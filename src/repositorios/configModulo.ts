import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IConfigModulo } from '../banco/models/configModulo';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

const consultarPorModulo = async (modulo: IConfigModulo['modulo']): Promise<IRetorno<IConfigModulo>> => {
  try {
    const result = await Knex.table(ETableNames.config_modulos).select().where('modulo', '=', modulo).first();

    if (result) {
      return {
        sucesso: true,
        dados: result,
        erro: null,
        total: 1,
      };
    } else {
      return {
        sucesso: false,
        dados: null,
        erro: 'Nenhum registro foi encontrado.',
        total: 0,
      };
    }
  } catch (error) {
    Util.Log.error(`Erro ao consultar modulo: ${modulo}`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

export const ConfigModulo = { consultarPorModulo };
