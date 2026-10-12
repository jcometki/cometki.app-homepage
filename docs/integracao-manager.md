# Integração futura de trials com o Luna Manager

## Situação atual

A homepage abre o WhatsApp comercial da Cometki. Ela não recebe inscrições, não armazena dados de leads, não provisiona ambientes e não anuncia teste gratuito ou prazo de trial.

O Manager existente cadastra clientes como rascunho e provisiona instalações isoladas. Na revisão para esta homepage, não foi encontrado endpoint público de trial. As rotas administrativas atuais exigem autenticação e devem continuar protegidas.

## Primeira integração recomendada

Manter a homepage estática. Criar um fluxo de inscrição público sob responsabilidade do backend e configurar sua URL HTTPS em LUNA_CONFIG.urlTrial.

1. O visitante escolhe começar o teste.
2. O fluxo público coleta os dados mínimos e verifica o contato.
3. O servidor cria uma solicitação idempotente.
4. O Manager recebe a solicitação por integração interna, cria um rascunho e provisiona.
5. O visitante acompanha o estado e recebe o acesso quando estiver pronto.

urlTrial é apenas uma URL pública. Nenhuma credencial, token administrativo ou segredo do Manager pode entrar em configuracao.js. Os rótulos podem passar a “Começar meu teste” em textoAcao quando o fluxo estiver operacional. Os links de fallback do HTML e o conteúdo de privacidade devem ser atualizados juntos.

## Contrato proposto — ainda não implementado

Se houver formulário na própria homepage, reservar POST /api/trials para um endpoint específico do backend. Não encaminhar o caminho inteiro /api/ ao painel administrativo.

Entrada proposta:

    {
      "nome": "Marina",
      "nomeSalao": "Studio Aurora",
      "email": "marina@exemplo.com",
      "whatsapp": "+5567999999999",
      "aceiteTermos": true,
      "versaoTermos": "versao-publicada",
      "origem": "homepage-luna"
    }

O cliente deve enviar uma chave de idempotência. Dados de plano, tempo de trial, credenciais, autorização e nome interno da instalação são definidos e validados no servidor.

Resposta inicial proposta: HTTP 202, com identificador opaco de solicitação e estado aguardando_verificacao. Nunca retornar segredos de infraestrutura.

Estados sugeridos: aguardando_verificacao, em_analise, provisionando, pronto, falhou e expirado. Um token de acompanhamento limitado à solicitação pode permitir consulta de status; não reutilizar a sessão administrativa do Manager.

Antes de habilitar: validar entrada, limitar tentativas e quantidade de ambientes, verificar contato, tratar duplicidade, definir expiração/suspensão, registrar auditoria e estabelecer recuperação de falhas. Não confirmar “conta criada” antes do provisionamento concluído.

## Decisões comerciais pendentes

- Duração, condições e recursos do trial.
- Liberação automática ou aprovação inicial da Cometki.
- Destino público de cadastro e canal de entrega do acesso.
- Termos e privacidade aplicáveis à coleta.
- Caminho de contratação após o período de teste.

Essas decisões não bloqueiam a homepage comercial atual.
