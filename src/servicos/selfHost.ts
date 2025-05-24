import qs from 'qs';

import { IProdutoERP } from '../banco/models/produtoERP';

import { Repositorios } from '../repositorios';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

import { Axios } from './axios';
import {
  ISHExtrairDominioEClientId,
  ISHGetCombos,
  ISHGetCombosItens,
  ISHGetEmpresa,
  ISHGetGrupos,
  ISHGetProdutos,
  ISHObterClientSecret,
  ISHObterToken,
  ISHResponseBase,
} from './types/selfHost';

const MODULO = '[SelfHost]';

const extrairDominioEClientId = (url: string): IRetorno<ISHExtrairDominioEClientId> => {
  try {
    const urlObj = new URL(url);
    const clientId = urlObj.searchParams.get('client_id');
    const dominio = `${urlObj.protocol}//${urlObj.host}`;

    if (!dominio || !clientId) {
      return {
        sucesso: false,
        dados: null,
        erro: `Parâmetros obrigatórios ausentes na URL Domínio: ${dominio}; Client ID:${clientId}`,
        total: 1,
      };
    }

    return {
      sucesso: true,
      dados: { dominio: dominio, clientId: clientId },
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao extrair dominio e cliente_id | URL: ${url}`, error);

    return {
      sucesso: false,
      dados: null,
      erro: 'Erro ao extrair dominio e cliente_id',
      total: 1,
    };
  }
};

const obterClientSecret = async (dominio: string, clientId: string): Promise<IRetorno<ISHObterClientSecret>> => {
  const gerarDeviceId = () => {
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Letra aleatória de A-Z
    const randomDigits = Math.floor(100 + Math.random() * 900); // Dois dígitos aleatórios
    return `TASK-HUB-${randomLetter}${randomDigits}`;
  };

  try {
    const deviceId = gerarDeviceId();

    const data = qs.stringify({
      client_id: clientId,
      device_id: deviceId,
    });

    const response = await Axios.defaultAxios.post<ISHResponseBase<ISHObterClientSecret>>(`${dominio}/device/add`, data);

    if (response.data.code !== 1) {
      return {
        sucesso: false,
        dados: null,
        erro: response.data.human || 'Erro ao obter client secret.',
        total: 1,
      };
    }

    return {
      sucesso: true,
      dados: response.data.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao obter client secret | Domínio: ${dominio} | clientId: ${clientId}`, error);

    return {
      sucesso: false,
      dados: null,
      erro: 'Erro ao obter client secret.',
      total: 1,
    };
  }
};

const obterToken = async (dominio: string, clientId: string, clientSecret: string): Promise<IRetorno<ISHObterToken>> => {
  try {
    const data = qs.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret });

    const response = await Axios.defaultAxios.post<ISHResponseBase<ISHObterToken>>(`${dominio}/authentication/token`, data);

    if (response.data.code !== 1) {
      return {
        sucesso: false,
        dados: null,
        erro: response.data.human || 'Erro ao obter token.',
        total: 1,
      };
    }

    const expiresIn = response.data.data.expires_in || 3599;

    // Pega o timestamp Unix atual, adiciona o expiresIn (normalmente 3599 s, ~60 min) e subtrai 10 min para garantir uma folga antes da expiração do token
    const sh_token_exp = Util.DataHora.obterTimestampUnixAtual() + expiresIn - 60 * 10;

    return {
      sucesso: true,
      dados: { ...response.data.data, expires_in: sh_token_exp },
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao obter token | Domínio: ${dominio} | clientId: ${clientId} | clientSecret: ${clientSecret}`, error);

    return {
      sucesso: false,
      dados: null,
      erro: 'Erro ao obter token.',
      total: 1,
    };
  }
};

const getEmpresa = async (empresaId: number): Promise<IRetorno<ISHGetEmpresa>> => {
  try {
    const apiAxiosSH = await Axios.axiosSelfHost(empresaId);
    if (typeof apiAxiosSH === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSH,
        total: 1,
      };
    }
    const response = await apiAxiosSH.get<ISHResponseBase<ISHGetEmpresa>>(`/api/empresa`);

    if (response.data.code !== 1) {
      return {
        sucesso: false,
        dados: null,
        erro: response.data.human || 'Erro ao consultar dados da empresa.',
        total: 1,
      };
    }

    return {
      sucesso: true,
      dados: response.data.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar dados da empresa.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const getProdutos = async (empresaId: number): Promise<IRetorno<ISHGetProdutos[]>> => {
  try {
    const apiAxiosSH = await Axios.axiosSelfHost(empresaId);
    if (typeof apiAxiosSH === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSH,
        total: 1,
      };
    }
    const result: ISHGetProdutos[] = [];

    const ultimaSinc = 1; // por enquanto vou deixar fixo 1.
    let page = 1;
    let countPages = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosSH.get<ISHResponseBase<ISHGetProdutos[]>>(`/api/produtos/produtos/ultima_sincronizacao/${ultimaSinc}/page/${page}`);

      if (response.data.code !== 1) {
        return {
          sucesso: false,
          dados: null,
          erro: response.data.human || 'Erro ao consultar produtos',
          total: 1,
        };
      }

      const produtos = response.data.data;
      const currentPage = response.data.meta.page.current;
      countPages = response.data.meta.page.count;

      result.push(...produtos);

      if (currentPage !== countPages) {
        page += 1;
      } else {
        hasMore = false;
      }
    }

    return {
      sucesso: true,
      dados: result,
      erro: null,
      total: result?.length || 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar produtos.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const getGrupos = async (empresaId: number): Promise<IRetorno<ISHGetGrupos[]>> => {
  try {
    const apiAxiosSH = await Axios.axiosSelfHost(empresaId);
    if (typeof apiAxiosSH === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSH,
        total: 1,
      };
    }
    const result: ISHGetGrupos[] = [];

    let page = 1;
    let countPages = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosSH.get<ISHResponseBase<ISHGetGrupos[]>>(`/api/produtos/grupos/page/${page}`);

      if (response.data.code !== 1) {
        return {
          sucesso: false,
          dados: null,
          erro: response.data.human || 'Erro ao consultar grupos',
          total: 1,
        };
      }

      const produtos = response.data.data;
      const currentPage = response.data.meta.page.current;
      countPages = response.data.meta.page.count;

      result.push(...produtos);

      if (currentPage !== countPages) {
        page += 1;
      } else {
        hasMore = false;
      }
    }

    return {
      sucesso: true,
      dados: result,
      erro: null,
      total: result?.length || 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar grupos.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const getCombos = async (empresaId: number): Promise<IRetorno<ISHGetCombos[]>> => {
  try {
    const apiAxiosSH = await Axios.axiosSelfHost(empresaId);
    if (typeof apiAxiosSH === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSH,
        total: 1,
      };
    }
    // NO MOMENTO QUE FOI IMPLEMENTADO NÃO EXISTIA  PAGINAÇÃO.
    const response = await apiAxiosSH.get<ISHResponseBase<ISHGetCombos[]>>(`/api/restaurantes/produto-combo`);

    return {
      sucesso: true,
      dados: response.data?.data || [],
      erro: null,
      total: response.data?.data?.length || 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar combos.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

export const alimentarProdutos = async (empresaId: number): Promise<IRetorno<string>> => {
  const gerarDescricaoComboFixoDeVariacoes = (
    variacoes: Partial<IProdutoERP & { itens?: ISHGetCombosItens[] }>[],
    allProdutos: ISHGetProdutos[],
  ): { descricao: string | null; precoTotal: number } => {
    try {
      const linhas: string[] = [];
      let precoTotal = 0;

      for (const v of variacoes) {
        if (!v.itens || !Array.isArray(v.itens)) continue;

        for (const item of v.itens) {
          if (item.quantidade && item.quantidade > 0) {
            const produto = allProdutos.find((p) => p.produto_id == item.produto_id);
            const nome = produto?.nome?.trim() || 'Produto desconhecido';

            const subtotal = (item.quantidade ?? 0) * (item.preco_venda ?? 0);
            precoTotal += subtotal;

            linhas.push(`x${item.quantidade} ${nome}`);
          }
        }
      }

      if (linhas.length === 0) return { descricao: null, precoTotal: 0 };

      return {
        descricao: `Itens que compõem o combo:\n${linhas.join('\n')}`,
        precoTotal,
      };
    } catch (error) {
      Util.Log.error(`${MODULO} | ComboFixo | Erro ao gerar descrição de combo fixo`, error);
      return { descricao: null, precoTotal: 0 };
    }
  };

  try {
    let totalCategoriasEncontradas = 0;
    let totalProdutosEncontrados = 0;
    let totalVariacoesEncontradas = 0;
    let totalVariacoesItemEncontrados = 0;

    const resultTruncate = await Repositorios.ProdutosERP.apagarProdutosPorEmpresaId(empresaId);
    if (!resultTruncate) {
      return {
        sucesso: false,
        dados: null,
        erro: Util.Msg.erroInesperado,
        total: 1,
      };
    }

    const [allCategorias, allVariacoes, allProdutos] = await Promise.all([getGrupos(empresaId), getCombos(empresaId), getProdutos(empresaId)]);

    if (!allCategorias.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: allCategorias.erro,
        total: 1,
      };
    }

    if (!allVariacoes.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: allVariacoes.erro,
        total: 1,
      };
    }

    if (!allProdutos.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: allProdutos.erro,
        total: 1,
      };
    }

    // ### CATEGORIAS ###
    for (const c of allCategorias.dados) {
      const produtoCategoria = allProdutos.dados.find((p) => p.grupo_id == c.id);

      if (produtoCategoria) {
        const modeloCategory: Partial<IProdutoERP> = {
          type: 'CATEGORY',
          empresa_id: empresaId,
          erp_c_code: Util.Texto.truncarTexto(Util.Texto.tratarComoString(c.id), 50),
          erp_c_name: Util.Texto.truncarTexto(Util.Texto.tratarComoString(c.nome), 100),
          erp_c_availability: 'AVAILABLE',
        };

        const resultCategoria = await Repositorios.ProdutosERP.inserir(modeloCategory);
        if (!resultCategoria) {
          return {
            sucesso: false,
            dados: null,
            erro: Util.Msg.erroInesperado,
            total: 1,
          };
        }

        totalCategoriasEncontradas++;
      }
    }

    const categoriasDb = await Repositorios.ProdutosERP.consultarCategorias(empresaId);
    if (!categoriasDb) {
      return {
        sucesso: false,
        dados: null,
        erro: Util.Msg.erroInesperado,
        total: 1,
      };
    }
    const categoriasMap = new Map(categoriasDb.map((c) => [c.erp_c_code, c]));

    // ### PRODUTOS ###
    for (const p of allProdutos.dados) {
      const c = categoriasMap.get(p.grupo_id.toString());

      if (!c) {
        Util.Log.warn(`${MODULO} | Produto ignorado, categoria não encontrada: ID: ${p.id}, Nome: ${p.nome}`);
        continue;
      }

      const modeloProduct: Partial<IProdutoERP> = {
        type: 'PRODUCT',
        empresa_id: empresaId,
        erp_c_code: Util.Texto.truncarTexto(Util.Texto.tratarComoString(c.erp_c_code), 50),
        erp_c_name: Util.Texto.truncarTexto(Util.Texto.tratarComoString(c.erp_c_name), 100),
        erp_c_availability: 'AVAILABLE',
        erp_p_name: Util.Texto.truncarTexto(Util.Texto.tratarComoString(p.nome), 100),
        erp_p_description: Util.Texto.truncarTexto(Util.Texto.tratarComoString(''), 500),
        erp_p_category_id: Util.Texto.tratarComoString(p.grupo_id),
        erp_p_price: Util.Texto.tratarComoNumero(p.preco_venda) ?? 0,
        erp_p_code: Util.Texto.truncarTexto(Util.Texto.tratarComoString(p.produto_id), 50),
        erp_p_availability: 'AVAILABLE',
        erp_p_stock_current: 0,
        erp_p_stock_active: false,
        erp_p_variations_grid: false,
        erp_p_images: null,
        erp_p_combo: Util.Texto.tratarComoBoolean(p.acompanhamento) == true ? true : false,
      };

      // Se o produto não for combo  e o preço tiver zerado, sera ignorado.
      if (!modeloProduct.erp_p_combo && modeloProduct.erp_p_price == 0) {
        // Util.Log.warn(`${MODULO} | Produto ignorado, preço 0: ID: ${p.id}, Nome: ${p.nome}`);
        continue;
      }

      const resultProduto = await Repositorios.ProdutosERP.inserir(modeloProduct);
      if (!resultProduto) {
        return {
          sucesso: false,
          dados: null,
          erro: Util.Msg.erroInesperado,
          total: 1,
        };
      }

      totalProdutosEncontrados++;

      // ### VARIAÇÕES ###
      const variacoes: Partial<IProdutoERP & { itens: ISHGetCombosItens[] }>[] = allVariacoes.dados
        .filter((v) => v.produto_id == p.produto_id)
        .map((v) => {
          const erpVRequired = !!(v.quantidade_minima && v.quantidade_minima > 0); // Define se a variação é obrigatória.

          return {
            erp_v_name: Util.Texto.truncarTexto(Util.Texto.tratarComoString(v.descricao), 100),
            erp_v_required: erpVRequired,
            erp_v_items_min: erpVRequired ? v.quantidade_minima : 0,
            // 99 porque se o usuario preencher com 0 na retaguarda, ele pode definir a quantidade que quiser na hora de passar no caixa.
            erp_v_items_max: v.quantidade_maxima && v.quantidade_maxima > 0 ? v.quantidade_maxima : 99,
            erp_v_availability: 'AVAILABLE',
            erp_v_ordem: typeof v.ordem == 'number' ? v.ordem : 0,
            // - Se `habilitar_pizza` for true:
            //    - Se `tipo_calculo_preco` for 1, utiliza 'AVG' (média) como tipo de cálculo
            //    - Caso contrário, utiliza 'MAX' (valor máximo)
            // - Se `habilitar_pizza` for false, utiliza 'SUM' (soma) como tipo padrão
            erp_v_calc_type: v.habilitar_pizza == true ? (v.tipo_calculo_preco == 1 ? 'AVG' : 'MAX') : 'SUM',
            itens: v.itens,
          };
        });

      // Se o combo for tipo fixo vai retornar descrição dos itens do combo.
      // O produto vai ser cadastrado como comum, mas a descrição vai ser os itens do combo.
      const descricaoComboFixo = gerarDescricaoComboFixoDeVariacoes(variacoes, allProdutos.dados);
      if (descricaoComboFixo.descricao && descricaoComboFixo.precoTotal > 0) {
        const resultProdutoAt = await Repositorios.ProdutosERP.atualizarDados(empresaId, 'erp_p_code', modeloProduct.erp_p_code || '', {
          ...modeloProduct,
          erp_p_description: Util.Texto.truncarTexto(descricaoComboFixo.descricao, 500),
          erp_p_price: descricaoComboFixo.precoTotal + (modeloProduct?.erp_p_price || 0),
          erp_p_combo: false,
        });
        if (!resultProdutoAt.sucesso) {
          return {
            sucesso: false,
            dados: null,
            erro: resultProdutoAt.erro,
            total: 1,
          };
        }
      } else {
        for (const v of variacoes) {
          const modeloVariation: Partial<IProdutoERP> = {
            ...modeloProduct,
            type: 'VARIATION_HEADER',
            empresa_id: empresaId,
            erp_v_name: Util.Texto.truncarTexto(Util.Texto.tratarComoString(v.erp_v_name), 100),
            erp_v_required: v.erp_v_required,
            erp_v_items_min: v.erp_v_items_min,
            erp_v_items_max: v.erp_v_items_max,
            erp_v_availability: v.erp_v_availability,
            erp_v_ordem: v.erp_v_ordem,
            erp_v_name_hash: Util.Texto.gerarHashTexto(Util.Texto.formatarParaTextoSimples(`${modeloProduct.erp_p_code}${v.erp_v_name}`)),
            erp_v_calc_type: v.erp_v_calc_type,
          };

          const resultVariacao = await Repositorios.ProdutosERP.inserir(modeloVariation);
          if (!resultVariacao) {
            return {
              sucesso: false,
              dados: null,
              erro: Util.Msg.erroInesperado,
              total: 1,
            };
          }

          totalVariacoesEncontradas++;

          if (v.itens && v.itens.length > 0) {
            for (const vi of v.itens) {
              const produtoItemCombo = allProdutos.dados.find((item) => item.produto_id == vi.produto_id);

              if (!produtoItemCombo) {
                Util.Log.warn(`${MODULO} | Item de combo ignorado. Produto não encontrado: ${vi.produto_id}`);
                continue;
              }

              const modeloItem: Partial<IProdutoERP> = {
                ...modeloProduct,
                ...modeloVariation,
                type: 'VARIATION_ITEM',
                empresa_id: empresaId,
                erp_vi_code: Util.Texto.tratarComoString(vi.codigo_pdv),
                erp_vi_name: Util.Texto.truncarTexto(Util.Texto.tratarComoString(produtoItemCombo.nome), 100),
                erp_vi_value: Util.Texto.tratarComoNumero(vi.preco_venda) ?? 0,
                erp_vi_availability: 'AVAILABLE',
                erp_vi_stock_current: 0,
                erp_vi_stock_active: false,
              };

              const resultItem = await Repositorios.ProdutosERP.inserir(modeloItem);
              if (!resultItem) {
                return {
                  sucesso: false,
                  dados: null,
                  erro: Util.Msg.erroInesperado,
                  total: 1,
                };
              }

              totalVariacoesItemEncontrados++;
            }
          }
        }
      }
    }

    Util.Log.info(`${MODULO} | Total de categorias encontradas: ${totalCategoriasEncontradas}`);
    Util.Log.info(`${MODULO} | Total de produtos encontrados: ${totalProdutosEncontrados}`);
    Util.Log.info(`${MODULO} | Total de variações encontradas: ${totalVariacoesEncontradas}`);
    Util.Log.info(`${MODULO} | Total de variações item encontrados: ${totalVariacoesItemEncontrados}`);

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao alimentar produtos`, error);
    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

export const SelfHost = {
  extrairDominioEClientId,
  obterClientSecret,
  obterToken,
  getEmpresa,
  getProdutos,
  getGrupos,
  getCombos,
  alimentarProdutos,
};
