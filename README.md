# LUNA · Homepage comercial

Página de apresentação da LUNA, uma solução **Cometki** para gestão de salões e atendimento automático com IA no WhatsApp.

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
- assets/imagens/: capturas reais do aplicativo com dados demonstrativos.
- assets/fontes/: fontes locais e licenças OFL.
- deploy/nginx.conf: cache, compressão, cabeçalhos e rota de saúde.
- docs/integracao-manager.md: caminho proposto para trial.
- docs/capturas.md: origem e atualização das telas.

## Conteúdo e contato

A marca principal é LUNA. Cometki aparece na assinatura e no atendimento comercial.

O contato atual é **+55 67 99293-8193**, configurado em assets/js/configuracao.js. Os links do HTML também têm esse destino para funcionar sem JavaScript. Ao trocar o contato, atualize os dois locais, incluindo o texto de privacidade.

O site não promete duração de trial, preços, quantidade de clientes nem resultados numéricos. O CTA atual abre o WhatsApp. A criação automática de trials ainda não está implementada.

## Publicação

1. Construir a imagem e publicar no registro da infraestrutura.
2. Apontar o serviço para a porta 8080 e a verificação de saúde para /saude.
3. Configurar domínio e HTTPS no proxy ou Ingress.
4. Informar o domínio definitivo em uma URL canônica e usar URL absoluta em og:image.
5. Conferir contato, privacidade e condições comerciais antes de divulgar.

O cache dos assets é de uma hora. HTML e configuração comercial revalidam a cada acesso. Ao atualizar imagens ou estilos durante uma campanha, altere o nome do arquivo ou sua versão na URL para invalidar caches já existentes.

Somente a rota estática e a verificação de saúde estão ativas. /api/ retorna 404 enquanto a integração não existir. A homepage não expõe o manager.

## Validação

O desenvolvimento inclui revisão visual em celular e desktop, verificação das interações e execução no Nginx. O relatório da primeira versão está em docs/validacao.md.

Para conferir o Nginx da imagem:

    docker compose exec homepage nginx -t

Capturas, conteúdo ilustrativo e limites de integração estão documentados em docs/.
