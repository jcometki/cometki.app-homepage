# Segurança e níveis de acesso na apresentação comercial

Decisão de 28/10/2026: destacar a proteção dos dados e o ambiente individual
junto à narrativa de IA, WhatsApp e campanhas. O usuário também solicitou os
níveis de acesso dos profissionais. A explicação aparece na abertura, na seção
Segurança e nas perguntas frequentes, em linguagem comercial.

## Afirmações e fontes

- **Aplicação e base de dados por cliente:** o aplicativo atende uma única
  empresa por deployment. O provisionador cria database e usuário exclusivos.
  Fontes: `luna/AGENTS.md`, `luna-manager/README.md` e
  `luna-manager/internal/tenantdb/provisioner.go`, conferidos nesta data.
- **HTTPS e permissões:** contas individuais e autorização no servidor,
  conforme `luna/docs/seguranca.md` e `luna/docs/autenticacao.md`.
- **Backups criptografados:** rotina comercial e procedimentos de recuperação
  documentados em `cometki-apps/clusters/oracle/README.md` e
  `cometki-apps/README.md`. O Manager também possui backup individual cifrado.
- **Monitoramento e verificações de saúde:** observabilidade Oracle e probes
  da aplicação, conforme a documentação do cluster e `tenants/base/deployment.yaml`.

Essas afirmações descrevem recursos existentes, não uma certificação ou SLA.
Não anunciar disponibilidade percentual, ausência de interrupções, servidor
físico exclusivo, isolamento absoluto, segurança infalível ou superioridade
sobre concorrentes sem evidências adicionais. A hospedagem é compartilhada;
a FAQ explica que aplicação, base de dados e credenciais são individuais.

## Nova redação em prévia — 31/10/2026

O usuário pediu uma apresentação menos técnica da infraestrutura: Oracle Cloud
no Brasil, ambiente e dados próprios por salão, investimento em disponibilidade
e segurança, com atenção aos horários de maior movimento. A chamada proposta é:

> Sábado cheio. A LUNA acompanha.
>
> Você investe no seu salão. A LUNA investe na estrutura que acompanha você.

A nova prévia não usa “ambiente compartilhado” na apresentação comercial. Diz
**“seu próprio ambiente, sua própria base de dados e acessos individuais”**.
Isso descreve o isolamento da aplicação e dos dados, sem afirmar hardware,
servidor físico ou serviço de banco dedicado exclusivamente a cada salão.
A explicação anterior da FAQ pública só será substituída junto da publicação
do conteúdo aprovado; a versão pública 1.7.0 ainda não foi alterada.

Evidências revalidadas em 31/10:

- O repositório remoto `cometki-apps`, `clusters/oracle/README.md`, confirma
  Manager e clientes LUNA ativos na Oracle, com banco externo.
- Consulta somente leitura ao metadado `region` da instância comercial retornou
  `sa-saopaulo-1`. A [documentação oficial da Oracle](https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm)
  identifica essa região como São Paulo, Brasil. Não foram lidas credenciais.
- `tenants/base/deployment.yaml` remoto usa atualização gradual com
  `maxUnavailable: 0` e `maxSurge: 1`. Isso sustenta “atualizações pensadas para
  reduzir interrupções”, não uma garantia de atualização ou operação sem falhas.
- O manifesto tem uma réplica; a documentação `cometki-foundation/docs/oracle-manual.md`
  descreve armazenamento em um host. Não apresentar uma arquitetura redundante
  de alta disponibilidade como já implantada nem transferir o SLA da nuvem ao produto.

“Disponibilidade como prioridade” descreve o compromisso operacional e os
controles existentes. Não publicar “nunca para”, “zero interrupções”, “nenhuma
janela aos sábados” ou percentual de uptime sem política/SLA e evidência
operacional correspondentes. Não atribuir janelas inconvenientes a concorrentes
sem fonte verificável. A proposta comunica o cuidado com o salão cheio sem fazer
essa comparação factual.

Hospedagem no Brasil refere-se ao ambiente principal da aplicação. Não estender
a afirmação automaticamente a todo processamento de IA, WhatsApp, CDN, backup
externo ou qualquer outro fornecedor integrado.

## Quatro perfis

A descrição foi conferida no catálogo `luna/docs/recursos.md` e no mapa
`luna/src/modulos/autenticacao/dominio/permissoes.ts`, revisão `3ab2f65`:

| Perfil | Resumo comercial |
| --- | --- |
| Proprietário | Administra o salão, equipe, financeiro e integrações. |
| Gerente | Gestão, financeiro, relatórios e equipe; integrações ficam com o proprietário. |
| Recepcionista | Agenda, clientes, operação dos atendimentos e conversas. |
| Profissional | Própria agenda, próprios atendimentos, comissões e pagamentos. |

Os perfis são permissões de acesso, não níveis de experiência profissional nem
planos comerciais. Não prometer permissões arbitrárias configuráveis por pessoa.
A conta precisa estar vinculada ao profissional para mostrar seus pagamentos.
O resumo não substitui o mapa completo de permissões da aplicação.

## Apresentação e escopo

Seção em areia, com aplicação/base representadas em um bloco café e os quatro
perfis sempre visíveis. No celular, o conteúdo vira uma coluna; não depende de
hover, carrossel ou JavaScript. O diagrama é explicativo, sem fingir uma captura
do aplicativo. As telas reais continuam inalteradas.

A alteração é da homepage. Não cria ou modifica permissões do aplicativo,
infraestrutura, backups, configuração de trials ou regras do Manager.

## Validação da entrega

- 19 testes Python aprovados com Nginx: conteúdo, assets, cache por assinatura,
  compatibilidade com páginas antigas, cadastro público, CSP e rotas privadas.
- Chromium em 320, 360, 390, 430, 768, 1024, 1440 e 1920 px; WebKit em 390,
  768 e 1440 px: layout, menu, abas, imagens ampliadas, foco, privacidade e contato.
- Conferência adicional do menu em 901 px, sem sobreposição dos cinco links.
- Quatro perfis conferidos em Chromium e WebKit; revisão visual da abertura
  e da seção de segurança em 390 e 1440 px.
- Axe-core WCAG 2/2.1 A/AA em 390, 901 e 1440 px nos dois motores, sem violações
  após ajustar o contraste do destaque pequeno sobre o fundo areia.
- Troca dinâmica do CTA e compatibilidade com configuração antiga aprovadas
  em Chromium e WebKit. A API do Manager foi simulada nos testes locais;
  não foram criados trials nem enviados contatos reais.

O teste geral de navegação agora simula inscrições pausadas somente em localhost
ou 127.0.0.1, porque a imagem estática não contém a API do Manager. Testes contra
um domínio público não recebem essa simulação. As capturas visuais são isoladas
da verificação estrita da CSP; o site mantém sua política original.

## Publicação confirmada — 1.5.0

Publicada em 28/10/2026 em `https://luna.cometki.app/#seguranca`.

- Código `8b56f9e`, tag `v1.5.0`.
- Validação GitHub `40777119917` e publicação `40777260923`: sucesso.
- Imagem `jcometki/luna:homepage-1.5.0`, amd64/arm64, digest
  `sha256:9dbfe4447b1f5c31cd615eaff1c7f5193b4d421f873f54695c0d4e38fd2333a6`.
- GitOps `8d9e190`: somente o campo de imagem da homepage, com atualização
  condicionada ao SHA do arquivo. Checkout compartilhado da infraestrutura preservado.
- Três testes do contrato GitOps e renderização do overlay Oracle aprovados.
- HTML e 22 assets públicos idênticos ao pacote Nginx validado. A página
  `/experimentar` também corresponde ao pacote; saúde `ok` e TLS válido.
- Chromium público em 390, 901 e 1440 px: seção, quatro perfis, menu,
  âncora de segurança e CTA aprovados, sem erros JS/CSP ou rolagem horizontal.

A verificação operacional foi pelo HTTPS público. Não foi usada a configuração
Kubernetes local, que aponta para ambientes diferentes do cluster comercial.
