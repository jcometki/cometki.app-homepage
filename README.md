# LUNA · Homepage comercial

Página de apresentação da LUNA, uma solução **Cometki** com atendimento autônomo, agendamentos e campanhas com IA no WhatsApp, conectados à gestão do salão.

HTML sem build, CSS próprio, JavaScript nativo e Nginx. Fontes, ícones e imagens são locais. Nenhum framework, serviço de analytics ou recurso de CDN é necessário para a página funcionar.

## Executar

Com Docker:

    docker compose up --build -d

Abra http://localhost:8080. O Compose expõe somente o loopback local. Para publicar, use o proxy/Ingress da infraestrutura com HTTPS e o domínio escolhido.

Para uma prévia simples:

    python3 -m http.server 8080 --bind 127.0.0.1

O servidor Python serve todo o diretório e deve ser usado somente em desenvolvimento. A imagem Nginx contém apenas os arquivos públicos.

## Estrutura

- index.html: conteúdo comercial, acessibilidade e metadados.
- assets/css/site.css: tema Élevé e layouts responsivos.
- assets/js/configuracao.js: WhatsApp e destino do cadastro público de trial.
- assets/js/site.js: menu, abas, ampliação, privacidade e chamada móvel.
- assets/imagens/: capturas reais do aplicativo com dados demonstrativos e marca otimizada.
- marca/: vetores, logos transparentes, perfis e peças de divulgação; fora da imagem pública.
- assets/fontes/: fontes locais e licenças OFL.
- deploy/nginx.conf: cache, compressão, cabeçalhos e rota de saúde.
- docs/integracao-manager.md: contrato do cadastro público de trial.
- docs/capturas.md: origem e atualização das telas.
- docs/atualizacao-comercial-1.1.md: seleção dos novos recursos e decisões de leitura e autonomia.
- docs/seguranca-comercial.md: afirmações de infraestrutura e os quatro perfis de acesso.
- docs/ajuda-e-suporte-comercial.md: manual integrado, IA de ajuda e suporte incluídos para todo salão.
- docs/comparativo-comercial.md: proposta de posicionamento e comparação com fontes oficiais.

## Conteúdo e contato

A marca principal é LUNA. A identidade oficial usa o monograma aprovado, sem assinatura empresarial. A única menção institucional visível é “produto cometki.cloud”, ao final do rodapé. Veja o [kit de marca](marca/README.md) e a [decisão de identidade](docs/identidade-luna.md).

O contato atual é **+55 67 99293-8193**, configurado em assets/js/configuracao.js. Os links do HTML também têm esse destino para funcionar sem JavaScript. Ao trocar o contato, atualize os dois locais, incluindo o texto de privacidade.

O site não publica preços, quantidade de clientes nem resultados numéricos. A
página `/experimentar` consulta a duração e disponibilidade no backend. Os CTAs
só promovem o teste quando houver inscrições e vagas abertas; o WhatsApp é o
fallback comercial. O formulário coleta nome do salão, e-mail e aceite, usa
Turnstile e exige confirmação por e-mail antes de provisionar.

O cadastro separa as telas de e-mail enviado, confirmação, preparação e salão
pronto. Depois do envio, um cartão compacto substitui a apresentação comercial,
com o botão **Criar meu salão** na confirmação e andamento pelos estados reais
do Manager. O [contrato de integração](docs/integracao-manager.md) detalha o fluxo.

## Publicação

Domínio definitivo: **https://luna.cometki.app/**. A URL canônica, og:url e
og:image já usam esse endereço. O domínio raiz cometki.app permanece livre
para outro serviço; não há alias www.luna.cometki.app neste deploy.

O workflow **Publicar imagem da homepage** segue o padrão da aplicação LUNA:
uma tag `vX.Y.Z` publica `jcometki/luna:homepage-X.Y.Z` no Docker Hub,
com uma tag adicional do commit e imagens `linux/amd64` e `linux/arm64`. Usa os Secrets
`DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN`. Não publica `latest`, não usa banco,
build frontend ou artefatos de cache do GitHub.

O workflow valida a imagem publicada; ele não altera o cluster. O deploy é
registrado explicitamente em
[`cometki-apps/apps/luna-homepage`](https://github.com/jcometki/cometki-apps/tree/main/apps/luna-homepage),
com versão e digest fixos, e aplicado pelo Flux. A homepage não recebe chave
de escrita do GitOps nem acesso ao Manager.

O registro é compartilhado com a aplicação, mas as tags `homepage-…` não
sobrescrevem suas versões e são ignoradas pelo catálogo do Manager. Não usar
tags de versão sem esse prefixo para imagens da homepage.

Atualização e rollback estão no [guia de publicação](docs/publicacao.md).

HTML, configuração e código sem assinatura usam `no-store`, com um único
cabeçalho de cache. A imagem empacota automaticamente os assets com uma assinatura
do conteúdo da publicação no nome: scripts, estilos, fontes e imagens passam a
ter URLs novas quando o conteúdo muda. Esses arquivos podem usar cache longo
sem prender o visitante a uma publicação anterior. Não é preciso atualizar
manualmente os parâmetros de versão do HTML nem limpar a zona Cloudflare.

Os nomes originais continuam disponíveis. Uma página antiga ou um recurso de
uma publicação diferente usa um fallback sem cache se sua assinatura não existir
na imagem atual. Erros também não são armazenados. A primeira adoção prepara
essa compatibilidade na 1.3.2 antes de ativar as assinaturas na 1.3.3, para evitar
falhas durante a troca de pods. Não remover esse fallback em atualizações futuras.

A homepage consulta a disponibilidade do trial ao abrir, ao retornar à aba e
a cada 30 segundos enquanto estiver visível. Mudanças no Manager não exigem
republicar a homepage. Falha da API ou falta de vagas preservam o WhatsApp.

O Nginx serve a homepage, `/experimentar` e a saúde. `/api/` permanece em 404 no
contêiner estático; em produção, o Traefik encaminha somente os seis caminhos
exatos do cadastro para a porta pública do Manager. O painel administrativo
continua protegido. Não há proxy genérico do Nginx para o Manager.

Somente a página de cadastro usa um recurso externo: o widget Cloudflare
Turnstile. Sua CSP autoriza scripts e frames de `challenges.cloudflare.com`.
A página de apresentação mantém imagens e fontes locais e sua CSP original.
As inscrições começam pausadas e são abertas pelo Manager após a validação.

## Validação

O desenvolvimento inclui revisão visual em celular e desktop, verificação das interações e execução no Nginx. O relatório da primeira versão está em docs/validacao.md.

Para conferir o Nginx da imagem:

    docker compose exec homepage nginx -t

Testes sem dependências de frontend:

    python3 -B -m unittest discover -s tests -v
    BASE_URL=http://127.0.0.1:8080 python3 -B -m unittest discover -s tests -v

Com `BASE_URL`, os testes conferem saúde, assets, cache, compressão, cabeçalhos
e isolamento das rotas privadas. O workflow **Validar homepage** faz essa
conferência em contêiner sem root e filesystem somente leitura. Playwright é
opcional para a revisão de navegador, somente no ambiente de desenvolvimento:

    BASE_URL=http://localhost:8080 node tests/validar-navegadores.cjs

Fornecer `PLAYWRIGHT_MODULE` se a instalação de Playwright estiver fora do
checkout. Nenhum módulo Node ou teste é incluído na imagem de produção.

Capturas, conteúdo ilustrativo e limites de integração estão documentados em docs/.
