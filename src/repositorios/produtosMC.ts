import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IProdutoMC } from '../banco/models/produtoMC';
import { IProdutoMCImagem } from '../banco/models/produtoMCImagem';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

const MODULO = '[Produtos MC]';
const MODULO_IMAGEM = '[Produtos Imagem MC]';

const apagarProdutosPorEmpresaId = async (empresaId: number) => {
  try {
    await Knex(ETableNames.produtos_mc).delete().where('empresa_id', '=', empresaId);
    return true;
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao apagar produtos da empresa.`, error);
    return false;
  }
};

const inserir = async (produtos: Partial<IProdutoMC>[] | Partial<IProdutoMC>) => {
  try {
    if (Array.isArray(produtos)) {
      if (produtos.length === 0) throw 'Produtos não pode ser um array vazio.';
    }

    await Knex(ETableNames.produtos_mc).insert(produtos);

    return true;
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao inserir produtos meu carrinho.`, error);
    return false;
  }
};

const consultarCategorias = async (empresaId: number) => {
  try {
    return await Knex(ETableNames.produtos_mc).where('empresa_id', '=', empresaId).andWhere('type', '=', 'CATEGORY');
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar categorias.`, error);
    return false;
  }
};

const consultarPrimeiroRegistroPorColuna = async (empresaId: number, type: IProdutoMC['type'], coluna: keyof IProdutoMC, valorBuscar: string) => {
  try {
    return await Knex.table(ETableNames.produtos_mc)
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
  type: IProdutoMC['type'],
  orderBy: { coluna: keyof IProdutoMC; direcao?: 'asc' | 'desc' } = { coluna: 'id', direcao: 'asc' },
) => {
  try {
    return await Knex(ETableNames.produtos_mc)
      .where('empresa_id', '=', empresaId)
      .andWhere('type', '=', type)
      .orderBy(orderBy.coluna, orderBy.direcao || 'asc');
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar ${type.toLowerCase()}.`, error);
    return false;
  }
};

const reativarOuInserirImagem = async (imagem: Partial<IProdutoMCImagem>): Promise<IRetorno<string>> => {
  try {
    // Verifica se a imagem já existe com deleted_at preenchido
    const imagemExistente = await Knex(ETableNames.produtos_mc_img)
      .where({
        url_origem: imagem.url_origem,
        produto_code: imagem.produto_code,
        empresa_id: imagem.empresa_id,
      })
      .whereNotNull('deleted_at')
      .first();

    if (imagemExistente) {
      // Se existe, "reativa" a imagem
      const atualizacao = await Knex(ETableNames.produtos_mc_img).where('id', imagemExistente.id).update({
        deleted_at: null,
        created_at: Util.DataHora.obterDataAtual(),
        ordem: imagem.ordem,
      });

      if (atualizacao) {
        return {
          sucesso: true,
          dados: Util.Msg.sucesso,
          erro: null,
          total: 1,
        };
      }
    } else {
      // Se não existe, faz a inserção normal
      const result = await Knex(ETableNames.produtos_mc_img).insert(imagem);

      if (result) {
        return {
          sucesso: true,
          dados: Util.Msg.sucesso,
          erro: null,
          total: 1,
        };
      }
    }

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO_IMAGEM} | Erro ao inserir imagem produtos meu carrinho.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

const apagarImagensPorProdutoCode = async (empresaId: number, code: string): Promise<IRetorno<string>> => {
  try {
    const result = await Knex.table(ETableNames.produtos_mc_img).where('empresa_id', empresaId).andWhere('produto_code', code).whereNull('deleted_at').update({
      deleted_at: Util.DataHora.obterDataAtual(),
      ordem: 0,
    });

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
    Util.Log.error(`${MODULO_IMAGEM} | Erro ao apagar imagens do produto`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 0,
    };
  }
};

export const ProdutosMC = {
  inserir,
  apagarProdutosPorEmpresaId,
  consultarCategorias,
  consultarPrimeiroRegistroPorColuna,
  consultar,
  reativarOuInserirImagem,
  apagarImagensPorProdutoCode,
};
