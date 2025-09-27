export interface IBancoImagem {
  id: number;

  nome: string;
  url: string;

  preco: number;
  categorias?: string | null;
  tags?: string | null;

  recomendado: boolean;

  empresa_id?: number | null;
  produto_code?: number | null;

  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}
