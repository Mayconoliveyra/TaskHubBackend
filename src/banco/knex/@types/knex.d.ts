import { IBancoImagem } from '../../models/bancoImagem';
import { IBancoImagemProdutoLoja } from '../../models/bancoImagemProdutoLoja';

import { IConfigModulo } from '../../models/configModulo';
import { IEmpresa } from '../../models/empresa';
import { INFSePadrao } from '../../models/NFSePadrao';
import { IProdutoERP } from '../../models/produtoERP';
import { IProdutoMC } from '../../models/produtoMC';
import { IProdutoMCImagem } from '../../models/produtoMCImagem';
import { ITarefa } from '../../models/tarefa';
import { ITarefaEmpresa } from '../../models/tarefaEmpresa';
import { IUsuario } from '../../models/usuario';
import { IVwTarefaEmpresa } from '../../models/vwTarefaEmpresa';
import { IVwTarefaEmpresa } from '../../models/vwTarefaEmpresa';
import { IVwTarefaProcessar } from '../../models/vwTarefaProcessar';

declare module 'knex/types/tables' {
  interface Tables {
    empresas: IEmpresa;
    usuarios: IUsuario;
    produtos_mc: IProdutoMC;
    produtos_erp: IProdutoERP;
    tarefas: ITarefa;
    tarefa_empresa: ITarefaEmpresa;
    nfse_padroes: INFSePadrao;
    config_modulos: IConfigModulo;
    vw_tarefas_empresas: IVwTarefaEmpresa;
    vw_tarefas_historico: IVwTarefaEmpresa;
    vw_tarefas_simultaneas: IVwTarefaProcessar;
    vw_tarefas_nao_simultaneas: IVwTarefaProcessar;
    produtos_mc_img: IProdutoMCImagem;
    banco_imagens: IBancoImagem;
    banco_imagem_produto_loja: IBancoImagemProdutoLoja;
  }
}
