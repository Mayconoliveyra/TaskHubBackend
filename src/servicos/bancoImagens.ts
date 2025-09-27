import { compareTwoStrings } from 'string-similarity';

import { IBancoImagem } from '../banco/models/bancoImagem';
import { IBancoImagemProdutoLoja } from '../banco/models/bancoImagemProdutoLoja';

import { Repositorios } from '../repositorios';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

import { Servicos } from '.';

const MODULO = '[Serviço Associação Imagem]';
const IMAGEM_PADRAO_MC = 'https://meucarrinhostg.blob.core.windows.net/images/default_product.png';

export interface IProdutoParaAssociar {
  nome: string;
  categoria: string;
  preco: number;
}

const PESOS = {
  tag: 5, // relevância de uma correspondência em tags
  categoria: 15, // categorias têm maior peso por serem mais específicas
  preco: 10, // preço ajuda a confirmar, mas não deve dominar
};

const STOPWORDS = ['de', 'da', 'do', 'das', 'dos', 'a', 'e', 'o', 'os', 'um', 'ao', 'uma', 'para', 'com'];

const normalizarTexto = (texto: string): string[] => {
  return Util.Texto.formatarParaTextoSimples(texto)
    .split(' ')
    .filter((p) => p.length > 1 && !STOPWORDS.includes(p));
};

const similaridade = (a: string, b: string): number => {
  return compareTwoStrings(a, b); // retorna entre 0 e 1
};

const calcularLimiar = (qtdPalavras: number): number => {
  // Base mínima (para nomes muito curtos, ex: 1 palavra)
  const base = 15;

  // Incremento por cada palavra extra no nome
  const incrementoPorPalavra = 5;

  // Limiar final
  return base + (qtdPalavras - 1) * incrementoPorPalavra;
};

const capturarImagensMcAlimentarBancoImagens = async (empresaId: number, merchantId: string): Promise<IRetorno<string>> => {
  try {
    // Busca todos os produtos e categorias da empresa simultaneamente
    const [allProdutos, allCategorias] = await Promise.all([
      Servicos.MeuCarrinho.getProdutos(empresaId),
      Servicos.MeuCarrinho.getCategorias(empresaId, merchantId),
    ]);

    if (!allProdutos.sucesso) {
      return { sucesso: false, dados: null, erro: allProdutos.erro, total: 1 };
    }

    if (!allCategorias.sucesso) {
      return { sucesso: false, dados: null, erro: allCategorias.erro, total: 1 };
    }

    for (const produto of allProdutos.dados) {
      // Busca o nome da categoria do produto
      const produtoNome = produto.name;
      const categoriaNome = allCategorias.dados.find((c) => c.id === produto.categoryId)?.name;
      const produtoCode = Util.Texto.tratarComoNumero(produto.code);

      if (!produtoNome || !categoriaNome || !produtoCode) continue;

      // Captura a primeira imagem válida que não seja padrão
      const img = produto.images.find((img) => img.path && img.path !== IMAGEM_PADRAO_MC);
      if (!img) continue;

      // Normaliza tags: usa palavras do nome do produto
      const tagsNormalizadas = normalizarTexto(produtoNome).join(';');

      // Normaliza categorias: separa palavras, trata cada token e junta com ";"
      const categoriasNormalizadas = normalizarTexto(categoriaNome).join(';');

      // Normaliza preço
      const preco = Util.Texto.tratarComoNumero(produto.price, 2) ?? 0;

      // Monta o objeto para inserção
      const modelo: Partial<IBancoImagem> = {
        nome: Util.Texto.truncarTexto(produtoNome, 255) || '',
        url: img.path,
        categorias: categoriasNormalizadas,
        preco,
        tags: tagsNormalizadas,
        recomendado: false,
        empresa_id: empresaId,
        produto_code: produtoCode,
      };

      // Insere no banco
      await Repositorios.BancoImagens.inserir(modelo);
    }

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    // Loga qualquer erro inesperado
    Util.Log.error(`${MODULO} | Erro ao realizar captura de imagens Meu Carrinho para alimentar banco de imagens.`, error);

    return { sucesso: false, dados: null, erro: Util.Msg.erroInesperado, total: 1 };
  }
};

const associarImagemAoProduto = async (produto: IProdutoParaAssociar): Promise<string | null> => {
  // Extrai tokens normalizados do nome do produto (sem acento, plurais e stopwords)
  const palavrasChave = normalizarTexto(produto.nome);

  // Categoria tratada para comparação (string única normalizada)
  const categoriaTratada = Util.Texto.formatarParaTextoSimples(produto.categoria);

  try {
    // Busca imagens candidatas usando FULLTEXT (apenas tags e categorias)
    const imagens = await Repositorios.BancoImagens.buscarPorPalavrasChave(palavrasChave);
    if (!imagens.sucesso || !imagens.dados?.length) return null;

    // Variáveis de controle para melhor imagem geral e recomendada
    let melhor = { url: null as string | null, score: 0, id: null as number | null, nome: null as string | null };
    let recomendada = { url: null as string | null, score: 0, id: null as number | null, nome: null as string | null };

    for (const img of imagens.dados) {
      let score = 0;

      // Normaliza listas de tags e categorias (removendo valores vazios)
      const tagsImgTokens = img?.tags?.split(';').map(Util.Texto.formatarParaTextoSimples).filter(Boolean) || [];
      const categoriasImgTokens = img?.categorias?.split(';').map(Util.Texto.formatarParaTextoSimples).filter(Boolean) || [];

      // 1️⃣ Comparação com tags (usa similaridade fuzzy)
      for (const palavra of palavrasChave) {
        for (const tag of tagsImgTokens) {
          const sim = similaridade(palavra, tag);
          if (sim > 0.8) score += PESOS.tag; // match forte
          else if (sim > 0.6) score += PESOS.tag / 2; // match parcial
        }
      }

      // 2️⃣ Categoria (apenas para produtos não genéricos)
      if (palavrasChave.length > 1) {
        if (categoriasImgTokens.some((c) => similaridade(categoriaTratada, c) > 0.75)) {
          score += PESOS.categoria;
        }
      }

      // 3️⃣ Preço aproximado (±40%)
      if (palavrasChave.length > 1) {
        const precoMin = produto.preco * 0.6;
        const precoMax = produto.preco * 1.4;
        if (img.preco >= precoMin && img.preco <= precoMax) {
          score += PESOS.preco;
        }
      }

      // 4️⃣ Bônus de cobertura de palavras (quantas palavras-chave aparecem em tags/categorias)
      const allTokens = new Set([...tagsImgTokens, ...categoriasImgTokens]);
      const palavrasEncontradas = palavrasChave.filter((p) => allTokens.has(p)).length;
      score += palavrasEncontradas * 2;

      // Atualiza melhor imagem geral
      if (score > melhor.score) melhor = { url: img.url, score, id: img.id, nome: img.nome };

      // Atualiza melhor imagem recomendada
      if (img.recomendado && score > recomendada.score) recomendada = { url: img.url, score, id: img.id, nome: img.nome };
    }

    // Definição de limiares dinâmicos
    const LIMIAR_RECOMENDADA = 40; // sempre exige confiança alta
    const LIMIAR = calcularLimiar(palavrasChave.length);

    /*     console.log('PRODUTO PARAMETRO:', produto.nome);
    console.log('PRODUTO BANCO:', melhor.nome);
    console.log('SCORE', melhor.score);
 */
    // Se existe recomendada válida, prioriza
    if (recomendada.score >= LIMIAR_RECOMENDADA) {
      console.log('PRODUTO:', produto);
      console.log('IMAGEM RECOMENDADA:', recomendada);
      return recomendada.url;
    }

    // Caso contrário, usa a melhor imagem geral
    if (melhor.score >= LIMIAR) {
      console.log('PRODUTO:', produto);
      console.log('MELHOR IMAGEM:', melhor);
      return melhor.url;
    }

    // Nenhuma imagem confiável encontrada
    return null;
  } catch (err) {
    Util.Log.error('[Associação Imagem] Erro:', err);
    return null;
  }
};

const capturarImagensMCProdutoImagemLoja = async (empresaId: number, merchantId: string): Promise<IRetorno<string>> => {
  try {
    // Busca todos os produtos e categorias da empresa simultaneamente
    const [allProdutos, allCategorias] = await Promise.all([
      Servicos.MeuCarrinho.getProdutos(empresaId),
      Servicos.MeuCarrinho.getCategorias(empresaId, merchantId),
    ]);

    if (!allProdutos.sucesso) {
      return { sucesso: false, dados: null, erro: allProdutos.erro, total: 1 };
    }

    if (!allCategorias.sucesso) {
      return { sucesso: false, dados: null, erro: allCategorias.erro, total: 1 };
    }

    const apagarProdutoImagensLojaEmpresa = await Repositorios.BancoImagens.apagarProdutoImagemLojaPorEmpresaId(empresaId);

    if (!apagarProdutoImagensLojaEmpresa.sucesso) {
      return { sucesso: false, dados: null, erro: apagarProdutoImagensLojaEmpresa.erro, total: 1 };
    }

    for (const produto of allProdutos.dados) {
      // Busca o nome da categoria do produto
      const produtoNome = produto.name;
      const categoriaNome = allCategorias.dados.find((c) => c.id === produto.categoryId)?.name;
      const produtoCode = Util.Texto.tratarComoNumero(produto.code);

      if (!produtoNome || !categoriaNome || !produtoCode) continue;

      // Normaliza preço
      const preco = Util.Texto.tratarComoNumero(produto.price, 2) ?? 0;

      // Captura a primeira imagem válida que não seja padrão
      const imagensFiltradas = produto.images.filter((img) => img.path && img.path !== IMAGEM_PADRAO_MC);

      const tagsProduto = normalizarTexto(produtoNome);
      const tagsCategoria = normalizarTexto(categoriaNome);

      // Remove duplicatas e junta com ';'
      const todasTagsUnicas = Array.from(new Set([...tagsCategoria, ...tagsProduto])).join(';');

      // Monta o objeto para inserção
      const modelo: Partial<IBancoImagemProdutoLoja> = {
        empresa_id: empresaId,
        codigo: produtoCode,
        nome: Util.Texto.truncarTexto(produtoNome, 255) || '',
        categoria: categoriaNome,
        preco,
        tags: todasTagsUnicas,
        img_01: imagensFiltradas[0]?.path || null,
        img_02: imagensFiltradas[1]?.path || null,
        img_03: imagensFiltradas[2]?.path || null,
        img_04: imagensFiltradas[3]?.path || null,
        img_05: imagensFiltradas[4]?.path || null,
        img_06: imagensFiltradas[5]?.path || null,
        img_07: imagensFiltradas[6]?.path || null,
        img_08: imagensFiltradas[7]?.path || null,
        img_09: imagensFiltradas[8]?.path || null,
        img_10: imagensFiltradas[9]?.path || null,
        img_11: imagensFiltradas[10]?.path || null,
        img_12: imagensFiltradas[11]?.path || null,
        img_13: imagensFiltradas[12]?.path || null,
        img_14: imagensFiltradas[13]?.path || null,
        img_15: imagensFiltradas[14]?.path || null,
        total_imgs: imagensFiltradas.length || 0,
      };

      // Insere no banco
      await Repositorios.BancoImagens.reativarOuInserirProdutoImagemLoja(modelo);
    }

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | EmpresaId: ${empresaId} | Função: capturarImagensMCProdutoImagemLoja`, error);

    return { sucesso: false, dados: null, erro: Util.Msg.erroInesperado, total: 1 };
  }
};

export const BancoImagens = {
  associarImagemAoProduto,
  capturarImagensMcAlimentarBancoImagens,
  capturarImagensMCProdutoImagemLoja,
};
