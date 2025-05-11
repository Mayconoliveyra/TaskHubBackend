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
