// Confere a troca do CTA em uma aba já aberta, sem acessar o Manager real.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const raiz = path.resolve(__dirname, '..');
(async () => {
  for (const [nome, motor] of Object.entries({ chromium, webkit })) {
    const executavel = process.env[nome === 'chromium' ? 'PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH' : 'PLAYWRIGHT_WEBKIT_EXECUTABLE_PATH'];
    const b = await motor.launch({ headless: true, executablePath: executavel || undefined });
    try {
      const p = await b.newPage();
      const erros = [];
      let aberto = false, vaga = true, falha = false;
      p.on('pageerror', e => erros.push(e.message));
      await p.route('**/*', async rota => {
        const u = new URL(rota.request().url());
        assert.equal(u.hostname, 'luna.cometki.app');
        if (u.pathname === '/api/trials/configuracao') return rota.fulfill({ status: falha ? 503 : 200, contentType: 'application/json', body: JSON.stringify({ habilitado: aberto, disponivel: vaga }) });
        const arq = u.pathname === '/' ? 'index.html' : u.pathname.slice(1);
        const tipos = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };
        return rota.fulfill({ contentType: tipos[path.extname(arq)], body: await fs.readFile(path.join(raiz, arq)) });
      });
      await p.clock.install();
      await p.goto('https://luna.cometki.app/');
      const cta = p.locator('#cta-principal');
      await p.waitForFunction(() => document.querySelector('#cta-principal').href.includes('wa.me'));
      aberto = true;
      await p.clock.fastForward(31000);
      await p.waitForFunction(() => document.querySelector('#cta-principal').href.endsWith('/experimentar'));
      assert.ok((await cta.innerText()).includes('Começar meu teste'));
      aberto = false;
      await p.evaluate(() => window.dispatchEvent(new Event('pageshow')));
      await p.waitForFunction(() => document.querySelector('#cta-principal').href.includes('wa.me'));
      assert.equal(await cta.getAttribute('target'), '_blank');
      aberto = true;
      await p.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
      await p.waitForFunction(() => document.querySelector('#cta-principal').href.endsWith('/experimentar'));
      vaga = false;
      await p.clock.fastForward(31000);
      await p.waitForFunction(() => document.querySelector('#cta-principal').href.includes('wa.me'));
      vaga = true; falha = true;
      await p.evaluate(() => window.dispatchEvent(new Event('pageshow')));
      assert.ok((await cta.getAttribute('href')).includes('wa.me'));
      assert.deepEqual(erros, []);
      console.log(`OK (${nome}): abre, pausa e esgota vagas sem recarregar; falhas preservam o WhatsApp.`);
    } finally { await b.close(); }
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
