import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

const id = 1;
export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.empresas)
    .insert({
      id: id,
      registro: '53539',
      nome: 'SOFTCOM TESTE',
      cnpj_cpf: '99999999000191',
      erp: 'SOFTCOMSHOP',
      ativo: true,
    })
    .then(() => {
      Util.Log.info(`# Inserido registro | Id: ${id} | tabela: ${ETableNames.empresas}`);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex(ETableNames.empresas)
    .where('id', id)
    .del()
    .then(() => {
      Util.Log.info(`# Excluído registro: ${id} | tabela: ${ETableNames.empresas}`);
    });
}
