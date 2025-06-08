import schedule from 'node-schedule';

import { ETableNames } from '../banco/eTableNames';
import { Knex } from '../banco/knex';
import { IVwTarefaProcessar } from '../banco/models/vwTarefaProcessar';

import { Repositorios } from '../repositorios';

import { Servicos } from '../servicos';

import { Util } from '../util';

const MODULO = '[Tarefas]';

let emExecucaoTarefas = false;

const executarTarefa = async (tarefa: IVwTarefaProcessar) => {
  Util.Log.info(`${MODULO} | executarTarefa | tId: ${tarefa.t_id} | teId: ${tarefa.te_id}`);

  try {
    if (tarefa.t_id === 2 || tarefa.t_id === 3) {
      // DataSyncFood - Meu Carrinho
      const result = await Servicos.MeuCarrinho.exportarMercadoriasParaMeuCarrinho(tarefa.e_id, tarefa.e_mc_empresa_id || '', tarefa.e_erp);

      if (!result.sucesso) {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'ERRO',
          feedback: result.erro,
        });
        Util.Log.error(`${MODULO} | Falha | tId: ${tarefa.t_id} | teId: ${tarefa.te_id}`, result.erro);
      } else {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'FINALIZADO',
          feedback: 'Processo realizado com sucesso.',
        });
      }
    } else if (tarefa.t_id === 4) {
      //Zerar Meu Carrinho
      const result = await Servicos.MeuCarrinho.zerarCadastros(tarefa.e_id, tarefa.e_mc_empresa_id || '');

      if (!result.sucesso) {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'ERRO',
          feedback: result.erro,
        });
      } else {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'FINALIZADO',
          feedback: 'Processo realizado com sucesso.',
        });
      }
    } else if (tarefa.t_id === 5) {
      // Zerar Api Marketplace
      const result = await Servicos.ApiMarketplace.zerarIntegracao(tarefa.e_id);

      if (!result.sucesso) {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'ERRO',
          feedback: result.erro,
        });
      } else {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'FINALIZADO',
          feedback: result.dados,
        });
      }
    } else if (tarefa.t_id === 6) {
      // Analise NFSe
      const modeloIA = Util.Texto.tratarComoString(tarefa.t_param_01) || '';
      const limiteMaxTokens = Util.Texto.tratarComoNumero(tarefa.t_param_02) || 0;
      const idPadraoNFSe = Util.Texto.tratarComoNumero(tarefa.te_param_01) || 0;
      const xmlRejeitado = Util.Texto.tratarComoString(tarefa.te_param_02) || '';
      const xmlAutorizadoEspelho = Util.Texto.tratarComoString(tarefa.te_param_03) || null;

      const registroTarEmp = await Repositorios.NFSe.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: idPadraoNFSe }]);
      const xmlModelo = registroTarEmp.dados?.xml_modelo || '';
      const xmlModeloEmpresa = registroTarEmp.dados?.xml_modelo_empresa || '';
      const xmlModeloObservacao = registroTarEmp.dados?.observacao || '';

      if (!xmlAutorizadoEspelho && !xmlModelo) {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'ERRO',
          feedback: `[{"id":"1","nomeTag":"Exemplo de XML Autorizado","tipo":"ausente","valor_encontrado":"VAZIO","valor_esperado":"XML ESPELHO","sugestao":"Nenhum exemplo de XML autorizado foi encontrado para o padrão do município selecionado. Para continuar a análise, selecione um arquivo autorizado no passo 3."}]`,
        });

        return;
      }

      const prompt = Servicos.NFSe.promptAnaliseNFSe(modeloIA, xmlRejeitado, xmlModelo, xmlModeloEmpresa, xmlModeloObservacao, xmlAutorizadoEspelho);
      const calcTokens = Servicos.OpenaiIA.calcularPromptTokens(prompt.messages);

      // Valida se ultrapassa o limite de token definido
      if (calcTokens > limiteMaxTokens) {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'ERRO',
          feedback: `[{"id":"1","nomeTag":"Limite de Tokens","tipo":"formato inválido","valor_encontrado":"UTILIZADO: ${calcTokens}","valor_esperado":"MÁXIMO PERMITIDO: ${limiteMaxTokens}","sugestao":"O número de tokens excedeu o limite permitido. Reduza o tamanho do XML."}]`,
        });

        return;
      }

      const resultAgent = await Servicos.OpenaiIA.gerarResposta(prompt);

      if (!resultAgent.sucesso) {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'ERRO',
          feedback: `[{"id":"1","nomeTag":"Erro Inesperado","tipo":"formato inválido","valor_encontrado":"${resultAgent.erro}","valor_esperado":"PROCESSAMENTO BEM-SUCEDIDO","sugestao":"Ocorreu um erro inesperado durante a análise. Revise os dados de entrada e tente novamente."}]`,
        });

        return;
      }

      const resultValido = Servicos.NFSe.validarRespostaAgente(resultAgent.dados);

      await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
        status: 'FINALIZADO',
        feedback: resultValido,
      });
    } else {
      Util.Log.error(`${MODULO} | executarTarefa | Nenhuma execução definida para a tarefa: ${tarefa.t_nome}`);

      await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
        status: 'ERRO',
        feedback: 'Nenhuma execução definida para a tarefa.',
      });
    }
  } catch (error) {
    Util.Log.error(`${MODULO} | executarTarefa | Erro ao executar a tarefa: ${tarefa.t_nome}`, error);

    await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
      status: 'ERRO',
      feedback: 'Erro desconhecido ao executar a tarefa.',
    });
  }
};

const processarTarefas = () => {
  // Executa a cada 5 segundos
  schedule.scheduleJob('*/5 * * * * *', async () => {
    if (emExecucaoTarefas) {
      Util.Log.warn(`${MODULO} | Tarefas | Sincronização já está em execução.`);
      return;
    }

    emExecucaoTarefas = true;
    try {
      const tarefa = await Knex(ETableNames.vw_tarefas_simultaneas).where('prox_processar', '=', true).orderBy('te_id', 'ASC').first();

      if (tarefa) {
        await Repositorios.TarefaEmpresa.atualizarDados(tarefa.te_id, {
          status: 'PROCESSANDO',
          feedback: null,
        });

        executarTarefa(tarefa);
      }
    } catch (error) {
      Util.Log.error(`${MODULO} | Tarefas | Erro inesperado ao processar.`, error);
    } finally {
      emExecucaoTarefas = false;
    }
  });
};

export const Tarefas = { processarTarefas };
