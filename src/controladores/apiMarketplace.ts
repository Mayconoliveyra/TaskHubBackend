import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';

import { Servicos } from '../servicos';

import { Util } from '../util';

type IBodyProps = {
  empresa_id: number;
  api_im_client_id: string;
  api_im_client_secret: string;
};

const limparConfigApiIm = async (id: number) => {
  await Repositorios.Empresa.atualizarDados(id, {
    api_im_client_id: null,
    api_im_client_secret: null,
    api_im_empresa_id: null,
    api_im_empresa_nome: null,
    api_im_empresa_cnpj: null,
  });
};

const configuracaoValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      empresa_id: yup.number().required(),
      api_im_client_id: yup.string().required().trim().max(36),
      api_im_client_secret: yup.string().required().trim().max(36),
    }),
  ),
}));
const testarConexaoValidacao = Middlewares.validacao((getSchema) => ({
  params: getSchema<{ empresaId: number }>(
    yup.object().shape({
      empresaId: yup.number().required(),
    }),
  ),
}));

const configuracao = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const { empresa_id, api_im_client_id, api_im_client_secret } = req.body;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresa_id }]);

  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: 'Empresa não encontrada.' } });
  }

  const resToken = await Servicos.ApiMarketplace.autenticar(api_im_client_id, api_im_client_secret);

  if (!resToken.sucesso) {
    await limparConfigApiIm(empresa_id);

    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: resToken.erro },
    });
  }

  const resAtDados = await Repositorios.Empresa.atualizarDados(empresa_id, {
    api_im_client_id: api_im_client_id,
    api_im_client_secret: api_im_client_secret,
    api_im_empresa_id: resToken.dados.id,
    api_im_empresa_nome: resToken.dados.name,
    api_im_empresa_cnpj: resToken.dados.cnpj,
  });

  if (!resAtDados.sucesso) {
    await limparConfigApiIm(empresa_id);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: Util.Msg.erroInesperado },
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};
const testarConexao = async (req: Request<{ empresaId: string }, {}, {}>, res: Response) => {
  const empresaId = req.params.empresaId as unknown as number;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresaId }]);

  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: 'Empresa não encontrada.' } });
  }

  if (!empresa.dados.api_im_client_id || !empresa.dados.api_im_client_secret || !empresa.dados.api_im_empresa_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: { default: 'Falha ao realizar o teste de conexão: credenciais inválidas ou pendentes de configuração.' } });
  }

  const resEmpresa = await Servicos.ApiMarketplace.autenticar(empresa.dados.api_im_client_id, empresa.dados.api_im_client_secret);

  if (!resEmpresa.sucesso) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: resEmpresa.erro },
    });
  }

  const resAtDados = await Repositorios.Empresa.atualizarDados(empresaId, {
    api_im_empresa_id: resEmpresa.dados.id,
    api_im_empresa_nome: resEmpresa.dados.name,
    api_im_empresa_cnpj: resEmpresa.dados.cnpj,
  });

  if (!resAtDados.sucesso) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: Util.Msg.erroInesperado },
    });
  }

  return res.status(StatusCodes.OK).json('Teste de conexão realizado com sucesso.');
};

export const ApiMarketplace = {
  configuracaoValidacao,
  testarConexaoValidacao,
  configuracao,
  testarConexao,
};
