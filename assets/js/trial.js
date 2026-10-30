(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const form = $('form-trial'), status = $('acompanhamento'), mensagem = $('mensagem');
  let configuracao, widget, desafio = '', confirmacao = '', consulta, reenvio, scriptCarregado = false;
  const mostrarMensagem = (texto, erro = false) => { mensagem.textContent = texto; mensagem.classList.toggle('erro', erro); mensagem.hidden = !texto; };
  const descrever = (elemento, texto) => {
    const destaque = 'espaço exclusivo para o seu salão';
    elemento.textContent = texto;
    if (!texto.includes(destaque)) return;
    const [antes, depois] = texto.split(destaque);
    const forte = document.createElement('strong'); forte.textContent = destaque;
    elemento.replaceChildren(document.createTextNode(antes), forte, document.createTextNode(depois));
  };
  const apresentarEtapa = (etapa, detalhes = {}) => {
    document.body.dataset.etapa = etapa;
    const acompanhamento = !['cadastro', 'confirmacao', 'carregando'].includes(etapa);
    // Elementos opcionais preservam páginas antigas durante o rollout/cache.
    if ($('apresentacao-trial')) $('apresentacao-trial').hidden = acompanhamento;
    if ($('cartao-trial')) $('cartao-trial').setAttribute('aria-labelledby', acompanhamento ? 'estado-titulo' : 'titulo-formulario');
    if ($('icone-etapa')) $('icone-etapa').hidden = etapa === 'cadastro' || etapa === 'carregando';
    $('simbolo-etapa')?.setAttribute('href', '#trial-' + (detalhes.icone || 'email'));
    if ($('etiqueta-etapa')) $('etiqueta-etapa').textContent = detalhes.etiqueta || 'COMECE POR AQUI';
    if ($('detalhe-etapa')) {
      $('detalhe-etapa').hidden = !detalhes.detalhe;
      $('detalhe-titulo').textContent = detalhes.detalheTitulo || '';
      $('detalhe-texto').textContent = detalhes.detalhe || '';
    }
    if ($('progresso-trial')) {
      $('progresso-trial').hidden = detalhes.passo === undefined;
      for (const item of $('progresso-trial').querySelectorAll('[data-passo]')) {
        const passo = Number(item.dataset.passo), feito = passo < detalhes.passo || etapa === 'pronto';
        item.dataset.feito = String(feito);
        item.querySelector('.numero-passo').textContent = feito ? '✓' : String(passo + 1);
        if (passo === detalhes.passo) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
      }
    }
    if (etapa === 'cadastro') {
      $('titulo-formulario').textContent = 'Seu teste da LUNA';
      $('resumo-trial').textContent = configuracao?.habilitado ? `Você terá ${configuracao.dias} dias para conhecer a LUNA. Sem cartão e sem cobrança automática.` : 'As inscrições estão pausadas no momento. Fale com nossa equipe para conhecer a LUNA.';
    }
  };
  const focarEtapa = () => {
    const titulo = status.hidden ? $('titulo-formulario') : $('estado-titulo');
    titulo.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'auto' });
  };
  const api = async (rota, dados, controle = new AbortController()) => {
    const fim = setTimeout(() => controle.abort(), 15000);
    try {
      const r = await fetch('/api/trials' + rota, { method: dados ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store', headers: dados ? { 'Content-Type': 'application/json' } : {}, body: dados ? JSON.stringify(dados) : undefined, signal: controle.signal });
      const p = await r.json().catch(() => ({}));
      if (!r.ok) throw Object.assign(new Error(p.mensagem || 'Não foi possível concluir agora. Tente novamente ou fale com nossa equipe.'), { status: r.status, codigo: p.codigo });
      return p;
    } finally { clearTimeout(fim); }
  };
  const identificador = $('identificador'), estadoEndereco = $('endereco-estado');
  const formatoEndereco = /^[a-z0-9][a-z0-9-]{0,46}[a-z0-9]$/;
  let enderecoEditado = false, enderecoDisponivel = '', consultaEndereco, atrasoEndereco, revisaoEndereco = 0, enviando = false;
  const atualizarBotaoCadastro = () => { $('solicitar').disabled = enviando || Boolean(identificador && (enderecoDisponivel !== identificador.value || !enderecoDisponivel)); };
  const indicarEndereco = (texto, estado = '') => { estadoEndereco.textContent = texto; estadoEndereco.dataset.estado = estado; };
  const verificarEndereco = async () => {
    if (!identificador) return true;
    clearTimeout(atrasoEndereco); consultaEndereco?.abort();
    const revisao = ++revisaoEndereco, base = identificador.value;
    enderecoDisponivel = ''; atualizarBotaoCadastro();
    $('endereco-sugestoes').replaceChildren(); $('endereco-sugestoes').hidden = true; $('tentar-endereco').hidden = true;
    $('endereco-previa').textContent = base ? base + '-luna.cometki.app' : 'Escolha como as pessoas vão encontrar seu salão.';
    if (!formatoEndereco.test(base)) {
      indicarEndereco(base ? 'Use de 2 a 48 letras, números ou hífens, começando e terminando com letra ou número.' : '', base ? 'erro' : '');
      identificador.setAttribute('aria-invalid', base ? 'true' : 'false'); return false;
    }
    indicarEndereco('Verificando…'); identificador.setAttribute('aria-invalid', 'false');
    const controle = consultaEndereco = new AbortController();
    try {
      const p = await api('/endereco?identificador=' + encodeURIComponent(base), undefined, controle);
      if (revisao !== revisaoEndereco || base !== identificador.value) return false;
      if (p.identificador !== base || p.endereco !== base + '-luna.cometki.app') throw new Error('Resposta diferente do endereço escolhido');
      if (p.disponivel === true) { enderecoDisponivel = base; indicarEndereco('Disponível', 'disponivel'); atualizarBotaoCadastro(); return true; }
      indicarEndereco('Esse endereço já está em uso. Escolha outra opção.', 'ocupado'); identificador.setAttribute('aria-invalid', 'true');
      for (const opcao of Array.isArray(p.sugestoes) ? p.sugestoes.slice(0, 3) : []) {
        if (!formatoEndereco.test(opcao.identificador) || opcao.endereco !== opcao.identificador + '-luna.cometki.app') continue;
        const botao = document.createElement('button'); botao.type = 'button'; botao.textContent = opcao.endereco;
        botao.addEventListener('click', () => { enderecoEditado = true; identificador.value = opcao.identificador; verificarEndereco(); identificador.focus(); });
        $('endereco-sugestoes').append(botao);
      }
      $('endereco-sugestoes').hidden = !$('endereco-sugestoes').childElementCount;
    } catch {
      if (revisao !== revisaoEndereco || base !== identificador.value) return false;
      indicarEndereco('Não conseguimos verificar agora. Tente novamente.', 'erro'); $('tentar-endereco').hidden = false;
    }
    return false;
  };
  const agendarEndereco = () => {
    clearTimeout(atrasoEndereco); consultaEndereco?.abort(); ++revisaoEndereco;
    enderecoDisponivel = ''; atualizarBotaoCadastro();
    $('endereco-sugestoes').replaceChildren(); $('endereco-sugestoes').hidden = true; $('tentar-endereco').hidden = true;
    $('endereco-previa').textContent = identificador.value ? identificador.value + '-luna.cometki.app' : 'Escolha como as pessoas vão encontrar seu salão.';
    indicarEndereco(identificador.value ? 'Verificando…' : '');
    atrasoEndereco = setTimeout(verificarEndereco, 500);
  };
  $('nome').addEventListener('input', () => {
    if (!identificador || enderecoEditado) return;
    const base = $('nome').value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s_-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40).replace(/-+$/g, '');
    identificador.value = base; agendarEndereco();
  });
  identificador?.addEventListener('input', () => { enderecoEditado = true; agendarEndereco(); });
  $('tentar-endereco')?.addEventListener('click', verificarEndereco);
  const limparDesafio = () => { desafio = ''; if (widget !== undefined) window.turnstile?.reset(widget); };
  const seguranca = visivel => { $('turnstile').hidden = !visivel; $('nota-seguranca').hidden = !visivel; };
  window.lunaTrialTurnstilePronto = () => {
    widget = window.turnstile.render('#turnstile', { sitekey: configuracao.siteKey, action: 'luna_trial', language: 'pt-br', size: 'compact', callback: token => { desafio = token; }, 'expired-callback': () => { desafio = ''; }, 'error-callback': () => { desafio = ''; mostrarMensagem('Não conseguimos confirmar agora. Atualize a página e tente novamente.', true); } });
  };
  const carregarTurnstile = () => {
    if (!configuracao.siteKey || scriptCarregado || $('turnstile').hidden) return;
    scriptCarregado = true;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=lunaTrialTurnstilePronto&render=explicit';
    script.async = true; script.defer = true;
    script.onerror = () => mostrarMensagem('Algo não carregou. Atualize a página ou fale com nossa equipe.', true);
    document.head.append(script);
  };
  const lembrar = () => { try { sessionStorage.setItem('luna-trial-pendente', 'sim'); } catch {} };
  const temPedido = () => { try { return sessionStorage.getItem('luna-trial-pendente') === 'sim'; } catch { return false; } };
  const aguardarReenvio = () => { $('reenviar').disabled = true; clearTimeout(reenvio); reenvio = setTimeout(() => { $('reenviar').disabled = false; }, 60000); };
  const exibirEstado = p => {
    form.hidden = true; $('confirmacao').hidden = true; status.hidden = false; $('abrir-luna').hidden = true; $('reenviar').hidden = true; seguranca(false);
    const textos = {
      aguardando_verificacao: { titulo: 'Confira seu e-mail.', texto: p.emailConfirmacao === 'enviado' ? 'Enviamos um link para você confirmar o cadastro e começar seu teste da LUNA.' : 'Você receberá um link para confirmar o cadastro e começar seu teste da LUNA.', etiqueta: 'Pedido recebido', icone: 'email', passo: 0, detalheTitulo: 'Não encontrou?', detalhe: 'Confira também a caixa de spam. O link de confirmação vale por 30 minutos.' },
      provisionando: { titulo: 'Estamos preparando sua LUNA.', texto: 'Obrigado por confirmar! Estamos criando um espaço exclusivo para o seu salão, com seus dados e configurações.', etiqueta: 'E-mail confirmado', icone: 'check', passo: 1, detalheTitulo: 'Pode fechar esta página.', detalhe: 'Assim que estiver tudo pronto, enviaremos o endereço e o código de configuração inicial por e-mail. Seu teste começa quando sua LUNA estiver pronta.' },
      pronto: { titulo: 'Sua LUNA está pronta!', texto: 'Agora é com você: configure seu salão, conecte seu WhatsApp e comece a experimentar.', etiqueta: 'Tudo pronto', icone: 'brilho', passo: 2, detalheTitulo: 'Confira seu e-mail.', detalhe: 'Enviamos o endereço da sua LUNA e o código de configuração inicial para você começar.' },
      restrito: { titulo: 'Seu teste terminou', texto: 'Você ainda pode consultar seus dados na LUNA. Para continuar usando todos os recursos, converse com nossa equipe.', etiqueta: 'Seu teste', icone: 'aviso' },
      expirado: { titulo: 'Seu link não é mais válido', texto: 'Peça um novo e-mail para continuar.', etiqueta: 'Link expirado', icone: 'email', passo: 0 },
      falhou: { titulo: 'Vamos ajudar você a começar', texto: 'Seu pedido está salvo. Fale com nossa equipe para continuarmos; não precisa fazer outro cadastro.', etiqueta: 'Conte com a gente', icone: 'aviso' },
      suspenso: { titulo: 'Seu acesso está pausado', texto: 'Fale com nossa equipe para continuar usando a LUNA.', etiqueta: 'Seu acesso', icone: 'aviso' },
      encerrado: { titulo: 'Este teste foi encerrado', texto: 'Fale com nossa equipe para saber como continuar.', etiqueta: 'Seu teste', icone: 'aviso' }
    };
    const etapa = Object.hasOwn(textos, p.estado) ? p.estado : 'falhou';
    const texto = textos[etapa]; $('estado-titulo').textContent = texto.titulo; descrever($('estado-texto'), texto.texto); apresentarEtapa(etapa, texto);
    if (['aguardando_verificacao', 'expirado'].includes(p.estado) && configuracao.habilitado) { $('reenviar').hidden = false; seguranca(true); }
    if (p.emailConfirmacao === 'erro' || p.emailConfirmacao === 'incerto') mostrarMensagem('O envio da confirmação teve uma falha. Você pode solicitar outro e-mail.', true);
    if (['pronto', 'restrito'].includes(p.estado) && /^https:\/\/[a-z0-9-]+\.cometki\.app$/.test(p.endereco || '')) { $('abrir-luna').href = p.endereco; $('abrir-luna').hidden = false; }
    clearTimeout(consulta);
    if (['aguardando_verificacao', 'provisionando'].includes(p.estado)) consulta = setTimeout(acompanhar, 15000);
  };
  const novoFormulario = () => {
    try { sessionStorage.removeItem('luna-trial-pendente'); } catch {}
    confirmacao = ''; $('confirmacao').hidden = true; status.hidden = true;
    apresentarEtapa('cadastro');
    form.hidden = !configuracao.disponivel; seguranca(configuracao.disponivel);
    if (configuracao.disponivel) carregarTurnstile();
  };
  const acompanhar = async () => { try { exibirEstado(await api('/estado')); } catch (erro) { if (erro.status === 410) { novoFormulario(); mostrarMensagem('O acompanhamento expirou. Confira seu e-mail de acesso ou faça uma nova solicitação.', true); } else mostrarMensagem('Não foi possível atualizar o estado. Seu pedido continua registrado; tente atualizar a página.', true); } };
  form.addEventListener('submit', async evento => {
    evento.preventDefault(); if (!form.reportValidity()) return;
    if (enviando) return;
    const escolhido = identificador?.value;
    if (!await verificarEndereco() || escolhido !== identificador?.value) return;
    if (!desafio) { mostrarMensagem('Conclua a verificação abaixo para continuar.', true); return; }
    enviando = true; atualizarBotaoCadastro(); mostrarMensagem('');
    try { const p = await api('', { nome: $('nome').value.trim(), email: $('email').value.trim(), identificador: escolhido, aceiteTermos: $('aceite').checked, versaoTermos: configuracao.versaoTermos, revisao: configuracao.revisao, turnstile: desafio }); lembrar(); exibirEstado(p); focarEtapa(); aguardarReenvio(); }
    catch (erro) { mostrarMensagem(erro.message, true); if (erro.codigo === 'endereco_ocupado') await verificarEndereco(); }
    finally { enviando = false; atualizarBotaoCadastro(); limparDesafio(); }
  });
  $('confirmar').addEventListener('click', async () => {
    $('confirmar').disabled = true; $('confirmar').textContent = 'Só um instante…'; mostrarMensagem('');
    try { const p = await api('/confirmar', { token: confirmacao }); lembrar(); confirmacao = ''; exibirEstado(p); focarEtapa(); }
    catch (erro) { if (erro.status === 410) novoFormulario(); mostrarMensagem(erro.message, true); }
    finally { $('confirmar').disabled = false; $('confirmar').textContent = 'Criar meu salão'; }
  });
  $('reenviar').addEventListener('click', async () => {
    if (!desafio) { mostrarMensagem('Conclua a verificação abaixo para pedir outro e-mail.', true); return; }
    $('reenviar').disabled = true;
    try { const p = await api('/reenviar', { turnstile: desafio }); mostrarMensagem(p.mensagem); aguardarReenvio(); }
    catch (erro) { mostrarMensagem(erro.message, true); $('reenviar').disabled = false; }
    finally { limparDesafio(); }
  });
  const mostrarConfirmacao = () => {
    clearTimeout(consulta); form.hidden = true; status.hidden = true; $('confirmacao').hidden = false;
    apresentarEtapa('confirmacao', { etiqueta: 'Só falta um passo', icone: 'confirmacao', passo: 0, detalheTitulo: 'Seu salão, do seu jeito.', detalhe: 'Depois, você configura sua LUNA e conecta seu WhatsApp. A gente cuida da preparação.' });
    $('titulo-formulario').textContent = 'Vamos criar sua LUNA?';
    descrever($('resumo-trial'), 'Seu salão terá um espaço exclusivo na LUNA. Clique em “Criar meu salão” para começarmos.');
    $('confirmar').textContent = 'Criar meu salão'; $('confirmar').disabled = !configuracao?.habilitado;
    seguranca(false); mostrarMensagem('');
  };
  const iniciar = async () => {
    confirmacao = new URLSearchParams(location.hash.slice(1)).get('confirmar') || '';
    if (confirmacao) history.replaceState(null, '', location.pathname);
    if (confirmacao) mostrarConfirmacao();
    try {
      configuracao = await api('/configuracao');
      if (confirmacao) mostrarConfirmacao();
      else if (temPedido()) await acompanhar();
      else {
        apresentarEtapa('cadastro');
        if (configuracao.disponivel) { form.hidden = false; seguranca(true); }
        else if (configuracao.habilitado) mostrarMensagem('As vagas de teste estão ocupadas. Tente mais tarde ou fale com nossa equipe.');
      }
      if (configuracao.habilitado && !confirmacao) carregarTurnstile();
    } catch { $('resumo-trial').textContent = 'Não foi possível consultar as vagas agora.'; mostrarMensagem('Tente novamente em instantes ou fale com nossa equipe pelo WhatsApp.', true); }
  };
  window.addEventListener('hashchange', () => {
    const token = new URLSearchParams(location.hash.slice(1)).get('confirmar');
    if (!token) return;
    confirmacao = token;
    history.replaceState(null, '', location.pathname);
    if (!configuracao) return;
    mostrarConfirmacao(); focarEtapa();
  });
  iniciar();
})();
