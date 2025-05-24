import qs from 'qs';

import { IProdutoERP } from '../banco/models/produtoERP';

import { Repositorios } from '../repositorios';

import { Axios } from '../servicos/axios';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

import {
  ICriarDispositivo,
  ICriarToken,
  ISSCriarDispositivo,
  ISSResponseBase,
  ISSCriarToken,
  ISSGetProdutos,
  ISSGetGrupos,
  ISSGetCombos,
  ISSGetCombosItens,
  ISSGetEmpresa,
} from './types/softcomshop';

const MODULO = '[Softcomshop]';

const criarDispositivo = async (erp_url: string): Promise<IRetorno<ICriarDispositivo>> => {
  try {
    const url = new URL(erp_url);

    const client_id = url.searchParams.get('client_id');
    const device_name = url.searchParams.get('device_name');

    if (!client_id || !device_name) {
      return {
        sucesso: false,
        dados: null,
        erro: 'Parâmetros obrigatórios ausentes na URL (client_id ou device_name)',
        total: 1,
      };
    }

    const data = qs.stringify({
      client_id,
      device_id: device_name,
    });

    const response = await Axios.defaultAxios.post<ISSResponseBase<ISSCriarDispositivo>>(url.origin + url.pathname, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      maxBodyLength: Infinity,
    });

    if (response.data.code !== 1) {
      return {
        sucesso: false,
        dados: null,
        erro: response.data.human || 'Erro ao gerar dispositivo.',
        total: 1,
      };
    }

    const dadosFormat = {
      url_base: response.data.data.resources.url_base,
      client_id: response.data.data.client_id,
      client_secret: response.data.data.client_secret,
      empresa_cnpj: response.data.data.empresa_cnpj,
      empresa_fantasia: response.data.data.empresa_fantasia,
    };

    return {
      sucesso: true,
      dados: dadosFormat,
      erro: null,
      total: 1,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao criar dispositivo | URL: ${erp_url}`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const criarToken = async (base_url: string, client_id: string, client_secret: string): Promise<IRetorno<ICriarToken>> => {
  try {
    const data = qs.stringify({
      grant_type: 'client_credentials',
      client_id,
      client_secret,
    });

    const response = await Axios.defaultAxios.post<ISSResponseBase<ISSCriarToken>>(`${base_url}/authentication/token`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.code !== 1) {
      return {
        sucesso: false,
        dados: null,
        erro: response.data.human || 'Erro ao gerar token.',
        total: 1,
      };
    }

    const expiresIn = response.data.data.expires_in; // segundos
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    const dadosFormat = {
      token: response.data.data.token,
      expiresAt: expiresAt,
    };

    return {
      sucesso: true,
      dados: dadosFormat,
      erro: null,
      total: 1,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao gerar token | Client: ${client_id}`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const getEmpresa = async (empresaId: number): Promise<IRetorno<ISSGetEmpresa>> => {
  try {
    const apiAxiosSS = await Axios.axiosSoftcomshop(empresaId);
    if (typeof apiAxiosSS === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSS,
        total: 1,
      };
    }
    const response = await apiAxiosSS.get<ISSResponseBase<ISSGetEmpresa>>(`/api/empresa`);

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

const getProdutos = async (empresaId: number): Promise<IRetorno<ISSGetProdutos[]>> => {
  try {
    const apiAxiosSS = await Axios.axiosSoftcomshop(empresaId);
    if (typeof apiAxiosSS === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSS,
        total: 1,
      };
    }
    const result: ISSGetProdutos[] = [];

    let page = 1;
    let countPages = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosSS.get<ISSResponseBase<ISSGetProdutos[]>>(`/api/produtos/produtos/page/${page}`);

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

const getGrupos = async (empresaId: number): Promise<IRetorno<ISSGetGrupos[]>> => {
  try {
    const apiAxiosSS = await Axios.axiosSoftcomshop(empresaId);
    if (typeof apiAxiosSS === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSS,
        total: 1,
      };
    }
    const result: ISSGetGrupos[] = [];

    let page = 1;
    let countPages = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosSS.get<ISSResponseBase<ISSGetGrupos[]>>(`/api/produtos/grupos/page/${page}`);

      if (response.data.code !== 1) {
        return {
          sucesso: false,
          dados: null,
          erro: response.data.human || 'Erro ao consultar grupos',
          total: 1,
        };
      }

      const grupos = response.data.data;
      const currentPage = response.data.meta.page.current;
      countPages = response.data.meta.page.count;

      result.push(...grupos);

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

const getCombos = async (empresaId: number): Promise<IRetorno<ISSGetCombos[]>> => {
  try {
    const apiAxiosSS = await Axios.axiosSoftcomshop(empresaId);
    if (typeof apiAxiosSS === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSS,
        total: 1,
      };
    }
    const result: ISSGetCombos[] = [];

    let page = 1;
    let countPages = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosSS.get<ISSResponseBase<ISSGetCombos[]>>(`/api/restaurantes/produto-combo?page=${page}`);

      if (!response.data) {
        return {
          sucesso: false,
          dados: null,
          erro: 'Erro ao consultar combos',
          total: 1,
        };
      }

      const combos = response.data.data;
      const currentPage = response.data.current_page;
      countPages = response.data.last_page;

      result.push(...combos);

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
    Util.Log.error(`${MODULO} | Erro ao consultar combos.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const alimentarProdutos = async (empresaId: number): Promise<IRetorno<string>> => {
  const gerarDescricaoComboFixoDeVariacoes = (
    variacoes: Partial<IProdutoERP & { itens?: ISSGetCombosItens[] }>[],
    allProdutos: ISSGetProdutos[],
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

            const subtotal = (item.quantidade ?? 0) * (Util.Texto.tratarComoNumero(item.preco_venda) ?? 0);
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const imagens = (p.produto_imagem || []).sort((a, _) => (a.tipo == 'PRINCIPAL' ? -1 : 1)).map((img) => img.arquivo_original);

      const modeloProduct: Partial<IProdutoERP> = {
        type: 'PRODUCT',
        empresa_id: empresaId,
        erp_c_code: Util.Texto.truncarTexto(Util.Texto.tratarComoString(c.erp_c_code), 50),
        erp_c_name: Util.Texto.truncarTexto(Util.Texto.tratarComoString(c.erp_c_name), 100),
        erp_c_availability: 'AVAILABLE',
        erp_p_name: Util.Texto.truncarTexto(Util.Texto.tratarComoString(p.nome), 100),
        erp_p_description: Util.Texto.truncarTexto(Util.Texto.tratarComoString(p.observacao), 500),
        erp_p_category_id: p.grupo_id,
        erp_p_price: Util.Texto.tratarComoNumero(p.preco_venda) ?? 0,
        erp_p_code: Util.Texto.truncarTexto(Util.Texto.tratarComoString(p.produto_id), 50),
        erp_p_availability: 'AVAILABLE',
        erp_p_stock_current: 0,
        erp_p_stock_active: false,
        erp_p_variations_grid: false,
        erp_p_images: JSON.stringify(imagens),
        erp_p_combo: p.habilitar_acompanhamento == '1' ? true : false,
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
      const variacoes: Partial<IProdutoERP & { itens: ISSGetCombosItens[] }>[] = allVariacoes.dados
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
                erp_vi_code: vi.codigo_pdv,
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

export const SoftcomShop = {
  criarDispositivo,
  criarToken,
  getEmpresa,
  getProdutos,
  getGrupos,
  getCombos,
  alimentarProdutos,
};
