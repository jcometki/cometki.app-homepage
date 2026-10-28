// Dados fictícios e requisições interceptadas: não acessa provedores nem produção.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const raiz = path.resolve(__dirname, '..');

(async () => {
  for (const [nome, motor] of Object.entries({ chromium, webkit })) {
    const executavel = process.env[nome === 'chromium' ? 'PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH' : 'PLAYWRIGHT_WEBKIT_EXECUTABLE_PATH'];
    const browser = await motor.launch({ headless: true, executablePath: executavel || undefined });
    try {
      const page = await browser.newPage();
      const erros = [], envios = [];
      let aberto = true, estado = 'aguardando_verificacao', expirado = false;
      page.on('pageerror', e => erros.push(e.message));
      await page.route('**/*', async rota => {
        const r = rota.request(), u = new URL(r.url());
        if (u.hostname === 'challenges.cloudflare.com') return rota.fulfill({ contentType: 'application/javascript', body: `window.turnstile={reset:()=>window.lunaTrialToken('token-ficticio')};window.turnstile.render=(el,op)=>{if(op.size!=='compact')throw new Error('Widget deve caber em celular');const bloco=document.createElement('div');bloco.style.width='150px';bloco.style.height='140px';bloco.textContent='Verificação de segurança simulada';document.querySelector(el).append(bloco);window.lunaTrialToken=op.callback;op.callback('token-ficticio');return 'widget';};window.lunaTrialTurnstilePronto();` });
        assert.equal(u.hostname, 'luna.cometki.app');
        if (u.pathname.startsWith('/api/trials')) {
          let payload = {}, status = 200;
          if (u.pathname.endsWith('/configuracao')) payload = { habilitado: aberto, disponivel: aberto, dias: 7, revisao: 1, siteKey: 'sitekey-publica-ficticia', versaoTermos: 'trial-2026-10-28' };
          else if (r.method() === 'POST') {
            envios.push({ caminho: u.pathname, dados: r.postDataJSON() });
            status = 202;
            if (u.pathname.endsWith('/confirmar')) { estado = 'provisionando'; if (expirado) { status = 410; payload = { mensagem: 'A confirmação expirou.' }; } }
            else payload = { mensagem: 'Confira seu e-mail.', estado: 'aguardando_verificacao' };
            if (status === 202 && u.pathname.endsWith('/confirmar')) payload = { estado: 'provisionando' };
          } else payload = { estado, endereco: 'https://studio-aurora-ficticio.cometki.app' };
          return rota.fulfill({ status, contentType: 'application/json', body: JSON.stringify(payload) });
        }
        const arquivo = u.pathname === '/experimentar' ? 'experimentar/index.html' : u.pathname.slice(1);
        assert.ok(arquivo === 'experimentar/index.html' || arquivo.startsWith('assets/'));
        const tipos = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
        return rota.fulfill({ contentType: tipos[path.extname(arquivo)], body: await fs.readFile(path.join(raiz, arquivo)) });
      });
      await page.goto('https://luna.cometki.app/experimentar');
      await page.locator('#form-trial').waitFor({ state: 'visible' });
      await page.waitForFunction(() => Boolean(window.turnstile));
      for (const largura of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width: largura, height: 1000 });
        await page.evaluate(() => document.fonts.ready);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${nome}: rolagem em ${largura}px`);
        if (nome === 'chromium' && [390, 1440].includes(largura)) {
          await fs.mkdir(path.join(raiz, 'outputs/trial'), { recursive: true });
          await page.screenshot({ path: path.join(raiz, `outputs/trial/${largura}.png`), fullPage: true });
        }
      }
      await page.locator('#nome').fill('Studio Aurora');
      await page.locator('#email').fill('pessoa@example.com');
      await page.locator('#aceite').check();
      await page.locator('#solicitar').click();
      await page.locator('#acompanhamento').waitFor({ state: 'visible' });
      assert.equal(envios[0].dados.nome, 'Studio Aurora');
      assert.deepEqual(Object.keys(envios[0].dados).sort(), ['aceiteTermos', 'email', 'nome', 'revisao', 'turnstile', 'versaoTermos']);
      assert.equal(envios.filter(e => e.caminho.endsWith('/confirmar')).length, 0);
      await page.goto('https://luna.cometki.app/experimentar#confirmar=token-ficticio');
      await page.locator('#confirmar').waitFor({ state: 'visible' });
      assert.equal(new URL(page.url()).hash, '');
      assert.equal(envios.filter(e => e.caminho.endsWith('/confirmar')).length, 0, 'Abrir link disparou provisionamento');
      await page.locator('#confirmar').click();
      await page.locator('#acompanhamento').waitFor({ state: 'visible' });
      assert.equal(envios.filter(e => e.caminho.endsWith('/confirmar')).length, 1);
      estado = 'pronto';
      await page.reload();
      await page.locator('#abrir-luna').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#abrir-luna').getAttribute('href'), 'https://studio-aurora-ficticio.cometki.app');
      expirado = true;
      await page.goto('https://luna.cometki.app/experimentar#confirmar=token-expirado');
      await page.locator('#confirmar').click();
      await page.locator('#form-trial').waitFor({ state: 'visible' });
      aberto = false;
      await page.goto('https://luna.cometki.app/experimentar');
      assert.ok(await page.locator('#resumo-trial').innerText().then(t => t.includes('pausadas')));
      assert.equal(await page.locator('#form-trial').isVisible(), false);
      assert.deepEqual(erros, []);
      console.log(`OK (${nome}): cadastro mínimo, confirmação por clique, estado pronto, link expirado, inscrições pausadas e 320–1440px.`);
    } finally { await browser.close(); }
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
