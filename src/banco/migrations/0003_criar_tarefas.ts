import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.tarefas, (table) => {
      table.bigIncrements('id');

      table.string('nome', 30).notNullable().index(); // Nome da tarefa
      table.string('descricao_resumo', 100).notNullable(); // Descrição resumida.
      table.text('descricao').notNullable(); // Descrição detalhada
      table.enum('erp', ['SOFTSHOP', 'SOFTCOMSHOP', 'TODOS']).notNullable();

      table.boolean('simultaneamente').defaultTo(false); // Define se pode executar simultaneamente
      table.boolean('ativo').defaultTo(false); // Indicador se a automação está ativa

      /**
       * Parâmetros adicionais para customizações específicas.
       * Exemplo: versão, modelo, token específico, entre outros.
       */
      table.text('param_descricao').nullable(); // Descrição dos parâmetros adicionais
      table.text('param_01').nullable();
      table.text('param_02').nullable();
      table.text('param_03').nullable();
      table.text('param_04').nullable();
      table.text('param_05').nullable();
      table.text('param_06').nullable();
      table.text('param_07').nullable();
      table.text('param_08').nullable();
      table.text('param_09').nullable();
      table.text('param_10').nullable();
      table.text('param_11').nullable();
      table.text('param_12').nullable();
      table.text('param_13').nullable();
      table.text('param_14').nullable();
      table.text('param_15').nullable();
      table.text('te_param_descricao').nullable(); // Descrição dos parâmetros adicionais em tarefa_empresa

      // Parâmetros de configurações necessárias
      table.boolean('param_ss').defaultTo(false);
      table.boolean('param_sh').defaultTo(false);
      table.boolean('param_mc').defaultTo(false);
      table.boolean('param_api_im').defaultTo(false);

      table.string('icone', 255).notNullable().defaultTo('https://storage.googleapis.com/tecnosh-img/softcom/taskhub/icone-padrao.png');

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.tarefas}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.tarefas).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.tarefas}`);
  });
}
