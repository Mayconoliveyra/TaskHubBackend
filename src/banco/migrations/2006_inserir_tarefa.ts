import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

const id = 6;
export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.tarefas)
    .insert({
      id: id,
      nome: 'Analise NFSe',
      descricao_resumo: 'Compara NFSe rejeitada com autorizada e sugere correções para aprovação.',
      descricao: `Esta tarefa tem como objetivo analisar uma NFSe (Nota Fiscal de Serviço Eletrônica) rejeitada pelo sistema da prefeitura, realizando uma comparação detalhada com um exemplo de NFSe previamente autorizada para o mesmo município. O processo identifica divergências estruturais e de conteúdo que possam ter causado a rejeição, como campos obrigatórios ausentes, formatos de informação incorretos ou valores divergentes em campos críticos.
Ao final da análise, serão apresentados relatórios claros com as diferenças encontradas, sugestões de ajustes e correções necessárias para que a NFSe possa ser validada e aceita pela prefeitura. A solução visa otimizar o tempo de identificação e resolução de erros, facilitando o processo de emissão de notas fiscais em conformidade com o padrão municipal.`,
      erp: 'TODOS',
      simultaneamente: true,
      ativo: true,
      param_ss: false,
      param_sh: false,
      param_mc: false,
      param_api_im: false,
      icone: 'https://storage.googleapis.com/tecnosh-img/softcom/taskhub/icone-analise-doc2.png',
      param_descricao: `
      param_01 = modelo de IA a ser utilizado.
      `,
      param_01: 'mistralai/mistral-7b-instruct',
      modal: 'ANALISE_NFSE',
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
