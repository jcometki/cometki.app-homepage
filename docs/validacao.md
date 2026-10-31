# Validação da homepage

## Visão da cliente e do salão — revisão 1.9.0, 31/10/2026

- Auditoria visual de todos os prints, incluindo versões de desktop/celular.
  WhatsApp ilustrativo na abertura e nas duas conversas da cliente; capturas
  reais da LUNA preservadas na operação do salão. Legendas e alternativas
  textuais explicitam o ponto de vista e a natureza ilustrativa/real.
- 19 testes Python/HTTP aprovados no pacote Nginx com execução restrita.
- Chromium 320/360/390/430/768/1024/1440/1920 e WebKit 390/768/1440:
  layout, menu, abas, imagens, diálogos, retorno de foco e WhatsApp aprovados;
  sem erros JS/CSP, incluindo conteúdo sem JavaScript.
- Jornadas em Chromium/WebKit, 320/390/768/901/1440: zero violações detectadas
  pelo axe WCAG 2/2.1 A/AA; ampliação e leitura móvel conferidas.
- A prévia navegável foi conferida em 24 combinações de cenário/navegador/largura,
  sem erros ou violações detectadas. Os botões desenhados correspondem às regras
  do produto; não houve conexão ou envio real por WhatsApp.
- Fontes e folhas de auditoria: `outputs/luna-whatsapp-previa-20261031`.
  QA do pacote: `work/homepage-whatsapp-qa-20261031`, neste workspace.
  Não houve ensaio em aparelho físico.

### Publicação da revisão 1.9.0

- Código `06d700d`, tag `v1.9.0`; validação `41220157883` e publicação
  `41220225726` concluídas com sucesso, incluindo testes da imagem publicada.
- GitOps `b4553a4`: somente a imagem da homepage alterada. Digest
  `sha256:1a9561207070a8ef3739f092fb9a07a874ac002fb0f5ac504599df6c89aa3262`.
- Consulta ao servidor confirmou imagem 1.9.0, Deployment 1/1 e Kustomization
  Ready. A espera pelas dependências do Flux se resolveu automaticamente.
- HTML e 29 assets públicos idênticos ao pacote aprovado; cadastro preservado,
  saúde `ok` e TLS validado. Nenhuma alteração no Manager ou em dados de clientes.
- Chromium/WebKit públicos em 390/901/1440 px: zero violações detectadas pelo
  axe e nenhuma rolagem horizontal. Conferência com CSP preservada confirmou
  as três imagens WhatsApp, painel da equipe mantido, legendas corretas,
  ampliação, retorno de foco e CTA `/experimentar`, sem erro JS/CSP.

## Revisão comercial 1.8.0 — 31/10/2026

- Integração aprovada das jornadas com capturas reais, relacionamento antes e
  depois do atendimento, comparação genérica, recursos incluídos, contratação
  sem fidelidade e infraestrutura Oracle no Brasil. Os quatro perfis, ajuda
  integrada e fluxo de cadastro existente foram preservados.
- 19 testes Python/HTTP aprovados no pacote Nginx sem root, com filesystem
  somente leitura. Nenhuma dependência de execução acrescentada.
- Navegação em Chromium de 320 a 1920 px e WebKit em 390, 768 e 1440 px:
  menu, abas, diálogos, foco, WhatsApp, ausência de erros JS/CSP e conteúdo sem JS.
- Novas seções em Chromium e WebKit: 320, 390, 768, 901 e 1440 px, sem rolagem
  horizontal ou colisão na navegação. As quatro capturas abrem em largura
  confortável no celular; Escape fecha e devolve o foco ao botão de origem.
- Axe-core WCAG 2/2.1 A/AA: zero violações detectadas nas dez combinações.
  Legendas com contraste ajustado; revisão visual móvel/desktop das seções.
- Teste dos CTAs nos dois motores com API simulada: abertura, pausa e falta de
  vagas sem recarregar; falhas mantêm o WhatsApp. Nenhum trial ou mensagem real
  foi enviado. Não houve ensaio em aparelho físico.
- Evidências locais: `work/homepage-lancamento-qa-20261031` neste workspace.

### Publicação da revisão 1.8.0

- Código `0791777`, tag `v1.8.0`; Actions de validação `41218007554` e de
  publicação `41218076734` concluídas com sucesso, incluindo testes da imagem.
- GitOps `90ef37d`: uma única linha alterada, com versão/digest da homepage.
  Nenhuma configuração de infraestrutura, cadastro ou Manager foi modificada.
- Imagem `jcometki/luna:homepage-1.8.0`, digest
  `sha256:0c7e9ba2682f19ed59d5f79ff80a3dfaaac7a33b157e15a3eaddc58d998d587e`.
- Consulta somente leitura ao servidor confirmou rollout concluído, Deployment
  com 1/1 réplica pronta e Kustomization Ready na revisão promovida.
- Houve espera temporária pelas dependências de certificados/TLS durante a
  reconciliação do Flux; ela se resolveu normalmente, sem intervenção.
- HTML e 28 assets públicos comparados byte a byte com o pacote aprovado;
  cadastro preservado, `/saude` respondendo `ok` e TLS validado.
- No domínio público, Chromium e WebKit em 390, 901 e 1440 px: jornadas,
  comparativo, quatro prints ampliáveis e zero violações detectadas pelo axe.
  Chromium com CSP preservada confirmou navegação, retorno de foco, ausência
  de erros JS/CSP e CTA para `/experimentar`, conforme disponibilidade real.
  Nenhum cadastro foi enviado. Capturas e relatórios públicos estão na pasta de QA.

## Identidade oficial — revisão 1.2.0, 23/10/2026

- Monograma aprovado aplicado ao cabeçalho, rodapé, favicon, ícone Apple Touch
  e imagem de compartilhamento. Logo em SVG com contornos e PNGs transparentes.
- Uma única menção institucional no texto da página: “produto cometki.cloud”,
  no fim do rodapé; endereços técnicos preservados.
- Kit de marca com 12 SVGs, 12 PNGs transparentes, três perfis em SVG/PNG,
  duas artes de feed, story, capa e compartilhamento, modelos HTML e guia de uso.
- Revisão visual da marca, perfis e cinco peças exportadas; fonte e vazados
  conferidos, incluindo o interior da letra A.
- Nginx sem root e com filesystem somente leitura: `nginx -t` e 11 testes
  Python aprovados, incluindo conteúdo, assets, saúde, cabeçalhos e rotas privadas.
- Chromium em 320, 360, 390, 430, 768, 1024, 1440 e 1920 px; WebKit em 390,
  768 e 1440 px. Sem rolagem horizontal, recursos ausentes ou erros JS/CSP.
  Menu, abas, ampliação, retorno de foco, privacidade e WhatsApp aprovados.
- Conteúdo e contato conferidos sem JavaScript nos dois motores.
- Axe-core WCAG 2/2.1 A/AA em 390 e 1440 px nos dois motores: zero violações
  detectadas. Não substitui validação em aparelho físico ou leitor de tela.
- Kit de divulgação fora da imagem Nginx; sem dependências novas em produção.


### Publicação da revisão 1.2.0

Confirmada em 23/10/2026 no endereço `https://luna.cometki.app/`:

- Código `96eec0b`, tag `v1.2.0`; validação GitHub `39960551414` e
  publicação `39960651398`, ambas concluídas com sucesso.
- Imagem `jcometki/luna:homepage-1.2.0`, digest
  `sha256:2c31718307afd4b08fd7bbe878af19a46390c8b33fe2e614566cec67dae7830d`.
- GitOps `1f9c4ee`: somente versão/digest do campo `image` alterados,
  com controle de concorrência pelo SHA do arquivo. Três testes de contrato
  do manifesto aprovados; checkout compartilhado da infraestrutura preservado.
- HTML público idêntico ao aprovado; 22 assets referenciados conferidos
  byte a byte, pelas URLs versionadas. `/saude` respondeu `ok`; TLS validado.
- Navegador público em 390 e 1440 px: logo decodificada, metadados LUNA,
  assinatura institucional única, sem rolagem horizontal ou erros JS/CSP.
- A verificação operacional foi feita pelo HTTPS público. Não houve nova
  consulta aos estados internos Ready do Kubernetes nesta rodada.


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
