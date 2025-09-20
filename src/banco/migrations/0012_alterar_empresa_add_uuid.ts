import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .alterTable(ETableNames.empresas, (table) => {
      table.uuid('uuid').index().unique().nullable().checkLength('=', 36).checkRegex(Util.UuidV4.regexUuidV4String);
    })
    .then(() => {
      Util.Log.info(`# Adicionado coluna 'uuid' na tabela ${ETableNames.empresas}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema
    .alterTable(ETableNames.empresas, (table) => {
      table.dropColumn('uuid');
    })
    .then(() => {
      Util.Log.info(`# Removido coluna 'uuid' da tabela ${ETableNames.empresas}`);
    });
}
