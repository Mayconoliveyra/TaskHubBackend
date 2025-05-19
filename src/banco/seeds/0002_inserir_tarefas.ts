import { Knex } from 'knex';

import { ETableNames } from '../eTableNames';
const { NODE_ENV } = process.env;

export const seed = async (knex: Knex) => {
  if (NODE_ENV === 'production') return;

  const result = await knex(ETableNames.tarefas).first();
  if (result) return;

  await knex(ETableNames.tarefas)
    .insert([
      {
        id: 1,
        nome: 'DataSyncFood - Meu Carrinho',
        descricao_resumo: 'Exporta o cardápio do SOFTCOMSHOP para o Meu Carrinho, sem sincronização automática.',
        descricao:
          'Exporte facilmente o cardápio do SOFTCOMSHOP para o Meu Carrinho. Serão transferidas as informações já cadastradas, como grupos, produtos principais, combos e variações. Essa funcionalidade tem como objetivo facilitar o primeiro envio do cardápio, mas não substitui a necessidade de gerenciamento contínuo pela plataforma do Meu Carrinho. Importante: alterações futuras como preço, estoque, novos produtos e atualizações não serão sincronizadas automaticamente, sendo necessário realizar essas manutenções diretamente no painel do Meu Carrinho.',
        erp: 'SOFTCOMSHOP',
        simultaneamente: true,
        ativo: true,
        param_ss: true,
        param_sh: false,
        param_mc: true,
        param_api_im: false,
        icone: 'https://storage.googleapis.com/tecnosh-img/softcom/taskhub/icone-softcomshop-meucarrinho2.png',
      },
      {
        id: 2,
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
      },
      {
        id: 3,
        nome: 'Zerar Meu Carrinho',
        descricao_resumo: 'Remove todo catálogo atual do Meu Carrinho de forma permanente.',
        descricao:
          'Remove todo o catálogo atual do Meu Carrinho de forma permanente. Serão apagadas todas as informações cadastradas: categorias, produtos, variações e imagens. Essa ação é irreversível.',
        erp: 'TODOS',
        simultaneamente: true,
        ativo: true,
        param_ss: false,
        param_sh: false,
        param_mc: true,
        param_api_im: false,
        icone: 'https://storage.googleapis.com/tecnosh-img/softcom/taskhub/icone-meu-carrinho.png',
      },
      {
        id: 4,
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
      },
      {
        id: 5,
        nome: 'Teste',
        descricao_resumo: 'Remove todos os cadastros de forma permanente.',
        descricao: `Essa ação apagará de forma irreversível todas as informações registradas, incluindo categorias, produtos, variações e imagens. Além disso, os produtos também serão excluídos dos canais de venda integrados, como Meu Carrinho e Nuvemshop. No caso da Plug4Market, os produtos serão apenas desabilitados, não excluídos.`,
        erp: 'TODOS',
        simultaneamente: true,
        ativo: false,
        param_ss: false,
        param_sh: false,
        param_mc: false,
        param_api_im: true,
        icone: 'https://storage.googleapis.com/tecnosh-img/softcom/taskhub/icone-padrao2.png',
      },
    ])
    .then(() => {
      console.log(`# Inserido dados na tabela ${ETableNames.tarefas}`);
    });
};
3;
