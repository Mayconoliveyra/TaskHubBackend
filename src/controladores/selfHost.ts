import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';

import { Servicos } from '../servicos';

import { Util } from '../util';

type IBodyProps = {
  empresa_id: number;
  sh_qrcode_url: string;
};

const limparConfigSH = async (id: number) => {
  await Repositorios.Empresa.atualizarDados(id, {
    sh_qrcode_url: null,
    sh_url: null,
    sh_client_id: null,
    sh_client_secret: null,
    sh_empresa_nome: null,
    sh_empresa_cnpj: null,
    sh_token: null,
    sh_token_exp: 0,
  });
};

const configuracaoValidacao = Middlewares.validacao((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      empresa_id: yup.number().required(),
      sh_qrcode_url: yup.string().required().url().trim().max(255),
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
  const { empresa_id, sh_qrcode_url } = req.body;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresa_id }]);

  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: 'Empresa não encontrada.' } });
  }

  if (sh_qrcode_url === empresa.dados.sh_qrcode_url && empresa.dados.sh_url && empresa.dados.sh_client_id && empresa.dados.sh_client_secret) {
    const resToken = await Servicos.SelfHost.obterToken(empresa.dados.sh_url, empresa.dados.sh_client_id, empresa.dados.sh_client_secret);
    if (!resToken.sucesso) {
      await limparConfigSH(empresa_id);

      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: { default: resToken.erro },
      });
    }

    const resAtDados = await Repositorios.Empresa.atualizarDados(empresa_id, {
      sh_token: resToken.dados.token,
      sh_token_exp: resToken.dados.expires_in,
    });

    if (!resAtDados.sucesso) {
      await limparConfigSH(empresa_id);

      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: { default: resAtDados.erro },
      });
    }

    return res.status(StatusCodes.OK).send();
  } else {
    const parsedUrl = Servicos.SelfHost.extrairDominioEClientId(sh_qrcode_url);
    if (!parsedUrl.sucesso) {
      await limparConfigSH(empresa_id);

      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: { default: parsedUrl.erro },
      });
    }

    const resDispositivo = await Servicos.SelfHost.obterClientSecret(parsedUrl.dados.dominio, parsedUrl.dados.clientId);
    if (!resDispositivo.sucesso) {
      await limparConfigSH(empresa_id);

      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: { default: resDispositivo.erro },
      });
    }

    const resToken = await Servicos.SelfHost.obterToken(parsedUrl.dados.dominio, parsedUrl.dados.clientId, resDispositivo.dados.client_secret);
    if (!resToken.sucesso) {
      await limparConfigSH(empresa_id);

      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: { default: resToken.erro },
      });
    }

    const resAtDados = await Repositorios.Empresa.atualizarDados(empresa_id, {
      sh_qrcode_url,
      sh_url: parsedUrl.dados.dominio,
      sh_client_id: parsedUrl.dados.clientId,
      sh_client_secret: resDispositivo.dados.client_secret,
      sh_empresa_nome: resDispositivo.dados.empresa_fantasia,
      sh_empresa_cnpj: resDispositivo.dados.empresa_cnpj,
      sh_token: resToken.dados.token,
      sh_token_exp: resToken.dados.expires_in,
    });

    if (!resAtDados.sucesso) {
      await limparConfigSH(empresa_id);

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: { default: resAtDados.erro },
      });
    }

    return res.status(StatusCodes.OK).send();
  }
};
const testarConexao = async (req: Request<{ empresaId: string }, {}, {}>, res: Response) => {
  const empresaId = req.params.empresaId as unknown as number;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresaId }]);

  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: 'Empresa não encontrada.' } });
  }

  const resEmpresa = await Servicos.SelfHost.getEmpresa(empresaId);

  if (!resEmpresa.sucesso) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: resEmpresa.erro },
    });
  }

  const resAtDados = await Repositorios.Empresa.atualizarDados(empresaId, {
    sh_empresa_nome: resEmpresa.dados.empresa_fantasia,
    sh_empresa_cnpj: resEmpresa.dados.empresa_cnpj,
  });

  if (!resAtDados.sucesso) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: Util.Msg.erroInesperado },
    });
  }

  return res.status(StatusCodes.OK).json('Teste de conexão realizado com sucesso.');
};

export const SelfHost = {
  configuracaoValidacao,
  testarConexaoValidacao,
  configuracao,
  testarConexao,
};
