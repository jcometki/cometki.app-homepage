# Cadastro público de trials

O cadastro principal fica em https://meuluna.com/experimentar; https://luna.cometki.app/experimentar permanece como alternativa. A homepage permanece
HTML, CSS e JavaScript, servida pelo Nginx sem build ou credenciais. O backend
é a API pública do LUNA Manager 0.15.0, em porta distinta do painel administrativo.

## Experiência

1. Informar nome do salão, e-mail, escolher o endereço e aceitar as condições.
2. Resolver o widget Cloudflare Turnstile Managed.
3. Receber um link de confirmação válido por 30 minutos.
4. Abrir o link e clicar em **Criar meu salão**. Abrir por GET,
   inclusive em scanners de e-mail, não provisiona nada.
5. Acompanhar o estado na página. Quando o ambiente estiver pronto, receber
   outro e-mail com endereço e código inicial para terminar o cadastro na LUNA.

O cliente conecta seu WhatsApp na própria LUNA; o Manager cria uma instância
desconectada. Duração, versão, IA, credenciais e domínio são definidos no servidor.
O endereço sugerido deriva do nome, com parte inicial editável e final fixo
`-luna.meuluna.com`. A consulta acontece 500 ms depois de parar de digitar e é
cancelada ao alterar novamente o campo. Respostas antigas não podem substituir
o resultado atual. A escolha manual é preservada ao mudar o nome; sugestões
numéricas são exibidas quando há conflito. O envio revalida e reserva por 30
minutos para confirmar o e-mail. Um conflito no envio mantém o formulário aberto
e oferece novas opções, sem trocar a escolha automaticamente. Clientes e pedidos
anteriores continuam com seus endereços originais. A duração
e a cota são registradas no pedido; o prazo começa com o ambiente pronto.

### Telas do cadastro — homepage 1.6.0

O formulário inicial permanece com nome, e-mail, endereço e aceite. Depois do
envio, a página muda para um cartão compacto, com uma única mensagem principal:

- **Confira seu e-mail.** O pedido foi recebido e o link ainda precisa ser usado.
  A página só informa envio concluído quando a API confirma o envio; mantém
  reenvio com Turnstile e o aviso de validade do link.
  O endereço de destino aparece em destaque, devolvido pelo Manager no campo
  `email` na criação e no acompanhamento autenticado de pedidos ainda não
  confirmados. Recarregar a página preserva a informação pelo cookie existente;
  o e-mail não é guardado no armazenamento do navegador. O conteúdo é inserido
  como texto, nunca HTML. Com uma API anterior, o primeiro envio ainda pode usar
  o endereço do próprio formulário, sem bloquear o restante do fluxo.
- **Vamos criar sua LUNA?** Ao abrir o link, mostra o botão **Criar meu salão**.
  O clique mantém o POST de confirmação existente; a simples abertura continua
  sem confirmar ou criar o ambiente.
- **Estamos preparando sua LUNA.** Mostra **E-mail confirmado**, agradece pela
  confirmação, explica o espaço exclusivo do salão e avisa que a pessoa pode
  fechar a página e receberá o endereço/código por e-mail.
- **Sua LUNA está pronta!** Oferece **Abrir minha LUNA**, usando apenas o endereço
  permitido devolvido pela API, e orienta sobre a configuração inicial.

O indicador **Confirmação → Preparação → Pronto** acompanha estados reais; não
há percentual ou avanço por tempo simulado. A consulta automática de estado
continua a cada 15 segundos. Após uma ação da pessoa, o foco vai ao título da
nova etapa; consultas periódicas não mudam seu foco nem sua posição de leitura.
Links expirados, pausas, falhas e trials encerrados mantêm mensagens próprias.
O texto comercial e as condições não são repetidos nas etapas de acompanhamento.

Mantém fontes e marca oficiais locais, com versões clara/escura e layout móvel.
Elementos novos são opcionais no JavaScript para preservar o funcionamento de
HTMLs anteriores atendidos pelo fallback de assets durante um rollout.
Não há mudança de API, regras de provisionamento, inscrição ou configurações dos
clientes. O painel do Manager e a aplicação LUNA não participam desta publicação.

Ao vencer, a vaga ativa é liberada e a LUNA permanece online com as restrições da
assinatura por 30 dias. O acompanhamento público retorna `restrito` e mantém o
link do salão. A retenção tem limite separado e reserva espaço também para os
trials ativos. Ao terminar, o Manager inicia a remoção protegida por backup.
As condições atuais usam `trial-2026-10-28.2`; uma página com condições antigas
precisa ser recarregada antes de enviar um novo pedido. Pedidos anteriores
preservam as condições registradas.

## Contrato HTTP

Somente seis caminhos exatos dos hosts meuluna.com e luna.cometki.app chegam à porta pública:

- GET /api/trials/configuracao: disponibilidade, duração, revisão e Site Key pública.
- GET /api/trials/endereco?identificador=studio: disponibilidade e até três
  sugestões livres, sem reservar nem devolver dados dos ocupantes.
- POST /api/trials: nome, email, identificador, aceiteTermos, versaoTermos, revisao e turnstile.
  Retorna 202 e cookie restrito de acompanhamento. A revisão impede cadastrar
  com condições alteradas depois de abrir o formulário.
- POST /api/trials/confirmar: token assinado recebido no fragmento do link.
  Reserva a vaga, cria o cliente e enfileira a operação em uma única transação.
- POST /api/trials/reenviar: cookie do pedido e novo token Turnstile.
- GET /api/trials/estado: estado limitado ao cookie do pedido, sem códigos,
  credenciais ou mensagens técnicas da infraestrutura.

POST exige JSON e Origin HTTPS igual ao host acessado (meuluna.com ou luna.cometki.app), com corpo de até 4 KiB.
Não existe CORS aberto. As respostas não permitem cache. O cookie é Secure,
HttpOnly e SameSite. Nenhum token administrativo do Manager vai para o frontend.
O Nginx local continua devolvendo 404 para /api/: as exceções exatas são do
Traefik na produção. Nunca encaminhar /api/ inteiro ao Manager.

## Ativação e proteção

Em **Manager → Trials públicos**, salvar as chaves do Turnstile para o hostname
meuluna.com e luna.cometki.app, Managed e sem pre-clearance. Salvar sem abrir inscrições,
validar o widget e um cadastro controlado e só depois divulgar. A API valida o
token, o hostname e a action luna_trial na Cloudflare.

Há pausa global, limite diário configurável, limite simultâneo, um cadastro não
excluído por e-mail, limites por IP/e-mail e teto global de confirmações. A
confirmação repetida é idempotente. O e-mail é enviado pelo worker persistente,
com idempotência da Resend e poucas tentativas. Nenhum ambiente é criado para
endereços não confirmados. Solicitações não confirmadas são limpas após sete dias.

assets/js/configuracao.js aponta urlTrial para a página pública. Os botões
principais só passam a **Começar meu teste** se a API informar inscrições e vagas
disponíveis. Com inscrições pausadas, vagas ocupadas, API fora do ar ou sem
JavaScript, os links comerciais continuam no WhatsApp.

O formulário precisa do JavaScript e do Turnstile. A homepage de apresentação
continua funcionando sem esses recursos. As condições da coleta são descritas
na página de cadastro e no aviso de privacidade da homepage.

## Validação

Testes Python conferem arquivos, entrega Nginx, CSP específica, cache e isolamento
das rotas. tests/validar-trial.cjs usa Chromium e WebKit headless com provedores
simulados, sem e-mails ou infraestrutura reais, em telas de 320 a 1440 px.
Os testes do Manager cobrem confirmação, reservas concorrentes, expiração,
limites, isolamento das rotas e estado sem segredos.

O backend devolve `dominioClientes` na configuração. Durante a publicação, a
homepage aceita meuluna.com e cometki.app, exibe o endereço exato retornado
pela consulta e mantém a confirmação de pedidos antigos em seu domínio original.

Nomes reservados são informados em `identificadoresReservados` na configuração.
O frontend orienta a escolha e o backend revalida. A API de endereço responde
400 com `codigo: endereco_reservado` para esses nomes. O site www.meuluna.com
redireciona para meuluna.com preservando o caminho; não é uma terceira origem
da API pública nem exige outro widget Turnstile.
