/* O HTML mantém o contato como alternativa quando o JavaScript não está disponível. */
(() => {
  'use strict';
  const c = window.LUNA_CONFIG || {};
  if (!/^[0-9]{10,15}$/.test(c.whatsapp || '')) return;
  for (const link of document.querySelectorAll('a[href^="https://wa.me/"]')) {
    const url = new URL('https://wa.me/' + c.whatsapp);
    if (c.mensagem) url.searchParams.set('text', c.mensagem);
    link.href = url.href;
  }
})();
