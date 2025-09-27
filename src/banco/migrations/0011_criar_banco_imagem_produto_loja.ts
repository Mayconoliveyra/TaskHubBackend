import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.banco_imagem_produto_loja, (table) => {
      table.bigIncrements('id');
      table.bigInteger('empresa_id').unsigned().notNullable().references('id').inTable(ETableNames.empresas).onUpdate('RESTRICT').onDelete('RESTRICT');

      table.integer('codigo').notNullable();
      table.string('nome').notNullable();
      table.string('categoria').notNullable();
      table.decimal('preco', 10, 2).nullable();

      table.string('tags', 1000).notNullable();

      table.string('img_01').nullable();
      table.string('img_02').nullable();
      table.string('img_03').nullable();
      table.string('img_04').nullable();
      table.string('img_05').nullable();
      table.string('img_06').nullable();
      table.string('img_07').nullable();
      table.string('img_08').nullable();
      table.string('img_09').nullable();
      table.string('img_10').nullable();
      table.string('img_11').nullable();
      table.string('img_12').nullable();
      table.string('img_13').nullable();
      table.string('img_14').nullable();
      table.string('img_15').nullable();

      table.integer('total_imgs').notNullable();

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
      table.timestamp('deleted_at');
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.banco_imagem_produto_loja}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.banco_imagem_produto_loja).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.banco_imagem_produto_loja}`);
  });
}
