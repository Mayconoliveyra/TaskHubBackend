import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IProdutoERP } from '../banco/models/produtoERP';

import { Util } from '../util';
import { IFiltro, IRetorno } from '../util/tipagens';

const MODULO = '[Produtos ERP]';

const apagarProdutosPorEmpresaId = async (empresaId: number) => {
  try {
    await Knex(ETableNames.produtos_erp).delete().where('empresa_id', '=', empresaId);
    return true;
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao apagar produtos da empresa.`, error);
    return false;
  }
};

const inserir = async (produtos: Partial<IProdutoERP>[] | Partial<IProdutoERP>) => {
  try {
    if (Array.isArray(produtos)) {
      if (produtos.length === 0) throw 'Produtos não pode ser um array vazio.';
    }

    await Knex(ETableNames.produtos_erp).insert(produtos);

    return true;
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao inserir produtos.`, error);
    return false;
  }
};

const consultarCategorias = async (empresaId: number) => {
  try {
    return await Knex(ETableNames.produtos_erp).where('empresa_id', '=', empresaId).andWhere('type', '=', 'CATEGORY');
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar categorias.`, error);
    return false;
  }
};

const consultarPrimeiroRegistroPorColuna = async (empresaId: number, type: IProdutoERP['type'], coluna: keyof IProdutoERP, valorBuscar: string) => {
  try {
    return await Knex.table(ETableNames.produtos_erp)
      .select()
      .where('empresa_id', '=', empresaId)
      .where(coluna, '=', valorBuscar)
      .andWhere('type', '=', type)
      .first();
  } catch (error) {
    Util.Log.error(
      `${MODULO} | Erro ao consultar primeiro registro por coluna: Type:${type.toLowerCase()}; coluna:${coluna.toLowerCase()}; valorBuscar:${valorBuscar.toLowerCase()};`,
      error,
    );
    return false;
  }
};

const consultar = async (
  empresaId: number,
  type: IProdutoERP['type'],
  orderBy: { coluna: keyof IProdutoERP; direcao?: 'asc' | 'desc' } = { coluna: 'id', direcao: 'asc' },
) => {
  try {
    return await Knex(ETableNames.produtos_erp)
      .where('empresa_id', '=', empresaId)
      .andWhere('type', '=', type)
      .orderBy(orderBy.coluna, orderBy.direcao || 'asc');
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar ${type.toLowerCase()}.`, error);
    return false;
  }
};

const consultarPrimeiroRegistro = async (filtros: IFiltro<IProdutoERP>[]): Promise<IRetorno<IProdutoERP>> => {
  try {
    const query = Knex.table(ETableNames.produtos_erp).select('*');

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

const atualizarDados = async (empresaId: number, coluna: keyof IProdutoERP, valorBuscar: string, data: Partial<IProdutoERP>): Promise<IRetorno<string>> => {
  try {
    const result = await Knex(ETableNames.produtos_erp)
      .where('empresa_id', '=', empresaId)
      .where(coluna, '=', valorBuscar)
      .update({ ...data });

    if (result) {
      return {
        sucesso: true,
        dados: Util.Msg.sucesso,
        erro: null,
        total: 1,
      };
    } else {
      return {
        sucesso: false,
        dados: null,
        erro: Util.Msg.erroInesperado,
        total: 0,
      };
    }
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar dados.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};
export const ProdutosERP = {
  inserir,
  apagarProdutosPorEmpresaId,
  consultarCategorias,
  consultar,
  consultarPrimeiroRegistroPorColuna,
  consultarPrimeiroRegistro,
  atualizarDados,
};
