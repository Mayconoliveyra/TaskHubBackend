import { Knex } from './banco/knex';

import { Configs } from './configs';

import { Tarefas } from './tarefas';

import { Util } from './util';

const { NODE_ENV } = process.env;

const PORT_HTTP = NODE_ENV === 'production' ? 2025 : 8081;

const startServer = () => {
  Configs.ExpressConfig.serverHttp.listen(PORT_HTTP, () => {
    Util.Log.info(`TaskHub | App rodando | Porta: ${PORT_HTTP} | Prot.: HTTP | Ambiente: ${NODE_ENV}`);
  });

  Tarefas.Tarefas.processarTarefas();
};

Knex.migrate
  .latest()
  .then(() => {
    Knex.seed
      .run()
      .then(() => {
        // Inicia o serviço e as tarefas
        startServer();
      })
      .catch(console.log);
  })
  .catch(console.log);
