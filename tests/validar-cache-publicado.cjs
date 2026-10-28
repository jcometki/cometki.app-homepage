// Exercita o pacote real com uma configuração antiga simulada no navegador.
const assert = require('node:assert/strict');
const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL;
if (!base) throw new Error('Informe BASE_URL do Nginx local.');
(async () => {
  for (const [nome, motor] of Object.entries({ chromium, webkit })) {
    const executablePath = process.env[nome === 'chromium' ? 'PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH' : 'PLAYWRIGHT_WEBKIT_EXECUTABLE_PATH'];
    const browser = await motor.launch({ headless: true, executablePath: executablePath || undefined });
    try {
      const page = await browser.newPage();
      const erros = [];
      page.on('pageerror', e => erros.push(e.message));
      await page.route('**/assets/js/configuracao.js*', r => r.fulfill({ contentType: 'application/javascript', body: `window.LUNA_CONFIG={whatsapp:'5567992938193',urlTrial:'',textoAcao:'Antigo'};` }));
      await page.route('**/api/trials/configuracao', r => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ habilitado: true, disponivel: true }) }));
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelector('#cta-principal').href.endsWith('/experimentar'));
      assert.ok((await page.locator('#cta-principal').innerText()).includes('Começar meu teste'));
      assert.ok(await page.locator('script[src*="configuracao.h"]').count());
      assert.deepEqual(erros, []);
      console.log(`OK (${nome}): configuração antiga não interfere na publicação com URLs assinadas.`);
    } finally { await browser.close(); }
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
