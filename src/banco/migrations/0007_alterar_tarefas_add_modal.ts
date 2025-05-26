import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .alterTable(ETableNames.tarefas, (table) => {
      table.string('modal', 100).notNullable().defaultTo('PADRAO');
    })
    .then(() => {
      Util.Log.info(`# Adicionado coluna 'modal' na tabela ${ETableNames.tarefas}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema
    .alterTable(ETableNames.tarefas, (table) => {
      table.dropColumn('modal');
    })
    .then(() => {
      Util.Log.info(`# Removido coluna 'modal' da tabela ${ETableNames.tarefas}`);
    });
}
