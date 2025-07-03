import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

const id = 7;
export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.tarefas)
    .insert({
      id: id,
      nome: 'Atual. Estoque – Meu Carrinho',
      descricao_resumo: 'Sincroniza o estoque e a disponibilidade de todos os produtos com a plataforma Meu Carrinho.',
      descricao: `Sincroniza o estoque e a disponibilidade de todos os produtos com a plataforma Meu Carrinho.
Essa tarefa é destinada exclusivamente a clientes que utilizam a integração com marketplaces e nos quais foi identificada alguma divergência de estoque ou disponibilidade.
Antes de executar, é altamente recomendável sincronizar todas as mercadorias pelo sistema de retaguarda.`,
      erp: 'TODOS',
      simultaneamente: true,
      ativo: true,
      param_ss: false,
      param_sh: false,
      param_mc: true,
      param_api_im: true,
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
