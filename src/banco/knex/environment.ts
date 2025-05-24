import 'dotenv/config';
import { Knex } from 'knex';
import * as path from 'path';

const connection = {
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: `dev-${process.env.DATABASE_NAME}`,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  decimalNumbers: true, // Essa opção faz com que os decimais sejam retornados como números
  dateStrings: true, // Essa opção faz com que os dataTime sejam retornados como string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeCast: function (field: any, next: any) {
    if (field.type == 'TINY' && field.length == 1) {
      return field.string() == '1'; // 1 = true, 0 = false
    }
    return next();
  },
  connectTimeout: 60000, // Timeout de conexão
  keepAliveInitialDelay: 10000, // Envia um sinal a cada 10s para manter a conexão viva
};

const development: Knex.Config = {
  client: 'mysql2',
  migrations: {
    directory: path.resolve(__dirname, '..', 'migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'seeds'),
  },
  connection: { ...connection, database: `dev-${process.env.DATABASE_NAME}` },
  pool: {
    min: 2, // Conexões mínimas
    max: 15, // Conexões máximas
    acquireTimeoutMillis: 60000, // Tempo de espera para adquirir conexão (60s)
    idleTimeoutMillis: 30000, // Tempo que a conexão pode ficar ociosa (30s)
    reapIntervalMillis: 10000, // Verifica e recicla conexões ociosas a cada 10s
    createRetryIntervalMillis: 5000, // Tenta recriar conexões fechadas a cada 5s
  },
};

const production: Knex.Config = {
  client: 'mysql2',
  migrations: {
    directory: path.resolve(__dirname, '..', 'migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'seeds'),
  },
  connection: { ...connection, database: `${process.env.DATABASE_NAME}` },
  pool: {
    min: 2, // Conexões mínimas
    max: 15, // Conexões máximas
    acquireTimeoutMillis: 60000, // Tempo de espera para adquirir conexão (60s)
    idleTimeoutMillis: 30000, // Tempo que a conexão pode ficar ociosa (30s)
    reapIntervalMillis: 10000, // Verifica e recicla conexões ociosas a cada 10s
    createRetryIntervalMillis: 5000, // Tenta recriar conexões fechadas a cada 5s
  },
};

export { development, production };
