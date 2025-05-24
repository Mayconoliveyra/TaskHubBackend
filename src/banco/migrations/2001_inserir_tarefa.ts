import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

const id = 1;
export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.tarefas)
    .insert({
      id: id,
      nome: 'Teste',
      descricao_resumo: 'Remove todos os cadastros de forma permanente.',
      descricao: `Essa ação apagará de forma irreversível todas as informações registradas, incluindo categorias, produtos, variações e imagens. Além disso, os produtos também serão excluídos dos canais de venda integrados, como Meu Carrinho e Nuvemshop. No caso da Plug4Market, os produtos serão apenas desabilitados, não excluídos.`,
      erp: 'TODOS',
      simultaneamente: true,
      ativo: false,
      param_ss: false,
      param_sh: false,
      param_mc: false,
      param_api_im: true,
      icone: 'https://storage.googleapis.com/tecnosh-img/softcom/taskhub/icone-padrao2.png',
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
