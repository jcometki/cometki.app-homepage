# Ajuda e suporte na apresentação comercial

Decisão de produto confirmada pelo usuário em **31/10/2026**: **ajuda, manual
integrado e suporte são incluídos para todo salão e serão ativados por padrão**.
A homepage não apresenta esse recurso como adicional ou opção a contratar.

## Conteúdo publicado

A seção `#ajuda` apresenta três caminhos: consultar o manual da tela, perguntar
à assistente de ajuda com IA e encaminhar a conversa ao suporte humano com o
histórico. Duas perguntas frequentes explicam a inclusão para todos os salões
e a separação entre a IA de suporte e a franquia da assistente do WhatsApp.

O benefício comercial é dar autonomia à equipe sem deixá-la sem apoio.
Proprietário, gerente, recepcionista e profissional recebem orientações para as
funções que podem acessar; cada pessoa mantém seu próprio histórico de suporte.
Não se promete atendimento humano imediato, disponibilidade humana 24 horas,
prazo de resolução, IA ilimitada ou alterações automáticas feitas pela IA de ajuda.

## Evidências e limites de escopo

- LUNA `ffc136d3360da25ccdee9294baeb99dacc515dc7`, `docs/recursos.md`, seção 17:
  ajuda sobre a tela, guias com prints, contexto, assistente, atendimento humano,
  anexos, histórico individual e ausência de consumo da franquia do salão.
- `docs/plataforma-suporte.md` e `tests/e2e/suporte.spec.ts` documentam o contrato,
  as permissões e os comportamentos. A assistente orienta; não altera o salão.
- A captura vem do manual real no tema Élevé, com dados fictícios. Procedência
  completa em [capturas.md](capturas.md).
- Na consulta ao GitOps em 31/10, a sobreposição Oracle do Manager habilitava
  suporte, IA e notificações. A ativação por cliente ainda era documentada
  individualmente. A decisão comercial acima passa a orientar o padrão futuro.

**Dependência para o chat de implementação:** garantir ajuda e suporte ativados
no provisionamento de todo salão e revisar a cobertura dos salões existentes.
Esta entrega modifica somente a homepage e sua publicação. Não altera Manager,
aplicativo, política de trial, credenciais, contas ou configurações dos clientes.

## Apresentação

O bloco mantém a identidade Élevé, com fundo café médio e uma área em areia
para o print do manual. O recorte pode ser ampliado com o visualizador existente.
Não adiciona dependência, script externo ou interação de suporte à homepage.
O menu inclui Ajuda e as demais seções mantêm seus destinos.

O [comparativo comercial](comparativo-comercial.md) é uma proposta interna
entregue ao usuário. Não foi acrescentada uma tabela de concorrentes à página
pública sem uma decisão editorial específica.

## Validação da entrega

- 19 verificações Python aprovadas contra a imagem Nginx restrita; `nginx -t` aprovado.
- Suíte existente de navegação aprovada em Chromium (320–1920 px) e WebKit
  (390, 768 e 1440 px), incluindo menu, abas, imagens, foco e contato.
- Nova seção conferida em Chromium e WebKit a 320, 390, 768, 901, 1101 e 1440 px:
  menu sem sobreposição, âncora Ajuda, imagem completa no diálogo, retorno de
  foco com Esc, perguntas frequentes e ausência de rolagem horizontal.
- Axe WCAG 2/2.1 A/AA sem violações detectadas nessas 12 combinações. A revisão
  automatizada não substitui o uso com todas as tecnologias assistivas.
- A configuração de trial foi simulada apenas no endereço local. Não houve
  cadastro real, envio de mensagem, atendimento de suporte ou chamada de IA.
