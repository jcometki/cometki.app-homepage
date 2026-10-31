# Jornadas de relacionamento com IA

Proposta preparada em 31/10/2026 para a próxima revisão da homepage. O usuário
pediu mais destaque para confirmações, avaliações, avisos antes e depois do
serviço, tratamento de atrasos e referências visuais com contexto da conversa.
O conjunto continua em **prévia**, junto do comparativo e do posicionamento de
solução completa. Não foi publicado nem alterou a versão pública 1.7.0.

## Mensagem e organização

Chamada: **“Você cuida do talento. A LUNA cuida da conversa.”**

1. Confirmação: a cliente confirma, pede reagendamento ou cancela pelo WhatsApp.
2. Lembrete e preparo: o aviso leva as orientações cadastradas para o serviço;
   uma resposta da cliente segue com a assistente.
3. Pós-atendimento: recomendações do serviço depois da conclusão.
4. Avaliação: nota e comentário associados ao atendimento, com aviso à gestão.

Não fixar intervalos de envio na chamada comercial: são configuráveis. Respeitar
preferências de comunicação e explicar que as orientações são cadastradas pelo
salão. Não prometer publicação automática das avaliações no Google. O convite
para avaliação externa depende de configuração e das regras do produto.

## Dois exemplos para demonstrar o benefício

**“Vou atrasar um pouquinho. A equipe já fica sabendo.”** Carla recebe o lembrete
do corte às 14h com Ana, responde que atrasará 15 minutos e recebe o retorno da
assistente. A central de notificações da profissional mostra o aviso com horário
e serviço. O atraso não altera o agendamento nem garante tolerância.

**“Ela manda uma inspiração. Você recebe o contexto.”** Júlia envia a referência
de um penteado e conta que tem um aniversário às 20h, precisando estar pronta até
18h30. O atendimento aberto mostra a foto e as observações sobre ocasião,
horário e preferências. Não prometer preço ou resultado estético deduzido apenas
da foto. A profissional continua responsável pelo serviço.

Cada exemplo explica o benefício em texto fora da imagem, traz legenda e permite
ampliar o print. No celular, as etapas ficam empilhadas. Os fundos quentes mais
claros pertencem à homepage; as telas mantêm o Élevé original do aplicativo.

## Evidência e limites da demonstração

Fonte: aplicativo 1.44.0, commit
`ffc136d3360da25ccdee9294baeb99dacc515dc7`, catálogo `docs/recursos.md`, seções de
assistente, conversas, automações, agendamento, atendimento, fotos e notificações.

- Cópia isolada do commit, MariaDB descartável e seed Studio Aurora fictício.
- Worker desligado; `AI_ENABLED=false` e `UAZAPI_ENABLED=false`.
- Textos de conversa e análise da imagem roteirizados. Não houve inferência ao
  vivo do modelo, contato com clientes nem envio real de WhatsApp.
- `avisarAtrasoFerramenta.executar` executou a regra real de atraso e gerou os
  avisos. A captura de notificações foi feita no perfil da profissional Ana.
- `registrarFotoDaConversa`, gancho `anexarFotosAoAgendamento` e
  `abrirAtendimentoDoAgendamento` realizaram os vínculos nativos. O preparo
  verificou a foto ligada ao agendamento e a cópia das observações no atendimento.
- A foto do penteado é uma ilustração gerada por IA. As telas são capturas do
  aplicativo em execução, sem redesenho de componentes nem substituição de textos
  no DOM. O campo de observações foi expandido usando o controle nativo de
  redimensionamento para permitir ler o conteúdo inteiro.
- As imagens não constituem depoimento, caso real de cliente ou prova de entrega
  de notificação push em um aparelho. Mostram a central de notificações do app.

## Arquivos da prévia

Pasta de entrega local:
`outputs/luna-jornadas-previa-20261031` no workspace deste chat.

O HTML, CSS e JS permanecem independentes da homepage publicada. A origem dos
arquivos e as instruções de captura estão em [capturas.md](capturas.md); a pasta
da prévia contém `PROCEDENCIA.md`, o prompt da referência e o relatório de QA.

Antes de publicar, incorporar o conteúdo aprovado ao layout principal, revalidar
o catálogo no commit vigente e seguir o fluxo existente de CI/imagem/GitOps.
Não incluir ambiente de demonstração, dados de sessão ou credenciais no pacote.
