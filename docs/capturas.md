# Capturas reais no tema Élevé

Desde a revisão 1.9.0, a homepage combina **capturas reais da LUNA para a visão
do salão** com **conversas ilustrativas do WhatsApp para a visão da cliente**.
Os três arquivos `whatsapp-*.png` são simulações aprovadas, não capturas reais.
Ver a [regra visual, auditoria e procedência](whatsapp-comercial.md). As imagens
anteriores das conversas ficam preservadas como referência histórica.

As imagens da homepage foram capturadas no aplicativo LUNA em execução local, a partir do checkout jcometki/luna, versão v1.21.0, commit 0ab68d1, em 23/10/2026. Uma cópia isolada desse commit foi usada para preservar o checkout em uso por outros chats.

O aplicativo usou um banco MariaDB descartável e separado, com o seed Studio Aurora e dados fictícios adicionais. O tema foi selecionado pela configuração real da empresa: eleve. Nenhum componente da interface foi redesenhado para parecer um print.

## Conteúdo

| Arquivo | Origem | Tela |
| --- | --- | --- |
| agenda-desktop.webp | /agenda | Grade diária por profissional |
| agenda-celular.webp | /agenda, visão lista | Agenda adaptada ao celular |
| conversas-desktop.webp | /conversas/{id} | Atendimento da assistente e lista de conversas |
| conversas-celular.webp | /conversas/{id} | Conversa na interface móvel |
| financeiro-*.webp | /financeiro | Resultado, recebimentos e contas a pagar |
| campanhas-*.webp | /campanhas/{id} | Criação da oferta: serviço, desconto e período |
| equipe-*.webp | /financeiro/equipe | Comissões e pagamentos |
| clientes-*.webp | /clientes | Cadastro e busca |
| inicio-celular.webp | /painel | Resumo do dia no celular |

Os prints de desktop usam viewport de 1440 × 960. Os móveis usam 390 × 780, com 390 × 844 para a conversa. O formato WebP preserva o conteúdo; a moldura de aparelho pertence à homepage, fora da captura.

Nomes, agendamentos, pagamentos e mensagens são demonstrações. A conversa com a assistente é um roteiro fictício, gravado no ambiente demonstrativo e renderizado pelo aplicativo real. Não representa um atendimento a cliente real nem uma execução ao vivo da IA. As integrações externas e o worker ficaram desligados.

## Jornadas com IA — revisão 1.8.0, 31/10/2026

A terceira prévia comercial usa a versão 1.44.0, commit
`ffc136d3360da25ccdee9294baeb99dacc515dc7`, em cópia isolada. Estes novos prints
foram aprovados e incorporados à homepage em `assets/imagens/`. Ver [decisões comerciais e
limites da demonstração](jornadas-com-ia-comercial.md).

| Arquivo | Origem | Conteúdo |
| --- | --- | --- |
| atraso-conversa.png | `/conversas/{id}` | Lembrete, resposta da cliente sobre atraso e retorno roteirizado da assistente |
| atraso-notificacao-detalhe.png | `/notificacoes`, perfil profissional | Recorte da central com o aviso gerado pela ferramenta real de atraso |
| referencia-conversa.png | `/conversas/{id}` | Foto ilustrativa, contexto do aniversário e confirmação demonstrativa |
| referencia-atendimento.png | `/atendimentos/{id}`, painel da ficha | Atendimento aberto, observações herdadas do agendamento e foto vinculada |

Captura móvel de 430 px de largura com escala 2. Alturas de viewport de 720 px
para o atraso e 1180 px para a referência; recorte direto da ficha em 1100 px e
da notificação em 215 px. O campo de observações foi expandido com o controle
nativo do navegador. Apenas a sobreposição de desenvolvimento do Next foi
omitida nas capturas. Não se alterou o DOM do produto para criar conteúdo.

A imagem `referencia-penteado.png` foi gerada com ImageGen exclusivamente como
referência fictícia de penteado dentro da conversa. Ela não representa uma
cliente real nem um resultado produzido pelo salão. O prompt e a procedência
estão em `PROCEDENCIA.md` na entrega da prévia. Conversas e análise da imagem
foram roteirizadas; o app executou as regras de aviso, vínculo de foto e abertura
do atendimento com integrações externas desligadas.

## Atualizar

A seção Ajuda, incluída em 31/10/2026, usa `manual-agenda-eleve.png`, cópia
integral de `luna/docs/suporte/imagens/agenda.novo-agendamento.celular.1.png`
do commit `ffc136d3360da25ccdee9294baeb99dacc515dc7`. A imagem tem 824 × 1678 px
e foi produzida pelo fluxo de prints do manual do próprio aplicativo. O preparo
em `tests/prints/preparar.ts` usa tema Élevé e dados fictícios; a legenda e o
destino estão em `docs/suporte/imagens/imagens.json`.

A homepage mostra um recorte por CSS e abre a imagem completa ao ampliar.
Ela é identificada como **print do manual**, não como captura da janela de
ajuda ou de uma resposta real da IA. O destaque do botão + pertence à imagem
original do guia. Nenhum print foi redesenhado, e nenhum dado real foi acessado.

1. Criar banco local descartável e aplicar as migrations do aplicativo.
2. Usar o seed de demonstração, nunca banco ou dados de produção.
3. Ativar o tema Élevé na configuração da empresa.
4. Preparar exemplos coerentes com os recursos disponíveis.
5. Entrar como proprietária e capturar as telas de desktop e celular.
6. Conferir textos, recortes, ausência de dados reais e conteúdo comercial.
7. Converter para WebP, preservar resolução e atualizar os arquivos.
8. Atualizar esta procedência e repetir a revisão visual da homepage.

Paleta do **aplicativo nos prints**: fundo #121010, superfície #1d1816, texto #f6eddc, texto suave #bfae92, borda #3a2f25 e principal #d4a853.

A homepage usa uma interpretação mais clara do Élevé: café `#342c25`, superfície `#44392f`, areia `#c4ac8b` e dourado `#edc77e`. As cores do aplicativo não foram alteradas. A campanha mostrada é um rascunho fictício; nenhuma mensagem foi enviada. As capturas de 23/10 permanecem em WebP sem perda; o manual, as jornadas posteriores e as ilustrações de WhatsApp usam PNG.
