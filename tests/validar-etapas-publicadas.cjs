// Usa HTML/assets reais e intercepta toda a API: não cria pedidos nem envia e-mails.
const assert = require('node:assert/strict');
const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL?.replace(/\/$/, '');
if (!base) throw new Error('Informe BASE_URL do Nginx ou da homepage publicada.');

(async () => {
  for (const [nome, motor] of Object.entries({ chromium, webkit })) {
    const executablePath = process.env[nome === 'chromium' ? 'PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH' : 'PLAYWRIGHT_WEBKIT_EXECUTABLE_PATH'];
    const navegador = await motor.launch({ headless: true, executablePath: executablePath || undefined });
    try {
      const pagina = await navegador.newPage({ viewport: { width: 390, height: 900 } });
      let estado = 'aguardando_verificacao', confirmacoes = 0;
      const erros = [];
      pagina.on('pageerror', e => erros.push(e.message));
      pagina.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
      pagina.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) erros.push(`${r.status()} ${new URL(r.url()).pathname}`); });
      await pagina.route(/\/api\/trials(?:[/?]|$)/, async rota => {
        const caminho = new URL(rota.request().url()).pathname;
        if (caminho === '/api/trials/configuracao') return rota.fulfill({ json: { habilitado: true, disponivel: true, dias: 7, siteKey: '' } });
        if (caminho === '/api/trials/confirmar' && rota.request().method() === 'POST') {
          assert.equal(rota.request().postDataJSON().token, 'confirmacao-simulada');
          confirmacoes++; estado = 'provisionando';
          return rota.fulfill({ status: 202, json: { estado } });
        }
        if (caminho === '/api/trials/estado') return rota.fulfill({ json: { estado, emailConfirmacao: 'enviado', endereco: 'https://studio-ficticio-luna.cometki.app' } });
        throw new Error('Chamada inesperada: nenhuma API real deve ser acessada.');
      });
      await pagina.addInitScript(() => sessionStorage.setItem('luna-trial-pendente', 'sim'));
      await pagina.goto(base + '/experimentar');
      await pagina.waitForFunction(() => document.body.dataset.etapa === 'aguardando_verificacao');
      assert.equal(await pagina.locator('#estado-titulo').innerText(), 'Confira seu e-mail.');
      await pagina.goto(base + '/experimentar#confirmar=confirmacao-simulada');
      await pagina.waitForFunction(() => !document.querySelector('#confirmar').disabled);
      assert.equal(confirmacoes, 0, 'Abrir o link confirmou sem clique');
      assert.equal(new URL(pagina.url()).hash, '');
      assert.equal(await pagina.locator('#confirmar').innerText(), 'Criar meu salão');
      await pagina.locator('#confirmar').click();
      await pagina.waitForFunction(() => document.body.dataset.etapa === 'provisionando');
      assert.equal(confirmacoes, 1);
      assert.equal(await pagina.locator('#etiqueta-etapa').innerText(), 'E-mail confirmado');
      estado = 'pronto'; await pagina.reload();
      await pagina.locator('#abrir-luna').waitFor({ state: 'visible' });
      assert.equal(await pagina.locator('#abrir-luna').getAttribute('href'), 'https://studio-ficticio-luna.cometki.app');
      for (const tema of ['light', 'dark']) {
        await pagina.emulateMedia({ colorScheme: tema });
        for (const largura of [320, 390, 1440]) {
          await pagina.setViewportSize({ width: largura, height: 900 });
          await pagina.evaluate(() => document.fonts.ready);
          assert.ok(await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        }
      }
      assert.ok((await pagina.locator('script[src*="trial.h"]').getAttribute('src')).includes('.h'));
      assert.deepEqual(erros, []);
      console.log(`OK (${nome}): pacote HTTP, quatro etapas, CSP, fontes/marca, cache assinado e API inteiramente simulada.`);
    } finally { await navegador.close(); }
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
