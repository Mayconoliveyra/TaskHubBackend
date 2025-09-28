import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.config_modulos, (table) => {
      table.bigIncrements('id');

      table.enu('modulo', ['ZERO_TRUST']).notNullable();

      table.string('zt_cert_url_download').notNullable();
      table.float('zt_cert_versao').notNullable();
      table.string('zt_arquivos_url_download').notNullable();
      table.float('zt_arquivos_url_versao').notNullable();

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.config_modulos}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.config_modulos).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.config_modulos}`);
  });
}
