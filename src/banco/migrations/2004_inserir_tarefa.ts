import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

const id = 4;
export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.tarefas)
    .insert({
      id: id,
      nome: 'Zerar Meu Carrinho',
      descricao_resumo: 'Remove todo catálogo atual do Meu Carrinho de forma permanente.',
      descricao:
        'Remove todo o catálogo atual do Meu Carrinho de forma permanente. Serão apagadas todas as informações cadastradas: categorias, produtos, variações e imagens. Essa ação é irreversível.',
      erp: 'TODOS',
      simultaneamente: true,
      ativo: true,
      param_ss: false,
      param_sh: false,
      param_mc: true,
      param_api_im: false,
      icone: 'https://storage.googleapis.com/tecnosh-img/softcom/taskhub/icone-meu-carrinho.png',
    })
    .then(() => {
      Util.Log.info(`# Inserido registro | Id: ${id} | tabela: ${ETableNames.tarefas}`);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex(ETableNames.tarefas)
    .where('id', id)
    .del()
    .then(() => {
      Util.Log.info(`# Excluído registro: ${id} | tabela: ${ETableNames.tarefas}`);
    });
}
