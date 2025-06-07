import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.nfse_padroes, (table) => {
      table.bigIncrements('id');

      table.string('nome', 255).notNullable().unique();
      table.text('observacao');
      table.text('xml_modelo');
      table.string('xml_modelo_empresa', 255);
      table.bigInteger('ativo').notNullable().defaultTo(1);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.nfse_padroes}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.nfse_padroes).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.nfse_padroes}`);
  });
}
