import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { INFSePadrao } from '../banco/models/NFSePadrao';

import { Util } from '../util';
import { IFiltro, IRetorno } from '../util/tipagens';

const MODULO = '[NFSe]';

type IRetornoNFSePadrao = Omit<INFSePadrao, 'xml_modelo' | 'created_at' | 'ativo'> & { xml_modelo: boolean };

const consultar = async (): Promise<IRetorno<IRetornoNFSePadrao[]>> => {
  try {
    // Dados
    const result = await Knex(ETableNames.nfse_padroes).select('id', 'nome', 'observacao', 'xml_modelo').where('ativo', '=', true).orderBy('nome', 'asc');

    const dadosTratados = result.map((item) => ({
      id: item.id,
      nome: item.nome,
      observacao: item.observacao,
      xml_modelo: !!item.xml_modelo,
    }));

    return {
      sucesso: true,
      dados: dadosTratados,
      erro: null,
      total: result.length || 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

const consultarPrimeiroRegistro = async (filtros: IFiltro<INFSePadrao>[]): Promise<IRetorno<INFSePadrao>> => {
  try {
    const query = Knex.table(ETableNames.nfse_padroes).select('*');

    filtros.forEach((filtro) => {
      query.where(filtro.coluna, filtro.operador, filtro.valor);
    });

    const result = await query.first();

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
    Util.Log.error(`${MODULO} | Erro ao consultar primeiro registro com filtros: filtros:${JSON.stringify(filtros)}`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

export const NFSe = { consultar, consultarPrimeiroRegistro };
