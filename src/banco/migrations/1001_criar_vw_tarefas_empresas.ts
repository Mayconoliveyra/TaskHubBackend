import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex): Promise<void> {
  await knex
    .raw(
      `
      CREATE OR REPLACE VIEW ${ETableNames.vw_tarefas_empresas} AS
      SELECT 
        e.id AS e_id,
        e.ativo AS e_ativo,
        e.erp AS e_erp,
        t.id AS t_id,
        t.ativo AS t_ativo,
        t.nome AS t_nome,
        t.descricao_resumo AS t_descricao_resumo,
        t.descricao AS t_descricao,
        t.erp AS t_erp,
        t.param_descricao AS t_param_descricao,
        t.te_param_descricao AS t_te_param_descricao,
        CASE 
          WHEN t.param_ss = TRUE THEN 
            CASE 
              WHEN e.ss_token IS NOT NULL THEN TRUE 
              ELSE FALSE 
            END
          ELSE NULL
        END AS t_param_ss,
        CASE 
          WHEN t.param_sh = TRUE THEN 
            CASE 
              WHEN e.sh_token IS NOT NULL THEN TRUE 
              ELSE FALSE 
            END
          ELSE NULL
        END AS t_param_sh,
        CASE 
          WHEN t.param_mc = TRUE THEN 
            CASE 
              WHEN e.mc_token IS NOT NULL THEN TRUE 
              ELSE FALSE 
            END
          ELSE NULL
        END AS t_param_mc,
        CASE 
          WHEN t.param_api_im = TRUE THEN 
            CASE 
              WHEN e.api_im_empresa_id IS NOT NULL THEN TRUE 
              ELSE FALSE 
            END
          ELSE NULL
        END AS t_param_api_im,
        t.icone AS t_icone,
        t.modal AS t_modal,
        te.id AS te_id,
        COALESCE(te.status, 'NOVO') AS te_status,
        te.feedback AS te_feedback,
        te.updated_at AS te_updated_at,
  
        -- Verificação dos tokens
        CASE WHEN e.ss_token IS NOT NULL THEN TRUE ELSE FALSE END AS ss_autenticado,
        CASE WHEN e.mc_token IS NOT NULL THEN TRUE ELSE FALSE END AS mc_autenticado,
        CASE WHEN e.sh_token IS NOT NULL THEN TRUE ELSE FALSE END AS sh_autenticado,
        CASE WHEN e.api_im_empresa_id IS NOT NULL THEN TRUE ELSE FALSE END AS api_im_autenticado
      FROM empresas e
      CROSS JOIN tarefas t
      LEFT JOIN (
          SELECT 
            te1.*
          FROM tarefa_empresa te1
          INNER JOIN (
            SELECT 
              tarefa_id,
              empresa_id,
              MAX(id) AS max_id
            FROM tarefa_empresa
            GROUP BY tarefa_id, empresa_id
          ) te2 ON te1.id = te2.max_id
      ) te ON te.tarefa_id = t.id AND te.empresa_id = e.id;
    `,
    )
    .then(() => {
      Util.Log.info(`# Criado view ${ETableNames.vw_tarefas_empresas}`);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP VIEW IF EXISTS ${ETableNames.vw_tarefas_empresas};`).then(() => {
    Util.Log.info(`# Excluído view ${ETableNames.vw_tarefas_empresas}`);
  });
}
