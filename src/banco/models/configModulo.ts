export interface IConfigModulo {
  id: number;
  modulo: 'ZERO_TRUST';

  zt_cert_url_download: string;
  zt_cert_versao: number;
  zt_arquivos_url_download: string;
  zt_arquivos_versao: number;

  created_at: string;
  updated_at?: string;
}
