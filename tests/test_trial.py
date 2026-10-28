import os
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import urlopen

RAIZ = Path(__file__).resolve().parents[1]


class Campos(HTMLParser):
    def __init__(self):
        super().__init__()
        self.campos = []

    def handle_starttag(self, tag, attrs):
        if tag == 'input':
            self.campos.append(dict(attrs))


class TrialPublico(unittest.TestCase):
    def test_somente_nome_email_e_aceite(self):
        p = Campos()
        p.feed((RAIZ / 'experimentar/index.html').read_text())
        self.assertEqual({c['name'] for c in p.campos if 'name' in c}, {'nome', 'email'})
        self.assertEqual(len([c for c in p.campos if c.get('type') == 'checkbox']), 1)
        script = (RAIZ / 'assets/js/trial.js').read_text()
        self.assertIn("history.replaceState(null, '', location.pathname)", script)
        self.assertIn("'/api/trials' + rota", script)
        self.assertNotIn('localStorage', script)
        self.assertNotIn('innerHTML', script)
        self.assertNotIn('manager.cometki.cloud', script)

    @unittest.skipUnless(os.getenv('BASE_URL'), 'exige Nginx local')
    def test_pagina_e_csp_turnstile(self):
        with urlopen(os.environ['BASE_URL'].rstrip('/') + '/experimentar') as r:
            self.assertEqual(r.status, 200)
            self.assertIn('id="form-trial"', r.read().decode())
            self.assertIn('https://challenges.cloudflare.com', r.headers['Content-Security-Policy'])
            self.assertIn('no-store', r.headers['Cache-Control'])
            self.assertEqual(r.headers['Referrer-Policy'], 'no-referrer')


if __name__ == '__main__':
    unittest.main()
