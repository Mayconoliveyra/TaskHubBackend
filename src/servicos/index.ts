import * as bancoImagens from './bancoImagens';

import * as apiMarketplace from './apiMarketplace';
import * as bcryptImp from './bcrypt';
import * as empresa from './empresa';
import * as jwt from './jwt';
import * as meuCarrinho from './meuCarrinho';
import * as nfse from './nfse';
import * as openaiIA from './openaiIA';
import * as selfHost from './selfHost';
import * as softcomshop from './softcomshop';

export const Servicos = {
  ...jwt,
  ...bcryptImp,
  ...softcomshop,
  ...meuCarrinho,
  ...selfHost,
  ...apiMarketplace,
  ...openaiIA,
  ...nfse,
  ...bancoImagens,
  ...empresa,
};
