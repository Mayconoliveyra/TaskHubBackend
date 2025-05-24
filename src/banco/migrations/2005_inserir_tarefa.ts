import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

const id = 5;
export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.tarefas)
    .insert({
      id: id,
      nome: 'Zerar Api Marketplace',
      descricao_resumo: 'Remove todos os cadastros de forma permanente.',
      descricao: `
Essa ação apagará de forma irreversível todas as informações registradas, incluindo categorias, produtos, variações e imagens. Os produtos também serão removidos dos canais de venda integrados (Meu Carrinho, ShowKase e Nuvemshop). No caso da Plug4Market, os produtos serão apenas desabilitados, e não excluídos.
Além disso, será necessário executar o script no banco de dados do cliente para zerar o status de integração no sistema de retaguarda — consulte o FAQ nº 7116.
Antes de reenviar os dados para a integração, acesse o canal de venda e verifique se todos os produtos foram realmente excluídos. Caso ainda estejam visíveis, aguarde alguns minutos. Se mesmo assim os produtos não forem removidos, realize a exclusão manual diretamente no canal de venda.`,
      erp: 'TODOS',
      simultaneamente: true,
      ativo: true,
      param_ss: false,
      param_sh: false,
      param_mc: false,
      param_api_im: true,
      icone: 'https://storage.googleapis.com/tecnosh-img/softcom/taskhub/icone-portal-servico.png',
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
