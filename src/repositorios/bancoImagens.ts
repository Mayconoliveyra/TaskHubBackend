import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IBancoImagem } from '../banco/models/bancoImagem';
import { IBancoImagemProdutoLoja } from '../banco/models/bancoImagemProdutoLoja';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

const MODULO = '[Banco Imagens]';

const inserir = async (imagem: Partial<IBancoImagem>): Promise<IRetorno<string>> => {
  try {
    // Verifica duplicidade apenas se ambos existirem
    if (imagem.empresa_id !== undefined && imagem.produto_code !== undefined) {
      const imagemExistente = await Knex(ETableNames.banco_imagens)
        .where({
          empresa_id: imagem.empresa_id,
          produto_code: imagem.produto_code,
        })
        .first();

      if (imagemExistente) {
        return {
          sucesso: true,
          dados: 'Imagem já existe',
          erro: null,
          total: 1,
        };
      }
    }

    // Insere a imagem normalmente
    const result = await Knex(ETableNames.banco_imagens).insert(imagem);
    if (result) {
      return {
        sucesso: true,
        dados: Util.Msg.sucesso,
        erro: null,
        total: 1,
      };
    }

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao inserir no banco de imagens.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

const buscarPorPalavrasChave = async (palavrasChave: string[]): Promise<IRetorno<IBancoImagem[]>> => {
  try {
    if (!palavrasChave || palavrasChave.length === 0) {
      return {
        sucesso: false,
        dados: null,
        erro: 'Nenhuma palavra-chave informada.',
        total: 0,
      };
    }

    // Monta a string de busca para FULLTEXT
    const matchQuery = palavrasChave.join(' ');

    // Busca imagens relevantes usando FULLTEXT em nome, tags e categorias
    const imagens = await Knex(ETableNames.banco_imagens)
      .select<IBancoImagem[]>('*')
      .whereRaw('MATCH(tags, categorias) AGAINST (? IN NATURAL LANGUAGE MODE)', [matchQuery])
      .whereNull('deleted_at');

    if (imagens.length > 0) {
      return {
        sucesso: true,
        dados: imagens,
        erro: null,
        total: imagens.length,
      };
    }

    return {
      sucesso: false,
      dados: null,
      erro: 'Nenhum resultado encontrado.',
      total: 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao buscar imagens por palavras-chave.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

const apagarProdutoImagemLojaPorEmpresaId = async (empresaId: number): Promise<IRetorno<string>> => {
  try {
    await Knex.table(ETableNames.banco_imagem_produto_loja).where('empresa_id', empresaId).whereNull('deleted_at').update({
      deleted_at: Util.DataHora.obterDataAtual(),
    });

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | EmpresaId: ${empresaId} | Função: apagarProdutoImagemLojaPorEmpresaId`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

const reativarOuInserirProdutoImagemLoja = async (imagem: Partial<IBancoImagemProdutoLoja>): Promise<IRetorno<string>> => {
  try {
    // Verifica se a imagem já existe com deleted_at preenchido
    const imagemExistente = await Knex(ETableNames.banco_imagem_produto_loja)
      .where({
        codigo: imagem.codigo,
        empresa_id: imagem.empresa_id,
      })
      .whereNotNull('deleted_at')
      .first();

    if (imagemExistente) {
      // Se existe, "reativa" a imagem
      const atualizacao = await Knex(ETableNames.banco_imagem_produto_loja)
        .where('id', imagemExistente.id)
        .update({
          ...imagem,
          deleted_at: null,
          created_at: Util.DataHora.obterDataAtual(),
        });

      if (atualizacao) {
        return {
          sucesso: true,
          dados: Util.Msg.sucesso,
          erro: null,
          total: 1,
        };
      }
    } else {
      // Se não existe, faz a inserção normal
      const result = await Knex(ETableNames.banco_imagem_produto_loja).insert(imagem);

      if (result) {
        return {
          sucesso: true,
          dados: Util.Msg.sucesso,
          erro: null,
          total: 1,
        };
      }
    }

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | EmpresaId: ${imagem.empresa_id} | Função: reativarOuInserirProdutoImagemLoja`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

const consultarProdutoImagemLoja = async (empresaId: number): Promise<IRetorno<IBancoImagemProdutoLoja[]>> => {
  try {
    const result = await Knex(ETableNames.banco_imagem_produto_loja)
      .where({
        empresa_id: empresaId,
      })
      .whereNull('deleted_at');

    return {
      sucesso: true,
      dados: result,
      erro: null,
      total: Number(result.length),
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | EmpresaId: ${empresaId} | Função: consultarProdutoImagemLoja`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

export const BancoImagens = {
  inserir,
  buscarPorPalavrasChave,
  apagarProdutoImagemLojaPorEmpresaId,
  reativarOuInserirProdutoImagemLoja,
  consultarProdutoImagemLoja,
};
