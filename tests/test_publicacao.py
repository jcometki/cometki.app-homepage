"""Confere o contrato público sem instalar dependências de frontend."""
from html.parser import HTMLParser
import os
from pathlib import Path
import unittest
from urllib.error import HTTPError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
PUBLICA = 'https://luna.cometki.app/'
BASE_URL = os.environ.get('BASE_URL', '').rstrip('/')


class Pagina(HTMLParser):
    def __init__(self):
        super().__init__()
        self.elementos = []

    def handle_starttag(self, tag, attrs):
        self.elementos.append((tag, dict(attrs)))


def pagina():
    resultado = Pagina()
    resultado.feed((ROOT / 'index.html').read_text())
    return resultado.elementos


class ConteudoPublico(unittest.TestCase):
    def test_metadados_apontam_para_dominio_definitivo(self):
        elementos = pagina()
        self.assertEqual([x.get('href') for tag, x in elementos
                          if tag == 'link' and x.get('rel') == 'canonical'], [PUBLICA])
        for campo, esperado in [('og:url', PUBLICA),
                                ('og:image', PUBLICA + 'assets/imagens/compartilhamento.png')]:
            self.assertEqual([x.get('content') for tag, x in elementos
                              if tag == 'meta' and x.get('property') == campo], [esperado])

    def test_ids_ancoras_e_assets_existem(self):
        elementos = pagina()
        ids = [x['id'] for _, x in elementos if x.get('id')]
        self.assertEqual(len(ids), len(set(ids)))
        for _, attrs in elementos:
            for atributo in ('href', 'src', 'srcset'):
                ref = attrs.get(atributo, '')
                if ref.startswith('#'):
                    self.assertIn(ref[1:], ids)
                elif ref and not urlparse(ref).scheme:
                    self.assertTrue((ROOT / ref.split('?', 1)[0].lstrip('/')).is_file(), ref)

    def test_contato_atual_e_trial_desativado(self):
        contatos = [x for tag, x in pagina() if tag == 'a' and 'contato' in x.get('class', '').split()]
        self.assertGreaterEqual(len(contatos), 3)
        for contato in contatos:
            self.assertEqual(urlparse(contato['href']).netloc, 'wa.me')
            self.assertEqual(urlparse(contato['href']).path, '/5567992938193')
            self.assertIn('noopener', contato.get('rel', ''))
        configuracao = (ROOT / 'assets/js/configuracao.js').read_text()
        self.assertRegex(configuracao, r"whatsapp:\s*'5567992938193'")
        self.assertRegex(configuracao, r"urlTrial:\s*''")

    def test_nao_depende_de_cdn_ou_manager(self):
        for tag, attrs in pagina():
            if tag in ('script', 'img', 'source', 'link'):
                ref = attrs.get('src') or attrs.get('srcset') or attrs.get('href', '')
                if urlparse(ref).scheme:
                    self.assertEqual(attrs.get('rel'), 'canonical')
        dockerfile = (ROOT / 'Dockerfile').read_text()
        self.assertNotRegex(dockerfile, r'COPY\s+\.\s')
        self.assertIn('COPY assets ', dockerfile)


@unittest.skipUnless(BASE_URL, 'Informe BASE_URL para conferir a entrega HTTP.')
class EntregaHTTP(unittest.TestCase):
    def obter(self, caminho, headers=None):
        return urlopen(Request(BASE_URL + caminho, headers=headers or {}), timeout=15)

    def test_pagina_e_saude(self):
        with self.obter('/') as resposta:
            self.assertEqual(resposta.status, 200)
            html = resposta.read().decode()
            self.assertIn('<title>LUNA', html)
            self.assertIn('https://luna.cometki.app/', html)
        with self.obter('/saude') as resposta:
            self.assertEqual(resposta.status, 200)
            self.assertEqual(resposta.read(), b'ok\n')

    def test_todos_assets_sao_servidos(self):
        for arquivo in (ROOT / 'assets').rglob('*'):
            if not arquivo.is_file():
                continue
            with self.subTest(arquivo=str(arquivo.relative_to(ROOT))):
                with self.obter('/' + arquivo.relative_to(ROOT).as_posix()) as resposta:
                    self.assertEqual(resposta.status, 200)
                    self.assertEqual(resposta.read(), arquivo.read_bytes())

    def test_rotas_privadas_e_api_nao_sao_expostas(self):
        for caminho in ('/api/', '/api/trials', '/api/admin', '/README.md', '/AGENTS.md',
                        '/docs/integracao-manager.md', '/Dockerfile', '/.git/config', '/inexistente'):
            with self.subTest(caminho=caminho):
                with self.assertRaises(HTTPError) as erro:
                    self.obter(caminho)
                self.assertIn(erro.exception.code, (403, 404))
                erro.exception.close()

    def test_cabecalhos_cache_e_compressao(self):
        with self.obter('/') as resposta:
            self.assertEqual(resposta.headers['X-Content-Type-Options'], 'nosniff')
            self.assertIn("frame-ancestors 'none'", resposta.headers['Content-Security-Policy'])
            self.assertIn('no-cache', resposta.headers['Cache-Control'])
        with self.obter('/assets/js/configuracao.js') as resposta:
            self.assertIn('no-cache', resposta.headers['Cache-Control'])
        with self.obter('/assets/css/site.css', {'Accept-Encoding': 'gzip'}) as resposta:
            self.assertEqual(resposta.headers['Content-Encoding'], 'gzip')
            self.assertIn('max-age=3600', resposta.headers['Cache-Control'])


if __name__ == '__main__':
    unittest.main()
