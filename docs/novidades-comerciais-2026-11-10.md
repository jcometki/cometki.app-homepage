# Sinal, retorno e conferência assistida — 10/11/2026

Aplicação da prévia aprovada pelo usuário, com publicação autorizada da homepage.
Base comercial conferida no LUNA **1.85.4**, commit `5d538906` de `origin/main`.
O checkout compartilhado do aplicativo e o Manager não foram alterados.

## Conteúdo

- Sinal por Pix: regras por serviço, dia e público, valor fixo ou percentual; a IA explica antes da reserva e o sinal acompanha o atendimento.
- Retorno: intervalo por serviço, convite pelo WhatsApp e continuidade com a assistente. Somente para quem aceita promoções, sem agendamento, no máximo um lembrete por semana e sem campanha na mesma semana; respeita saída.
- Comprovantes: leitura de valor, data e recebedor, indicação de divergências e conferência pela equipe. Um comprovante elegível sem alertas pode confirmar a reserva automaticamente. Isso não é conciliação bancária nem garantia de autenticidade.
- A reserva começa a contar seu prazo após o envio válido do Pix. Comprovante elegível pendente de revisão mantém a reserva. A equipe define as condições do sinal.
- Reforço de histórico e preferências na conversa, leitura de boletos/contas e uso da agenda com o celular deitado.

Fontes: `docs/recursos.md`, `docs/sinal.md`, `docs/pix.md`, módulo de automações e guias de suporte da versão citada. Não foram acrescentadas promessas de resultados, preços de assinatura, IA ilimitada, prazo de trial, garantia de disponibilidade ou confirmação bancária automática.

## Direção visual preservada

Cliente: WhatsApp ilustrativo, com conversa roteirizada e dados fictícios. Salão: telas reais da aplicação, tema Élevé. O novo exemplo do sinal usa HTML acessível, sem texto rasterizado, para manter a leitura no celular. O retorno usa fundo areia e texto café; os demais destaques mantêm a paleta da homepage.

Permanecem campanhas com geração de fundos por IA e aberturas personalizadas, saída das mensagens, suporte incluído, infraestrutura individual, contratação sem fidelidade, condições claras de uso de IA e o fechamento “Feita por quem entende seu negócio”. A única assinatura da empresa permanece no rodapé.

As ampliações agora informam a procedência de cada imagem: aplicativo real, WhatsApp ilustrativo ou composição de campanha. Antes, o rodapé fixo do visualizador chamava todas as imagens de interface real.

## Capturas e proteção dos dados

Aplicação exata da versão publicada, extraída para uma pasta temporária, com MariaDB descartável e dados de `tests/prints/preparar.ts`. IA externa, WhatsApp e worker desligados; e-mail simulado. Nenhuma conversa enviada, nenhuma campanha ativada e nenhum dado real usado.

Foram recapturados agenda, conversas, criação de campanha, financeiro, pagamento da equipe, clientes e início no celular. Também foram refeitos sinal, lembrete de retorno, comprovante, notificação de atraso e ficha com referência do penteado/aniversário. Os dados de análise e conversa são roteirizados; as telas são reais. A notificação e o vínculo da foto/observações foram produzidos pelos fluxos de domínio da aplicação no banco fictício.

A imagem do exemplo de ajuda usa a Agenda atual; não é apresentada como captura de uma sessão real de suporte. Os guias são descritos conforme o produto. Imagens de WhatsApp e fundos de campanha já aprovados foram preservados; suas datas são exemplos ilustrativos. A tela de criação representa uma nova oferta de demonstração, com o mesmo desconto e valores, não a execução de uma campanha real.

As imagens novas foram convertidas para WebP. As anteriores permanecem no repositório para histórico, sem referências na página quando substituídas. O manifesto `capturas-2026-11-10.json` registra tamanhos, hashes e procedência.

## Publicação

O site continua estático, servido por Nginx. Cadastro de trial, disponibilidade, políticas de cache, segurança, domínio e integração com Manager foram preservados. A promoção usa a imagem versionada validada pela CI e altera somente a referência de imagem no manifesto GitOps.
