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
- assets/js/configuracao.js: WhatsApp e destino futuro de trial.
- assets/js/site.js: menu, abas, ampliação, privacidade e chamada móvel.
- assets/imagens/: capturas reais do aplicativo com dados demonstrativos e marca otimizada.
- marca/: vetores, logos transparentes, perfis e peças de divulgação; fora da imagem pública.
- assets/fontes/: fontes locais e licenças OFL.
- deploy/nginx.conf: cache, compressão, cabeçalhos e rota de saúde.
- docs/integracao-manager.md: caminho proposto para trial.
- docs/capturas.md: origem e atualização das telas.
- docs/atualizacao-comercial-1.1.md: seleção dos novos recursos e decisões de leitura e autonomia.

## Conteúdo e contato

A marca principal é LUNA. A identidade oficial usa o monograma aprovado, sem assinatura empresarial. A única menção institucional visível é “produto cometki.cloud”, ao final do rodapé. Veja o [kit de marca](marca/README.md) e a [decisão de identidade](docs/identidade-luna.md).

O contato atual é **+55 67 99293-8193**, configurado em assets/js/configuracao.js. Os links do HTML também têm esse destino para funcionar sem JavaScript. Ao trocar o contato, atualize os dois locais, incluindo o texto de privacidade.

O site não promete duração de trial, preços, quantidade de clientes nem resultados numéricos. O CTA atual abre o WhatsApp. A criação automática de trials ainda não está implementada.

## Publicação

Domínio definitivo: **https://luna.cometki.app/**. A URL canônica, og:url e
og:image já usam esse endereço. O domínio raiz cometki.app permanece livre
para outro serviço; não há alias www.luna.cometki.app neste deploy.

O workflow **Publicar imagem da homepage** segue o padrão da aplicação LUNA:
uma tag `vX.Y.Z` publica `jcometki/luna:homepage-X.Y.Z` no Docker Hub,
com uma tag adicional do commit e imagem `linux/amd64`. Usa os Secrets
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

O cache dos assets é de uma hora. HTML e configuração comercial revalidam a cada acesso. Ao atualizar imagens ou estilos durante uma campanha, altere o nome do arquivo ou sua versão na URL para invalidar caches já existentes.

Somente a rota estática e a verificação de saúde estão ativas. /api/ retorna 404 enquanto a integração não existir. A homepage não expõe o manager.

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
