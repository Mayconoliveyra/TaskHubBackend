import { existsSync, readdirSync, statSync, mkdirSync, copyFileSync } from 'fs';
import { mkdtempSync, rmSync } from 'fs-extra';
import { tmpdir } from 'os';
import path from 'path';
import puppeteer, { Page, Browser } from 'puppeteer';

import { Util } from '../util';

// Diretório browser
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

// Nome do provedor para logs
const PROVIDER_NAME = 'automations.puppeteer';

// Caminho base para o diretório _homer-bot
const homerBotDir = path.join(tmpdir(), '._homer-bot');

// Verifica se o diretório _homer-bot existe
if (existsSync(homerBotDir)) {
  // Remove o diretório e todo o seu conteúdo
  rmSync(homerBotDir, { recursive: true, force: true });
  Util.Log.info(`Diretório ${homerBotDir} removido com sucesso.`);
}

// Verifica se o diretório _homer-bot existe, caso contrário, cria
if (!existsSync(homerBotDir)) {
  mkdirSync(homerBotDir, { recursive: true });
  Util.Log.info(`Diretório ${homerBotDir} criado com sucesso.`);
}

const copiarDirIgnorandoEmUso = (source: string, destination: string): void => {
  const files = readdirSync(source);
  files.forEach((file) => {
    const srcPath = path.join(source, file);
    const destPath = path.join(destination, file);

    try {
      if (statSync(srcPath).isDirectory()) {
        mkdirSync(destPath, { recursive: true });
        copiarDirIgnorandoEmUso(srcPath, destPath);
      } else {
        copyFileSync(srcPath, destPath); // Copia arquivos
      }
    } catch (error: any) {
      if (error.code === 'EBUSY') {
        /* Util.Log.warn(`${PROVIDER_NAME}\nArquivo ocupado ignorado: ${srcPath}`); */
      } else {
        throw error;
      }
    }
  });
};

// Configurações padrão
const DEFAULTS = {
  headless: false,
  slowMo: 15,
  timeout: 1000 * 60 * 1, // 1 minuto
  vwWidth: 1440, // Define a largura
  vwHeight: 900, // Define a altura
  userDataDir: path.join(PROJECT_ROOT, 'browser', 'user_data'),
  executablePath: path.join(PROJECT_ROOT, 'browser', 'chrome_win', 'chrome.exe'),
  extensionPath: path.join(PROJECT_ROOT, 'browser', '2captcha'),
};

// Cria uma instância do Puppeteer com configurações personalizadas
const pagina = async ({
  headless = DEFAULTS.headless,
  slowMo = DEFAULTS.slowMo,
  vwWidth = DEFAULTS.vwWidth,
  vwHeight = DEFAULTS.vwHeight,
}: {
  headless?: boolean;
  slowMo?: number;
  vwWidth?: number;
  vwHeight?: number;
}): Promise<{ page: Page; browser: Browser }> => {
  try {
    // Cria o diretório temporário dentro de _homer-bot
    const tempUserDataDir = mkdtempSync(path.join(homerBotDir, 'puppeteer-temp-'));

    // Copiar o conteúdo do diretório original para o temporário
    copiarDirIgnorandoEmUso(DEFAULTS.userDataDir, tempUserDataDir);
    Util.Log.info(`userDataDir: ${tempUserDataDir}`);

    const browser = await puppeteer.launch({
      headless,
      slowMo,
      executablePath: DEFAULTS.executablePath,
      userDataDir: tempUserDataDir,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--load-extension=${DEFAULTS.extensionPath}`,
        `--disable-extensions-except=${DEFAULTS.extensionPath}`,
        `--window-size=${vwWidth},${vwHeight}`,
      ],

      defaultViewport: {
        width: vwWidth,
        height: vwHeight,
      },
    });

    // Abre uma nova aba específica
    const page = await browser.newPage();
    page.setDefaultTimeout(DEFAULTS.timeout);

    // Adicionar lógica para excluir o diretório temporário quando o browser fechar

    browser.on('disconnected', async () => {
      try {
        // Espera um breve período para garantir que todos os arquivos sejam liberados
        await aguardar(3000);
        rmSync(tempUserDataDir, { recursive: true, force: true });
        /* Util.Log.info(`${PROVIDER_NAME}\nDiretório temporário removido: ${userDataDir}`); */
      } catch (err: any) {
        Util.Log.error(`${PROVIDER_NAME}\nErro ao remover diretório temporário: ${err.message}`, err);
      }
    });

    return { browser, page };
  } catch (error: any) {
    Util.Log.error(`${PROVIDER_NAME}\nErro ao inicializar Puppeteer: ${error.message}`, error);
    throw new Error('Falha ao criar instância do Puppeteer');
  }
};

// Pausa a execução por um período
const aguardar = (ms = 3000): Promise<void> => {
  Util.Log.info(`${PROVIDER_NAME} | Aguardando por ${ms}ms...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Extrai o próximo valor após o valor atual em uma mensagem
const extrairValorSeguinte = (message: string, currentValue: string): string | null => {
  try {
    // 1. Remove espaços das extremidades e divide a frase por qualquer quantidade de espaços
    const parts = message.trim().split(/\s+/);

    // 2. Procura a posição da palavra de referência
    const index = parts.indexOf(currentValue);

    // 3. Se encontrou e existe algo após ela, devolve esse “próximo” valor
    if (index !== -1 && index + 1 < parts.length) {
      const nextValue = parts[index + 1];
      Util.Log.debug(`${PROVIDER_NAME} | Valor seguinte encontrado: ${nextValue} (após "${currentValue}")`);
      return nextValue;
    }

    // 4. Caso não exista sucessor ou a palavra não seja encontrada, registra e devolve null
    Util.Log.info(`${PROVIDER_NAME} | Valor "${currentValue}" não encontrado ou sem sucessor em: "${message}"`);
    return null;
  } catch (error: any) {
    // 5. Captura qualquer exceção inesperada e devolve null
    Util.Log.error(`${PROVIDER_NAME} | Erro ao extrair valor seguinte a "${currentValue}" | ${error.message}`, error);
    return null;
  }
};

// Extrai o valor de uma chave específica em uma mensagem formatada
const extrairValorPorChave = (message: string, key: string): string | null => {
  try {
    // 1. Quebra o texto por quebras de linha (compatível \n ou \r\n)
    const lines = message.split(/\r?\n/);

    // 2. Percorre cada linha em busca da chave indicada
    for (const line of lines) {
      const trimmedLine = line.trim();

      // A comparação considera a chave seguida de ":" ou da própria chave
      if (
        trimmedLine.startsWith(`${key}:`) ||
        trimmedLine.startsWith(`${key} :`) || // espaço antes dos dois-pontos
        trimmedLine === key // linha que contenha somente a chave
      ) {
        const parts = trimmedLine.split(':');

        // Se existir informação após ":", retorna o valor já sem espaços
        const valor = parts[1]?.trim() || null;

        Util.Log.debug(`${PROVIDER_NAME} | Valor encontrado para chave "${key}": ${valor}`);
        return valor;
      }
    }

    // 3. Caso nenhuma linha corresponda, apenas registra e devolve null
    Util.Log.info(`${PROVIDER_NAME} | Chave "${key}" não encontrada em mensagem.`);
    return null;
  } catch (error: any) {
    // 4. Captura erros inesperados e evita quebra do fluxo
    Util.Log.error(`${PROVIDER_NAME} | Erro ao extrair valor da chave "${key}" | ${error.message}`, error);
    return null;
  }
};

// Aguarda e captura o primeiro seletor disponível
const capturarPrimeiroSeletor = async (page: Page, selectors: string[], timeout: number = DEFAULTS.timeout): Promise<string | null> => {
  try {
    Util.Log.info(`${PROVIDER_NAME} | Aguardando por um dos seletores: ${selectors.join(', ')}`);

    const element = await page.waitForFunction((...selectors) => selectors.map((s) => document.querySelector(s)).find(Boolean), { timeout }, ...selectors);

    if (!element) {
      Util.Log.warn(`${PROVIDER_NAME} | Nenhum seletor encontrado: ${selectors.join(', ')}`);
      return null;
    }

    const seletorEncontrado = await page.evaluate((el, selectors) => selectors.find((s) => el?.matches(s)) || null, element, selectors);

    Util.Log.info(`${PROVIDER_NAME} | Seletor identificado: ${seletorEncontrado}`);
    return seletorEncontrado;
  } catch (error: any) {
    if (error.name === 'TimeoutError') {
      Util.Log.error(`${PROVIDER_NAME} | Timeout ao capturar seletores: ${selectors.join(', ')}`);
    } else {
      Util.Log.error(`${PROVIDER_NAME} | Erro ao capturar seletor: ${error.message}`, error);
    }
    return null;
  }
};
// Monitora seletor na página e executa callback ao encontrá-lo
const monitorarSeletor = (
  page: Page,
  selector: string,
  callback: () => Promise<void>,
  continueMonitoringAfterDisappear = false,
  checkInterval = 2000,
): void => {
  let isMonitoring = true;
  let isSelectorFound = false;

  Util.Log.info(`${PROVIDER_NAME} | Iniciando monitoramento do seletor: ${selector}`);

  const stopMonitoring = () => {
    isMonitoring = false;
    Util.Log.info(`${PROVIDER_NAME} | Monitoramento encerrado para o seletor: ${selector}`);
  };

  const checkSelector = async () => {
    if (!isMonitoring) return;

    try {
      const element = await page.$(selector);

      if (element && !isSelectorFound) {
        Util.Log.info(`${PROVIDER_NAME} | Seletor encontrado: ${selector}`);
        isSelectorFound = true;

        await callback();
        Util.Log.info(`${PROVIDER_NAME} | Callback executado com sucesso.`);

        if (!continueMonitoringAfterDisappear) {
          Util.Log.info(`${PROVIDER_NAME} | Parando monitoramento após detecção do seletor.`);
          stopMonitoring();
        }
      } else if (!element && isSelectorFound && continueMonitoringAfterDisappear) {
        Util.Log.info(`${PROVIDER_NAME} | Seletor desapareceu: ${selector} — pronto para detectar novamente.`);
        isSelectorFound = false;
      }
    } catch (error: any) {
      if (error.message.includes('Execution context was destroyed')) {
        Util.Log.warn(`${PROVIDER_NAME} | Contexto destruído durante monitoramento. Tentando continuar...`);
      } else {
        Util.Log.error(`${PROVIDER_NAME} | Erro ao monitorar seletor: ${selector} | ${error.message}`, error);
      }
    }
  };

  setInterval(checkSelector, checkInterval);
};

// Aguarda e clica em um seletor
const aguardarEClicar = async (page: Page, selector: string, timeout: number = DEFAULTS.timeout): Promise<boolean> => {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
    Util.Log.info(`${PROVIDER_NAME} | Clique realizado com sucesso no seletor: ${selector}`);
    return true;
  } catch (error: any) {
    Util.Log.error(`${PROVIDER_NAME} | Erro ao clicar no seletor: ${selector} | ${error.message}`, error);
    return false;
  }
};

// Aguarda e digita em um seletor
const aguardarEDigitar = async (page: Page, selector: string, text: string, timeout: number = DEFAULTS.timeout): Promise<boolean> => {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.type(selector, text);
    Util.Log.info(`${PROVIDER_NAME} | Texto digitado com sucesso no seletor: ${selector}`);
    return true;
  } catch (error: any) {
    Util.Log.error(`${PROVIDER_NAME} | Erro ao digitar no seletor: ${selector} | ${error.message}`, error);
    return false;
  }
};

const verificarResultadoSQL = async (page: Page, timeout: number = DEFAULTS.timeout): Promise<{ sucesso: boolean; erro: string | null }> => {
  Util.Log.info(`${PROVIDER_NAME} | Verificando resultado da execução SQL...`);

  const seletor = await capturarPrimeiroSeletor(page, ['.alert-danger', '.alert-success'], timeout);

  if (!seletor) {
    Util.Log.warn(`${PROVIDER_NAME} | Nenhum resultado visível após o tempo limite.`);
    return {
      sucesso: false,
      erro: 'Nenhum resultado encontrado após o tempo limite.',
    };
  }

  if (seletor === '.alert-danger') {
    Util.Log.warn(`${PROVIDER_NAME} | Resultado da execução retornou erro.`);
    const erroMsg = await page.$$eval(`${seletor} code`, (codes) => {
      const ultimo = codes[codes.length - 1];
      return ultimo?.textContent?.trim() || 'Erro desconhecido.';
    });

    Util.Log.error(`${PROVIDER_NAME} | Mensagem de erro capturada: ${erroMsg}`);
    return { sucesso: false, erro: erroMsg };
  }

  if (seletor === '.alert-success') {
    Util.Log.info(`${PROVIDER_NAME} | Execução SQL realizada com sucesso.`);
    return { sucesso: true, erro: null };
  }

  Util.Log.error(`${PROVIDER_NAME} | Seletor não reconhecido: ${seletor}`);
  return { sucesso: false, erro: 'Seletor não reconhecido.' };
};

export const Puppeteer = {
  pagina,
  aguardar,
  extrairValorSeguinte,
  extrairValorPorChave,
  capturarPrimeiroSeletor,
  monitorarSeletor,
  aguardarEClicar,
  aguardarEDigitar,
  verificarResultadoSQL,
};
