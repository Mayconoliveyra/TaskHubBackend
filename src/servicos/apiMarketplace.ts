import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

import { Axios } from './axios';
import { IApiIMErroValidacao, IApiIMAutenticar } from './types/apiMarketplace';

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

export const ApiMarketplace = {
  autenticar,
};
