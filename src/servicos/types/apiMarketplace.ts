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
