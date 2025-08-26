import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.produtos_mc_img, (table) => {
      table.bigIncrements('id');
      table.bigInteger('empresa_id').unsigned().notNullable().references('id').inTable(ETableNames.empresas).onUpdate('RESTRICT').onDelete('RESTRICT');

      table.string('produto_code').notNullable();
      table.text('base64', 'longtext');
      table.string('url_origem').notNullable();
      table.string('url_nova').notNullable();
      table.integer('ordem').notNullable().defaultTo(0);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
      table.timestamp('deleted_at');
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.produtos_mc_img}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.produtos_mc_img).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.produtos_mc_img}`);
  });
}
