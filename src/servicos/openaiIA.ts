import OpenAI from 'openai';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

const MODULO = '[OpenAIService]';

type ICreateChat = OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming;
type ICreateChatMessages = OpenAI.Chat.Completions.ChatCompletionMessageParam;

const promptAnaliseNFSe = (modelo: string, xmlAutorizado: string, xmlRejeitado: string): ICreateChat => {
  const prompt: ICreateChatMessages[] = [
    // ———— Exemplos few-shot ————
    {
      role: 'user',
      content: `ENTRADA:
  xml_autorizado:<EnviarLoteRps… exemplo1…>
  xml_rejeitado:<EnviarLoteRps… rejeitado1…>`,
    },
    {
      role: 'assistant',
      content: `{
    "erros": [
      {
        "id": "1",
        "campo": "Servico/ItemListaServico",
        "tipo": "valor incorreto",
        "valor_encontrado": "1004",
        "valor_esperado": "10.04",
        "sugestao": "Altere <ItemListaServico> para '10.04'."
      },
      {
        "id": "2",
        "campo": "Servico/CodigoTributacaoMunicipio",
        "tipo": "valor incorreto",
        "valor_encontrado": "10.04",
        "valor_esperado": "100400388",
        "sugestao": "Altere <CodigoTributacaoMunicipio> para '100400388'."
      }
    ],
    "observacoes": "2 divergências críticas"
  }`,
    },
    {
      role: 'user',
      content: `ENTRADA:
  xml_autorizado:<EnviarLoteRps… exemplo2…>
  xml_rejeitado:<EnviarLoteRps… rejeitado2…>`,
    },
    {
      role: 'assistant',
      content: `{
    "erros": [],
    "observacoes": "Nenhuma divergência"
  }`,
    },

    // ———— Prompt principal ————
    {
      role: 'system',
      content: `
  Você é um ANALISTA NFSe: receba dois ou mais XMLs (xml_autorizado; xml_rejeitado), compare estrutura e conteúdo apenas dos campos críticos, e retorne EXATAMENTE um JSON no formato:
  
  {
    "erros":[
      {
        "id":"1",
        "campo":"<tag>",
        "tipo":"ausente|formato inválido|valor incorreto|structural",
        "valor_encontrado":"<valor no xml_rejeitado ou null>",
        "valor_esperado":"<valor no xml_autorizado ou regex>",
        "sugestao":"<correção objetiva>"
      }
      // …
    ],
    "observacoes":"<# divergências críticas ou Nenhuma divergência>"
  }
  
  **Regras de comparação**  
  1. Estrutura: verifique elementos e atributos obrigatórios.  
  2. Conteúdo: valide formato (regex/tipo) e compare valor apenas nos campos críticos:  
     - Servico/ItemListaServico  
     - Servico/CodigoTributacaoMunicipio  
     - Servico/Valores/ValorServicos, ValorLiquido, ValorIss, Aliquota  
     - Servico/CNAE, CodigoCnae  
     - RegimeEspecialTributacao, OptanteSimplesNacional, IncentivoFiscal  
     - Prestador/CpfCnpj, InscricaoMunicipal  
     - Tomador/IdentificacaoTomador/CpfCnpj (só formato)  
     - CFOP, NaturezaOperacao, ExigibilidadeISS, ResponsavelISSQN  
  3. Ignore diferenças de número de RPS, datas de emissão, competência e campos de RazaoSocial/Endereco.`.trim(),
    },

    // ———— Input real ————
    {
      role: 'user',
      content: `ENTRADA:
  xml_autorizado:${xmlAutorizado}
  xml_rejeitado:${xmlRejeitado}`,
    },
  ];

  return {
    model: modelo, // Ex: 'mistralai/mistral-7b-instruct'
    messages: prompt,
    temperature: 0, // desativa variabilidade
    top_p: 1, // mantém cobertura total do vocabulário
    frequency_penalty: 0, // sem penalizar repetições
    presence_penalty: 0,
    stop: ['\n\n'], // impede texto extra após o JSON
  };
};

const gerarResposta = async (requisicao: ICreateChat): Promise<IRetorno<string>> => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    });

    const completion = await openai.chat.completions.create(requisicao);
    /*   const completion = await openai.chat.completions.create({
      model: modelo, // Ex: 'mistralai/mistral-7b-instruct'
      messages: mensagem,
      temperature: 0, // desativa variabilidade
      top_p: 1, // mantém cobertura total do vocabulário
      frequency_penalty: 0, // sem penalizar repetições
      presence_penalty: 0,
      stop: ['\n\n'], // impede texto extra após o JSON
    }); */

    const resposta = completion.choices[0]?.message?.content || '';

    return {
      sucesso: true,
      dados: resposta,
      erro: null,
      total: 1,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao gerar resposta`, error);

    let mensagemErro = 'Erro desconhecido ao gerar resposta.';

    if (error?.response?.data?.error?.message) {
      mensagemErro = error.response.data.error.message;
    } else if (error?.message) {
      mensagemErro = error.message;
    }

    return {
      sucesso: false,
      dados: null,
      erro: mensagemErro,
      total: 1,
    };
  }
};

export const OpenaiIA = { gerarResposta, promptAnaliseNFSe };
