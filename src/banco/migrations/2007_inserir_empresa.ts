import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

const id = 1;
export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.empresas)
    .insert({
      id: id,
      uuid: '56313283-804d-4ba9-b9ce-14dd94efbedc',
      registro: '53539',
      nome: 'SOFTCOM TESTE',
      cnpj_cpf: '99999999000191',

      zt_host: '1-softcom',
      zt_host_remoto_porta: 3389,
      zt_host_remoto_porta_ativo: true,
      zt_host_sql_porta: 5433,
      zt_host_sql_porta_ativo: true,
      zt_host_selfhost_porta: 7711,
      zt_host_selfhost_porta_ativo: true,

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
