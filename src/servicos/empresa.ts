import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';

import { Repositorios } from '../repositorios';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

import { IGerarJsonZeroTrust } from './types/empresa';

const gerarJsonZeroTrust = async (uuid: string): Promise<IRetorno<IGerarJsonZeroTrust>> => {
  try {
    if (!process.env.ZT_KEY) {
      return {
        sucesso: false,
        dados: null,
        erro: `ZT_KEY não está configurada`,
        total: 0,
      };
    }

    const result = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'uuid', operador: '=', valor: uuid }]);

    if (!result.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: Util.Msg.erroInesperado,
        total: 0,
      };
    }

    const empresaId = Number(result.dados.id);
    const idFormatado = empresaId.toString().padStart(4, '0');

    const proxies: IGerarJsonZeroTrust['proxies'] = [];

    // remoto (RDP)
    if (result.dados.zt_host_remoto_porta_ativo) {
      proxies.push({
        name: `${result.dados.zt_host}-remoto`,
        type: 'tcp',
        localPort: result.dados.zt_host_remoto_porta,
        remotePort: Number(`1${idFormatado}`),
      });
    }

    // SQL
    if (result.dados.zt_host_sql_porta_ativo) {
      proxies.push({
        name: `${result.dados.zt_host}-sql`,
        type: 'tcp',
        localPort: result.dados.zt_host_sql_porta,
        remotePort: Number(`2${idFormatado}`),
      });
    }

    // Selfhost
    if (result.dados.zt_host_selfhost_porta_ativo) {
      proxies.push({
        name: `${result.dados.zt_host}-selfhost`,
        type: 'https',
        localPort: result.dados.zt_host_selfhost_porta,
        subdomain: `${result.dados.zt_host}`,
        plugin: {
          type: 'https2http',
          localAddr: `127.0.0.1:${result.dados.zt_host_selfhost_porta}`,
          crtPath: './fullchain.pem',
          keyPath: './privkey.pem',
        },
      });
    }

    // Config final
    const config: IGerarJsonZeroTrust = {
      serverAddr: 'connect.softcomzerotrust.com',
      serverPort: 11770,
      auth: {
        token: process.env.ZT_KEY,
      },
      transport: {
        tls: { enable: true },
      },
      log: {
        maxDays: 3,
      },
      proxies,
    };

    return {
      sucesso: true,
      dados: config,
      erro: null,
      total: proxies.length,
    };
  } catch (error) {
    Util.Log.error(`Erro ao gerar JSON Zero Trust.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

export const Empresa = { gerarJsonZeroTrust };
