# Publicação da homepage LUNA na Cometki

A homepage comercial usa **https://luna.cometki.app/**. O conteúdo e o contato
aprovados permanecem estáticos; criação de trials não participa deste deploy.

Atualização vigente em 23/10/2026: **`homepage-1.2.0`**, com a identidade
oficial da LUNA e assinatura institucional somente no fim do rodapé.
Código `96eec0b`; promoção GitOps `1f9c4ee`. Digest da imagem:
`sha256:2c31718307afd4b08fd7bbe878af19a46390c8b33fe2e614566cec67dae7830d`.
HTML, 22 assets referenciados e saúde conferidos no endereço HTTPS publicado.
Veja o [registro da entrega](validacao.md) e o [kit de marca](../marca/README.md).

Publicada em 12 de outubro de 2026. A versão `homepage-1.0.2` acrescenta
`Cache-Control: no-transform` para impedir injeção automática de Analytics no
HTML pela Cloudflare, mantendo a CSP restrita e o visual aprovado.
A versão `homepage-1.0.3` corrige o espaço de “merece ser” na aba Clientes,
preservando a quebra de linha no desktop e a leitura contínua no celular.
O [relatório de validação](validacao.md#publicação-na-cometki-em-12-de-outubro-de-2026)
registra o digest, verificações realizadas e limites do ensaio.

## Componentes e responsabilidades

| Item | Configuração |
| --- | --- |
| Código | `jcometki/cometki.app-homepage`, branch `main` |
| Imagem | `jcometki/luna:homepage-X.Y.Z`, Docker Hub, `linux/amd64` |
| Publicação da imagem | Tag `vX.Y.Z`, workflow `Publicar imagem da homepage` |
| Deploy | `cometki-apps/apps/luna-homepage`, namespace `apps`, Flux |
| Aplicação | Nginx 8080; GET `/saude` retorna 200 |
| Entrada | Service ClusterIP 80 → 8080; Ingress público no Traefik `websecure` |
| DNS | Wildcard existente `*.cometki.app`, apontando ao túnel com proxy Cloudflare |
| Túnel | Wildcard existente → HTTPS `localhost:443`, Origin Server Name `cometki.app` |
| TLS do origin | Certificado existente `cometki-app-wildcard-tls`, mantido pelo cert-manager |
| Comercial | WhatsApp `+55 67 99293-8193`; `urlTrial` vazia |

Não é necessário novo registro DNS, rota de túnel ou certificado para este
hostname. A resolução interna usa o DNS da LAN e o mesmo certificado público
no Traefik. `www.luna.cometki.app` não está configurado: é um subdomínio de
segundo nível, sem cobertura pelo Universal SSL padrão da Cloudflare.
Um redirect HTTPS nesse alias também precisaria de certificado na borda antes
de processar a requisição. [Cobertura SSL](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/).

## Publicar uma versão

1. Validar alterações e publicar o commit na `main`. Push nessa branch valida
   o código, mas não publica a imagem nem altera a produção.
2. Escolher uma versão inédita, criar a tag `vX.Y.Z` no commit aprovado e enviá-la.
3. Aguardar o workflow da tag concluir construção, upload e testes HTTP da imagem.
4. Obter o digest publicado e atualizar somente `image` em
   `cometki-apps/apps/luna-homepage/deployment.yaml`, no formato
   `jcometki/luna:homepage-X.Y.Z@sha256:<digest>`.
5. Publicar esse manifesto na `main` de `cometki-apps`. O webhook e a consulta
   de cinco minutos do Flux aplicam a versão com rollout gradual.
6. Conferir Deployment disponível, Kustomization Ready, página/saúde/arquivos
   públicos e WhatsApp. Não divulgar uma versão apenas porque o upload terminou.

Não sobrescrever tags publicadas; criar uma nova versão. O digest prende o
conteúdo efetivamente aprovado mesmo se uma tag for alterada no registro.
As Actions estão fixadas por SHA; a base Nginx também tem digest fixo. Atualizar
esses pins exige uma nova validação, não apenas trocar a tag base para `latest`.

O repositório Docker Hub é o mesmo da LUNA. O prefixo `homepage-` também é
usado nas tags de commit; nunca publicar `X.Y.Z`, `latest` ou `migracoes-X.Y.Z`
por este workflow. O Manager filtra versões semânticas com migrações
correspondentes e ignora as tags da homepage. A imagem preliminar 1.0.0 no
repositório separado não é usada pelo deploy final.

## Verificação

```sh
curl -fsS https://luna.cometki.app/saude
curl -I https://luna.cometki.app/
curl -I https://luna.cometki.app/assets/js/configuracao.js
curl -I https://luna.cometki.app/api/trials
```

Esperado: página, assets e saúde 200; `/api/` e rotas privadas 404; configuração
comercial e HTML revalidáveis. Nginx envia cache de uma hora para assets; a
política de cache da Cloudflare pode aplicar TTL maior na borda/navegador.
Conferir menu, abas, imagens ampliadas e layout
móvel. Verificar o link do WhatsApp sem enviar mensagens no teste.

Para testar HTTP contra Nginx, usar `BASE_URL` com a suíte Python. Para validar
o endereço público de fora da LAN, usar uma conexão externa ou os IPs retornados
pelo DNS público com `curl --resolve`, **sem desabilitar validação TLS**.

## Rollback e proteção do ambiente

Voltar o manifesto GitOps à versão/digest anteriormente validada e publicar
essa mudança. Não usar `kubectl set image` como estado permanente: Flux
reconcilia o Git. Não excluir a Kustomization, o namespace ou o Ingress para
fazer rollback.

O contêiner roda sem root, com capacidades removidas, filesystem somente
leitura e diretórios efêmeros do Nginx. Não recebe token de ServiceAccount,
variáveis do Manager, credenciais de banco ou volumes persistentes.
`/api/` permanece 404; não há proxy para rotas administrativas.

Não há dados novos a restaurar em PVC. Código, versões e manifests pertencem
ao Git; exports Kubernetes existentes também incluem esta configuração. A
imagem depende do registro Docker Hub, assim como as aplicações atuais.

[No-transform e Analytics da Cloudflare](https://developers.cloudflare.com/web-analytics/get-started/):
o proxy não deve alterar o payload para injetar o beacon. Isso não muda regras
de segurança de outros hosts nem libera scripts externos na CSP.
