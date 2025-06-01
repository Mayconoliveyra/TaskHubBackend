export interface INFSePadrao {
  id: number;

  nome: string;
  observacao?: string | null;
  xml_modelo?: string | null;
  ativo: boolean;

  created_at: string;
  updated_at?: string;
}
