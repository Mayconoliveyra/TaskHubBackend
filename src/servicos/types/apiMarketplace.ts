export interface IApiIMErroValidacao {
  errors: {
    [key: string]: string[];
  };
  type: string;
  title: string;
  status: number;
  traceId: string;
}

export interface IApiIMAutenticar {
  id: string;
  name: string;
  cnpj: string;
}

export interface IApiIMGetMarketplaces {
  id: string;
  name: string;
  baseUrl: string | null;
  active: boolean;
  marketplaceId: string;
  marketplaceName: 'NuvemShop' | 'Plug4Market (Tecnospeed) [BETA]' | 'MeuCarrinho' | 'Showkase';
  marketplaceCryptoData: string;
  orderSync: string | null;
  isHub: boolean;
}

export interface IApiIMGetProdutos {
  id: string;
  code: string;
  name: string;
  sku: string;
  gtin: string;
  priority: number;
  description: string;
  measure: string;
  brand: string;
  dimension: {
    weight: number;
    height: number;
    width: number;
    length: number;
  };
  price: number;
  promotion: {
    price: number;
    start: string | null;
    validity: string | null;
  };
  stock: {
    stock: number;
    active: boolean;
    min: number;
    max?: number;
  };
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  grid: boolean;
  categories: {
    id: string;
    code: string;
    name: string;
  }[];
  images: string[];
  merchantMarketplaces: {
    id: string;
    externalCode: string;
    marketplaceName: string | null;
    availability: string | null;
    price: number | null;
    stock: number | null;
    name: string | null;
    description: string | null;
    promotionPrice: number | null;
    promotionStart: string | null;
    promotionValidity: string | null;
    stockMax: number | null;
    status: 'AVAILABLE' | 'UNAVAILABLE';
    errorMessage: string | null;
  }[];
  plug4Market: {
    salesChannel: string[];
  };
  variations: {
    id: string;
    code: string;
    name: string;
    sku: string | null;
    gtin: string | null;
    description: string;
    price: number;
    availability: 'AVAILABLE' | 'UNAVAILABLE';
    stock: {
      stock: number;
      active: boolean;
      min: number;
    };
    specifications: {
      key: string;
      value: string;
      colorHex: string | null;
      order: number;
    }[];
    plug4Market: {
      color: string | null;
      size: string | null;
      voltage: string | null;
      flavor: string | null;
    };
    merchantMarketplaces: {
      id: string;
      externalCode: string;
      marketplaceName: string | null;
      availability: string | null;
      price: number | null;
      stock: number | null;
      status: 'AVAILABLE' | 'UNAVAILABLE';
      errorMessage: string | null;
    }[];
  }[];
}

export interface IApiIMGetCategorias {
  id: string; // UUID da categoria
  code: string | null; // Código da categoria no sistema
  priority: number; // Ordem de prioridade
  name: string | null; // Nome da categoria
  availability: 'AVAILABLE' | 'UNAVAILABLE'; // Enum esperado
  plug4MarketCode: string | null; // Código da categoria na Plug4Market
  merchantMarketplaces:
    | {
        id: string; // ID do marketplace
        marketplaceName: string | null; // Nome do marketplace
        availability: 'AVAILABLE' | 'UNAVAILABLE'; // Disponibilidade no marketplace
        name: string | null; // Nome da categoria no marketplace
        externalCode: string | null; // Código externo no marketplace
        status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'; // Enum de status de processo
        errorMessage: string | null; // Mensagem de erro (se houver)
      }[]
    | null;
}

export interface IApiIMProdutoBaseForcaEstDisp {
  externalCode: string;
  externalCodePai: string;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  availabilityPai: 'AVAILABLE' | 'UNAVAILABLE';
  stock: number;
}

export interface IApiIMUploadImagem {
  fileBase64: string;
  fileName: string;
  fileContentType: string;
  description: string;
}

export interface IApiIMUploadImagemResponse {
  id: string;
  fileName: string;
  description: string;
  url: string;
  thumbnailUrl: string;
}
