import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

const id = 1;
export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.config_modulos)
    .insert({
      id: id,
      zt_cert_url_download: 'https://storage.googleapis.com/tecnosh-img/softcom/CertificadoFullChainPrivKey.rar',
      zt_cert_versao: 1.0,
      zt_arquivos_url_download: 'https://storage.googleapis.com/tecnosh-img/softcom/ZeroTrustSoftcom.rar',
      zt_arquivos_url_versao: 1.0,
    })
    .then(() => {
      Util.Log.info(`# Inserido registro | Id: ${id} | tabela: ${ETableNames.config_modulos}`);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex(ETableNames.config_modulos)
    .where('id', id)
    .del()
    .then(() => {
      Util.Log.info(`# Excluído registro: ${id} | tabela: ${ETableNames.config_modulos}`);
    });
}
