import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Middlewares } from '../middlewares';

import { Repositorios } from '../repositorios';

import { Servicos } from '../servicos';

import { Util } from '../util';

const consultarMCProdutosImagensLojaValidacao = Middlewares.validacao((getSchema) => ({
  params: getSchema<{ uuid: string }>(
    yup.object().shape({
      uuid: yup.string().required().trim().length(36).test('is-uuid-v4', 'id inválido', Util.UuidV4.uuidV4Test),
    }),
  ),
}));

const consultarMCProdutosImagensLoja = async (req: Request<{ uuid: string }, {}, {}>, res: Response) => {
  const uuid = req.params.uuid;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'uuid', operador: '=', valor: uuid }]);

  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: 'Empresa não encontrada.' } });
  }

  const resultCapturarImagens = await Servicos.BancoImagens.capturarImagensMCProdutoImagemLoja(empresa.dados.id, empresa.dados.mc_empresa_id || '');
  if (!resultCapturarImagens.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: 'Erro ao carregar os produtos. Contate o suporte para obter ajuda.' } });
  }

  const resultProdutosLoja = await Repositorios.BancoImagens.consultarProdutoImagemLoja(empresa.dados.id);
  if (!resultProdutosLoja.sucesso) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: { default: resultProdutosLoja.erro } });
  }

  return res.status(StatusCodes.OK).json({
    dados: resultProdutosLoja.dados,
    totalRegistros: resultProdutosLoja.total,
  });
};

export const BancoImagem = {
  consultarMCProdutosImagensLojaValidacao,
  consultarMCProdutosImagensLoja,
};
