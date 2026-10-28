/* Melhoria progressiva: conteúdo e contato funcionam mesmo sem JavaScript. */
(() => {
  'use strict';
  const configuracao = window.LUNA_CONFIG || {};
  const menu = document.getElementById('menu');
  const botaoMenu = document.querySelector('.abrir-menu');
  const fecharMenu = () => {
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
    menu.classList.remove('aberto');
  };
  botaoMenu.addEventListener('click', () => {
    const aberto = botaoMenu.getAttribute('aria-expanded') !== 'true';
    botaoMenu.setAttribute('aria-expanded', String(aberto));
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('aberto', aberto);
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', fecharMenu));
  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && menu.classList.contains('aberto')) {
      fecharMenu();
      botaoMenu.focus();
    }
  });
  document.addEventListener('click', evento => {
    if (!menu.contains(evento.target) && !botaoMenu.contains(evento.target)) fecharMenu();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', fecharMenu);

  const abas = Array.from(document.querySelectorAll('[role="tab"]'));
  function selecionarAba(aba, focar = false) {
    abas.forEach(item => {
      const selecionada = item === aba;
      item.setAttribute('aria-selected', String(selecionada));
      item.tabIndex = selecionada ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selecionada;
    });
    if (focar) aba.focus({ preventScroll: true });
  }
  abas.forEach((aba, indice) => {
    aba.addEventListener('click', () => selecionarAba(aba));
    aba.addEventListener('keydown', evento => {
      const destinos = { ArrowRight: (indice + 1) % abas.length, ArrowLeft: (indice - 1 + abas.length) % abas.length, Home: 0, End: abas.length - 1 };
      if (!(evento.key in destinos)) return;
      evento.preventDefault();
      selecionarAba(abas[destinos[evento.key]], true);
    });
  });

  const visualizador = document.getElementById('visualizador');
  const imagemAmpliada = document.getElementById('imagem-ampliada');
  const tituloVisualizador = document.getElementById('titulo-visualizador');
  let origemDoDialogo = null;
  const abrirDialogo = (dialogo, origem = document.activeElement) => {
    // No Safari, um clique nem sempre transfere o foco para o botão.
    origemDoDialogo = origem;
    dialogo.showModal();
    document.body.classList.add('dialogo-aberto');
  };
  document.querySelectorAll('.ampliavel').forEach(botao => {
    botao.addEventListener('click', () => {
      const imagem = botao.querySelector('img');
      imagemAmpliada.src = imagem.currentSrc || imagem.src;
      imagemAmpliada.alt = imagem.alt;
      tituloVisualizador.textContent = botao.dataset.titulo;
      abrirDialogo(visualizador, botao);
    });
  });
  document.querySelectorAll('dialog').forEach(dialogo => {
    dialogo.querySelector('.fechar-dialogo').addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('click', evento => {
      const limites = dialogo.getBoundingClientRect();
      if (evento.target === dialogo && (evento.clientX < limites.left || evento.clientX > limites.right || evento.clientY < limites.top || evento.clientY > limites.bottom)) dialogo.close();
    });
    dialogo.addEventListener('close', () => {
      document.body.classList.remove('dialogo-aberto');
      origemDoDialogo?.focus({ preventScroll: true });
    });
  });
  document.getElementById('abrir-privacidade').addEventListener('click', evento => abrirDialogo(document.getElementById('privacidade'), evento.currentTarget));

  // O cadastro público só é promovido quando há inscrições e vagas disponíveis.
  let destinoTrial = null;
  if (configuracao.urlTrial) {
    try {
      const endereco = new URL(configuracao.urlTrial);
      if (endereco.protocol === 'https:') destinoTrial = endereco.href;
    } catch { /* Mantém o WhatsApp se a configuração estiver inválida. */ }
  }
  const telefone = String(configuracao.whatsapp || '').replace(/\D/g, '');
  document.querySelectorAll('a.contato').forEach(link => {
    if (telefone.length >= 10 && telefone.length <= 15) {
      link.href = 'https://wa.me/' + telefone + '?text=' + encodeURIComponent(configuracao.mensagem || 'Olá! Quero conhecer a LUNA.');
    }
  });
  if (destinoTrial) {
    fetch('/api/trials/configuracao', { credentials: 'omit', cache: 'no-store' })
      .then(resposta => resposta.ok ? resposta.json() : null)
      .then(dados => {
        if (!dados?.habilitado || !dados?.disponivel) return;
        document.querySelectorAll('a.acao-produto').forEach(link => {
          link.href = destinoTrial;
          link.removeAttribute('target');
          if (configuracao.textoAcao) link.childNodes[0].textContent = configuracao.textoAcao + ' ';
        });
      }).catch(() => { /* O WhatsApp permanece disponível se a API falhar. */ });
  }
  document.getElementById('ano').textContent = new Date().getFullYear();

  const barra = document.getElementById('barra-celular');
  const cta = document.getElementById('cta-principal');
  const convite = document.getElementById('conhecer');
  const telaPequena = window.matchMedia('(max-width: 700px)');
  let conviteVisivel = false;
  const atualizarBarra = () => {
    barra.hidden = !telaPequena.matches || cta.getBoundingClientRect().bottom > 0 || conviteVisivel;
  };
  if ('IntersectionObserver' in window) {
    const observar = new IntersectionObserver(entradas => {
      entradas.forEach(entrada => {
        if (entrada.target === convite) conviteVisivel = entrada.isIntersecting;
      });
      atualizarBarra();
    }, { threshold: 0 });
    observar.observe(cta);
    observar.observe(convite);
    telaPequena.addEventListener('change', atualizarBarra);
  }
})();
