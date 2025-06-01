import { encoding_for_model } from '@dqbd/tiktoken';
import OpenAI from 'openai';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

const MODULO = '[OpenAIService]';

export type ICreateChat = OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming;
export type ICreateChatMessages = OpenAI.Chat.Completions.ChatCompletionMessageParam;

const gerarResposta = async (requisicao: ICreateChat): Promise<IRetorno<string>> => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    });

    const completion = await openai.chat.completions.create(requisicao);

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

const calcularPromptTokens = (mensagens: ICreateChatMessages[]): number => {
  try {
    const encoder = encoding_for_model('gpt-4o');
    let totalPromptTokens = 0;

    for (const mensagem of mensagens) {
      const conteudo = Array.isArray(mensagem.content)
        ? mensagem.content
            .map((p) => {
              if (typeof p === 'string') return p;
              if ('text' in p && typeof p.text === 'string') return p.text;
              if ('type' in p && p.type === 'image_url') return '[imagem]';
              return '';
            })
            .join(' ')
        : typeof mensagem.content === 'string'
        ? mensagem.content
        : '';

      const tokens = encoder.encode(conteudo);
      totalPromptTokens += tokens.length + 4;
    }

    totalPromptTokens += 2;
    return totalPromptTokens;
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao calcular tokens`, error);
    return 0;
  }
};

export const OpenaiIA = { gerarResposta, calcularPromptTokens };
