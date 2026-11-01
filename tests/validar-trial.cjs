// Dados fictícios e requisições interceptadas: não acessa provedores nem produção.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const raiz = path.resolve(__dirname, '..');
const hostPublico = process.env.LUNA_TRIAL_HOST || 'luna.cometki.app';
const dominioClientes = process.env.LUNA_TRIAL_DOMINIO || 'meuluna.com';
const sufixoEndereco = process.env.LUNA_TRIAL_SUFIXO || (dominioClientes === 'cometki.app' ? '-luna.cometki.app' : '.meuluna.com');

(async () => {
  for (const [nome, motor] of Object.entries({ chromium, webkit })) {
    const executavel = process.env[nome === 'chromium' ? 'PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH' : 'PLAYWRIGHT_WEBKIT_EXECUTABLE_PATH'];
    const browser = await motor.launch({ headless: true, executablePath: executavel || undefined });
    try {
      const page = await browser.newPage();
      const erros = [], envios = [];
      let aberto = true, estado = 'aguardando_verificacao', expirado = false, disputar = true, paginaAntiga = false;
      let emailDestino = 'pessoa@example.com', emailConfirmacao = 'pendente';
      const ocupados = new Set(['studio-aurora', 'novo']);
      const consultas = [];
      page.on('pageerror', e => erros.push(e.message));
      await page.route('**/*', async rota => {
        const r = rota.request(), u = new URL(r.url());
        if (u.hostname === 'challenges.cloudflare.com') return rota.fulfill({ contentType: 'application/javascript', body: `window.turnstile={reset:()=>window.lunaTrialToken('token-ficticio')};window.turnstile.render=(el,op)=>{if(op.size!=='compact')throw new Error('Widget deve caber em celular');const bloco=document.createElement('div');bloco.style.width='150px';bloco.style.height='140px';bloco.textContent='Verificação de segurança simulada';document.querySelector(el).append(bloco);window.lunaTrialToken=op.callback;op.callback('token-ficticio');return 'widget';};window.lunaTrialTurnstilePronto();` });
        assert.equal(u.hostname, hostPublico);
        if (u.pathname.startsWith('/api/trials')) {
          let payload = {}, status = 200;
          if (u.pathname.endsWith('/configuracao')) payload = { habilitado: aberto, disponivel: aberto, dias: 7, revisao: 1, siteKey: 'sitekey-publica-ficticia', dominioClientes, sufixoEndereco, identificadoresReservados: ['www', 'db', 'gerencia'], versaoTermos: 'trial-2026-10-28' };
          else if (u.pathname.endsWith('/endereco')) {
            const base = u.searchParams.get('identificador'); consultas.push(base);
            if (base === 'antigo') await new Promise(r => setTimeout(r, 1100));
            payload = { identificador: base, endereco: base + sufixoEndereco, disponivel: !ocupados.has(base), sugestoes: ocupados.has(base) ? [2, 3, 4].map(n => ({ identificador: base + '-' + n, endereco: base + '-' + n + sufixoEndereco })) : [] };
          }
          else if (r.method() === 'POST') {
            envios.push({ caminho: u.pathname, dados: r.postDataJSON() });
            status = 202;
            if (u.pathname.endsWith('/confirmar')) { estado = 'provisionando'; if (expirado) { status = 410; payload = { mensagem: 'A confirmação expirou.' }; } }
            else if (u.pathname === '/api/trials' && disputar) { disputar = false; ocupados.add(r.postDataJSON().identificador); status = 409; payload = { codigo: 'endereco_ocupado', mensagem: 'Esse endereço já está em uso. Escolha outra opção.' }; }
            else payload = { mensagem: 'Confira seu e-mail.', estado: 'aguardando_verificacao', email: emailDestino };
            if (status === 202 && u.pathname.endsWith('/confirmar')) payload = { estado: 'provisionando' };
          } else payload = { estado, endereco: 'https://studio-aurora-ficticio.cometki.app', email: estado === 'aguardando_verificacao' ? emailDestino : undefined, emailConfirmacao };
          return rota.fulfill({ status, contentType: 'application/json', body: JSON.stringify(payload) });
        }
        const arquivo = u.pathname === '/experimentar' ? 'experimentar/index.html' : u.pathname.slice(1);
        assert.ok(arquivo === 'experimentar/index.html' || arquivo.startsWith('assets/'));
        const tipos = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
        const origem = paginaAntiga && arquivo === 'experimentar/index.html' ? 'tests/fixtures/experimentar-1.5.1.html' : arquivo;
        return rota.fulfill({ contentType: tipos[path.extname(arquivo)], body: await fs.readFile(path.join(raiz, origem)) });
      });
      const conferirEtapa = async (etapa, titulo) => {
        assert.equal(await page.locator('body').getAttribute('data-etapa'), etapa);
        assert.equal(await page.locator('.convite-trial').isVisible(), false, 'Repetiu a chamada do formulário depois do cadastro');
        assert.equal(await page.locator('.condicoes-trial').isVisible(), false);
        assert.equal(await page.locator('.cartao-trial h2:visible').count(), 1, 'Etapa com títulos duplicados');
        assert.equal(await page.locator('.cartao-trial h2:visible').innerText(), titulo);
        for (const tema of ['light', 'dark']) {
          await page.emulateMedia({ colorScheme: tema });
          for (const largura of [320, 390, 1440]) {
            await page.setViewportSize({ width: largura, height: 1000 });
            await page.evaluate(() => document.fonts.ready);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${nome}: ${etapa} transborda em ${largura}px (${tema})`);
            if (nome === 'chromium' && largura === 390) {
              await fs.mkdir(path.join(raiz, 'outputs/trial'), { recursive: true });
              await page.screenshot({ path: path.join(raiz, `outputs/trial/${etapa}-${tema}.png`), fullPage: true });
            }
          }
        }
        await page.emulateMedia({ colorScheme: 'light' });
      };
      await page.goto('https://' + hostPublico + '/experimentar');
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
      await page.waitForFunction(() => document.querySelector('#endereco-estado').dataset.estado === 'ocupado');
      assert.equal(await page.locator('#identificador').inputValue(), 'studio-aurora');
      assert.equal(await page.locator('#endereco-sugestoes button').count(), 3);
      await page.locator('#endereco-sugestoes button').first().click();
      await page.waitForFunction(() => document.querySelector('#endereco-estado').dataset.estado === 'disponivel');
      assert.equal(await page.locator('#identificador').inputValue(), 'studio-aurora-2');
      await page.locator('#nome').fill('Outro nome');
      assert.equal(await page.locator('#identificador').inputValue(), 'studio-aurora-2', 'Nome sobrescreveu escolha manual');
      await page.locator('#nome').fill('Studio Aurora');
      await page.locator('#identificador').fill('antigo');
      await page.waitForRequest(r => r.url().includes('identificador=antigo'));
      await page.locator('#identificador').fill('novo');
      await page.waitForFunction(() => document.querySelector('#endereco-estado').dataset.estado === 'ocupado');
      await page.waitForTimeout(800);
      assert.equal(await page.locator('#endereco-estado').getAttribute('data-estado'), 'ocupado', 'Resposta atrasada substituiu a atual');
      const antesInvalidos = consultas.length;
      await page.locator('#identificador').fill('invalido.com');
      await page.waitForFunction(() => document.querySelector('#endereco-estado').dataset.estado === 'erro');
      assert.equal(consultas.length, antesInvalidos, 'Enviou endereço inválido à API');
      assert.equal(await page.locator('#solicitar').isDisabled(), true);
      for (const reservado of ['www', 'db', 'gerencia', 'www-luna']) {
        await page.locator('#identificador').fill(reservado);
        await page.waitForFunction(() => document.querySelector('#endereco-estado').textContent.includes('reservado'));
        assert.equal(await page.locator('#solicitar').isDisabled(), true);
      }
      assert.equal(consultas.length, antesInvalidos, 'Consultou nome reservado conhecido');
      await page.locator('#identificador').fill('studio-aurora-2');
      await page.waitForFunction(() => document.querySelector('#endereco-estado').dataset.estado === 'disponivel');
      await page.locator('#email').fill('pessoa@example.com');
      await page.locator('#aceite').check();
      await page.locator('#solicitar').click();
      await page.waitForFunction(() => document.querySelector('#endereco-estado').dataset.estado === 'ocupado');
      assert.equal(await page.locator('#form-trial').isVisible(), true, 'Conflito no envio ocultou o formulário');
      await page.locator('#endereco-sugestoes button').first().click();
      await page.waitForFunction(() => document.querySelector('#endereco-estado').dataset.estado === 'disponivel');
      await page.locator('#solicitar').click();
      await page.locator('#acompanhamento').waitFor({ state: 'visible' });
      await conferirEtapa('aguardando_verificacao', 'Confira seu e-mail.');
      assert.equal(await page.locator('#detalhe-titulo').innerText(), 'Não encontrou?');
      assert.match(await page.locator('#estado-texto').innerText(), /Você receberá um link em pessoa@example.com/);
      assert.equal(await page.locator('#estado-texto strong').innerText(), emailDestino);
      emailConfirmacao = 'enviado';
      await page.reload();
      await page.waitForFunction(() => document.body.dataset.etapa === 'aguardando_verificacao');
      assert.match(await page.locator('#estado-texto').innerText(), /Enviamos um link para pessoa@example.com/);
      assert.equal(await page.locator('#estado-texto strong').innerText(), emailDestino);
      assert.equal(await page.evaluate(() => JSON.stringify({ ...sessionStorage }).includes('pessoa@example.com')), false, 'Persistiu e-mail no navegador');
      emailDestino = 'pessoa.' + 'a'.repeat(50) + '@' + 'dominio'.repeat(8) + '.example.com';
      await page.reload();
      await page.waitForFunction(() => document.body.dataset.etapa === 'aguardando_verificacao');
      await conferirEtapa('aguardando_verificacao', 'Confira seu e-mail.');
      assert.equal(await page.locator('#estado-texto strong').innerText(), emailDestino);
      emailDestino = '<img src=x onerror=alert(1)>@example.com';
      await page.reload();
      await page.waitForFunction(() => document.body.dataset.etapa === 'aguardando_verificacao');
      assert.equal(await page.locator('#estado-texto img').count(), 0, 'Interpretou destinatário como HTML');
      assert.equal(await page.locator('#estado-texto strong').innerText(), emailDestino);
      emailDestino = 'pessoa@example.com';

      assert.equal(envios[0].dados.nome, 'Studio Aurora');
      assert.deepEqual(Object.keys(envios[0].dados).sort(), ['aceiteTermos', 'email', 'identificador', 'nome', 'revisao', 'turnstile', 'versaoTermos']);
      assert.equal(envios[0].dados.identificador, 'studio-aurora-2');
      assert.equal(envios.filter(e => e.caminho.endsWith('/confirmar')).length, 0);
      await page.goto('https://' + hostPublico + '/experimentar#confirmar=token-ficticio');
      await page.locator('#confirmar').waitFor({ state: 'visible' });
      await conferirEtapa('confirmacao', 'Vamos criar sua LUNA?');
      assert.equal(await page.locator('#confirmar').innerText(), 'Criar meu salão');
      assert.match(await page.locator('#resumo-trial').innerText(), /Seu salão terá um espaço exclusivo/);
      assert.doesNotMatch(await page.locator('#resumo-trial').innerText(), /Confirme seu e-mail/);
      assert.equal(await page.locator('#progresso-trial [aria-current="step"]').getAttribute('data-passo'), '0');
      assert.equal(new URL(page.url()).hash, '');
      assert.equal(envios.filter(e => e.caminho.endsWith('/confirmar')).length, 0, 'Abrir link disparou provisionamento');
      await page.locator('#confirmar').click();
      await page.locator('#acompanhamento').waitFor({ state: 'visible' });
      await conferirEtapa('provisionando', 'Estamos preparando sua LUNA.');
      assert.equal(await page.locator('#etiqueta-etapa').innerText(), 'E-mail confirmado');
      assert.equal(await page.locator('#detalhe-titulo').innerText(), 'Pode fechar esta página.');
      assert.equal(await page.locator('#progresso-trial [aria-current="step"]').getAttribute('data-passo'), '1');
      assert.equal(await page.locator('#estado-titulo').evaluate(el => el === document.activeElement), true);
      assert.equal(envios.filter(e => e.caminho.endsWith('/confirmar')).length, 1);
      estado = 'pronto';
      await page.reload();
      await page.locator('#abrir-luna').waitFor({ state: 'visible' });
      await conferirEtapa('pronto', 'Sua LUNA está pronta!');
      assert.equal(await page.locator('#progresso-trial [data-feito="true"]').count(), 3);
      assert.equal(await page.locator('#abrir-luna').getAttribute('href'), 'https://studio-aurora-ficticio.cometki.app');
      estado = 'restrito';
      await page.reload();
      await page.locator('#abrir-luna').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#estado-titulo').innerText(), 'Seu teste terminou');
      assert.equal(await page.locator('#progresso-trial').isVisible(), false, 'Trial vencido apareceu como etapa de sucesso');
      for (const terminal of ['falhou', 'suspenso', 'encerrado']) {
        estado = terminal; await page.reload();
        await page.waitForFunction(e => document.body.dataset.etapa === e, terminal);
        assert.equal(await page.locator('#abrir-luna').isVisible(), false);
        assert.equal(await page.locator('#progresso-trial').isVisible(), false);
      }
      expirado = true;
      await page.goto('https://' + hostPublico + '/experimentar#confirmar=token-expirado');
      await page.locator('#confirmar').click();
      await page.locator('#form-trial').waitFor({ state: 'visible' });
      assert.equal(await page.locator('body').getAttribute('data-etapa'), 'cadastro', 'Link expirado não voltou ao formulário');
      // Um HTML anterior pode buscar o JS novo pelo fallback durante o rollout.
      paginaAntiga = true; expirado = false;
      const confirmacoesAntes = envios.filter(e => e.caminho.endsWith('/confirmar')).length;
      await page.goto('https://' + hostPublico + '/experimentar#confirmar=token-legado');
      await page.locator('#confirmar').waitFor({ state: 'visible' });
      assert.equal(envios.filter(e => e.caminho.endsWith('/confirmar')).length, confirmacoesAntes);
      await page.locator('#confirmar').click();
      await page.locator('#acompanhamento').waitFor({ state: 'visible' });
      assert.equal(envios.filter(e => e.caminho.endsWith('/confirmar')).length, confirmacoesAntes + 1);
      assert.equal(await page.locator('#estado-titulo').innerText(), 'Estamos preparando sua LUNA.');
      paginaAntiga = false;
      aberto = false;
      await page.evaluate(() => sessionStorage.clear());
      await page.goto('https://' + hostPublico + '/experimentar');
      assert.ok(await page.locator('#resumo-trial').innerText().then(t => t.includes('pausadas')));
      assert.equal(await page.locator('#form-trial').isVisible(), false);
      assert.deepEqual(erros, []);
      console.log(`OK (${nome}): quatro etapas, claro/escuro, 320–1440px, foco, confirmação só após clique, sugestões, disputa, estados terminais, pausa e HTML legado.`);
    } finally { await browser.close(); }
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
