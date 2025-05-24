import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

const id = 3;
export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.tarefas)
    .insert({
      id: id,
      nome: 'DataSyncFood - Meu Carrinho',
      descricao_resumo: 'Exporta o cardápio do SOFTSHOP para o Meu Carrinho, sem sincronização automática.',
      descricao:
        'Exporte facilmente o cardápio do SOFTSHOP para o Meu Carrinho. Serão transferidas as informações já cadastradas, como grupos, produtos principais, combos e variações. Essa funcionalidade tem como objetivo facilitar o primeiro envio do cardápio, mas não substitui a necessidade de gerenciamento contínuo pela plataforma do Meu Carrinho. Importante: alterações futuras como preço, estoque, novos produtos e atualizações não serão sincronizadas automaticamente, sendo necessário realizar essas manutenções diretamente no painel do Meu Carrinho.',
      erp: 'SOFTSHOP',
      simultaneamente: true,
      ativo: true,
      param_ss: false,
      param_sh: true,
      param_mc: true,
      param_api_im: false,
      icone: 'https://storage.googleapis.com/tecnosh-img/softcom/taskhub/icone-meucarrinho-softshop.png',
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
