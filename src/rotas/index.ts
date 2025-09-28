import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Controladores } from '../controladores';

import { Middlewares } from '../middlewares';

const router = Router();

router.get('/teste-api', (req, res) => res.status(StatusCodes.OK).json('API TESTADA!.'));

router.get('/teste', Controladores.Teste.teste);

router.get('/empresa', Controladores.Empresa.consultarValidacao, Controladores.Empresa.consultar);
router.post('/empresa', Controladores.Empresa.cadastrarValidacao, Controladores.Empresa.cadastrar);
router.put('/empresa/:empresaId', Controladores.Empresa.editarValidacao, Controladores.Empresa.editar);

router.get('/empresa/:empresaId', Controladores.Empresa.consultarPorIdValidacao, Controladores.Empresa.consultarPorId);

router.get('/empresa/zerotrust/:uuid', Controladores.Empresa.consultarZeroTrustPorUuidValidacao, Controladores.Empresa.consultarZeroTrustPorUuid);

router.post('/configuracoes/softcomshop', Controladores.SoftcomShop.configuracaoValidacao, Controladores.SoftcomShop.configuracao);
router.post('/configuracoes/meu-carrinho', Controladores.MeuCarrinho.configuracaoValidacao, Controladores.MeuCarrinho.configuracao);
router.post('/configuracoes/self-host', Controladores.SelfHost.configuracaoValidacao, Controladores.SelfHost.configuracao);
router.post('/configuracoes/api-marketplace', Controladores.ApiMarketplace.configuracaoValidacao, Controladores.ApiMarketplace.configuracao);
router.get('/configuracoes/meu-carrinho/testar-conexao/:empresaId', Controladores.MeuCarrinho.testarConexaoValidacao, Controladores.MeuCarrinho.testarConexao);
router.get('/configuracoes/softcomshop/testar-conexao/:empresaId', Controladores.SoftcomShop.testarConexaoValidacao, Controladores.SoftcomShop.testarConexao);
router.get('/configuracoes/self-host/testar-conexao/:empresaId', Controladores.SelfHost.testarConexaoValidacao, Controladores.SelfHost.testarConexao);
router.get(
  '/configuracoes/api-marketplace/testar-conexao/:empresaId',
  Controladores.ApiMarketplace.testarConexaoValidacao,
  Controladores.ApiMarketplace.testarConexao,
);

router.get('/tarefa', Controladores.Tarefa.consultarValidacao, Controladores.Tarefa.consultar);
router.post('/tarefa/solicitar', Controladores.Tarefa.solicitarValidacao, Controladores.Tarefa.solicitar);
router.patch('/tarefa/cancelar/:tarefaId', Controladores.Tarefa.cancelarValidacao, Controladores.Tarefa.cancelar);
router.get('/tarefa/historico', Controladores.Tarefa.historicoValidacao, Controladores.Tarefa.historico);

router.get('/tarefa/nfse/padroes', Controladores.Tarefa.consultarPadroesNFSe);

router.get('/banco-imagem/:uuid', Controladores.BancoImagem.consultarMCProdutosImagensLojaValidacao, Controladores.BancoImagem.consultarMCProdutosImagensLoja);

export { router };
