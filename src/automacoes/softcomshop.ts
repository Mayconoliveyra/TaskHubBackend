import { Util } from '../util';

import { Puppeteer } from './puppeteer';

const addRoleUserFavorita = async (usuarioDB: string, senhaDB: string, banco: 'ANTIGO' | 'NOVO', ssURL: string) => {
  const urlDb = banco === 'ANTIGO' ? 'https://softcomsistemas.com.br/opalassv6' : 'https://softcomshop.com.br/opalassv6/index.ph';

  const { page, browser } = await Puppeteer.pagina({ headless: false });

  try {
    // Acessa a URL
    await page.goto(urlDb);
    await page.waitForNavigation();

    await Puppeteer.aguardarEDigitar(page, '#input_username', usuarioDB);
    await Puppeteer.aguardarEDigitar(page, '#input_password', senhaDB);
    await Puppeteer.aguardarEClicar(page, '#input_go');
    await page.waitForNavigation();

    await page.goto(`${urlDb}/index.php?route=/database/sql&db=softcoms_softcomshop_${ssURL}`);

    const seletor = await Puppeteer.capturarPrimeiroSeletor(page, ['.CodeMirror', '#li_select_mysql_collation']);

    console.log('seletor', seletor);

    const queryCorrigirErro500AposLogin = `ALTER TABLE role_user ADD favorita BOOLEAN NOT NULL DEFAULT FALSE AFTER empresa_id; INSERT INTO migrations (migration, batch) SELECT '2025_02_26_110556_alter_table_role_user_add_column_favorita', 1 WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE migration = '2025_02_26_110556_alter_table_role_user_add_column_favorita');`;

    await Puppeteer.aguardarEDigitar(page, '.CodeMirror', queryCorrigirErro500AposLogin);
    await Puppeteer.aguardarEClicar(page, '#button_submit_query');

    const teste = await Puppeteer.verificarResultadoSQL(page);

    console.log(teste);

    await Puppeteer.aguardar(10000);

    Util.Log.info('Consulta executada com sucesso.');
  } catch (error: any) {
    Util.Log.error(`Erro ao executar automação Puppeteer: ${error.message}`);
  } finally {
    // Pode manter aberto ou fechar se preferir
    await browser.close();
  }
};

export const Softcomshop = { addRoleUserFavorita };
