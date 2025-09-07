import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Repositorios } from '../repositorios';

import { Servicos } from '../servicos';

const teste = async (req: Request, res: Response) => {
  const empresa_id = req.body?.empresa_id as number;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresa_id }]);

  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: 'Empresa não encontrada.' } });
  }

  /* const teste = await Servicos.MeuCarrinho.criarProduto(empresa_id, {
    categoryId: '1bec277f-3e1a-4a92-98f0-ea09872bdfa4',
    merchantId: empresa.mc_empresa_id || '',
    name: 'agora 123',
    code: '8877',
    description: 'descricao',
    price: 1.55,
  }); */

  /*   const teste = await Servicos.MeuCarrinho.criarVariacaoItem(empresa_id, '07b4f087-f79a-43f1-b043-9f4c96414a3b', {
    name: 'teste 654',
    code: '11770',
    value: 99.99,
    description: '987',
  }); */

  // const mc = await Servicos.MeuCarrinho.zerarCadastros(empresa_id, empresa.mc_empresa_id || '');
  const sh = await Servicos.MeuCarrinho.sincronizarImagens(1);

  console.log('sh', sh);

  return res.status(StatusCodes.NO_CONTENT).send();
};

export const Teste = {
  teste,
};
