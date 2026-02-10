# TaskHub API - referencia completa

## Visao geral
- Base URL: `http://localhost:8081` em desenvolvimento (`NODE_ENV` diferente de `production`) ou `http://localhost:2025` em producao.
- Formato: JSON. Enviar `Content-Type: application/json`. Tamanho maximo do corpo: 5 MB.
- CORS liberado para qualquer origem com metodos `GET, POST, PUT, DELETE`.
- Autenticacao: nao ha middleware de auth aplicado nas rotas atuais (existe middleware JWT, mas nao esta em uso).
- Padrao de erros de validacao (middleware Yup): `400` com `{ "errors": { "fields": {...}, "messages": [...], "default": "CAMPO: mensagem; ..." } }`.
- Outros erros retornam `{ "errors": { "default": "mensagem" } }` com o status indicado abaixo.

### Objetos principais
- Empresa (`empresa`):
  - `id`, `uuid`, `registro`, `nome`, `cnpj_cpf` (formatado na listagem/busca), `erp` (`SOFTSHOP` | `SOFTCOMSHOP`), `ativo`.
  - Campos de Zero Trust: `zt_host`, `zt_host_remoto_porta`, `zt_host_remoto_porta_ativo`, `zt_host_sql_porta`, `zt_host_sql_porta_ativo`, `zt_host_selfhost_porta`, `zt_host_selfhost_porta_ativo`.
  - SoftcomShop: `ss_qrcode_url`, `ss_url`, `ss_client_id`, `ss_client_secret`, `ss_empresa_nome`, `ss_empresa_cnpj`, `ss_token`, `ss_token_exp`.
  - MeuCarrinho: `mc_usuario`, `mc_senha`, `mc_empresa_id`, `mc_empresa_nome`, `mc_empresa_cnpj`, `mc_token`, `mc_token_exp`.
  - SelfHost: `sh_qrcode_url`, `sh_url`, `sh_client_id`, `sh_client_secret`, `sh_empresa_nome`, `sh_empresa_cnpj`, `sh_token`, `sh_token_exp`.
  - API Marketplace: `api_im_client_id`, `api_im_client_secret`, `api_im_empresa_id`, `api_im_empresa_nome`, `api_im_empresa_cnpj`.
  - Timestamps: `created_at`, `updated_at`.

- Tarefa (view `vw_tarefas_empresas` e historico):
  - Empresa: `e_id`, `e_ativo`, `e_erp`.
  - Tarefa: `t_id`, `t_ativo`, `t_nome`, `t_descricao_resumo`, `t_descricao`, `t_erp` (`SOFTSHOP` | `SOFTCOMSHOP` | `TODOS`), `t_param_descricao`, `t_te_param_descricao`, `t_param_ss`, `t_param_sh`, `t_param_mc`, `t_param_api_im`, `t_icone`, `t_modal`.
  - Execucao (quando existir): `te_id`, `te_status` (`NOVO` | `PENDENTE` | `PROCESSANDO` | `FINALIZADO` | `CONSULTAR` | `CANCELADA` | `ERRO`), `te_feedback`, `te_updated_at`.
  - Flags de autenticacao: `ss_autenticado`, `mc_autenticado`, `sh_autenticado`, `api_im_autenticado`.

- Padroes NFSe: `id`, `nome`, `observacao`, `xml_modelo` (boolean indicando se ha modelo salvo).

- Banco de imagens loja (`banco_imagem_produto_loja`): `id`, `empresa_id`, `codigo`, `nome`, `categoria`, `preco`, `tags`, `img_01..img_15`, `total_imgs`, `created_at`, `updated_at`.

## Endpoints

### Health / testes
- `GET /teste-api`
  - Retorno `200`: `"API TESTADA!."`
- `GET /teste`
  - Usado apenas para testes internos de associacao de imagem; requer `empresa_id` no corpo (mesmo sendo GET). Retorno `204` sem corpo em caso de sucesso; erros padrao em caso de empresa nao encontrada.

### Empresas
- `GET /empresa`
  - Query: `pagina` (default 1, >0), `limite` (default 10, max 500), `filtro` (busca em nome/registro/cnpj), `ordenarPor` (default `nome`), `ordem` (`asc`|`desc`, default `asc`).
  - Sucesso `200`: `{ "dados": [empresa...], "totalRegistros": number, "totalPaginas": number }` (`cnpj_cpf` vem formatado).
  - Erros: `500` erro interno.

- `GET /empresa/:empresaId`
  - Params: `empresaId` numerico.
  - Sucesso `200`: objeto empresa unico (cnpj/cpf formatado).
  - Erros: `404` se nao encontrado.

- `POST /empresa`
  - Body: `{ "registro": string, "nome": string, "cnpj_cpf": string (11 ou 14 digitos), "erp": "SOFTSHOP" | "SOFTCOMSHOP" }`.
  - Sucesso `204` sem corpo.
  - Erros: `400` registro duplicado (mesmo `registro` ou `cnpj_cpf`), `500` erro interno.

- `PUT /empresa/:empresaId`
  - Params: `empresaId` numerico.
  - Body: `{ "nome": string, "cnpj_cpf": string (11 ou 14 digitos), "erp": "SOFTSHOP" | "SOFTCOMSHOP", "ativo": boolean }`.
  - Sucesso `200` sem corpo.
  - Erros: `400` se empresa nao existe ou cnpj/cpf duplicado, `500` erro interno.

- `GET /empresa/zerotrust/:uuid`
  - Params: `uuid` formato UUID v4 (36 chars).
  - Sucesso `200`:
    ```json
    {
      "config": {
        "uuid": "...",
        "nome": "...",
        "cnpj_cpf": "...",
        "registro": "...",
        "cert_url_download": "https://...",
        "cert_versao": 1,
        "arquivos_url_download": "https://...",
        "arquivos_versao": 1,
        "arquivos_senha": "qaz@123"
      },
      "frpc": {
        "serverAddr": "connect.softcomzerotrust.com",
        "serverPort": 11770,
        "auth": { "token": "ZT_KEY" },
        "transport": { "tls": { "enable": true } },
        "log": { "maxDays": 3 },
        "proxies": [
          { "name": "<zt_host>-remoto", "type": "tcp", "localPort": <porta>, "remotePort": 1XXX },
          { "name": "<zt_host>-sql", "type": "tcp", "localPort": <porta>, "remotePort": 2XXX },
          { "name": "<zt_host>-selfhost", "type": "https", "localPort": <porta>, "subdomain": "<zt_host>", "plugin": { "type": "https2http", "localAddr": "127.0.0.1:<porta>", "crtPath": "./fullchain.pem", "keyPath": "./privkey.pem" } }
        ]
      }
    }
    ```
  - Erros: `404` se UUID invalido/empresa nao encontrada ou se configuracao Zero Trust nao foi localizada.

### Configuracoes de integracao
Todas exigem empresa valida (`id` existente). Em caso de falha externa os dados salvos sao limpos antes de responder.

- `POST /configuracoes/softcomshop`
  - Body: `{ "empresa_id": number, "erp_url": string (URL gerada pelo ERP) }`.
  - Fluxo: cria dispositivo + token no SoftcomShop ou reutiliza configuracao existente e apenas renova token.
  - Sucesso `204` sem corpo.
  - Erros: `400` credenciais/URL invalidas ou empresa inexistente; `500` ao salvar.

- `GET /configuracoes/softcomshop/testar-conexao/:empresaId`
  - Params: `empresaId` numerico.
  - Pre-requisitos: campos `ss_url`, `ss_client_id`, `ss_client_secret`, `ss_token` preenchidos.
  - Sucesso `200`: `"Teste de conexao realizado com sucesso."`
  - Erros: `404` empresa nao encontrada; `400` se credenciais ausentes/invalidas; `500` ao salvar retorno.

- `POST /configuracoes/meu-carrinho`
  - Body: `{ "empresa_id": number, "mc_usuario": string, "mc_senha": string }`.
  - Fluxo: autentica no MeuCarrinho, busca usuario/empresa e grava token + metadados.
  - Sucesso `204` sem corpo.
  - Erros: `400` credenciais invalidas ou empresa nao encontrada; `500` ao salvar.

- `GET /configuracoes/meu-carrinho/testar-conexao/:empresaId`
  - Params: `empresaId` numerico.
  - Pre-requisitos: `mc_token`, `mc_empresa_id`, `mc_usuario`, `mc_senha`.
  - Sucesso `200`: `"Teste de conexao realizado com sucesso."`
  - Erros: `404` empresa nao encontrada; `400` se configuracao incompleta/expirada; `500` ao salvar retorno.

- `POST /configuracoes/self-host`
  - Body: `{ "empresa_id": number, "sh_qrcode_url": string (URL completa do QRCode SelfHost) }`.
  - Fluxo: extrai dominio e clientId do QRCode, obtém client_secret e token; se o QRCode for igual ao salvo e houver credenciais, apenas renova token.
  - Sucesso: `200` sem corpo.
  - Erros: `400` QRCode invalido/credenciais invalidas/empresa inexistente; `500` ao salvar.

- `GET /configuracoes/self-host/testar-conexao/:empresaId`
  - Params: `empresaId` numerico.
  - Pre-requisitos: `sh_token`, `sh_client_id`, `sh_client_secret`.
  - Sucesso `200`: `"Teste de conexao realizado com sucesso."`
  - Erros: `404` empresa nao encontrada; `400` configuracao ausente; `500` ao salvar retorno.

- `POST /configuracoes/api-marketplace`
  - Body: `{ "empresa_id": number, "api_im_client_id": string (max 36), "api_im_client_secret": string (max 36) }`.
  - Fluxo: autentica na API Marketplace e salva dados da empresa retornados.
  - Sucesso `204` sem corpo.
  - Erros: `400` credenciais invalidas/empresa inexistente; `500` ao salvar.

- `GET /configuracoes/api-marketplace/testar-conexao/:empresaId`
  - Params: `empresaId` numerico.
  - Pre-requisitos: `api_im_client_id`, `api_im_client_secret`, `api_im_empresa_id`.
  - Sucesso `200`: `"Teste de conexao realizado com sucesso."`
  - Erros: `404` empresa nao encontrada; `400` configuracao ausente; `500` ao salvar retorno.

### Tarefas
- `GET /tarefa`
  - Query: `empresaId` (obrigatorio), `pagina` (default 1), `limite` (default 10, max 500), `filtro`, `ordenarPor` (default `nome`, cai para `t_nome`), `ordem` (`asc`|`desc`, default `asc`).
  - Sucesso `200`: `{ "dados": [item], "totalRegistros": number, "totalPaginas": number }` onde `dados` segue o shape da view de tarefas descrita em Objetos principais.
  - Erros: `404` se empresa nao existir; `500` erro interno.

- `POST /tarefa/solicitar`
  - Body: `{ "empresa_id": number, "tarefa_id": number, "param_01"... "param_15": string|null }`.
  - Regras: bloqueia se ja houver tarefa da mesma empresa e tarefa com status `PENDENTE`/`PROCESSANDO`/`CONSULTAR`. Para `tarefa_id === 6` (analise NFSe) limpa tags `Signature` dos XMLs enviados em `param_02` e `param_03` e limita cada um a 9999 caracteres.
  - Sucesso `204` sem corpo (tarefa criada com status `PENDENTE`).
  - Erros: `400` empresa/tarefa inexistente, tarefa em andamento, XML muito grande; outros `500` por falha geral.

- `PATCH /tarefa/cancelar/:tarefaId`
  - Params: `tarefaId` numerico.
  - So cancela tarefas com status `PENDENTE`; marca status `CANCELADA` e feedback padrao.
  - Sucesso `204` sem corpo.
  - Erros: `404` tarefa nao encontrada; `400` se status diferente de `PENDENTE`; `500` ao atualizar.

- `GET /tarefa/historico`
  - Query: `empresaId` (obrigatorio), `pagina` (default 1), `limite` (default 10, max 500), `filtro`, `ordenarPor` (default `te_id`), `ordem` (`asc`|`desc`, default `desc`).
  - Sucesso `200`: `{ "dados": [itemHistorico], "totalRegistros": number, "totalPaginas": number }` com o mesmo shape detalhado em Objetos principais.
  - Erros: `404` empresa nao encontrada; `500` erro interno.

- `GET /tarefa/nfse/padroes`
  - Sem parametros.
  - Sucesso `200`: `{ "dados": [ { "id": number, "nome": string, "observacao": string|null, "xml_modelo": boolean } ], "totalRegistros": number, "totalPaginas": 1 }`.
  - Erros: `500` erro interno.

### Banco de imagens
- `GET /banco-imagem/:uuid`
  - Params: `uuid` (UUID v4) da empresa.
  - Fluxo: encontra empresa, captura imagens da loja via MeuCarrinho e salva/atualiza cache antes de responder.
  - Sucesso `200`: `{ "dados": [ { campos de banco_imagem_produto_loja } ], "totalRegistros": number }`.
  - Erros: `404` empresa nao encontrada ou falha ao carregar produtos; `500` erro ao consultar banco.

## Notas para frontend
- Sempre espere JSON; respostas `204` nao trazem corpo.
- As validacoes Yup retornam erros por campo em `errors.fields`.
- Para listar tarefas e historico, usar o mesmo shape da view para montar UI (campos `t_param_*` indicam se a tarefa exige configuracao de integracao).
- `param_01..param_15` sao strings livres; a descricao esperada vem de `t_param_descricao`/`t_te_param_descricao` nas listagens.
- Portas/host Zero Trust dependem dos campos `zt_host_*` salvos na empresa; use o retorno de `/empresa/zerotrust/:uuid` para alimentar automacao/instalador.
