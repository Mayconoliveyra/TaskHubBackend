import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .alterTable(ETableNames.empresas, (table) => {
      table.string('zt_host').unique();

      table.integer('zt_host_remoto_porta').notNullable().defaultTo(4009);
      table.boolean('zt_host_remoto_porta_ativo').defaultTo(false);

      table.integer('zt_host_sql_porta').notNullable().defaultTo(5433);
      table.boolean('zt_host_sql_porta_ativo').defaultTo(false);

      table.integer('zt_host_selfhost_porta').notNullable().defaultTo(7711);
      table.boolean('zt_host_selfhost_porta_ativo').defaultTo(true);
    })
    .then(() => {
      Util.Log.info(`# Adicionado colunas 'zt_*' na tabela ${ETableNames.empresas}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema
    .alterTable(ETableNames.empresas, (table) => {
      table.dropColumn('zt_host');
      table.dropColumn('zt_host_remoto_porta');
      table.dropColumn('zt_host_remoto_porta_ativo');
      table.dropColumn('zt_host_sql_porta');
      table.dropColumn('zt_host_sql_porta_ativo');
      table.dropColumn('zt_host_selfhost_porta');
      table.dropColumn('zt_host_selfhost_porta_ativo');
    })
    .then(() => {
      Util.Log.info(`# Removido colunas 'zt_*' da tabela ${ETableNames.empresas}`);
    });
}
