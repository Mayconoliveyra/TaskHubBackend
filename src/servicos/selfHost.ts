import qs from 'qs';

import { IProdutoERP } from '../banco/models/produtoERP';

import { Repositorios } from '../repositorios';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

import { Axios } from './axios';
import { ISHExtrairDominioEClientId, ISHGetEmpresa, ISHObterClientSecret, ISHObterToken, ISHResponseBase } from './types/selfHost';

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

export const SelfHost = {
  extrairDominioEClientId,
  obterClientSecret,
  obterToken,
  getEmpresa,
};
