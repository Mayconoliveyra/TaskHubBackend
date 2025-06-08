import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

const padroesNfse = [
  {
    id: 1,
    nome: 'Padrão Ábaco',
  },
  {
    id: 2,
    nome: 'Padrão DSFNET',
    xml_modelo_empresa: '30.273.570/0001-16 - AUTO CENTER SAO FRANCISCO - TE',
    xml_modelo:
      '<ns1:ReqEnvioLoteRPS xmlns:ns1="http://localhost:8080/WsNFe2/lote" xmlns:tipos="http://localhost:8080/WsNFe2/tp" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://localhost:8080/WsNFe2/lote http://localhost:8080/WsNFe2/xsd/ReqEnvioLoteRPS.xsd"><Cabecalho><CodCidade>1219</CodCidade><CPFCNPJRemetente>30273570000116</CPFCNPJRemetente><RazaoSocialRemetente>MARIA GERLANDIA MONTEIRO SILVA</RazaoSocialRemetente><transacao>true</transacao><dtInicio>2025-05-30</dtInicio><dtFim>2025-05-30</dtFim><QtdRPS>1</QtdRPS><ValorTotalServicos>550.00</ValorTotalServicos><ValorTotalDeducoes>0.00</ValorTotalDeducoes><Versao>1</Versao><MetodoEnvio>WS</MetodoEnvio></Cabecalho><Lote><RPS><Assinatura>59616fabb68dcd34d657d8ee66bebb6a5528b4cd</Assinatura><InscricaoMunicipalPrestador>6017096</InscricaoMunicipalPrestador><RazaoSocialPrestador>MARIA GERLANDIA MONTEIRO SILVA</RazaoSocialPrestador><TipoRPS>RPS</TipoRPS><SerieRPS>NF</SerieRPS><NumeroRPS>86</NumeroRPS><DataEmissaoRPS>2025-05-30T12:13:00</DataEmissaoRPS><SituacaoRPS>N</SituacaoRPS><DataEmissaoNFSeSubstituida>1900-01-01</DataEmissaoNFSeSubstituida><SeriePrestacao>99</SeriePrestacao><InscricaoMunicipalTomador>0000000</InscricaoMunicipalTomador><CPFCNPJTomador>09948821300</CPFCNPJTomador><RazaoSocialTomador>TADEU JOSE DE MORAES VIANA</RazaoSocialTomador><TipoLogradouroTomador>Rua</TipoLogradouroTomador><LogradouroTomador>Quadra 29</LogradouroTomador><NumeroEnderecoTomador>8</NumeroEnderecoTomador><ComplementoEnderecoTomador/><TipoBairroTomador>-</TipoBairroTomador><BairroTomador>Mocambinho</BairroTomador><CidadeTomador>1219</CidadeTomador><CidadeTomadorDescricao>TERESINA</CidadeTomadorDescricao><CEPTomador>64010345</CEPTomador><EmailTomador/><CodigoAtividade>452000100</CodigoAtividade><AliquotaAtividade>0.0000</AliquotaAtividade><TipoRecolhimento>A</TipoRecolhimento><MunicipioPrestacao>1219</MunicipioPrestacao><MunicipioPrestacaoDescricao>TERESINA</MunicipioPrestacaoDescricao><Operacao>A</Operacao><Tributacao>H</Tributacao><ValorPIS>0.00</ValorPIS><ValorCOFINS>0.00</ValorCOFINS><ValorINSS>0.00</ValorINSS><ValorIR>0.00</ValorIR><ValorCSLL>0.00</ValorCSLL><AliquotaPIS>0.00</AliquotaPIS><AliquotaCOFINS>0.00</AliquotaCOFINS><AliquotaINSS>0.00</AliquotaINSS><AliquotaIR>0.00</AliquotaIR><AliquotaCSLL>0.00</AliquotaCSLL><DescricaoRPS>SERVICO MECANICO Qtd.: 1 Valor Unit.: R$550,00;</DescricaoRPS><DDDPrestador/><TelefonePrestador/><DDDTomador/><TelefoneTomador/><MotCancelamento/><Deducoes/><Itens><Item><DiscriminacaoServico>SERVICO MECANICO Qtd.: 1 Valor Unit.: R$550.00;</DiscriminacaoServico><Quantidade>1.00</Quantidade><ValorUnitario>550.0000</ValorUnitario><ValorTotal>550.00</ValorTotal></Item></Itens></RPS></Lote></ns1:ReqEnvioLoteRPS>',
  },
  {
    id: 3,
    nome: 'Padrão E-Nota Portal Público',
  },
  {
    id: 4,
    nome: 'Padrão E&L',
    xml_modelo_empresa: '50.458.061/0001-75 - MACEDO FREIOS E EMBREAGENS - P',
    xml_modelo:
      '<CompNfse><Nfse><InfNfse Id="2c97808396f0a13701970d83b5c673d1"><Numero>438</Numero><CodigoVerificacao>8fb3e2b59</CodigoVerificacao><DataEmissao>2025-05-26</DataEmissao><ValoresNfse><BaseCalculo>120</BaseCalculo><Aliquota>3.1</Aliquota><ValorIss>3.72</ValorIss><ValorLiquidoNfse>116.28</ValorLiquidoNfse></ValoresNfse><PrestadorServico><RazaoSocial>MACEDO FREIOS E PE AS LTDA</RazaoSocial><NomeFantasia>MACEDO FREIOS E PECAS</NomeFantasia><Endereco><Endereco>Avenida DA FERTILIDADE</Endereco><Numero>151</Numero><Bairro>DOM AVELAR</Bairro><CodigoMunicipio>2611101</CodigoMunicipio><Uf>PE</Uf><Cep>56323010</Cep></Endereco></PrestadorServico><OrgaoGerador><CodigoMunicipio>2611101</CodigoMunicipio><Uf>PE</Uf></OrgaoGerador><DeclaracaoPrestacaoServico><InfDeclaracaoPrestacaoServico Id="2c97808396f0a13701970d83b5c673d1"><Competencia>2025-05-26-03:00</Competencia><Servico><Valores><ValorServicos>120</ValorServicos><ValorDeducoes>0</ValorDeducoes><ValorPis>0</ValorPis><ValorCofins>0</ValorCofins><ValorInss>0</ValorInss><ValorIr>0</ValorIr><ValorCsll>0</ValorCsll><OutrasRetencoes>0</OutrasRetencoes><ValorIss>3.72</ValorIss><Aliquota>3.1</Aliquota><DescontoIncondicionado>0</DescontoIncondicionado><DescontoCondicionado>0</DescontoCondicionado></Valores><IssRetido>1</IssRetido><CodigoTributacaoMunicipio>1401</CodigoTributacaoMunicipio><Discriminacao>01 SERVI O DE CUICA ORDEM DE SERVI O 14155 VEICULO: ATEGO 1635 PLACA: PJA7250 </Discriminacao><CodigoMunicipio>2611101</CodigoMunicipio><ExigibilidadeISS>0</ExigibilidadeISS><MunicipioIncidencia>2611101</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>50458061000175</Cnpj></CpfCnpj><InscricaoMunicipal>85747</InscricaoMunicipal></Prestador><TomadorServico><IdentificacaoTomador><CpfCnpj><Cnpj>12655650000154</Cnpj></CpfCnpj><InscricaoMunicipal>6884</InscricaoMunicipal></IdentificacaoTomador><RazaoSocial>HIDROTEC AGRICOLA LTDA</RazaoSocial><Endereco><Endereco>Rua PROJETO IRRIGADO SENADOR NILO COELHO LOTE 1698 NUCLEO C. A</Endereco><Numero>SN</Numero><Bairro>ZONA RURAL</Bairro><CodigoMunicipio>2611101</CodigoMunicipio><Uf>PE</Uf><Cep>56302270</Cep></Endereco></TomadorServico><OptanteSimplesNacional>1</OptanteSimplesNacional><IncentivoFiscal>2</IncentivoFiscal></InfDeclaracaoPrestacaoServico></DeclaracaoPrestacaoServico><Status>1</Status></InfNfse></Nfse></CompNfse>',
  },
  {
    id: 5,
    nome: 'Padrão ISS.NET',
    xml_modelo_empresa: '51.353.054/0001-71 - GORDINHO FREIOS A AR - APARECI',
    xml_modelo:
      '<EnviarLoteRpsSincronoEnvio xmlns="http://www.abrasf.org.br/nfse.xsd"><LoteRps Id="LOTE" versao="2.04"><NumeroLote>790</NumeroLote><Prestador><CpfCnpj><Cnpj>51353054000171</Cnpj></CpfCnpj><InscricaoMunicipal>14456333</InscricaoMunicipal></Prestador><QuantidadeRps>1</QuantidadeRps><ListaRps><Rps><InfDeclaracaoPrestacaoServico Id="inf_687"><Rps><IdentificacaoRps><Numero>687</Numero><Serie>9</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-06-06</DataEmissao><Status>1</Status></Rps><Competencia>2025-06-06</Competencia><Servico><Valores><ValorServicos>2300.00</ValorServicos></Valores><IssRetido>2</IssRetido><ItemListaServico>14.01</ItemListaServico><CodigoCnae>4520001</CodigoCnae><CodigoTributacaoMunicipio>4520001</CodigoTributacaoMunicipio><Discriminacao>FROTA 198 SERVICO DE: Fazer embuchamento dos eixos  V 2300rn COM PRAZO DE 35,65,95 DIASrnSENDO A PRIMEIRA DE 766,66 PARA 10/07/2025rnSENDO A SEGUNDA DE 766,66 PARA 09/08/2025rnSENDO A TERCEIRA DE 766,67 PARAu00a008/09/2025</Discriminacao><CodigoMunicipio>5201405</CodigoMunicipio><ExigibilidadeISS>1</ExigibilidadeISS><MunicipioIncidencia>5201405</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>51353054000171</Cnpj></CpfCnpj><InscricaoMunicipal>14456333</InscricaoMunicipal></Prestador><TomadorServico><IdentificacaoTomador><CpfCnpj><Cnpj>05533482000169</Cnpj></CpfCnpj></IdentificacaoTomador><RazaoSocial>REALMIX CONCRETO LTDA</RazaoSocial><Endereco><Endereco>Rua X 18</Endereco><Numero>0</Numero><Bairro>Su00edtios Santa Luzia</Bairro><CodigoMunicipio>5201405</CodigoMunicipio><Uf>GO</Uf><Cep>74922555</Cep></Endereco></TomadorServico><RegimeEspecialTributacao>6</RegimeEspecialTributacao><OptanteSimplesNacional>1</OptanteSimplesNacional><IncentivoFiscal>2</IncentivoFiscal></InfDeclaracaoPrestacaoServico></Rps></ListaRps></LoteRps></EnviarLoteRpsSincronoEnvio>',
  },
  {
    id: 6,
    nome: 'Padrão Lençóis Paulista',
  },
  {
    id: 7,
    nome: 'Padrão SIGCORP Londrina',
  },
  {
    id: 8,
    nome: 'Padrão E-Caucaia',
  },
  {
    id: 9,
    nome: 'Padrão Freire',
  },
  {
    id: 10,
    nome: 'Padrão NFWEB',
  },
  {
    id: 11,
    nome: 'Padrão ISSWEB Fiorilli',
    xml_modelo_empresa: '41.158.055/0001-01 - SCANTOOLS',
    xml_modelo:
      '<EnviarLoteRpsSincronoEnvio xmlns="http://www.abrasf.org.br/nfse.xsd"><LoteRps Id="FE7268EE9BCD2FC8" versao="2.01"><NumeroLote>682</NumeroLote><CpfCnpj><Cnpj>41158055000101</Cnpj></CpfCnpj><InscricaoMunicipal>024502138</InscricaoMunicipal><QuantidadeRps>1</QuantidadeRps><ListaRps><Rps><InfDeclaracaoPrestacaoServico Id="DE007695FE655151"><Rps Id="inf_281"><IdentificacaoRps><Numero>281</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-06-06</DataEmissao><Status>1</Status></Rps><Competencia>2025-06-06</Competencia><Servico><Valores><ValorServicos>80.00</ValorServicos><ValorIss>1.60</ValorIss><Aliquota>2.0000</Aliquota></Valores><IssRetido>2</IssRetido><ItemListaServico>14.01</ItemListaServico><CodigoCnae>4520001</CodigoCnae><CodigoTributacaoMunicipio>4520001</CodigoTributacaoMunicipio><Discriminacao>Veiculo: SCANIA G 440 A6X4 Placa: GER0J17 - TROCA DO LIQUIDO DE ARREFECIMENTO Qtd.: 1 Valor Unit.: R$ 80,00;</Discriminacao><CodigoMunicipio>3124500</CodigoMunicipio><ExigibilidadeISS>1</ExigibilidadeISS><MunicipioIncidencia>3124500</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>41158055000101</Cnpj></CpfCnpj><InscricaoMunicipal>024502138</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cnpj>31009147000176</Cnpj></CpfCnpj></IdentificacaoTomador><RazaoSocial>TRANSPORTADORA REIS LTDA</RazaoSocial><Endereco><Endereco>Avenida Joao Rodrigues Beck</Endereco><Numero>65</Numero><Bairro>Novo Horizonte</Bairro><CodigoMunicipio>3169307</CodigoMunicipio><Uf>MG</Uf><Cep>37417462</Cep></Endereco></Tomador><RegimeEspecialTributacao>6</RegimeEspecialTributacao><OptanteSimplesNacional>1</OptanteSimplesNacional><IncentivoFiscal>2</IncentivoFiscal></InfDeclaracaoPrestacaoServico></Rps></ListaRps></LoteRps></EnviarLoteRpsSincronoEnvio>',
  },
  {
    id: 12,
    nome: 'Padrão Cecam',
  },
  {
    id: 13,
    nome: 'Padrão Goiânia',
    xml_modelo_empresa: '52.346.349/0001-83 - SOMOS EMPILHADEIRAS - GOIANIA',
    xml_modelo:
      '<GerarNfseEnvio xmlns="http://nfse.goiania.go.gov.br/xsd/nfse_gyn_v02.xsd"><Rps><InfDeclaracaoPrestacaoServico><Rps><IdentificacaoRps><Numero>370</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-04-24T13:12:49</DataEmissao><Status>1</Status></Rps><Servico><Valores><ValorServicos>265.00</ValorServicos><ValorPis>0.00</ValorPis><ValorCofins>0.00</ValorCofins><ValorInss>0.00</ValorInss><ValorIr>0.00</ValorIr><ValorCsll>0.00</ValorCsll><OutrasRetencoes>0.00</OutrasRetencoes></Valores><CodigoTributacaoMunicipio>331470800</CodigoTributacaoMunicipio><Discriminacao>HORA TECNICA - Qtde: 1 - R$ 240,00DESLOCAMENTO TECNICO - Qtde: 10 - R$ 2,50PREVENTIVA CBD20</Discriminacao><CodigoMunicipio>0025300</CodigoMunicipio></Servico><Prestador><CpfCnpj><Cnpj>52346349000183</Cnpj></CpfCnpj><InscricaoMunicipal>6432816</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cnpj>23179971000146</Cnpj></CpfCnpj></IdentificacaoTomador><RazaoSocial>COMERCIAL RUBI</RazaoSocial><Endereco><Endereco>ROD BR 153</Endereco><Numero>S/N</Numero><Bairro>FAZENDA RETIRO</Bairro><CodigoMunicipio>0025300</CodigoMunicipio><Uf>GO</Uf><Cep>74675090</Cep></Endereco><Contato><Telefone>6235229494</Telefone></Contato></Tomador><RegimeEspecialTributacao>6</RegimeEspecialTributacao></InfDeclaracaoPrestacaoServico></Rps></GerarNfseEnvio>',
  },
  {
    id: 14,
    nome: 'Padrão SIGCORP – TXT',
  },
  {
    id: 15,
    nome: 'Padrão GINFES',
    xml_modelo_empresa: '09.091.530/0001-67 - VILLA BELLA',
    xml_modelo:
      '<EnviarLoteRpsEnvio xmlns:tipos="http://www.ginfes.com.br/tipos_v03.xsd" xmlns="http://www.ginfes.com.br/servico_enviar_lote_rps_envio_v03.xsd"><LoteRps><tipos:NumeroLote>1828</tipos:NumeroLote><tipos:Cnpj>09091530000167</tipos:Cnpj><tipos:InscricaoMunicipal>900784751</tipos:InscricaoMunicipal><tipos:QuantidadeRps>1</tipos:QuantidadeRps><tipos:ListaRps><tipos:Rps><tipos:InfRps><tipos:IdentificacaoRps><tipos:Numero>11083</tipos:Numero><tipos:Serie>1</tipos:Serie><tipos:Tipo>1</tipos:Tipo></tipos:IdentificacaoRps><tipos:DataEmissao>2025-05-15T10:10:58</tipos:DataEmissao><tipos:NaturezaOperacao>1</tipos:NaturezaOperacao><tipos:RegimeEspecialTributacao>1</tipos:RegimeEspecialTributacao><tipos:OptanteSimplesNacional>1</tipos:OptanteSimplesNacional><tipos:IncentivadorCultural>2</tipos:IncentivadorCultural><tipos:Status>1</tipos:Status><tipos:Servico><tipos:Valores><tipos:ValorServicos>380.00</tipos:ValorServicos><tipos:IssRetido>2</tipos:IssRetido><tipos:BaseCalculo>380.00</tipos:BaseCalculo><tipos:Aliquota>0.0500</tipos:Aliquota><tipos:ValorLiquidoNfse>380.00</tipos:ValorLiquidoNfse></tipos:Valores><tipos:ItemListaServico>14.01</tipos:ItemListaServico><tipos:CodigoTributacaoMunicipio>4520001</tipos:CodigoTributacaoMunicipio><tipos:Discriminacao>MEC.EWERTSONVEICULO:CERATO PLACA:NMF9840NFe:01328</tipos:Discriminacao><tipos:CodigoMunicipio>2704302</tipos:CodigoMunicipio></tipos:Servico><tipos:Prestador><tipos:Cnpj>09091530000167</tipos:Cnpj><tipos:InscricaoMunicipal>900784751</tipos:InscricaoMunicipal></tipos:Prestador><tipos:Tomador><tipos:IdentificacaoTomador><tipos:CpfCnpj><tipos:Cpf>05668834492</tipos:Cpf></tipos:CpfCnpj></tipos:IdentificacaoTomador><tipos:RazaoSocial>FABYANA DE LUCENA ALBUQUERQUE</tipos:RazaoSocial><tipos:Endereco><tipos:Endereco>RUA DJALMA MENDONCA</tipos:Endereco><tipos:Numero>63</tipos:Numero><tipos:Bairro>GRUTA DE LOURDES</tipos:Bairro><tipos:CodigoMunicipio>2704302</tipos:CodigoMunicipio><tipos:Uf>AL</tipos:Uf><tipos:Cep>57052489</tipos:Cep></tipos:Endereco><tipos:Contato><tipos:Telefone>82999820679</tipos:Telefone><tipos:Email>fabyanalucena2@gmail.com</tipos:Email></tipos:Contato></tipos:Tomador></tipos:InfRps></tipos:Rps></tipos:ListaRps></LoteRps></EnviarLoteRpsEnvio>',
  },
  {
    id: 16,
    nome: 'Padrão BOANF',
  },
  {
    id: 17,
    nome: 'Padrão BETHA',
  },
  {
    id: 18,
    nome: 'Padrão PRODATA',
  },
  {
    id: 19,
    nome: 'Padrão SimplISS',
  },
  {
    id: 20,
    nome: 'Padrão ISSWEB Camaçari',
    xml_modelo_empresa: '49.152.110/0001-68 - ALL GOLDPETS',
    xml_modelo:
      '<EnviarLoteRpsSincronoEnvio xmlns="http://www.abrasf.org.br/nfse.xsd"><LoteRps Id="lote_" versao="2.01"><NumeroLote>2918</NumeroLote><CpfCnpj><Cnpj>49152110000168</Cnpj></CpfCnpj><InscricaoMunicipal>0049248001</InscricaoMunicipal><QuantidadeRps>1</QuantidadeRps><ListaRps><Rps><InfDeclaracaoPrestacaoServico Id="CD9F0DE86079F879"><Rps><IdentificacaoRps><Numero>1680</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-06-07</DataEmissao><Status>1</Status></Rps><Competencia>2025-06-07</Competencia><Servico><Valores><ValorServicos>67.00</ValorServicos><ValorIss>3.3500</ValorIss><Aliquota>5.0000</Aliquota></Valores><IssRetido>2</IssRetido><ItemListaServico>00508</ItemListaServico><CodigoCnae>9609208</CodigoCnae><CodigoTributacaoMunicipio>9609208</CodigoTributacaoMunicipio><Discriminacao>BANHO PELO CURTO M Qtd.: 1 Valor Unit.: R$52,00; TAXI PET M Qtd.: 1 Valor Unit.: R$15,00;</Discriminacao><CodigoMunicipio>2905701</CodigoMunicipio><ExigibilidadeISS>1</ExigibilidadeISS><MunicipioIncidencia>2905701</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>49152110000168</Cnpj></CpfCnpj><InscricaoMunicipal>0049248001</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cpf>00779247540</Cpf></CpfCnpj></IdentificacaoTomador><RazaoSocial>DANIELA BRITO</RazaoSocial><Endereco><Endereco>Rua Colonia Boa Uniao</Endereco><Numero>SN</Numero><Bairro>Boa Uniao (Abrantes)</Bairro><CodigoMunicipio>2905701</CodigoMunicipio><Uf>BA</Uf><CodigoPais>1058</CodigoPais><Cep>42821798</Cep></Endereco><Contato><Telefone>71988596415</Telefone></Contato></Tomador><OptanteSimplesNacional>1</OptanteSimplesNacional><IncentivoFiscal>2</IncentivoFiscal></InfDeclaracaoPrestacaoServico></Rps></ListaRps></LoteRps></EnviarLoteRpsSincronoEnvio>',
  },
  {
    id: 21,
    nome: 'Padrão SMARAPD SIL Tecnologia WS',
  },
  {
    id: 22,
    nome: 'Padrão Dueto',
  },
  {
    id: 23,
    nome: 'Padrão IPM',
  },
  {
    id: 24,
    nome: 'Padrão WEB ISS',
  },
  {
    id: 25,
    nome: 'Padrão NF-em',
  },
  {
    id: 26,
    nome: 'Padrão Nota Blu',
  },
  {
    id: 27,
    nome: 'Padrão Lexsom',
  },
  {
    id: 28,
    nome: 'Padrão eISS',
  },
  {
    id: 29,
    nome: 'Padrão Nota Natalense',
    xml_modelo_empresa: '52.835.757/0001-07 - PETVILA PET SHOP E CLÍNICA VET',
    xml_modelo:
      '<EnviarLoteRpsEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd"><LoteRps Id="Lote_1044"><NumeroLote>1044</NumeroLote><Cnpj>52835757000107</Cnpj><InscricaoMunicipal>2277998</InscricaoMunicipal><QuantidadeRps>1</QuantidadeRps><ListaRps><Rps><InfRps Id="inf_941"><IdentificacaoRps><Numero>941</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-04-26T12:19:50</DataEmissao><NaturezaOperacao>1</NaturezaOperacao><RegimeEspecialTributacao>6</RegimeEspecialTributacao><OptanteSimplesNacional>1</OptanteSimplesNacional><IncentivadorCultural>2</IncentivadorCultural><Status>1</Status><Servico><Valores><ValorServicos>60.00</ValorServicos><IssRetido>2</IssRetido><BaseCalculo>60.00</BaseCalculo><ValorLiquidoNfse>60.00</ValorLiquidoNfse></Valores><ItemListaServico>5.08</ItemListaServico><CodigoCnae>9609208</CodigoCnae><Discriminacao>BANHO P.P PELO LONGO - Qtde: 1 - R$ 45,00REMOCAO DE NOZINHO - Qtde: 1 - R$ 15,00</Discriminacao><CodigoMunicipio>2408102</CodigoMunicipio></Servico><Prestador><Cnpj>52835757000107</Cnpj><InscricaoMunicipal>2277998</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cpf>00846065410</Cpf></CpfCnpj></IdentificacaoTomador><RazaoSocial>CARLA MEDEIROS DE ARAUJO</RazaoSocial><Endereco><Endereco>Rua Professor Pedro Pinheiro de Souza 95</Endereco><Numero>95</Numero><Bairro>Ponta Negra</Bairro><CodigoMunicipio>2408102</CodigoMunicipio><Uf>RN</Uf><Cep>59092550</Cep></Endereco></Tomador></InfRps></Rps></ListaRps></LoteRps></EnviarLoteRpsEnvio>',
  },
  {
    id: 30,
    nome: 'Padrão Equiplano',
  },
  {
    id: 31,
    nome: 'Padrão FacilitaISS',
  },
  {
    id: 32,
    nome: 'Padrão SEMFAZ',
  },
  {
    id: 33,
    nome: 'Padrão Tecnos',
  },
  {
    id: 34,
    nome: 'Padrão SIGCORP Rio Grande',
  },
  {
    id: 35,
    nome: 'Padrão INFISC – Santiago',
  },
  {
    id: 36,
    nome: 'Padrão INFISC – Sapucaia',
  },
  {
    id: 37,
    nome: 'Padrão Governo Digital',
  },
  {
    id: 38,
    nome: 'Padrão Governa TXT',
  },
  {
    id: 39,
    nome: 'Padrão e-Receita',
  },
  {
    id: 40,
    nome: 'Padrão SIGCORP São Gonçalo',
  },
  {
    id: 41,
    nome: 'Padrão ArrecadaNet',
  },
  {
    id: 42,
    nome: 'Padrão RLZ',
  },
  {
    id: 43,
    nome: 'Padrão PMJP',
  },
  {
    id: 44,
    nome: 'Padrão Governo Eletrônico',
  },
  {
    id: 45,
    nome: 'Padrão PortalFacil',
  },
  {
    id: 46,
    nome: 'Padrão ISS On-line Supernova',
  },
  {
    id: 47,
    nome: 'Padrão ISSNFe On-line',
  },
  {
    id: 48,
    nome: 'Padrão DEISS',
  },
  {
    id: 49,
    nome: 'Padrão SIGCORP Ivaipora',
  },
  {
    id: 50,
    nome: 'Padrão SAPITUR',
  },
  {
    id: 51,
    nome: 'Padrão ISS Fortaleza',
    xml_modelo_empresa: '40.001.381/0001-48 - BETEL MOTOPECAS',
    xml_modelo:
      '<EnviarLoteRpsEnvio xmlns:tipos="http://www.ginfes.com.br/tipos_v03.xsd" xmlns="http://www.ginfes.com.br/servico_enviar_lote_rps_envio_v03.xsd"><LoteRps><tipos:NumeroLote>15</tipos:NumeroLote><tipos:Cnpj>40001381000148</tipos:Cnpj><tipos:InscricaoMunicipal>618650</tipos:InscricaoMunicipal><tipos:QuantidadeRps>1</tipos:QuantidadeRps><tipos:ListaRps><tipos:Rps><tipos:InfRps><tipos:IdentificacaoRps><tipos:Numero>215</tipos:Numero><tipos:Serie>1</tipos:Serie><tipos:Tipo>1</tipos:Tipo></tipos:IdentificacaoRps><tipos:DataEmissao>2025-06-05T10:09:40</tipos:DataEmissao><tipos:NaturezaOperacao>1</tipos:NaturezaOperacao><tipos:RegimeEspecialTributacao>6</tipos:RegimeEspecialTributacao><tipos:OptanteSimplesNacional>2</tipos:OptanteSimplesNacional><tipos:IncentivadorCultural>2</tipos:IncentivadorCultural><tipos:Status>1</tipos:Status><tipos:Servico><tipos:Valores><tipos:ValorServicos>120.00</tipos:ValorServicos><tipos:IssRetido>2</tipos:IssRetido><tipos:ValorIss>6.00</tipos:ValorIss><tipos:BaseCalculo>120.00</tipos:BaseCalculo><tipos:Aliquota>0.0500</tipos:Aliquota><tipos:ValorLiquidoNfse>120.00</tipos:ValorLiquidoNfse></tipos:Valores><tipos:ItemListaServico>14.01</tipos:ItemListaServico><tipos:CodigoCnae>20</tipos:CodigoCnae><tipos:CodigoTributacaoMunicipio>454390001</tipos:CodigoTributacaoMunicipio><tipos:Discriminacao>REVISAO Qtd.: 1 Valor Unit.: R$ 120,00;</tipos:Discriminacao><tipos:CodigoMunicipio>2304400</tipos:CodigoMunicipio></tipos:Servico><tipos:Prestador><tipos:Cnpj>40001381000148</tipos:Cnpj><tipos:InscricaoMunicipal>618650</tipos:InscricaoMunicipal></tipos:Prestador><tipos:Tomador><tipos:IdentificacaoTomador><tipos:CpfCnpj><tipos:Cnpj>86927704000200</tipos:Cnpj></tipos:CpfCnpj></tipos:IdentificacaoTomador><tipos:RazaoSocial>AUTO POSTO STAR LTDA</tipos:RazaoSocial><tipos:Endereco><tipos:Endereco>Avenida Sargento Herminio Sampaio</tipos:Endereco><tipos:Numero>1500</tipos:Numero><tipos:Bairro>Monte Castelo</tipos:Bairro><tipos:CodigoMunicipio>2304400</tipos:CodigoMunicipio><tipos:Uf>CE</tipos:Uf><tipos:Cep>60326515</tipos:Cep></tipos:Endereco><tipos:Contato><tipos:Telefone>8532834582</tipos:Telefone><tipos:Email>autopostostar02@gmail.com</tipos:Email></tipos:Contato></tipos:Tomador></tipos:InfRps></tipos:Rps></tipos:ListaRps></LoteRps></EnviarLoteRpsEnvio>',
  },
  {
    id: 52,
    nome: 'Padrão Metrópolis',
  },
  {
    id: 53,
    nome: 'Padrão Consist',
  },
  {
    id: 54,
    nome: 'Padrão Tributos Municipais',
  },
  {
    id: 55,
    nome: 'Padrão SIGCORP Cianorte',
  },
  {
    id: 56,
    nome: 'Padrão INFISC Garibaldi',
  },
  {
    id: 57,
    nome: 'Padrão INFISC Campo Bom',
  },
  {
    id: 58,
    nome: 'Padrão Siappa',
  },
  {
    id: 59,
    nome: 'Padrão Janela Única',
  },
  {
    id: 60,
    nome: 'Padrão Obaratech',
  },
  {
    id: 61,
    nome: 'Padrão Mitra',
  },
  {
    id: 62,
    nome: 'Padrão WEB ISS 2.0',
    xml_modelo_empresa: '52.317.018/0001-15 - VICTORIA BRANDAO BEAUTY - ARAC',
    xml_modelo:
      '<EnviarLoteRpsSincronoEnvio xmlns="http://www.abrasf.org.br/nfse.xsd"><LoteRps Id="Lote_6124" versao="2.02"><NumeroLote>6124</NumeroLote><CpfCnpj><Cnpj>52317018000115</Cnpj></CpfCnpj><InscricaoMunicipal>1463369</InscricaoMunicipal><QuantidadeRps>1</QuantidadeRps><ListaRps><Rps><InfDeclaracaoPrestacaoServico Id="inf_4295"><Rps Id="Rps_42951"><IdentificacaoRps><Numero>4295</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-06-07</DataEmissao><Status>1</Status></Rps><Competencia>2025-06-07</Competencia><Servico><Valores><ValorServicos>100.00</ValorServicos><ValorIss>5.00</ValorIss><Aliquota>5.0000</Aliquota></Valores><IssRetido>2</IssRetido><ItemListaServico>0601</ItemListaServico><CodigoCnae>9602501</CodigoCnae><CodigoTributacaoMunicipio>0601</CodigoTributacaoMunicipio><Discriminacao>PODOLOGIA - Qtde: 1 - R$ 100,00</Discriminacao><CodigoMunicipio>2800308</CodigoMunicipio><ExigibilidadeISS>1</ExigibilidadeISS><MunicipioIncidencia>2800308</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>52317018000115</Cnpj></CpfCnpj><InscricaoMunicipal>1463369</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cpf>02523240564</Cpf></CpfCnpj></IdentificacaoTomador><RazaoSocial>MARCELA DA SILVA BARROS</RazaoSocial><Endereco><Endereco>Rua Francisco Gumercindo Bessa</Endereco><Numero>315</Numero><Bairro>Grageru</Bairro><CodigoMunicipio>2800308</CodigoMunicipio><Uf>SE</Uf><CodigoPais>1058</CodigoPais><Cep>49025220</Cep></Endereco><Contato><Telefone>79988277264</Telefone><Email>MARCELABARROS1106@GMAIL.COM</Email></Contato></Tomador><RegimeEspecialTributacao>6</RegimeEspecialTributacao><OptanteSimplesNacional>1</OptanteSimplesNacional><IncentivoFiscal>2</IncentivoFiscal></InfDeclaracaoPrestacaoServico></Rps></ListaRps></LoteRps></EnviarLoteRpsSincronoEnvio>',
  },
  {
    id: 63,
    nome: 'Padrão 3enet',
  },
  {
    id: 64,
    nome: 'Padrão SigCORP Marília',
  },
  {
    id: 65,
    nome: 'Padrão Asten',
  },
  {
    id: 66,
    nome: 'Padrão NFPSe WS',
  },
  {
    id: 67,
    nome: 'Padrão SIGCORP Itapira',
  },
  {
    id: 68,
    nome: 'Padrão SigCorp Botucatu',
  },
  {
    id: 69,
    nome: 'Padrão SIGCorp Sarandi',
  },
  {
    id: 70,
    nome: 'Padrão SIGCorp Petrópolis',
  },
  {
    id: 71,
    nome: 'Padrão 3TECNOS Upload XML',
  },
  {
    id: 72,
    nome: 'Padrão Città',
  },
  {
    id: 73,
    nome: 'Padrão VLCNET WS',
  },
  {
    id: 74,
    nome: 'Padrão D2TI',
  },
  {
    id: 75,
    nome: 'Padrão E-Nota WS',
  },
  {
    id: 76,
    nome: 'Padrão RLZ ABRASF',
  },
  {
    id: 77,
    nome: 'Padrão Prefeitura Rápida',
  },
  {
    id: 78,
    nome: 'Padrão INFISC CFS-e',
  },
  {
    id: 79,
    nome: 'Padrão N&A Informática',
  },
  {
    id: 80,
    nome: 'Padrão GLC Consultoria WS',
  },
  {
    id: 81,
    nome: 'Padrão CENTI 2',
  },
  {
    id: 82,
    nome: 'Padrão Prescon WS',
  },
  {
    id: 83,
    nome: 'Padrão ENota Fiscal',
  },
  {
    id: 84,
    nome: 'Padrão Gefisco 2',
  },
  {
    id: 85,
    nome: 'Padrão NFSeWeb',
  },
  {
    id: 86,
    nome: 'Padrão Futurize',
    xml_modelo_empresa: '52.871.838/0001-54 - BRUNO SILVA BERTELLI',
    xml_modelo:
      '<GerarNfseEnvio xmlns="http://www.abrasf.org.br/nfse.xsd"><Rps><InfDeclaracaoPrestacaoServico><Rps><IdentificacaoRps><Numero>202</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-06-07</DataEmissao><Status>1</Status></Rps><Competencia>2025-06-07</Competencia><Servico><Valores><ValorServicos>150.00</ValorServicos><ValorIss>3.00</ValorIss><Aliquota>2.0000</Aliquota></Valores><IssRetido>2</IssRetido><ItemListaServico>05.01</ItemListaServico><CodigoCnae>7500100</CodigoCnae><Discriminacao>EXAME DE SANGUE - Qtde: 1 - R$ 150,00</Discriminacao><CodigoMunicipio>3106903</CodigoMunicipio><ExigibilidadeISS>1</ExigibilidadeISS><MunicipioIncidencia>3106903</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>52871838000154</Cnpj></CpfCnpj><InscricaoMunicipal>74001359</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cpf>08573973625</Cpf></CpfCnpj></IdentificacaoTomador><RazaoSocial>JANAINA PALMA MONTEIRO</RazaoSocial><Endereco><Endereco>Rua Dona Ana</Endereco><Numero>74</Numero><Bairro>Centro</Bairro><CodigoMunicipio>3106903</CodigoMunicipio><Uf>MG</Uf><CodigoPais>1058</CodigoPais><Cep>36600030</Cep></Endereco><Contato/></Tomador><RegimeEspecialTributacao>6</RegimeEspecialTributacao><OptanteSimplesNacional>1</OptanteSimplesNacional><IncentivoFiscal>2</IncentivoFiscal></InfDeclaracaoPrestacaoServico></Rps></GerarNfseEnvio>',
  },
  {
    id: 87,
    nome: 'Padrão Barueri',
  },
  {
    id: 88,
    nome: 'Padrão Ativ',
  },
  {
    id: 89,
    nome: 'Padrão E-Ticons',
  },
  {
    id: 90,
    nome: 'Padrão Tributos Municipais WS',
    xml_modelo_empresa: '22.939.130/0002-08 - CLIMED UNIDADE II - PEDRAS',
    xml_modelo:
      '<EnviarLoteRpsSincronoEnvio xmlns="http://www.abrasf.org.br/nfse.xsd"><LoteRps id="C10A325775D5278D" versao="2.04"><NumeroLote>1000360</NumeroLote><Prestador><CpfCnpj><Cnpj>22939130000208</Cnpj></CpfCnpj><InscricaoMunicipal>353527144</InscricaoMunicipal></Prestador><QuantidadeRps>1</QuantidadeRps><ListaRps><Rps><InfDeclaracaoPrestacaoServico id="inf_281"><Rps id="Rps_2811"><IdentificacaoRps><Numero>281</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-05-27</DataEmissao><Status>1</Status></Rps><Competencia>2025-05-27</Competencia><Servico><Valores><ValorServicos>78.56</ValorServicos></Valores><IssRetido>2</IssRetido><ItemListaServico>04.01</ItemListaServico><CodigoCnae>8630502</CodigoCnae><CodigoTributacaoMunicipio>8630502</CodigoTributacaoMunicipio><Discriminacao>EXAME DE APTIDÃO FISICA E MENTAL - Qtde: 1 - R$ 78,56</Discriminacao><CodigoMunicipio>2511202</CodigoMunicipio><ExigibilidadeISS>1</ExigibilidadeISS><MunicipioIncidencia>2511202</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>22939130000208</Cnpj></CpfCnpj><InscricaoMunicipal>353527144</InscricaoMunicipal></Prestador><TomadorServico><IdentificacaoTomador><CpfCnpj><Cpf>08245874485</Cpf></CpfCnpj></IdentificacaoTomador><RazaoSocial>ADEMILTON THEYLON PAULINO VITURIANO</RazaoSocial><Endereco><Endereco>SEVERINA BORGES</Endereco><Numero>104</Numero><Bairro>Centro</Bairro><CodigoMunicipio>2511202</CodigoMunicipio><Uf>PB</Uf><Cep>58328000</Cep></Endereco></TomadorServico><RegimeEspecialTributacao>6</RegimeEspecialTributacao><OptanteSimplesNacional>1</OptanteSimplesNacional><IncentivoFiscal>2</IncentivoFiscal></InfDeclaracaoPrestacaoServico></Rps></ListaRps></LoteRps></EnviarLoteRpsSincronoEnvio>',
  },
  {
    id: 91,
    nome: 'Padrão FINTELISS',
  },
  {
    id: 92,
    nome: 'Padrão FGMAISS',
  },
  {
    id: 93,
    nome: 'Padrão AWATAR',
  },
  {
    id: 94,
    nome: 'Padrão GLC Consultoria (Sumaré e Monte Mor)',
  },
  {
    id: 95,
    nome: 'Padrão Thema',
  },
  {
    id: 96,
    nome: 'Padrão GENERATIVA',
  },
  {
    id: 97,
    nome: 'Padrão ISSE',
  },
  {
    id: 98,
    nome: 'Padrão SMARAPD SIL Tecnologia',
  },
  {
    id: 99,
    nome: 'Padrão Nota Carioca',
  },
  {
    id: 100,
    nome: 'Padrão JFISS Digital',
  },
  {
    id: 101,
    nome: 'Padrão ISISS',
  },
  {
    id: 102,
    nome: 'Padrão Elotech',
  },
  {
    id: 103,
    nome: 'Padrão NF Paulistana',
  },
  {
    id: 104,
    nome: 'Padrão NFSeNET',
  },
  {
    id: 105,
    nome: 'Padrão INFISC – Caxias do Sul',
  },
  {
    id: 106,
    nome: 'Padrão Pública',
  },
  {
    id: 107,
    nome: 'Padrão Assessor Público',
  },
  {
    id: 108,
    nome: 'Padrão NFPSe',
  },
  {
    id: 109,
    nome: 'Padrão Ágili',
    xml_modelo_empresa: '53.962.659/0001-95 - SOS TRANSMISSOES AUTOMATICAS',
    xml_modelo:
      '<GerarNfseEnvio xmlns="http://www.agili.com.br/nfse_v_1.00.xsd"><UnidadeGestora>03347101000121</UnidadeGestora><DeclaracaoPrestacaoServico><IdentificacaoPrestador><ChaveDigital>97f28745cc802310e00120df4d6a450c</ChaveDigital><CpfCnpj><Cnpj>53962659000195</Cnpj></CpfCnpj><InscricaoMunicipal>6820661</InscricaoMunicipal></IdentificacaoPrestador><Rps><IdentificacaoRps><Numero>290</Numero><Serie>1</Serie><Tipo>-2</Tipo></IdentificacaoRps><DataEmissao>2025-06-05</DataEmissao></Rps><DadosTomador><IdentificacaoTomador><CpfCnpj><Cnpj>05386044000204</Cnpj></CpfCnpj></IdentificacaoTomador><RazaoSocial>MAGDA MARIA LAHUDE SPOHR &amp; FILHOS LTDA</RazaoSocial><LocalEndereco>1</LocalEndereco><Endereco><TipoLogradouro>Rua</TipoLogradouro><Logradouro>ROD BR-471</Logradouro><Numero>0</Numero><Bairro>SCHULZ</Bairro><Municipio><CodigoMunicipioIBGE>4316808</CodigoMunicipioIBGE></Municipio><Pais><CodigoPaisBacen>1058</CodigoPaisBacen></Pais><Cep>96845545</Cep></Endereco><Contato><Telefone>5137156439</Telefone><Email>manutencao@spohrlocadora.com.br</Email></Contato></DadosTomador><RegimeEspecialTributacao><Codigo>-6</Codigo></RegimeEspecialTributacao><OptanteSimplesNacional>1</OptanteSimplesNacional><OptanteMEISimei>0</OptanteMEISimei><ISSQNRetido>0</ISSQNRetido><ItemLei116AtividadeEconomica>14.01</ItemLei116AtividadeEconomica><ExigibilidadeISSQN><Codigo>-1</Codigo></ExigibilidadeISSQN><MunicipioIncidencia><CodigoMunicipioIBGE>5107602</CodigoMunicipioIBGE></MunicipioIncidencia><ValorServicos>300.00</ValorServicos><ValorDescontos>0.00</ValorDescontos><ValorPis>0.00</ValorPis><ValorCofins>0.00</ValorCofins><ValorInss>0.00</ValorInss><ValorIrrf>0.00</ValorIrrf><ValorCsll>0.00</ValorCsll><ValorOutrasRetencoes>0.00</ValorOutrasRetencoes><ValorBaseCalculoISSQN>300.00</ValorBaseCalculoISSQN><AliquotaISSQN>3.47</AliquotaISSQN><ValorISSQNCalculado>10.41</ValorISSQNCalculado><ValorLiquido>300.00</ValorLiquido><ListaServico><DadosServico><Discriminacao>Veículo: FIAT TORO Placa: JBN7D93 - SERVICO REVISAO LINHA LEVE Qtd.: 1 Valor Unit.: R$ 80.00;</Discriminacao><CodigoCnae>4520003</CodigoCnae><Quantidade>1.00</Quantidade><ValorServico>300.00</ValorServico></DadosServico></ListaServico><Versao>1.00</Versao></DeclaracaoPrestacaoServico></GerarNfseEnvio>',
  },
  {
    id: 110,
    nome: 'Padrão Nota Salvador',
    xml_modelo_empresa: '47.066.879/0001-38 - CRONUS - SALVADOR',
    xml_modelo:
      '<EnviarLoteRpsEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd"><LoteRps id="Lote_308"><NumeroLote>308</NumeroLote><Cnpj>47066879000138</Cnpj><InscricaoMunicipal>89086700146</InscricaoMunicipal><QuantidadeRps>1</QuantidadeRps><ListaRps><Rps><InfRps id="Rps_871"><IdentificacaoRps><Numero>87</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-05-30T16:45:33</DataEmissao><NaturezaOperacao>1</NaturezaOperacao><RegimeEspecialTributacao>1</RegimeEspecialTributacao><OptanteSimplesNacional>1</OptanteSimplesNacional><IncentivadorCultural>2</IncentivadorCultural><Status>1</Status><Servico><Valores><ValorServicos>55.00</ValorServicos><IssRetido>2</IssRetido><BaseCalculo>55.00</BaseCalculo><ValorLiquidoNfse>55.00</ValorLiquidoNfse></Valores><ItemListaServico>1401</ItemListaServico><CodigoCnae>1401001</CodigoCnae><CodigoTributacaoMunicipio>1401001</CodigoTributacaoMunicipio><Discriminacao>INDEX;</Discriminacao><CodigoMunicipio>2927408</CodigoMunicipio></Servico><Prestador><Cnpj>47066879000138</Cnpj><InscricaoMunicipal>89086700146</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cpf>05396554576</Cpf></CpfCnpj></IdentificacaoTomador><RazaoSocial>PEDRO ELIAS SANTOS SOUZA</RazaoSocial><Endereco><Endereco>NORDESTE</Endereco><Numero>18</Numero><Bairro>Nordeste</Bairro><CodigoMunicipio>2927408</CodigoMunicipio><Uf>BA</Uf><Cep>41905000</Cep></Endereco><Contato><Telefone>71992910046</Telefone><Email>PEEDROEFISIO@GMAIL.COM</Email></Contato></Tomador></InfRps></Rps></ListaRps></LoteRps></EnviarLoteRpsEnvio>',
  },
  {
    id: 111,
    nome: 'Padrão ISS Intel',
    xml_modelo_empresa: '09.370.415/0001-21 - FALCÃO AUTO PEÇAS - CENTRO',
    xml_modelo:
      '<EnviarLoteRpsEnvio><LoteRps><NumeroLote>192</NumeroLote><Cnpj>09370415000121</Cnpj><InscricaoMunicipal>111272</InscricaoMunicipal><QuantidadeRps>1</QuantidadeRps><ListaRps><Rps><InfRps><IdentificacaoRps><Numero>71</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-05-29T10:39:11</DataEmissao><NaturezaOperacao>1</NaturezaOperacao><RegimeEspecialTributacao>1</RegimeEspecialTributacao><OptanteSimplesNacional>1</OptanteSimplesNacional><IncentivadorCultural>2</IncentivadorCultural><Status>1</Status><Servico><Valores><ValorServicos>95.00</ValorServicos><IssRetido>2</IssRetido><BaseCalculo>0.00</BaseCalculo><Aliquota>0.0200</Aliquota><DescontoIncondicionado>95.00</DescontoIncondicionado></Valores><ItemListaServico>14.01</ItemListaServico><CodigoCnae>452000101</CodigoCnae><Discriminacao>ALINHAMENTO DIANTEIRO - Qtde: 1 - R$ 35,00BALANCEAMENTO FERRO ARO 15 - Qtde: 4 - R$ 15,00</Discriminacao><CodigoMunicipio>2501807</CodigoMunicipio></Servico><Prestador><Cnpj>09370415000121</Cnpj><InscricaoMunicipal>111272</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cpf>33538140430</Cpf></CpfCnpj></IdentificacaoTomador><RazaoSocial>CLAUDIO DOS SANTOS</RazaoSocial><Endereco><Endereco>ALMIRO BARBOSA LIMA</Endereco><Numero>56</Numero><Bairro>Centro</Bairro><CodigoMunicipio>2508604</CodigoMunicipio><Uf>PB</Uf><Cep>58315000</Cep></Endereco></Tomador></InfRps></Rps></ListaRps></LoteRps></EnviarLoteRpsEnvio>',
  },
  {
    id: 112,
    nome: 'Padrão TIPLAN',
  },
  {
    id: 113,
    nome: 'Padrão Solução Pública',
  },
  {
    id: 114,
    nome: 'Padrão DB NFSE',
  },
  {
    id: 115,
    nome: 'Padrão DigiFred',
  },
  {
    id: 116,
    nome: 'Padrão BSIT-BR',
  },
  {
    id: 117,
    nome: 'Padrão FISS-LEX',
  },
  {
    id: 118,
    nome: 'Padrão SJP',
  },
  {
    id: 119,
    nome: 'Padrão Tinus',
    xml_modelo_empresa: '12.469.175/0001-21 - A OFFICINA PEÇAS E SERVIÇOS',
    xml_modelo:
      '<tin:RecepcionarLoteRps xmlns:tin="http://www.tinus.com.br"><tin:Arg><tin:LoteRps id="Lote_102"><tin:NumeroLote>102</tin:NumeroLote><tin:Cnpj>12469175000121</tin:Cnpj><tin:InscricaoMunicipal>0641995</tin:InscricaoMunicipal><tin:QuantidadeRps>1</tin:QuantidadeRps><tin:ListaRps><tin:Rps><tin:InfRps id="inf_1464"><tin:IdentificacaoRps><tin:Numero>1464</tin:Numero><tin:Serie>1</tin:Serie><tin:Tipo>1</tin:Tipo></tin:IdentificacaoRps><tin:DataEmissao>2025-05-22T11:19:41</tin:DataEmissao><tin:NaturezaOperacao>3</tin:NaturezaOperacao><tin:RegimeEspecialTributacao>6</tin:RegimeEspecialTributacao><tin:OptanteSimplesNacional>1</tin:OptanteSimplesNacional><tin:IncentivadorCultural>2</tin:IncentivadorCultural><tin:Status>1</tin:Status><tin:Servico><tin:Valores><tin:ValorServicos>2000.00</tin:ValorServicos><tin:IssRetido>2</tin:IssRetido><tin:BaseCalculo>2000.00</tin:BaseCalculo><tin:Aliquota>0.0200</tin:Aliquota><tin:ValorLiquidoNfse>2000.00</tin:ValorLiquidoNfse></tin:Valores><tin:ItemListaServico>14.01</tin:ItemListaServico><tin:CodigoCnae>4520003</tin:CodigoCnae><tin:CodigoTributacaoMunicipio>4520003</tin:CodigoTributacaoMunicipio><tin:Discriminacao>Veiculo: PEUGEOT 408 Placa: FNF5C86 - SERVICO MOTOR Qtd.: 1 Valor Unit.: R$ 2.000,00;</tin:Discriminacao><tin:CodigoMunicipio>2609600</tin:CodigoMunicipio></tin:Servico><tin:Prestador><tin:Cnpj>12469175000121</tin:Cnpj><tin:InscricaoMunicipal>0641995</tin:InscricaoMunicipal></tin:Prestador><tin:Tomador><tin:IdentificacaoTomador><tin:CpfCnpj><tin:Cpf>70573295476</tin:Cpf></tin:CpfCnpj></tin:IdentificacaoTomador><tin:RazaoSocial>VINICIUS FERREIRA SAMPAIO</tin:RazaoSocial><tin:Endereco><tin:Endereco>RUA MANOEL GRACILIANO DE SOUZA</tin:Endereco><tin:Numero>1299</tin:Numero><tin:Bairro>JARDIM ATLANTICO</tin:Bairro><tin:CodigoMunicipio>2609600</tin:CodigoMunicipio><tin:Uf>PE</tin:Uf><tin:Cep>53050120</tin:Cep></tin:Endereco></tin:Tomador></tin:InfRps></tin:Rps></tin:ListaRps></tin:LoteRps></tin:Arg></tin:RecepcionarLoteRps>',
  },
  {
    id: 120,
    nome: 'Padrão SH3',
  },
  {
    id: 121,
    nome: 'Padrão Governa',
  },
  {
    id: 122,
    nome: 'Padrão Prescon',
  },
  {
    id: 123,
    nome: 'Padrão Tinus Upload',
  },
  {
    id: 124,
    nome: 'Padrão CONAM',
  },
  {
    id: 125,
    nome: 'Padrão Comunix',
  },
  {
    id: 126,
    nome: 'Padrão e-Governe ISS',
  },
  {
    id: 127,
    nome: 'Padrão NF-Eletronica',
  },
  {
    id: 128,
    nome: 'Padrão Memory',
    xml_modelo_empresa: '11.438.136/0001-02 - SERRALHERIA GARCIA E INOX LTDA',
    xml_modelo:
      '<urn:tm_lote_rps_service.importarLoteRPS><xml><EnviarLoteRpsEnvio xmlns:xs="http://www.nfsebrasil.net.br/nfse/rps/xsd/rps.xsd"><LoteRps codMunicipio="3151503" versao="1" Id="1120"><NumeroLote>213</NumeroLote><Cnpj>11438136000102</Cnpj><InscricaoMunicipal>3810</InscricaoMunicipal><QuantidadeRps>1</QuantidadeRps><ListaRps><Rps><InfRps Id="1120"><IdentificacaoRps><Numero>1120</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-05-16T15:40:38</DataEmissao><NaturezaOperacao>1</NaturezaOperacao><Status>1</Status><Servico><Valores><ValorServicos>969.15</ValorServicos><ValorDeducoes>0.00</ValorDeducoes><ValorPis>0.00</ValorPis><ValorCofins>0.00</ValorCofins><ValorInss>0.00</ValorInss><ValorIr>0.00</ValorIr><ValorCsll>0.00</ValorCsll><IssRetido>2</IssRetido><ValorIss>0.00</ValorIss><OutrasRetencoes>0.00</OutrasRetencoes><Aliquota>0.00</Aliquota><DescontoIncondicionado>0.00</DescontoIncondicionado><DescontoCondicionado>0.00</DescontoCondicionado></Valores><CodigoTributacaoMunicipio>14.13</CodigoTributacaoMunicipio><CodigoCnae>3329501</CodigoCnae><Discriminacao>SERVICO A SER PRESTADO DE SERRALHERIA PARA MANUTENCAO DA UBS JOAQUIM TOMESERVICO HORA - Qtde: 25,955 - R$ 37,34</Discriminacao><CodigoMunicipio>3151503</CodigoMunicipio></Servico><Prestador><Cnpj>11438136000102</Cnpj><InscricaoMunicipal>3810</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cnpj>16781346000104</Cnpj></CpfCnpj></IdentificacaoTomador><RazaoSocial>PREFEITURA MUNICIPAL DE PIUMHI</RazaoSocial><Endereco><Endereco>RUA PADRE ABEL</Endereco><Numero>332</Numero><Bairro>CENTRO</Bairro><CodigoMunicipio>3151503</CodigoMunicipio><Uf>MG</Uf><Cep>37925000</Cep></Endereco><Email>sistemas@diginew.com.br</Email><Telefone>3733719200</Telefone></Tomador></InfRps></Rps></ListaRps></LoteRps></EnviarLoteRpsEnvio></xml><codMunicipio>3151503</codMunicipio><cnpjPrestador>11438136000102</cnpjPrestador><hashValidador>09e59b2c979ebf8d009a48c2043eee94</hashValidador></urn:tm_lote_rps_service.importarLoteRPS>',
  },
  {
    id: 129,
    nome: 'Padrão System',
  },
  {
    id: 130,
    nome: 'Padrão ISS Online AEG',
  },
  {
    id: 131,
    nome: 'Padrão ISS Simples SPCONSIG',
  },
  {
    id: 132,
    nome: 'Padrão SAATRI',
  },
  {
    id: 133,
    nome: 'Padrão INFISC Farroupilha',
  },
  {
    id: 134,
    nome: 'Padrão SIAM',
  },
  {
    id: 135,
    nome: 'Padrão NFSE-ECIDADES',
  },
  {
    id: 136,
    nome: 'Padrão DUETO 2.0',
    xml_modelo_empresa: '12.146.271/0001-39 - AUTO CENTER BLACK FILM ACESSÓR',
    xml_modelo:
      '<EnviarLoteRpsSincronoEnvio><LoteRps Id="Lote_397" versao="2.02"><NumeroLote>397</NumeroLote><CpfCnpj><Cnpj>12146271000139</Cnpj></CpfCnpj><InscricaoMunicipal>17206</InscricaoMunicipal><QuantidadeRps>1</QuantidadeRps><ListaRps><Rps><InfDeclaracaoPrestacaoServico Id="Rps_2001"><Rps><IdentificacaoRps><Numero>200</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-06-06</DataEmissao><Status>1</Status></Rps><Competencia>2025-06-06</Competencia><Servico><Valores><ValorServicos>160.00</ValorServicos><Aliquota>3.00</Aliquota></Valores><IssRetido>2</IssRetido><ItemListaServico>14.01</ItemListaServico><CodigoCnae>3314712</CodigoCnae><CodigoTributacaoMunicipio>3314712</CodigoTributacaoMunicipio><Discriminacao>SERVICO MECANICO - Qtde: 1 - R$ 160,00</Discriminacao><CodigoMunicipio>3131703</CodigoMunicipio><ExigibilidadeISS>1</ExigibilidadeISS><MunicipioIncidencia>3131703</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>12146271000139</Cnpj></CpfCnpj><InscricaoMunicipal>17206</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cpf>05933738638</Cpf></CpfCnpj></IdentificacaoTomador><RazaoSocial>FAGNER SANTIAGO</RazaoSocial><Endereco><Endereco>Rua Grafite</Endereco><Numero>180</Numero><Bairro>Major Lage de Baixo</Bairro><CodigoMunicipio>3131703</CodigoMunicipio><Uf>MG</Uf><Cep>35900222</Cep></Endereco></Tomador><RegimeEspecialTributacao>6</RegimeEspecialTributacao><OptanteSimplesNacional>1</OptanteSimplesNacional><IncentivoFiscal>2</IncentivoFiscal></InfDeclaracaoPrestacaoServico></Rps></ListaRps></LoteRps></EnviarLoteRpsSincronoEnvio>',
  },
  {
    id: 137,
    nome: 'Padrão CENTI',
  },
  {
    id: 138,
    nome: 'Padrão COPLAN',
  },
  {
    id: 139,
    nome: 'Padrão SISNFe BAURU',
  },
  {
    id: 140,
    nome: 'Padrão JGBAIAO',
  },
  {
    id: 141,
    nome: 'Padrão Primax Online',
  },
  {
    id: 142,
    nome: 'Padrão VLCNET',
  },
  {
    id: 143,
    nome: 'Padrão GENFE',
  },
  {
    id: 144,
    nome: 'Padrão SysISS',
  },
  {
    id: 145,
    nome: 'Padrão NF Eletrônica 2.0',
  },
  {
    id: 146,
    nome: 'Padrão Betha 2.0',
    xml_modelo_empresa: '49.980.341/0001-60 - SUPERPET SAO FRANCISCO - CONSE',
    xml_modelo:
      '<EnviarLoteRpsSincronoEnvio xmlns="http://www.betha.com.br/e-nota-contribuinte-ws"><LoteRps Id="LOT" versao="2.02"><NumeroLote>1704</NumeroLote><CpfCnpj><Cnpj>49980341000160</Cnpj></CpfCnpj><InscricaoMunicipal>803139</InscricaoMunicipal><QuantidadeRps>1</QuantidadeRps><ListaRps><Rps><InfDeclaracaoPrestacaoServico Id="RPS"><Rps><IdentificacaoRps><Numero>1389</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-06-07</DataEmissao><Status>1</Status></Rps><Competencia>2025-06-07</Competencia><Servico><Valores><ValorServicos>55.00</ValorServicos><Aliquota>3.0000</Aliquota></Valores><IssRetido>2</IssRetido><ItemListaServico>0508</ItemListaServico><CodigoCnae>9609208</CodigoCnae><CodigoTributacaoMunicipio>9609208</CodigoTributacaoMunicipio><Discriminacao>BANHO PUG PEQUENO ATÉ 10KG Qtd.: 1 Valor Unit.: R$ 55,00;</Discriminacao><CodigoMunicipio>3118304</CodigoMunicipio><ExigibilidadeISS>1</ExigibilidadeISS><MunicipioIncidencia>3118304</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>49980341000160</Cnpj></CpfCnpj><InscricaoMunicipal>803139</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cpf>07485279661</Cpf></CpfCnpj></IdentificacaoTomador><RazaoSocial>Roberta Aparecida Siqueira de Castro</RazaoSocial><Endereco><Endereco>Rua São Cristóvão</Endereco><Numero>334</Numero><Bairro>ALVORADA</Bairro><CodigoMunicipio>3118304</CodigoMunicipio><Uf>MG</Uf><Cep>36407048</Cep></Endereco><Contato><Telefone>31993096372</Telefone><Email>roberta.asc10@gmail.com</Email></Contato></Tomador><RegimeEspecialTributacao>1</RegimeEspecialTributacao><OptanteSimplesNacional>1</OptanteSimplesNacional><IncentivoFiscal>2</IncentivoFiscal></InfDeclaracaoPrestacaoServico></Rps></ListaRps></LoteRps></EnviarLoteRpsSincronoEnvio>',
  },
  {
    id: 147,
    nome: 'Padrão GESPAM',
  },
  {
    id: 148,
    nome: 'Padrão SIGCORP MOGI GUAÇU',
  },
  {
    id: 149,
    nome: 'Padrão DATAPUBLIC',
  },
  {
    id: 150,
    nome: 'Padrão ISANETO',
  },
  {
    id: 151,
    nome: 'Padrão Sigcorp São João de Meriti',
  },
  {
    id: 152,
    nome: 'Padrão NFSD',
  },
  {
    id: 153,
    nome: 'Padrão Embras Siap.Net',
  },
  {
    id: 154,
    nome: 'Padrão GIAP',
  },
  {
    id: 155,
    nome: 'Padrão SMARAPDSil WS2',
  },
  {
    id: 156,
    nome: 'Padrão SigCORP Governador Valadares',
  },
  {
    id: 157,
    nome: 'Padrão Tiplan 2.0',
  },
  {
    id: 158,
    nome: 'Padrão DEISS WS',
  },
  {
    id: 159,
    nome: 'Padrão INFISC Bom Princípio',
  },
  {
    id: 160,
    nome: 'Padrão SafeWeb',
  },
  {
    id: 161,
    nome: 'Padrão SIAP',
  },
  {
    id: 162,
    nome: 'Padrão ASPEC',
  },
  {
    id: 163,
    nome: 'Padrão Awatar WS',
  },
  {
    id: 164,
    nome: 'Padrão NF-em Joinville',
  },
  {
    id: 165,
    nome: 'Padrão Sigcorp Abrasf',
    xml_modelo_empresa: '43.734.344/0001-37 - VOLCANIA MG PECAS E SERVICOS',
    xml_modelo:
      '<EnviarLoteRpsSincronoEnvio xmlns="http://www.abrasf.org.br/nfse.xsd"><LoteRps versao="2.04"><NumeroLote>1028</NumeroLote><Prestador><CpfCnpj><Cnpj>43734344000137</Cnpj></CpfCnpj><InscricaoMunicipal>94997</InscricaoMunicipal></Prestador><QuantidadeRps>1</QuantidadeRps><ListaRps><Rps><InfDeclaracaoPrestacaoServico Id="inf_2581"><Rps><IdentificacaoRps><Numero>2581</Numero><Serie>1</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2025-06-05</DataEmissao><Status>1</Status></Rps><Competencia>2025-06-05</Competencia><Servico><Valores><ValorServicos>460.00</ValorServicos><ValorIss>13.80</ValorIss><Aliquota>3.0000</Aliquota></Valores><IssRetido>2</IssRetido><ItemListaServico>14.01</ItemListaServico><CodigoCnae>4520001</CodigoCnae><CodigoTributacaoMunicipio>4520001</CodigoTributacaoMunicipio><Discriminacao>Veiculo: VOLVO FH 540 Placa: QQV2F18 - LEITURA COMPUTADOR Qtd.: 1 Valor Unit.: R$300,00; SUBST FILTRO DIESEL RACOR Qtd.: 1 Valor Unit.: R$80,00; SUBST DE FILTRO SECADOR Qtd.: 1 Valor Unit.: R$80,00;</Discriminacao><CodigoMunicipio>3152501</CodigoMunicipio><ExigibilidadeISS>1</ExigibilidadeISS><MunicipioIncidencia>3152501</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>43734344000137</Cnpj></CpfCnpj><InscricaoMunicipal>94997</InscricaoMunicipal></Prestador><TomadorServico><IdentificacaoTomador><CpfCnpj><Cnpj>18304908000154</Cnpj></CpfCnpj></IdentificacaoTomador><RazaoSocial>DONELLY LOGISTICA E TRANSPORTES LTDA</RazaoSocial><Endereco><Endereco>RUA ANTONIO FURTANDO</Endereco><Numero>70</Numero><Bairro>CENTRO</Bairro><CodigoMunicipio>3122405</CodigoMunicipio><Uf>MG</Uf><Cep>37142000</Cep></Endereco></TomadorServico><RegimeEspecialTributacao>1</RegimeEspecialTributacao><OptanteSimplesNacional>2</OptanteSimplesNacional><IncentivoFiscal>2</IncentivoFiscal></InfDeclaracaoPrestacaoServico></Rps></ListaRps></LoteRps></EnviarLoteRpsSincronoEnvio>',
  },
  {
    id: 166,
    nome: 'Padrão DSF 1',
  },
  {
    id: 167,
    nome: 'Padrão H2M Soluções',
  },
  {
    id: 168,
    nome: 'Padrão Gefisco',
  },
  {
    id: 169,
    nome: 'Padrão SISGENFe',
  },
  {
    id: 170,
    nome: 'Padrão Public Soft',
  },
  {
    id: 171,
    nome: 'Padrão ISS.MAP',
  },
  {
    id: 172,
    nome: 'Padrão ADM Nota Fiscal',
  },
  {
    id: 173,
    nome: 'Padrão Ágape',
  },
  {
    id: 174,
    nome: 'Padrão Município Eletrônico',
  },
  {
    id: 175,
    nome: 'Padrão Tchê Informática',
  },
  {
    id: 176,
    nome: 'Padrão Bauhaus',
  },
  {
    id: 177,
    nome: 'Padrão NFServiço',
  },
  {
    id: 178,
    nome: 'Padrão Belga NFSe',
  },
  {
    id: 179,
    nome: 'Padrão SS Informática',
  },
  {
    id: 180,
    nome: 'Padrão XTROnline',
  },
  {
    id: 181,
    nome: 'Padrão Elmar Tecnologia',
  },
  {
    id: 182,
    nome: 'Padrão Kalana',
  },
  {
    id: 183,
    nome: 'Padrao NFE-HD',
  },
  {
    id: 184,
    nome: 'Padrão Caucaia – WS',
  },
  {
    id: 185,
    nome: 'Padrão EBM Informática',
  },
  {
    id: 186,
    nome: 'Padrão Datapublic Webservice',
  },
  {
    id: 187,
    nome: 'Padrão Horus ISS',
  },
];
export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.nfse_padroes)
    .insert(
      padroesNfse.map((p) => ({ id: p.id, nome: p.nome, xml_modelo: p.xml_modelo || null, xml_modelo_empresa: p.xml_modelo_empresa || null, ativo: true })),
    )
    .then(() => {
      Util.Log.info(`# Inseridos ${padroesNfse.length} registros na tabela ${ETableNames.nfse_padroes}`);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex(ETableNames.nfse_padroes)
    .whereIn(
      'id',
      padroesNfse.map((p) => p.id),
    )
    .del()
    .then(() => {
      Util.Log.info(`# Removidos ${padroesNfse.length} registros da tabela ${ETableNames.nfse_padroes}`);
    });
}
