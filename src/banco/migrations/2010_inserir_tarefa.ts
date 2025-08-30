import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

const id = 8;
export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.tarefas)
    .insert({
      id: id,
      nome: 'Sinc. Imagens – Meu Carrinho',
      descricao_resumo: 'Realiza a sincronização das imagens capturadas do Meu Carrinho durante o processo de zeragem.',
      descricao: `A captura ocorre de forma automática sempre que o cadastro do Meu Carrinho é zerado pela tarefa Zerar Meu Carrinho, ou quando é utilizada a tarefa Zerar API Marketplace. No entanto, no caso da API Marketplace, as imagens só serão capturadas se as credenciais do Meu Carrinho estiverem configuradas no momento da execução da tarefa.`,
      erp: 'TODOS',
      simultaneamente: true,
      ativo: true,
      param_ss: false,
      param_sh: false,
      param_mc: true,
      param_api_im: false,
      icone: 'https://storage.googleapis.com/tecnosh-img/softcom/taskhub/icone-meu-carrinho.png',
    })
    .then(() => {
      Util.Log.info(`# Inserido registro | Id: ${id} | tabela: ${ETableNames.tarefas}`);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex(ETableNames.tarefas)
    .where('id', id)
    .del()
    .then(() => {
      Util.Log.info(`# Excluído registro: ${id} | tabela: ${ETableNames.tarefas}`);
    });
}
