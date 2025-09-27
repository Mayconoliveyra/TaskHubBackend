import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.banco_imagens, (table) => {
      table.bigIncrements('id');

      table.string('nome').notNullable();
      table.string('url').notNullable();

      table.decimal('preco', 10, 2).nullable();

      table.string('categorias', 500).notNullable();
      table.string('tags', 500).notNullable();

      table.boolean('recomendado').notNullable().defaultTo(false);

      table
        .bigInteger('empresa_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(ETableNames.empresas)
        .onUpdate('NO ACTION')
        .onDelete('NO ACTION')
        .defaultTo(null);
      table.integer('produto_code').nullable();

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
      table.timestamp('deleted_at');
    })
    .then(async () => {
      // FULLTEXT index combinado para nome + tags + categorias
      await knex.raw('ALTER TABLE ?? ADD FULLTEXT idx_fulltext_tags_categorias (tags, categorias)', [ETableNames.banco_imagens]);

      Util.Log.info(`# Criado tabela ${ETableNames.banco_imagens}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.banco_imagens).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.banco_imagens}`);
  });
}
