(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const form = $('form-trial'), status = $('acompanhamento'), mensagem = $('mensagem');
  let configuracao, widget, desafio = '', confirmacao = '', consulta, reenvio, scriptCarregado = false;
  const mostrarMensagem = (texto, erro = false) => { mensagem.textContent = texto; mensagem.classList.toggle('erro', erro); mensagem.hidden = !texto; };
  const api = async (rota, dados) => {
    const controle = new AbortController(), fim = setTimeout(() => controle.abort(), 15000);
    try {
      const r = await fetch('/api/trials' + rota, { method: dados ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store', headers: dados ? { 'Content-Type': 'application/json' } : {}, body: dados ? JSON.stringify(dados) : undefined, signal: controle.signal });
      const p = await r.json().catch(() => ({}));
      if (!r.ok) throw Object.assign(new Error(p.mensagem || 'Não foi possível concluir agora. Tente novamente ou fale com nossa equipe.'), { status: r.status });
      return p;
    } finally { clearTimeout(fim); }
  };
  const limparDesafio = () => { desafio = ''; if (widget !== undefined) window.turnstile?.reset(widget); };
  const seguranca = visivel => { $('turnstile').hidden = !visivel; $('nota-seguranca').hidden = !visivel; };
  window.lunaTrialTurnstilePronto = () => {
    widget = window.turnstile.render('#turnstile', { sitekey: configuracao.siteKey, action: 'luna_trial', language: 'pt-br', size: 'compact', callback: token => { desafio = token; }, 'expired-callback': () => { desafio = ''; }, 'error-callback': () => { desafio = ''; mostrarMensagem('A verificação de segurança não carregou. Tente atualizar a página ou fale com nossa equipe.', true); } });
  };
  const carregarTurnstile = () => {
    if (!configuracao.siteKey || scriptCarregado || $('turnstile').hidden) return;
    scriptCarregado = true;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=lunaTrialTurnstilePronto&render=explicit';
    script.async = true; script.defer = true;
    script.onerror = () => mostrarMensagem('Não foi possível carregar a verificação de segurança. Atualize a página ou fale com nossa equipe.', true);
    document.head.append(script);
  };
  const lembrar = () => { try { sessionStorage.setItem('luna-trial-pendente', 'sim'); } catch {} };
  const temPedido = () => { try { return sessionStorage.getItem('luna-trial-pendente') === 'sim'; } catch { return false; } };
  const aguardarReenvio = () => { $('reenviar').disabled = true; clearTimeout(reenvio); reenvio = setTimeout(() => { $('reenviar').disabled = false; }, 60000); };
  const exibirEstado = p => {
    form.hidden = true; $('confirmacao').hidden = true; status.hidden = false; $('abrir-luna').hidden = true; $('reenviar').hidden = true; seguranca(false);
    const textos = {
      aguardando_verificacao: ['Confira seu e-mail', 'Enviaremos o link de confirmação em instantes. Confira também o spam. O ambiente só será criado após você confirmar.'],
      provisionando: ['Estamos preparando sua LUNA', 'Você pode fechar esta página. Quando estiver pronta, enviaremos o endereço e o código de configuração inicial por e-mail.'],
      pronto: ['Sua LUNA está pronta', 'Confira seu e-mail para obter o código inicial. Dentro da LUNA você termina a configuração e conecta seu WhatsApp.'],
      expirado: ['O link de confirmação expirou', 'Solicite um novo e-mail e use o link mais recente.'],
      falhou: ['Precisamos conferir seu ambiente', 'Sua solicitação está registrada. Fale com nossa equipe; você não precisa fazer outro cadastro.'],
      suspenso: ['Seu ambiente está suspenso', 'Fale com nossa equipe para continuar usando a LUNA.'],
      encerrado: ['Este teste foi encerrado', 'Fale com nossa equipe para saber como continuar.']
    };
    const texto = textos[p.estado] || textos.falhou; $('estado-titulo').textContent = texto[0]; $('estado-texto').textContent = texto[1];
    if (['aguardando_verificacao', 'expirado'].includes(p.estado) && configuracao.habilitado) { $('reenviar').hidden = false; seguranca(true); }
    if (p.emailConfirmacao === 'erro' || p.emailConfirmacao === 'incerto') mostrarMensagem('O envio da confirmação teve uma falha. Você pode solicitar outro e-mail.', true);
    if (p.estado === 'pronto' && /^https:\/\/[a-z0-9-]+\.cometki\.app$/.test(p.endereco || '')) { $('abrir-luna').href = p.endereco; $('abrir-luna').hidden = false; }
    clearTimeout(consulta);
    if (['aguardando_verificacao', 'provisionando'].includes(p.estado)) consulta = setTimeout(acompanhar, 15000);
  };
  const novoFormulario = () => {
    try { sessionStorage.removeItem('luna-trial-pendente'); } catch {}
    confirmacao = ''; $('confirmacao').hidden = true; status.hidden = true;
    form.hidden = !configuracao.disponivel; seguranca(configuracao.disponivel);
    if (configuracao.disponivel) carregarTurnstile();
  };
  const acompanhar = async () => { try { exibirEstado(await api('/estado')); } catch (erro) { if (erro.status === 410) { novoFormulario(); mostrarMensagem('O acompanhamento expirou. Confira seu e-mail de acesso ou faça uma nova solicitação.', true); } else mostrarMensagem('Não foi possível atualizar o estado. Seu pedido continua registrado; tente atualizar a página.', true); } };
  form.addEventListener('submit', async evento => {
    evento.preventDefault(); if (!form.reportValidity()) return;
    if (!desafio) { mostrarMensagem('Conclua a verificação de segurança para continuar.', true); return; }
    $('solicitar').disabled = true; mostrarMensagem('');
    try { const p = await api('', { nome: $('nome').value.trim(), email: $('email').value.trim(), aceiteTermos: $('aceite').checked, versaoTermos: configuracao.versaoTermos, revisao: configuracao.revisao, turnstile: desafio }); lembrar(); exibirEstado(p); aguardarReenvio(); }
    catch (erro) { mostrarMensagem(erro.message, true); }
    finally { $('solicitar').disabled = false; limparDesafio(); }
  });
  $('confirmar').addEventListener('click', async () => {
    $('confirmar').disabled = true; mostrarMensagem('');
    try { const p = await api('/confirmar', { token: confirmacao }); lembrar(); confirmacao = ''; exibirEstado(p); }
    catch (erro) { if (erro.status === 410) novoFormulario(); mostrarMensagem(erro.message, true); }
    finally { $('confirmar').disabled = false; }
  });
  $('reenviar').addEventListener('click', async () => {
    if (!desafio) { mostrarMensagem('Refaça a verificação de segurança antes de reenviar.', true); return; }
    $('reenviar').disabled = true;
    try { const p = await api('/reenviar', { turnstile: desafio }); mostrarMensagem(p.mensagem); aguardarReenvio(); }
    catch (erro) { mostrarMensagem(erro.message, true); $('reenviar').disabled = false; }
    finally { limparDesafio(); }
  });
  const iniciar = async () => {
    confirmacao = new URLSearchParams(location.hash.slice(1)).get('confirmar') || '';
    if (confirmacao) history.replaceState(null, '', location.pathname);
    try {
      configuracao = await api('/configuracao');
      $('resumo-trial').textContent = configuracao.habilitado ? `Experimente por ${configuracao.dias} dias a partir do ambiente pronto. Sem cartão e sem cobrança automática.` : 'As inscrições estão pausadas no momento. Fale com nossa equipe para conhecer a LUNA.';
      if (confirmacao) { $('resumo-trial').textContent = 'Confirme o e-mail para preparar o teste solicitado. O prazo começa com o ambiente pronto.'; $('confirmacao').hidden = false; $('confirmar').disabled = !configuracao.habilitado; }
      else if (temPedido()) await acompanhar();
      else if (configuracao.disponivel) { form.hidden = false; seguranca(true); }
      else if (configuracao.habilitado) mostrarMensagem('As vagas de teste estão ocupadas. Tente mais tarde ou fale com nossa equipe.');
      if (configuracao.habilitado && !confirmacao) carregarTurnstile();
    } catch { $('resumo-trial').textContent = 'Não foi possível consultar as vagas agora.'; mostrarMensagem('Tente novamente em instantes ou fale com nossa equipe pelo WhatsApp.', true); }
  };
  window.addEventListener('hashchange', () => {
    const token = new URLSearchParams(location.hash.slice(1)).get('confirmar');
    if (!token) return;
    confirmacao = token;
    history.replaceState(null, '', location.pathname);
    clearTimeout(consulta);
    if (!configuracao) return;
    form.hidden = true; status.hidden = true; $('confirmacao').hidden = false;
    $('confirmar').disabled = !configuracao.habilitado; seguranca(false); mostrarMensagem('');
    $('resumo-trial').textContent = 'Confirme o e-mail para preparar o teste solicitado. O prazo começa com o ambiente pronto.';
  });
  iniciar();
})();
