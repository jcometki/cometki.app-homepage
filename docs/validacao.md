# Validação da homepage

## Atualização comercial 1.1 — 23/10/2026

Capturas renovadas a partir da LUNA v1.21.0 (`0ab68d1`) em ambiente isolado,
com dados fictícios e integrações externas desligadas. Incluídos campanhas
com IA, contas a pagar, taxas/repasses e relatórios; veja as
[decisões comerciais e visuais](atualizacao-comercial-1.1.md).

- Chromium: 320, 360, 390, 430, 768, 1024, 1440 e 1920 px.
- WebKit: 390, 768 e 1440 px.
- Nas 11 combinações: sem rolagem horizontal, erro JavaScript, erro de CSP
  ou recurso ausente. Menu, quatro abas, imagens ampliadas, retorno de foco,
  privacidade e links comerciais conferidos.
- Ampliação da nova captura de campanhas validada com `currentSrc`, tanto
  no desktop quanto na seleção da imagem móvel pelo `picture`.
- Conteúdo principal e contato conferidos com JavaScript desligado.
- axe-core / WCAG 2 A/AA e 2.1 A/AA: nenhuma violação detectada em 390 e
  1440 px, nos dois motores. Auditoria automática não é certificação.
- Revisão visual de abertura, campanhas, atendimento com IA e gestão,
  nas capturas completas e nas seções em desktop e celular.
- Nginx validado em contêiner sem privilégios e com filesystem somente leitura.
  Os 11 testes Python passaram com HTTP, incluindo saúde, assets, cache,
  compressão, CSP e bloqueio das rotas privadas.

A revisão corrigiu uma decoração que extrapolava a largura de 1024 px e
escureceu o destaque pequeno da seção areia para atingir contraste AA.
Os testes de navegação e contraste foram repetidos depois dessas correções.
Não foram enviados contatos pelo WhatsApp nem realizadas chamadas pagas de IA.

A revisão 1.1.1 reforçou a autonomia da IA no título, na abertura, na explicação
de campanhas e na FAQ. Os 11 testes HTTP e as 11 combinações de navegador/tela
foram repetidos após a alteração de texto e da imagem de compartilhamento,
sem falhas. A abertura foi revisada visualmente em 390 e 1440 px.

### Publicação da revisão 1.1.1

Confirmada em 23/10/2026 no endereço `https://luna.cometki.app/`:

- Imagem `jcometki/luna:homepage-1.1.1`, digest
  `sha256:b1f9bf4bb2112ffc143c48c6efbaeb8116591123e9c5f6705ac7826cc39e9225`.
- Código `b54ea1b`; validação GitHub `39956580207` e publicação `39956692858`,
  ambas concluídas com sucesso.
- GitOps `c847f0f`: somente o campo de imagem do Deployment foi alterado,
  usando o SHA anterior do arquivo como controle de concorrência. O checkout
  compartilhado da infraestrutura foi preservado.
- Os três testes do contrato GitOps passaram com o novo manifesto.
- HTML público idêntico ao arquivo aprovado; os 19 assets referenciados
  conferidos byte a byte pelas URLs usadas na página, incluindo suas versões
  de cache. `/saude` respondeu `ok`; TLS validado sem exceção de certificado.

A versão 1.1.0 com o novo visual passou também pelas 11 combinações no domínio
público. A revisão 1.1.1 mantém esse layout e teve a abertura conferida no
navegador público em 390 e 1440 px. A conferência operacional desta entrega
foi feita por HTTPS; não foi possível consultar a API Kubernetes a partir
do contexto local disponível, portanto não se afirma uma leitura interna
dos estados Ready do Deployment ou da Kustomization nesta rodada.

## Histórico da primeira versão

Executada em 12/10/2026 sobre o site servido pela imagem Nginx, em ambiente local.

## Responsividade e navegadores

| Motor | Larguras verificadas |
| --- | --- |
| Chromium | 320, 360, 390, 430, 768, 1024, 1440 e 1920 px |
| WebKit | 390, 768 e 1440 px |

Nas 11 combinações, a largura do documento correspondeu à viewport, sem rolagem horizontal. As imagens visíveis foram carregadas e decodificadas. Fontes locais e imagens responsivas funcionaram.

Revisão visual das capturas completas de desktop e celular, incluindo abertura, seção de IA, galeria e seção de uso no celular.

## Interações

Verificadas nos dois motores:

- Abrir e fechar menu móvel por botão, link e tecla Esc.
- Selecionar as quatro abas por clique e teclado, incluindo setas, Home e End.
- Abrir os quatro prints da galeria, fechar por Esc e retornar o foco ao botão de origem.
- Exibir a chamada móvel após a abertura e recolhê-la quando a chamada final aparece.
- Abrir e fechar a informação de privacidade.
- Conferir o destino de todos os links comerciais: WhatsApp +55 67 99293-8193.
- Carregar título, conteúdo principal e contato com JavaScript desligado.

A revisão no WebKit identificou que cliques nem sempre transferem foco ao botão. O visualizador agora guarda explicitamente o botão de origem, garantindo o retorno ao fechar.

## Acessibilidade

Auditoria automatizada axe-core com regras WCAG 2 A/AA e WCAG 2.1 A/AA em 390 e 1440 px, nos dois motores: **nenhuma violação detectada**.

Há link para pular ao conteúdo, foco visível, diálogos nativos, nomes acessíveis, navegação por teclado nas abas, textos alternativos e respeito à preferência por movimento reduzido.

A auditoria automatizada não equivale a certificação nem substitui testes com leitores de tela e dispositivos físicos.

## Entrega HTTP

- Configuração validada com nginx -t.
- Contêiner saudável com filesystem somente para leitura e diretórios temporários em tmpfs.
- Página principal e /saude respondem 200.
- Rota inexistente e /api/trials respondem 404.
- Documentação do repositório não é incluída na imagem pública.
- Arquivos ocultos protegidos.
- Compressão gzip de CSS conferida.
- Cache dos assets, revalidação do HTML e cabeçalhos de segurança conferidos.
- Nenhum erro JavaScript, recurso ausente ou erro de CSP durante os testes de navegador.
- IDs, âncoras e referências a arquivos do HTML conferidos.

## Limites

- Não houve publicação em domínio público, configuração de DNS ou teste em aparelho físico.
- Os testes conferiram o link comercial, sem enviar mensagens pelo WhatsApp.
- A integração de trials com o Manager está documentada e tem ponto de configuração, mas não está implementada.
- Os prints mostram a interface real do LUNA com dados fictícios; a conversa ilustrativa não é uma chamada de IA ao vivo.

## Publicação na Cometki em 12 de outubro de 2026

Endereço definitivo: **https://luna.cometki.app/**. A imagem implantada é
`jcometki/luna:homepage-1.0.3`, fixada no GitOps pelo digest
`sha256:afdfa1ed0f889aea899a2665c94549d8a5016d8415bbec326116824189ddfd76`.
Fonte da imagem: commit `1597124`; entrega original: `6a04a92`.
O visual e o conteúdo foram preservados, com a correção solicitada do espaço
em “merece ser” no item 04 da aba Clientes, inclusive quando a quebra de linha
fica oculta no celular.

- CI de validação e publicação concluídos; Actions e base Nginx fixadas por SHA/digest.
- Deployment disponível sem reinícios; as 25 Kustomizations Flux ficaram Ready.
- Página, saúde e todos os assets validados por HTTP; arquivos conferidos contra
  o checkout, incluindo fontes e imagem de compartilhamento.
- TLS verificado pelo edge público Cloudflare e por conexão direta ao IP LAN,
  sem desabilitar validação de certificados. Não houve alteração de DNS,
  túnel ou certificado wildcard existentes.
- HTML/configuração revalidáveis, cache de assets, gzip e cabeçalhos conferidos.
- `/api/`, documentação, arquivos ocultos e rotas administrativas não publicados.
- Testes locais repetidos em Chromium nas oito larguras e WebKit nas três
  larguras da tabela, com menu, abas, diálogos, imagens e WhatsApp.
- Chromium repetiu as oito larguras e WebKit as três larguras no endereço HTTPS
  de produção, sem erros de JavaScript, assets ou CSP. O texto da aba Clientes
  foi conferido nas 11 combinações. Automação WebKit não equivale a teste em
  iPhone físico.
- `Cache-Control: no-transform` conferido no origin e no edge público. O HTML
  mantém apenas os scripts locais, sem injeção automática do Analytics da
  Cloudflare; a CSP continua restrita.

As capturas do WebKit são isoladas da validação de segurança: o mecanismo de
screenshot injeta CSS interno e pode provocar aviso de CSP. Os testes da página
mantêm a CSP estrita; o bypass é restrito ao contexto de captura visual, não ao
site ou à suíte que confere seus erros.

O contato continua WhatsApp +55 67 99293-8193, sem envio de mensagens nos testes.
`urlTrial` continua vazia e não há acesso ao Manager pela homepage.
