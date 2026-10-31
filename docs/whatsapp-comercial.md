# Ponto de vista das imagens comerciais

Decisão aprovada pelo usuário em 31/10/2026 para publicação na revisão 1.9.0 e
para as próximas atualizações: **visão da cliente no WhatsApp; visão do salão
na LUNA, com o tema Élevé**. A imagem deve acompanhar o ponto de vista do texto,
não apenas a presença da palavra WhatsApp na seção.

## Auditoria dos prints atuais

| Posição | Perspectiva | Decisão |
| --- | --- | --- |
| Celular da abertura | Cliente recebendo a mensagem | WhatsApp ilustrativo, com os botões do pedido de confirmação |
| Agenda ao fundo da abertura | Operação do salão | Preservar captura real da LUNA |
| Painel de conversas, desktop e celular | Equipe acompanha a IA e pode assumir | Preservar LUNA; título e legenda explicitam a visão da equipe |
| Jornada de atraso, conversa | Cliente recebe lembrete e responde | WhatsApp ilustrativo da Carla |
| Jornada de atraso, aviso | Profissional recebe informação | Preservar central real da Ana na LUNA |
| Referência e aniversário, conversa | Cliente envia foto e contexto | WhatsApp ilustrativo da Júlia; descrição automática não aparece na conversa da cliente |
| Referência, atendimento aberto | Profissional usa foto e observações | Preservar ficha real da LUNA |
| Campanhas, desktop e celular | Salão cria e configura oferta | Preservar LUNA; legenda explicita criação da campanha pelo salão |
| Agenda, financeiro, comissões e clientes, nas abas | Gestão do salão | Preservar capturas reais da LUNA |
| Resumo do dia no celular | Gestão móvel | Preservar painel real da LUNA |
| Manual integrado | Equipe aprende a usar o aplicativo | Preservar print real do manual, com seu destaque original |

Todos esses arquivos foram inspecionados, incluindo as versões móveis. Não
aplicar a nova imagem da abertura ao painel de conversas: ambos usavam
`conversas-celular.webp`, mas mostram perspectivas diferentes. Os novos assets
têm nomes próprios.

## Proveniência e limites

`whatsapp-confirmacao.png`, `whatsapp-atraso.png` e `whatsapp-referencia.png`
são renderizações HTML/CSS da prévia aprovada, com dados fictícios. Não são
capturas do aplicativo WhatsApp nem comprovam um envio ou execução real de IA.
As legendas públicas usam “WhatsApp ilustrativo” / “Conversa ilustrativa no
WhatsApp”; os textos alternativos usam “Simulação visual”. As capturas reais
da LUNA continuam identificadas separadamente. Nenhum dado de cliente ou
credencial foi acessado, e nenhuma mensagem foi enviada.

A foto de penteado reutiliza a ilustração gerada por IA documentada em
[jornadas-com-ia-comercial.md](jornadas-com-ia-comercial.md). Não adicionar selos
de verificação ao salão nem atribuir aprovação da Meta. Para apresentar uma
imagem como **print real do WhatsApp**, capturar o aplicativo em uma conta de
teste, com destinatário autorizado. A renderização de botões pode variar conforme
o aparelho/versão.

Fontes do estudo e relatório local:
`outputs/luna-whatsapp-previa-20261031` no workspace deste chat. Contém
`gerar-previa.py`, CSS, JS, HTML autônomo, a cópia da homepage e procedência.
Referência visual externa: [documentação de botões WhatsApp da Twilio](https://www.twilio.com/docs/whatsapp/buttons).
Nenhuma imagem externa foi copiada; a integração da LUNA não foi alterada.

## Botões e narrativa

Conferidos na LUNA 1.45.0, commit `629015c`:

- Pedido de confirmação: **Confirmar**, **Reagendar**, **Cancelar**, conforme
  `src/modulos/automacoes/dominio/regras.ts`, `botoesDaConfirmacao`.
- Lembrete: mensagem sem botões. A resposta sobre atraso continua com a IA,
  conforme `src/modulos/automacoes/aplicacao/envio.ts`, `enviarLembrete`.
- Proposta de novo agendamento: **Sim, agendar**, conforme
  `src/modulos/assistente/dominio/propostas.ts`. O cenário da referência mantém
  a confirmação por texto do roteiro anterior.
- Campanha recebida pela cliente: **Quero agendar**. Uma futura demonstração
  da campanha recebida deve mostrar WhatsApp, ao lado da criação/gestão na LUNA.

No WhatsApp da cliente, o contato é o salão; suas mensagens aparecem à direita.
Análise de imagem, controles da assistente, notificações internas e observações
da ficha pertencem à visão do salão. Não transferir esses elementos ao WhatsApp.

## Publicação

A revisão 1.9.0 troca três imagens e ajusta os rótulos, sem alterar o cadastro,
o Manager, botões comerciais, JavaScript de produção ou configuração Nginx.
Ver [publicação](publicacao.md) para versão, digest e rollback efetivos.
