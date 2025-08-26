export interface IProdutoMCImagem {
  id: number;
  empresa_id: number;

  produto_code: string;
  base64: string | null;
  url_origem: string;
  url_nova: string;
  ordem: number;

  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
}
