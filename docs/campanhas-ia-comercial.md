# Campanhas, privacidade e proteção — revisão 1.10.0

Conteúdo e visual aprovados pelo usuário em 31/10/2026. A demonstração entra
na seção Campanhas da homepage, em quatro abas independentes das abas de gestão.
HTML/CSS/JS nativos, imagens locais otimizadas e nenhuma dependência de execução
adicionada. Cadastro público, configuração comercial, API do Manager, Nginx e
infraestrutura permanecem com o contrato existente.

## Mensagem comercial

- A IA gera duas opções de fundo para a arte e personaliza a abertura da mensagem
  com o nome e o histórico disponível. A oferta, os valores e a validade continuam
  sob controle do salão. Sem histórico, não inventar uma relação anterior.
- O WhatsApp da cliente mostra imagem, abertura, oferta e saída. “Quero agendar”
  continua a conversa com o contexto da campanha; “Sim, agendar” confirma a
  proposta. Não apresentar um horário como reservado antes da confirmação.
- “SAIR” interrompe promoções, confirmações, lembretes e pesquisas automáticas.
  “Não quero receber promoções” interrompe apenas campanhas. A preferência fica
  registrada e é conferida antes de novos envios.
- Contato responsável: intervalo mínimo de sete dias entre campanhas para a mesma
  pessoa, limite diário e janela de envio. Não prometer disparos ilimitados.
- LGPD: recursos que ajudam o salão a cuidar da privacidade e atender à lei.
  Não afirmar certificação ou conformidade automática. O público considera a
  permissão registrada; o produto também tem valores padrão e autorizações
  herdadas, portanto não afirmar exigência universal de novo aceite explícito.
- Segurança: Cloudflare como proteção adicional, conforme informação do usuário
  e presença do proxy/túnel na infraestrutura. Não alegar imunidade a invasões,
  disponibilidade absoluta, certificações ou configurações de WAF não verificadas.
- Preservar o fechamento “Feita por quem entende seu negócio. E valoriza seu
  tempo e talento”, os recursos incluídos, suporte e contratação sem fidelidade.

## Imagens e procedência

`campanha-arte-ia-1.webp` e `campanha-arte-ia-2.webp` são composições comerciais
ilustrativas, feitas em HTML/CSS sobre dois fundos gerados por ImageGen para o
estudo aprovado. Não representam uma geração executada dentro da LUNA. A
LUNA oferece a geração de fundo e a composição da oferta, mas o visual do
modelo selecionado pode variar.

`campanha-whatsapp-convite.webp`, `campanha-whatsapp-agendamento.webp`,
`campanha-whatsapp-confirmado.webp` e `campanha-whatsapp-saida.webp` são capturas
da simulação HTML/CSS aprovada. Não são prints do aplicativo WhatsApp, envios
reais ou provas de execução da IA. Legendas e textos alternativos deixam a
natureza ilustrativa explícita. O contato é o salão; mensagens da cliente
aparecem à direita. Os controles internos ficam na visão real da LUNA.

A captura `campanhas-desktop.webp` e sua versão móvel continuam sendo telas
reais da LUNA no tema Élevé, com dados fictícios. As seis imagens novas somam
aproximadamente 493 KiB, são carregadas sob demanda e podem ser ampliadas.

Oferta fictícia: hidratação com 15% de desconto, de R$ 120 por R$ 102, válida
de 03 a 12/11/2026. Proposta para 05/11/2026 às 14h, com Ana. Não é preço da
assinatura nem condição de trial da LUNA.

Fontes técnicas verificadas na LUNA 1.45.0, commit `629015c`:

- `docs/campanhas.md` e `src/modulos/campanhas/`: composição, fundos, aberturas,
  público, ritmo e continuidade da campanha.
- `src/modulos/assistente/dominio/propostas.ts`: botão “Sim, agendar”.
- `src/modulos/conversas/aplicacao/receber.ts`: saída geral e saída de promoções.
- `src/modulos/voz/dominio/textos.ts`: respostas reais de confirmação da saída.
- [ANPD — direitos dos titulares](https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares).

Estudo, fontes e capturas no workspace deste chat:
`outputs/luna-campanhas-previa-20261031` e `work/luna-campanhas-20261031`.
Nenhum dado real de cliente ou credencial foi usado, e nenhuma mensagem foi enviada.

## Validação e publicação

As abas são isoladas por `role=tablist`, evitando que a demonstração esconda os
painéis de gestão. A validação de navegadores cobre essa independência, teclado,
ampliação das seis imagens, navegação móvel e ausência de transbordamento.
Versão, digest, CI e evidências efetivas de publicação: [publicacao.md](publicacao.md).
