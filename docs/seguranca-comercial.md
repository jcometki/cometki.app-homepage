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
