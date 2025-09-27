export interface IBancoImagemProdutoLoja {
  id: number;
  empresa_id: number;

  codigo: number;
  nome: string;
  categoria: string;
  preco: number;

  tags: string;

  img_01?: string | null;
  img_02?: string | null;
  img_03?: string | null;
  img_04?: string | null;
  img_05?: string | null;
  img_06?: string | null;
  img_07?: string | null;
  img_08?: string | null;
  img_09?: string | null;
  img_10?: string | null;
  img_11?: string | null;
  img_12?: string | null;
  img_13?: string | null;
  img_14?: string | null;
  img_15?: string | null;

  total_imgs: number;

  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}
