import { Knex } from 'knex';

import { ETableNames } from '../eTableNames';
const { NODE_ENV } = process.env;

export const seed = async (knex: Knex) => {
  if (NODE_ENV === 'production') return;

  const result = await knex(ETableNames.tarefas).first();
  if (result) return;

  await knex(ETableNames.tarefas)
    .insert([])
    .then(() => {
      console.log(`DEV - Inserido dados na tabela ${ETableNames.tarefas}`);
    });
};
3;
