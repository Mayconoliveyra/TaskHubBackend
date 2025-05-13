export interface ISHResponseBase<T = any> {
  code: number;
  message: string;
  human: string;
  data: T;
  meta: {
    page: {
      current: number;
      prev: number | null;
      next: number | null;
      count: 1;
    };
  };
  date_sync: number;
  current_page: number;
  last_page: number;
}

export interface ISHExtrairDominioEClientId {
  dominio: string;
  clientId: string;
}

export interface ISHObterClientSecret {
  client_id: string;
  client_secret: string;
  device_id: string;
  device_name: string;

  empresa_id: number;
  empresa_name: string;
  empresa_fantasia: string;
  empresa_razao_social: string;
  empresa_cnpj: string;
  empresa_email: string;
  empresa_fone_ddd: string;
  empresa_fone: string;
  empresa_inscricao_estadual: string;
  empresa_inscricao_municipal: string;
  empresa_cep: string;
  empresa_endereco: string;
  empresa_numero: string;
  empresa_complemento: string | null;
  empresa_bairro: string;
  empresa_cidade: string;
  empresa_c_cidade: number;
  empresa_uf: string;
  empresa_c_uf: number;
  empresa_pais: string;
  empresa_c_pais: string;
  empresa_regime_tributario: number;

  empresa_csc_token: string;
  empresa_csc_id: number;

  empresa_certificado: string | null;
  empresa_certificado_senha: string | null;
  empresa_certificado_validade: string;

  empresa_nfce_serie: number;
  empresa_nfce_ambiente: number;
  empresa_nfce_proximo_numero: number;

  cpf_cnpj_autorizados: string[] | null;

  versao_memoria_restaurante: number;

  empresa_mensagem_pedido: string | null;
  empresa_troca_prazo: string | null;
  empresa_troca_mensagem: string | null;

  empresa_mfe_chave_validador: string | null;
  empresa_nfce_valor_minimo: number | null;
  empresa_logomarca: string | null;
  empresa_logomarca_extensao: string | null;
  empresa_modulo_fiscal: string | null;
  empresa_mei: boolean | null;
  empresa_sat: string | null;

  taxa_servico: string;
  empresa_nfce_numero_caixa: number;
  empresa_nfce_modelo: number;

  resources: {
    url_base: string;
    path_api: string;
    path_device: string;
    path_authentication: string;
    retaguarda: string;
    pasta_xmls: string;
    oauth_url_base: string | null;
  };
}

export interface ISHObterToken {
  token: string;
  expires_in: number;
  type: string;
}

export interface ISHGetEmpresa {
  empresa_id: number;
  empresa_name: string;
  empresa_fantasia: string;
  codigo_suporte: string;

  empresa_razao_social: string;
  empresa_cnpj: string;
  empresa_email: string;
  empresa_fone: string;
  empresa_fone_ddd: string;

  empresa_inscricao_estadual: string;
  empresa_inscricao_municipal: string;

  empresa_cep: string;
  empresa_endereco: string;

  /** Versão com underscore — preserve se for usada internamente */
  _empresa_numero: string;
  empresa_numero: string;

  empresa_bairro: string;
  empresa_cidade: string;
  empresa_c_cidade: number;

  empresa_uf: string;
  empresa_c_uf: number;

  empresa_pais: string;
  empresa_c_pais: string;

  empresa_regime_tributario: number;

  empresa_csc_token: string;
  empresa_csc_id: number;

  empresa_certificado: string | null;
  empresa_certificado_senha: string | null;
  empresa_certificado_validade: string | null;

  empresa_nfce_serie: number;
  empresa_nfce_ambiente: number;
  empresa_nfce_modelo: number;
  empresa_nfce_proximo_numero: number;

  cpf_cnpj_autorizados: string[] | null;

  taxa_servico: number;

  empresa_nfce_valor_minimo: number | null;
  versao_memoria_restaurante: number;
}

export interface ISHGetProdutos {
  id: number;
  produto_id: number;
  nome: string;
  codigo_barras: string | null;
  sku: string | null;
  grupo_nome: string;
  grupo_id: number;
  fabricante: string;
  fornecedor: string;
  unidade_medida: string;
  quantidade_acompanhamentos: number;
  acompanhamento: boolean;
  PrecoA: number;
  PrecoB: number;
  PrecoC: number;
  promocao_preco: number;
  ncm: string;
  IssItemListaServico: string | null;
  converter_em_kg: boolean;
  nao_cobrar_taxa_servico: boolean;
  cfop_nfce_saida: number;
  icms_saida_origem: number;
  cest: string | null;
  restaurante_pizza: boolean;
  restaurante_tipo_calculo: number;
  id_restaurante_setor: number;
  perguntar_adicional: boolean;
  icms_st_modalidade_base: number;
  codigo_nfe: string | null;
  vinculo_fiscal_id: number;
  codigo_barras_grade: string | null;
  empresa_id: number;
  vinculo_fiscal: {
    vinculo_id: number;
    produto_id: number;
    empresa_id: number;
  }[];
  tabela_precos: any[];
  habilitar_grade: boolean | null;
  tipo_combo: number;
  tipo_faturamento: number;
  preco_a_partir_de: number;
  SmNaoEnviarPalm: boolean;
  nao_enviar_comanda: string;
  estoque: string;
  preco_venda: string;
  cst_csosn: string;
  icms_normal_aliquota: string;
  taxa_entrega: number;
  percentual_comissao_produto: string;
  icms_modalidade_base: string;
  icms_reducao: string;
  pis_saida: string;
  cofins_saida: string;
  cofins_saida_aliquota: string;
  pis_saida_aliquota: string;
  tributos_federais: string;
  tributos_estaduais: string;
  tributos_municipais: string;
  icms_st_aliquota: string;
  icms_st_reducao: string;
  icms_acrescimo: string;
  icms_percentual_diferimento: string;
  ipi_saida: string;
  ipi_saida_aliquota: string;
  especifico: any | null;
}
