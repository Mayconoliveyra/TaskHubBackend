import type { Knex } from 'knex';

import 'dotenv/config';
import { development, production } from './src/banco/knex/environment';

const { NODE_ENV } = process.env;

const config: Knex.Config = NODE_ENV === 'production' ? production : development;

export default config;
