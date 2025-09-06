import { v4 as uuidv4 } from 'uuid';

import { Repositorios } from '../repositorios';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

import { Servicos } from '.';
import { Axios } from './axios';
import {
  IApiIMErroValidacao,
  IApiIMAutenticar,
  IApiIMGetMarketplaces,
  IApiIMGetProdutos,
  IApiIMGetCategorias,
  IApiIMProdutoBaseForcaEstDisp,
  IApiIMUploadImagemResponse,
  IApiIMUploadImagem,
} from './types/apiMarketplace';

const BASE_URL_API_IMK = 'https://api-imkt.softcomservices.com';

const MODULO = '[API Marketplace]';

const formatarErroValidacao = (erro: any): string => {
  try {
    const statusCode = erro?.response?.status;
    const responseData = erro?.response?.data as IApiIMErroValidacao;

    // Se for erro de autenticação
    if (statusCode === 401) {
      return 'Autenticação inválida. Verifique credenciais configuradas.';
    }

    // Se for estrutura conhecida de validação
    if (responseData?.errors && typeof responseData.errors === 'object') {
      return Object.entries(responseData.errors)
        .map(([campo, mensagens]) => `${campo.toUpperCase()}: ${(mensagens as string[]).join(', ')}`)
        .join('; ');
    }

    // Se tiver título de erro HTTP padrão
    if (responseData?.title) return responseData.title;

    // Fallback
    return 'Erro desconhecido ao processar a requisição.';
  } catch (err) {
    return 'Erro inesperado ao tratar erro.';
  }
};

const autenticar = async (clientId: string, clientSecret: string): Promise<IRetorno<IApiIMAutenticar>> => {
  try {
    const response = await Axios.defaultAxios.get<IApiIMAutenticar>(`${BASE_URL_API_IMK}/merchants/info`, {
      auth: {
        username: clientId,
        password: clientSecret,
      },
    });

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: 1,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao autenticar empresa.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getMarketplaces = async (empresaId: number): Promise<IRetorno<IApiIMGetMarketplaces[]>> => {
  try {
    const apiAxiosApiIM = await Axios.axiosApiMarketplace(empresaId);
    if (typeof apiAxiosApiIM === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosApiIM,
        total: 1,
      };
    }

    const response = await apiAxiosApiIM.get<IApiIMGetMarketplaces[]>(`/marketplaces`);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: response.data?.length || 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar marketplaces.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getProdutos = async (empresaId: number): Promise<IRetorno<IApiIMGetProdutos[]>> => {
  try {
    const apiAxiosApiIM = await Axios.axiosApiMarketplace(empresaId);
    if (typeof apiAxiosApiIM === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosApiIM,
        total: 1,
      };
    }

    const result: IApiIMGetProdutos[] = [];

    const pageSize = 500;
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosApiIM.get<IApiIMGetProdutos[]>(`/products?pageNumber=${page}&pageSize=${pageSize}`);
      const produtos = response.data;

      if (produtos.length > 0) {
        result.push(...produtos);
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
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getCategorias = async (empresaId: number): Promise<IRetorno<IApiIMGetCategorias[]>> => {
  try {
    const apiAxiosApiIM = await Axios.axiosApiMarketplace(empresaId);
    if (typeof apiAxiosApiIM === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosApiIM,
        total: 1,
      };
    }

    const result: IApiIMGetCategorias[] = [];

    const pageSize = 50;
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosApiIM.get<IApiIMGetCategorias[]>(`/categories?pageNumber=${page}&pageSize=${pageSize}`);
      const produtos = response.data;

      if (produtos.length > 0) {
        result.push(...produtos);
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
    Util.Log.error(`${MODULO} | Erro ao consultar categorias.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const uploadImagem = async (base64: string, code: string): Promise<IRetorno<IApiIMUploadImagemResponse>> => {
  const url = 'https://api-imkt.softcomservices.com/images';
  const basicAuth = {
    username: '94ce7a7a-5344-4160-b53f-d40db79ebf71',
    password: 'A123ED88-5DCF-421A-9EAD-8B5D2E26704E',
  };

  try {
    const modelo: IApiIMUploadImagem = {
      fileBase64: base64,
      fileContentType: 'image/png',
      fileName: `${uuidv4()}.png`,
      description: `${code} - taskhub`,
    };

    const response = await Axios.defaultAxios.post<IApiIMUploadImagemResponse[]>(url, [modelo], {
      auth: basicAuth,
      timeout: 1000 * 60 * 2,
    });

    if (response.status === 200 && response.data[0]) {
      return {
        sucesso: true,
        dados: response.data[0],
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
    Util.Log.error(`${MODULO} | Erro ao fazer upload de imagem`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const deleteProdutoPorId = async (empresaId: number, code: string): Promise<IRetorno<{ code: string }>> => {
  try {
    const apiAxiosApiIM = await Axios.axiosApiMarketplace(empresaId);
    if (typeof apiAxiosApiIM === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosApiIM,
        total: 1,
      };
    }

    await apiAxiosApiIM.delete(`/products/${code}`);

    return {
      sucesso: true,
      dados: { code: code },
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao apagar produto. Code: ${code}`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const deleteCategoriaPorId = async (empresaId: number, code: string): Promise<IRetorno<{ code: string }>> => {
  try {
    const apiAxiosApiIM = await Axios.axiosApiMarketplace(empresaId);
    if (typeof apiAxiosApiIM === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosApiIM,
        total: 1,
      };
    }

    await apiAxiosApiIM.delete(`/categories/${code}`);

    return {
      sucesso: true,
      dados: { code: code },
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao apagar categoria. Code: ${code}`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const zerarIntegracao = async (empresaId: number): Promise<IRetorno<string>> => {
  try {
    const [resGetMarketplaces, resGetCategorias] = await Promise.all([getMarketplaces(empresaId), getCategorias(empresaId)]);
    if (!resGetMarketplaces.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: resGetMarketplaces.erro,
        total: 1,
      };
    }

    // Verifica se MEU CARRINHO ta habilitado, caso sim, captura imagens.
    const ehMeuCarrinho = resGetMarketplaces.dados.find((canal) => canal.marketplaceName === 'MeuCarrinho');
    if (ehMeuCarrinho) {
      const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresaId }]);
      if (!empresa.sucesso) {
        return {
          sucesso: false,
          dados: null,
          erro: empresa.erro,
          total: 1,
        };
      }

      if (empresa.dados.mc_empresa_id) {
        // Antes de zerar os cadastros captura as imagens. Se houver erro ignora a captura.
        await Servicos.MeuCarrinho.capturarImagens(empresaId);
      }
    }

    if (!resGetCategorias.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: resGetCategorias.erro,
        total: 1,
      };
    }

    if (resGetCategorias.dados.length === 0) {
      return {
        sucesso: true,
        dados: 'A integração já está vazia. Caso ainda existam produtos no canal de destino, aguarde alguns minutos até que a sincronização seja concluída.',
        erro: null,
        total: 1,
      };
    }

    // Verifica os marketplaces integrados, se tiver utilizando Showkase exclui os produtos antes.
    const ehShowkase = resGetMarketplaces.dados.find((canal) => canal.marketplaceName === 'Showkase');
    if (ehShowkase && ehShowkase.active) {
      const resGetProdutos = await getProdutos(empresaId);
      if (!resGetProdutos.sucesso) {
        return {
          sucesso: false,
          dados: null,
          erro: resGetProdutos.erro,
          total: 1,
        };
      }

      for (const p of resGetProdutos.dados) {
        const resDelete = await deleteProdutoPorId(empresaId, p.code);
        if (!resDelete.sucesso) {
          return {
            sucesso: false,
            dados: null,
            erro: resDelete.erro,
            total: 1,
          };
        }
      }

      // Aguarda 15s por garantia
      await Util.Outros.delay(15000);
    }

    for (const c of resGetCategorias.dados) {
      const resDelete = await deleteCategoriaPorId(empresaId, c.code || '');
      if (!resDelete.sucesso) {
        return {
          sucesso: false,
          dados: null,
          erro: resDelete.erro,
          total: 1,
        };
      }
    }

    return {
      sucesso: true,
      dados: 'Integração zerada com sucesso.',
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao zerar integração.`, error);
    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const forcaEstoqueDisponibilidade = async (empresaId: number, merchantId: string): Promise<IRetorno<string>> => {
  function calcularDisponibilidade(
    disponibilidadeOriginal: string | null | undefined,
    controleEstoque: boolean | null | undefined,
    estoqueAtual: number | null | undefined,
    forcaDisponivel = false,
  ): 'AVAILABLE' | 'UNAVAILABLE' {
    const disponibilidade = disponibilidadeOriginal === 'AVAILABLE';
    const controle = controleEstoque ?? false;
    const estoque = estoqueAtual ?? 0;

    // Força que seja disponível
    if (forcaDisponivel) return 'AVAILABLE';

    if (!disponibilidade) return 'UNAVAILABLE';
    if (!controle) return 'AVAILABLE';
    return estoque > 0 ? 'AVAILABLE' : 'UNAVAILABLE';
  }

  try {
    const arrayProdutoSimples: IApiIMProdutoBaseForcaEstDisp[] = [];
    const arrayProdutoGrade: IApiIMProdutoBaseForcaEstDisp[] = [];
    const arrayProdutoGradeItem: IApiIMProdutoBaseForcaEstDisp[] = [];

    const [resGetProdutosIM, resGetProdutosMC] = await Promise.all([getProdutos(empresaId), Servicos.MeuCarrinho.alimentarProdutos(empresaId, merchantId)]);

    if (!resGetProdutosIM.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: resGetProdutosIM.erro,
        total: 1,
      };
    }

    if (resGetProdutosIM.dados.length === 0) {
      return {
        sucesso: true,
        dados: 'Não foi encontrado nenhum produto na API MARKETPLACE.',
        erro: null,
        total: 1,
      };
    }

    if (!resGetProdutosMC.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: resGetProdutosMC.erro,
        total: 1,
      };
    }

    // TRATA DOS PRODUTOS/VARIAÇÕES
    for (const produto of resGetProdutosIM.dados) {
      const isGrade = produto.grid === true;

      const externalCodePai = produto.merchantMarketplaces?.find((m) => m.marketplaceName === 'MeuCarrinho')?.externalCode;

      if (!externalCodePai) continue;

      const stockProduto = produto.stock?.stock ?? 0;

      if (!isGrade) {
        const availabilityProduto = calcularDisponibilidade(produto.availability, produto.stock?.active, produto.stock?.stock);

        arrayProdutoSimples.push({
          externalCode: externalCodePai,
          externalCodePai,
          availability: availabilityProduto,
          availabilityPai: availabilityProduto,
          stock: stockProduto,
        });
      } else {
        const availability = produto.availability === 'AVAILABLE';
        const hasAvailableVariation =
          produto.variations?.some((v) => {
            const s = v.stock?.stock ?? 0;
            const a = v.stock?.active ?? false;
            return v.availability === 'AVAILABLE' && (!a || (a && s > 0));
          }) ?? false;

        const availabilityPai: 'AVAILABLE' | 'UNAVAILABLE' = availability && hasAvailableVariation ? 'AVAILABLE' : 'UNAVAILABLE';

        arrayProdutoGrade.push({
          externalCode: externalCodePai,
          externalCodePai,
          availability: availabilityPai,
          availabilityPai,
          stock: stockProduto,
        });

        for (const variacao of produto.variations) {
          /* const externalCodeVar = variacao.merchantMarketplaces?.find((m) => m.marketplaceName === 'MeuCarrinho')?.externalCode; */
          const externalCodeVar = variacao.merchantMarketplaces[0].externalCode || null;
          const variacaoCode = variacao.code;

          if (!externalCodeVar) continue;

          const stockVar = variacao.stock?.stock ?? 0;
          const availabilityVar = calcularDisponibilidade(variacao.availability, variacao.stock?.active, variacao.stock?.stock);

          const variacaoMC = await Repositorios.ProdutosMC.consultarPrimeiroRegistroPorColuna(empresaId, 'VARIATION_ITEM', 'vi_code', variacaoCode || '');

          if (!variacaoMC || !variacaoMC.v_id) continue;

          arrayProdutoGradeItem.push({
            externalCode: externalCodeVar,
            externalCodePai: variacaoMC.v_id,
            availability: availabilityVar,
            availabilityPai,
            stock: stockVar,
          });
        }
      }
    }

    // ATUALIZAR PRODUTO SIMPLES
    if (arrayProdutoSimples.length > 0) {
      const resAtEstoqueProdPrincipal = await Servicos.MeuCarrinho.atEstoque(
        empresaId,
        arrayProdutoSimples.map((item) => ({ id: item.externalCode, stock: item.stock })),
      );
      if (!resAtEstoqueProdPrincipal.sucesso) {
        return {
          sucesso: false,
          dados: null,
          erro: resAtEstoqueProdPrincipal.erro,
          total: 1,
        };
      }

      // Aguarda 15s por garantia
      await Util.Outros.delay(15000);

      for (const p of arrayProdutoSimples) {
        const resAtDisponibilidadeProduto = await Servicos.MeuCarrinho.atDisponibilidadeProduto(empresaId, p.externalCode, p.availability);
        if (!resAtDisponibilidadeProduto.sucesso) {
          return {
            sucesso: false,
            dados: null,
            erro: resAtDisponibilidadeProduto.erro,
            total: 1,
          };
        }
      }
    }

    // ATUALIZAR PRODUTO GRADE ITEM
    if (arrayProdutoGradeItem.length > 0) {
      const resAtEstoqueProdGradeItem = await Servicos.MeuCarrinho.atEstoqueVariacao(
        empresaId,
        arrayProdutoGradeItem.map((item) => ({ variationId: item.externalCodePai, id: item.externalCode, stock: item.stock })),
      );
      if (!resAtEstoqueProdGradeItem.sucesso) {
        return {
          sucesso: false,
          dados: null,
          erro: resAtEstoqueProdGradeItem.erro,
          total: 1,
        };
      }

      // Aguarda 15s por garantia
      await Util.Outros.delay(15000);

      for (const p of arrayProdutoGradeItem) {
        const resAtDisponibilidadeProdGradeItem = await Servicos.MeuCarrinho.atDisponibilidadeVariacaoItem(
          empresaId,
          p.externalCodePai,
          p.externalCode,
          p.availability,
        );
        if (!resAtDisponibilidadeProdGradeItem.sucesso) {
          return {
            sucesso: false,
            dados: null,
            erro: resAtDisponibilidadeProdGradeItem.erro,
            total: 1,
          };
        }
      }

      // Aguarda 15s por garantia
      await Util.Outros.delay(15000);
    }

    // ATUALIZAR DISPONIBILIDADE PRODUTO GRADE PAI
    if (arrayProdutoGrade.length > 0) {
      for (const p of arrayProdutoGrade) {
        const resAtDisponibilidadeProdGradePai = await Servicos.MeuCarrinho.atDisponibilidadeProduto(empresaId, p.externalCode, p.availabilityPai);
        if (!resAtDisponibilidadeProdGradePai.sucesso) {
          return {
            sucesso: false,
            dados: null,
            erro: resAtDisponibilidadeProdGradePai.erro,
            total: 1,
          };
        }
      }
    }

    return {
      sucesso: true,
      dados: 'Atualização concluída! Estoque e disponibilidade foram ajustados com sucesso.',
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao realizar atualização de estoque e disponibilidade.`, error);
    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

export const ApiMarketplace = {
  autenticar,
  getMarketplaces,
  getProdutos,
  getCategorias,
  deleteProdutoPorId,
  deleteCategoriaPorId,
  zerarIntegracao,
  forcaEstoqueDisponibilidade,
  uploadImagem,
};
