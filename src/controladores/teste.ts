import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IProdutoParaAssociar } from '../servicos/bancoImagens';

import { Repositorios } from '../repositorios';

import { Servicos } from '../servicos';

const teste = async (req: Request, res: Response) => {
  const empresa_id = req.body?.empresa_id as number;

  const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresa_id }]);

  if (!empresa.sucesso) {
    return res.status(StatusCodes.NOT_FOUND).json({ errors: { default: 'Empresa não encontrada.' } });
  }

  const produtosParaTestar: IProdutoParaAssociar[] = [
    // Pizzas
    { nome: 'Pizza', categoria: 'pizzas', preco: 0 },
    { nome: 'Pizza Pepperoni Grande', categoria: 'pizzas', preco: 55.0 },
    { nome: 'Pizza Vegetariana Média', categoria: 'pizzas', preco: 50.0 },
    { nome: 'Pizza Quatro Queijos 30cm', categoria: 'pizzas', preco: 52.0 },
    { nome: 'Pizza Frango com Catupiry', categoria: 'pizzas', preco: 53.0 },
    { nome: 'Pizza Calabresa Média', categoria: 'pizzas', preco: 48.0 },

    // Bebidas
    { nome: 'Refrigerante Coca-Cola 2L', categoria: 'bebidas', preco: 9.9 },
    { nome: 'Suco Natural Laranja 300ml', categoria: 'bebidas naturais', preco: 7.5 },
    { nome: 'Cerveja Heineken 600ml', categoria: 'bebidas alcoólicas', preco: 8.0 },
    { nome: 'Água Mineral 500ml', categoria: 'bebidas', preco: 5 },
    { nome: 'Água Mineral', categoria: 'bebidas', preco: 5 },
    { nome: 'Chopp Artesanal 500ml', categoria: 'bebidas alcoólicas', preco: 12.0 },
    { nome: 'Refrigerante Guaraná Lata', categoria: 'bebidas', preco: 4.5 },

    // Lanches
    { nome: 'Hambúrguer Tradicional', categoria: 'lanches', preco: 18.0 },
    { nome: 'Cheeseburger Duplo', categoria: 'lanches', preco: 22.0 },
    { nome: 'X-Salada', categoria: 'lanches', preco: 20.0 },
    { nome: 'Hot Dog Especial', categoria: 'lanches', preco: 12.5 },
    { nome: 'Batata Frita Grande', categoria: 'acompanha', preco: 10.0 },
    { nome: 'Onion Rings', categoria: 'acompanha', preco: 11.0 },

    // Sobremesas
    { nome: 'Brigadeiro Gourmet', categoria: 'sobremesas', preco: 4.5 },
    { nome: 'Pudim de Leite', categoria: 'sobremesas', preco: 6.0 },
    { nome: 'Sorvete de Chocolate 200ml', categoria: 'sobremesas', preco: 5.0 },
    { nome: 'Brownie com Nutella', categoria: 'sobremesas', preco: 7.0 },
    { nome: 'Mousse de Maracujá', categoria: 'sobremesas', preco: 6.5 },

    // Combos
    { nome: 'Combo Pizza Grande + Refrigerante 2L', categoria: 'combos', preco: 65.0 },
    { nome: 'Combo Hambúrguer + Batata Frita + Refrigerante', categoria: 'combos', preco: 30.0 },
    { nome: 'Combo Sobremesa + Bebida', categoria: 'combos', preco: 12.0 },

    // Produto fora de contexto (baixo score)
    { nome: 'Fogão Industrial 6 Bocas', categoria: 'equipamentos', preco: 2200.0 },
    { nome: 'Mesa de Jantar Madeira', categoria: 'moveis', preco: 899.9 },
  ];

  /*   const testeResult = await Servicos.BancoImagens.associarImagemAoProduto(produtosParaTestar);
  console.log('testeResult', testeResult); */

  /*  await Servicos.BancoImagens.capturarImagensMcAlimentarBancoImagens(67, '43f4b62f-47bc-44b8-a1e0-76acac7c3080'); */

  const executarTestes = async () => {
    console.log('--- INICIANDO TESTES DE ASSOCIAÇÃO DE IMAGEM ---');

    for (const [index, produto] of produtosParaTestar.entries()) {
      /*    console.log(`\n[TESTE ${index + 1}] Buscando imagem para: "${produto.nome}"`); */

      const urlEncontrada = await Servicos.BancoImagens.associarImagemAoProduto(produto);

      if (urlEncontrada) {
        /* console.log(` -> Imagem encontrada: ${urlEncontrada}`); */
      } else {
        /*   console.log(' -> Nenhuma imagem correspondente encontrada.'); */
      }
    }

    console.log('\n--- TESTES FINALIZADOS ---');
  };

  // Executa a função de teste
  /*  executarTestes(); */

  const teste = await Servicos.BancoImagens.capturarImagensMCProdutoImagemLoja(1, 'e10cfaae-6833-4235-8c34-f8cf83c60b1d');
  console.log(teste);

  return res.status(StatusCodes.NO_CONTENT).send();
};

export const Teste = {
  teste,
};
