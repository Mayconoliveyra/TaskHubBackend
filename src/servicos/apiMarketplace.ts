import { Util } from '../util';
import { Log } from '../util/log';
import { IRetorno } from '../util/tipagens';

import { Servicos } from '.';
import { Axios } from './axios';
import { IApiIMErroValidacao, IApiIMAutenticar, IApiIMGetMarketplaces, IApiIMGetProdutos, IApiIMGetCategorias } from './types/apiMarketplace';

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

const forcaEstoqueDisponibilidade = async (empresaId: number): Promise<IRetorno<string>> => {
  try {
    const resGetProdutos = await getProdutos(empresaId);

    if (!resGetProdutos.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: resGetProdutos.erro,
        total: 1,
      };
    }

    if (resGetProdutos.dados.length === 0) {
      return {
        sucesso: true,
        dados: 'Não foi encontrado nenhum produto na API MARKETPLACE.',
        erro: null,
        total: 1,
      };
    }

    const obsAtEstoque = resGetProdutos.dados
      .filter((item) => item.grid == false && item.merchantMarketplaces.some((mp) => mp.marketplaceName == 'MeuCarrinho' && mp.externalCode != null))
      .map((item) => {
        const marketplace = item.merchantMarketplaces.find((mp) => mp.marketplaceName == 'MeuCarrinho');
        return {
          id: marketplace!.externalCode, // O "!" porque já garantimos que não é null
          stock: item.stock.stock || 0,
        };
      });

    const resAtEstoqueProdPrincipal = await Servicos.MeuCarrinho.atEstoque(empresaId, obsAtEstoque);
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

    for (const p of resGetProdutos.dados) {
      if (p.grid) continue;

      const externalCode = p.merchantMarketplaces.find((item) => item.marketplaceName == 'MeuCarrinho')?.externalCode;
      const controleEstoque = p.stock.active;
      const estoqueAtual = p.stock.stock;
      const disponibilidade = p.availability == 'AVAILABLE' ? true : false;

      // Define o novo status de disponibilidade do produto com base em regras de estoque e configuração
      const novoStatus: 'UNAVAILABLE' | 'AVAILABLE' = !disponibilidade
        ? 'UNAVAILABLE' // Se o produto estiver marcado como indisponível, retorna 'UNAVAILABLE'
        : !controleEstoque
        ? 'AVAILABLE' // Se o controle de estoque estiver desativado, o produto sempre estará disponível
        : estoqueAtual > 0
        ? 'AVAILABLE' // Se o estoque estiver sendo controlado e houver quantidade disponível, está disponível
        : 'UNAVAILABLE'; // Caso contrário, está indisponível

      if (!externalCode) {
        continue;
      }

      const resAtDisponibilidadeProduto = await Servicos.MeuCarrinho.atDisponibilidadeProduto(empresaId, externalCode, novoStatus);
      if (!resAtDisponibilidadeProduto.sucesso) {
        return {
          sucesso: false,
          dados: null,
          erro: resAtDisponibilidadeProduto.erro,
          total: 1,
        };
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
};
