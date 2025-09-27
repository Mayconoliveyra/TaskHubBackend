import { AxiosError } from 'axios';
import fs from 'fs';
import path from 'path';
import winston from 'winston';

import { DataHora } from './dataHora';

// Diretório de logs
const logDir = path.join('log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Variável para armazenar a data atual
let currentDate = DataHora.obterDataAtual('DD-MM-YYYY');

// Criar transporte de arquivo atualizado
const getLogFileTransport = () => {
  const logFile = path.join(logDir, `log-${currentDate}.log`);
  return new winston.transports.File({ filename: logFile, level: 'info' });
};

const getCallerInfo = (): string => {
  try {
    const err = new Error();
    const stack = err.stack?.split('\n').map((l) => l.trim()) || [];

    const usefulLines = stack
      .slice(1)
      .filter((line) => line.startsWith('at') && !line.includes('log.util.ts') && !line.includes('winston') && !line.includes('internal/'));

    // 1) Procura a primeira linha com função nomeada (ignorando Generator/Promise/__awaiter)
    const withFunc = usefulLines.find(
      (line) =>
        line.includes(`${path.sep}src${path.sep}`) && // só dentro de src/
        /\s+\(.*\)/.test(line) &&
        !line.includes('Generator') &&
        !line.includes('__awaiter') &&
        !line.includes('Promise'),
    );

    if (withFunc) {
      const matchFunc = withFunc.match(/at (.+?) \((.*):\d+:\d+\)/);
      if (matchFunc) {
        let functionName = matchFunc[1];
        const fileName = path.basename(matchFunc[2]);
        functionName = functionName.replace(/^Object\./, '');
        return `${fileName} | ${functionName}`;
      }
    }

    // 2) Se não tiver função nomeada, pega a primeira linha do src/
    const inSrc = usefulLines.find((line) => line.includes(`${path.sep}src${path.sep}`));
    if (inSrc) {
      const matchFile = inSrc.match(/at (.*):\d+:\d+/);
      if (matchFile) {
        const fileName = path.basename(matchFile[1]);
        return `${fileName} | <anonymous>`;
      }
    }

    // 3) Fallback final (pode ser express, layer, etc.)
    const callerLine = usefulLines[0];
    const matchFile = callerLine?.match(/at (.*):\d+:\d+/);
    if (matchFile) {
      const fileName = path.basename(matchFile[1]);
      return `${fileName} | <anonymous>`;
    }

    return '<unknown>';
  } catch {
    return '<error>';
  }
};

// Criar o transporte inicial
let fileTransport = getLogFileTransport();

const safeParse = (raw: any) => {
  if (typeof raw !== 'string') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return { raw }; // preserva o texto bruto para inspeção
  }
};

// Função para formatar erros
const formatError = (error: any, truncateStack = false) => {
  if (error instanceof AxiosError) {
    return {
      status: error?.response?.status || 'Sem status',
      message: error.message,
      method: error.config?.method?.toUpperCase() || 'Método desconhecido',
      url: error.config?.url || 'URL desconhecida',
      queryParams: error.config?.params || 'Sem parâmetros',
      requestBody: safeParse(error.config?.data),
      responseData: safeParse(error.response?.data),
      headers: error.response?.headers || 'Sem headers',
      errorCode: error.code || 'Sem código de erro',
      stack: truncateStack && error.stack ? error.stack : error.stack,
    };
  } else if (error instanceof Error) {
    return {
      message: error.message,
      stack: truncateStack && error.stack ? error.stack : error.stack,
      name: error.name,
    };
  }
  return error;
};

// Formatar exibição no console e arquivo
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message }) => {
    const time = DataHora.formatarDataHora(String(timestamp), 'DD/MM/YYYY HH:mm:ss');
    const emoji = level === 'error' ? '🔴' : level === 'warn' ? '🟠' : '🟢';
    return `${emoji} ${time} [${level.toUpperCase()}]: ${message}`;
  }),
);

// Criar o logger
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [new winston.transports.Console(), fileTransport],
});

// Verificar se a data mudou e atualizar o arquivo de log
const checkAndRotateLogFile = () => {
  const newDate = DataHora.obterDataAtual('DD-MM-YYYY');
  if (newDate !== currentDate) {
    currentDate = newDate;
    fileTransport = getLogFileTransport();
    logger.clear();
    logger.add(fileTransport);
  }
};

// Função de log genérica
const customLogger = (level: string, message: string, additional?: any) => {
  checkAndRotateLogFile(); // Verifica se o log precisa ser rotacionado

  const callerFile = getCallerInfo();

  let formattedMessage = `${callerFile} | ${message}`;
  let formattedAdditional;

  if (additional !== undefined) {
    if (additional instanceof Error || additional instanceof AxiosError) {
      formattedAdditional = JSON.stringify(formatError(additional, true), null, 2); // Truncado para console
      logger.log({ level, message: `${message}\n${JSON.stringify(formatError(additional, false), null, 2)}` }); // Completo para arquivo
    } else {
      formattedAdditional = typeof additional === 'object' ? JSON.stringify(additional, null, 2) : String(additional);
    }
    formattedMessage += `\n${formattedAdditional}`;
  }

  logger.log({ level, message: formattedMessage });
};

// Funções específicas de log
export const Log = {
  info: (message: string, additional?: any) => customLogger('info', message, additional),
  error: (message: string, additional?: any) => customLogger('error', message, additional),
  warn: (message: string, additional?: any) => customLogger('warn', message, additional),
};
