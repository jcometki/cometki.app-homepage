/* Validação de desenvolvimento: Playwright não é incluído na imagem de produção. */
const assert = require('node:assert/strict');
const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL;
if (!base) throw new Error('Informe BASE_URL.');

(async () => {
  for (const [motor, larguras] of [[chromium, [320, 360, 390, 430, 768, 1024, 1440, 1920]], [webkit, [390, 768, 1440]]]) {
    const browser = await motor.launch({ headless: true });
    try {
      for (const largura of larguras) {
        const page = await browser.newPage({ viewport: { width: largura, height: 900 } });
        const erros = [];
        page.on('pageerror', e => erros.push(e.message));
        page.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
        page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) erros.push(r.status() + ' ' + r.url()); });
        assert.equal((await page.goto(base, { waitUntil: 'networkidle' })).status(), 200);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://luna.cometki.app/');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Rolagem horizontal: ' + largura);
        if (largura <= 700) {
          await page.locator('.abrir-menu').click();
          assert.equal(await page.locator('.abrir-menu').getAttribute('aria-expanded'), 'true');
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('.abrir-menu').getAttribute('aria-expanded'), 'false');
        }
        const titulos = {
          agenda: 'Cada horário, no seu lugar.',
          financeiro: 'Clareza para decidir melhor.',
          equipe: 'Contas claras. Equipe tranquila.',
          clientes: 'Quem volta merece ser lembrada.'
        };
        for (const [nome, esperado] of Object.entries(titulos)) {
          await page.locator('#aba-' + nome).click();
          const painel = page.locator('#painel-' + nome);
          assert.ok(await painel.isVisible());
          const titulo = (await painel.locator('h3').innerText()).replace(/\s+/g, ' ').trim();
          assert.equal(titulo, esperado);
          if (largura <= 700) {
            const duvidas = (await page.locator('#titulo-duvidas').innerText()).replace(/\s+/g, ' ').trim();
            assert.equal(duvidas, 'Antes do primeiro “oi”.');
          }
          const origem = painel.locator('.ampliavel');
          await origem.click();
          assert.ok(await page.locator('#visualizador').isVisible());
          await page.locator('#imagem-ampliada').evaluate(img => img.decode());
          await page.keyboard.press('Escape');
          assert.ok(await origem.evaluate(el => el === document.activeElement));
        }
        await page.locator('#abrir-privacidade').click();
        assert.ok(await page.locator('#privacidade').isVisible());
        await page.keyboard.press('Escape');
        for (const href of await page.locator('a.contato').evaluateAll(els => els.map(el => el.href))) {
          const url = new URL(href);
          assert.equal(url.host, 'wa.me');
          assert.equal(url.pathname, '/5567992938193');
        }
        await page.evaluate(async () => {
          for (const img of document.images) {
            if (img.getBoundingClientRect().width > 0) {
              img.loading = 'eager';
              await img.decode();
            }
          }
        });
        assert.deepEqual(erros, []);
        if (process.env.CAPTURAS_DIR && [390, 1440].includes(largura)) {
          // WebKit injeta CSS interno ao capturar. Isolar a imagem da validação
          // estrita acima; não relaxar a CSP do site nem ignorar seus erros.
          const captura = await browser.newContext({ viewport: { width: largura, height: 900 }, bypassCSP: true });
          try {
            const foto = await captura.newPage();
            await foto.goto(base, { waitUntil: 'networkidle' });
            await foto.evaluate(async () => {
              await document.fonts.ready;
              for (const img of document.images) {
                if (img.getBoundingClientRect().width > 0) { img.loading = 'eager'; await img.decode(); }
              }
            });
            await foto.screenshot({ path: process.env.CAPTURAS_DIR + '/' + motor.name() + '-' + largura + '.png', fullPage: true });
          } finally { await captura.close(); }
        }
        console.log(motor.name() + ' ' + largura + ' px: layout, assets, diálogos e WhatsApp OK');
        await page.close();
      }
      const contexto = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
      const pagina = await contexto.newPage();
      await pagina.goto(base);
      assert.ok(await pagina.locator('h1').isVisible());
      assert.match(await pagina.locator('#cta-principal').getAttribute('href'), /^https:\/\/wa.me\/5567992938193/);
      await contexto.close();
    } finally {
      await browser.close();
    }
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
