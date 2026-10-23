# Atualização comercial 1.1

Decisões de 23/10/2026, para a homepage LUNA da Cometki.

## Fonte e seleção comercial

Catálogo verificado: `jcometki/luna`, `docs/recursos.md`, versão v1.21.0,
commit `0ab68d1`. O aplicativo e a infraestrutura têm outros responsáveis;
esta atualização não modifica o código do aplicativo nem o Manager.

O destaque principal é o retorno de clientes por campanhas no WhatsApp:
público por última visita, serviço ou seleção manual; oferta e pacote;
abertura personalizada e fundos para artes com IA; teste antes da ativação;
envios graduais; botão de agendamento; desconto reconhecido pela assistente
e levado ao caixa. O acompanhamento inclui respostas, agendamentos,
comparecimentos e receita vinculada. Não prometemos aumento de vendas,
agenda cheia nem resultados numéricos.

O segundo destaque é o financeiro: contas a pagar e recorrência, alertas,
taxas de maquininha, valor líquido previsto, datas de repasse e relatórios
por período. Repasses são previsões conforme configuração, não uma
integração bancária ou confirmação automática de liquidação.

No atendimento, entram imagens compreendidas pela IA, conversas fixadas
e prioridade para quem precisa da equipe. A equipe continua podendo assumir
e devolver a conversa. A redação sobre clientes é neutra quanto a gênero.

## Visual e leitura

- Substituir o fundo quase preto por café médio e superfícies mais claras.
- Alternar campanhas e mobilidade em areia, sem usar grandes áreas brancas.
- Manter dourado, tipografia editorial, marca LUNA e assinatura Cometki.
- Priorizar textos de 15–16 px e espaçamento confortável, inclusive no celular.
- Preservar o Élevé original nas capturas reais; nenhuma tela foi redesenhada.
- Manter quatro abas para a gestão e mostrar as novidades financeiras fora
  delas, para que não dependam de interação para serem descobertas.

## Entrega

HTML, CSS e JavaScript nativos; fontes locais e WebP sem perda. Sem biblioteca
nova, build de frontend, formulário ou serviço externo adicional. O contato
continua configurado em `assets/js/configuracao.js`, com WhatsApp comercial
e ponto futuro de integração de trials.

CSS, prints e imagem de compartilhamento usam `?v=1.1.0` para renovar o cache
na borda. A entrega continua pela imagem Nginx com tag `homepage-1.1.0`;
a referência imutável deve ser promovida pelo GitOps conforme
[publicação](publicacao.md). DNS, ingress, TLS, recursos e permissões do
Deployment não precisam mudar.

Procedência das imagens: [capturas](capturas.md).
