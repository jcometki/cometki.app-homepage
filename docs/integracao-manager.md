# Cadastro público de trials

O cadastro fica em https://luna.cometki.app/experimentar. A homepage permanece
HTML, CSS e JavaScript, servida pelo Nginx sem build ou credenciais. O backend
é a API pública do LUNA Manager 0.13.0, em porta distinta do painel administrativo.

## Experiência

1. Informar nome do salão, e-mail e aceitar as condições apresentadas.
2. Resolver o widget Cloudflare Turnstile Managed.
3. Receber um link de confirmação válido por 30 minutos.
4. Abrir o link e clicar em **Confirmar e criar meu teste**. Abrir por GET,
   inclusive em scanners de e-mail, não provisiona nada.
5. Acompanhar o estado na página. Quando o ambiente estiver pronto, receber
   outro e-mail com endereço e código inicial para terminar o cadastro na LUNA.

O cliente conecta seu WhatsApp na própria LUNA; o Manager cria uma instância
desconectada. Duração, versão, IA, credenciais e domínio são definidos no servidor.
O endereço deriva do nome do salão e recebe sufixo para evitar colisões. A duração
e a cota são registradas no pedido; o prazo começa com o ambiente pronto.

## Contrato HTTP

Somente cinco caminhos exatos do host luna.cometki.app chegam à porta pública:

- GET /api/trials/configuracao: disponibilidade, duração, revisão e Site Key pública.
- POST /api/trials: nome, email, aceiteTermos, versaoTermos, revisao e turnstile.
  Retorna 202 e cookie restrito de acompanhamento. A revisão impede cadastrar
  com condições alteradas depois de abrir o formulário.
- POST /api/trials/confirmar: token assinado recebido no fragmento do link.
  Reserva a vaga, cria o cliente e enfileira a operação em uma única transação.
- POST /api/trials/reenviar: cookie do pedido e novo token Turnstile.
- GET /api/trials/estado: estado limitado ao cookie do pedido, sem códigos,
  credenciais ou mensagens técnicas da infraestrutura.

POST exige JSON e Origin https://luna.cometki.app, com corpo de até 4 KiB.
Não existe CORS aberto. As respostas não permitem cache. O cookie é Secure,
HttpOnly e SameSite. Nenhum token administrativo do Manager vai para o frontend.
O Nginx local continua devolvendo 404 para /api/: as exceções exatas são do
Traefik na produção. Nunca encaminhar /api/ inteiro ao Manager.

## Ativação e proteção

Em **Manager → Trials públicos**, salvar as chaves do Turnstile para o hostname
luna.cometki.app, Managed e sem pre-clearance. Salvar sem abrir inscrições,
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
