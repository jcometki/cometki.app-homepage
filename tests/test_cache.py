import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest
from urllib.error import HTTPError
from urllib.request import urlopen

RAIZ = Path(__file__).resolve().parents[1]


class Empacotamento(unittest.TestCase):
    def preparar(self, pasta):
        shutil.copytree(RAIZ / 'assets', pasta / 'assets')
        shutil.copytree(RAIZ / 'experimentar', pasta / 'experimentar')
        shutil.copy(RAIZ / 'index.html', pasta / 'index.html')

    def versionar(self, pasta):
        subprocess.run(['sh', str(RAIZ / 'deploy/versionar-assets.sh'), str(pasta)], check=True)
        html = (pasta / 'index.html').read_text()
        versoes = set(re.findall(r'\.h([0-9a-f]{16})\.', html))
        self.assertEqual(len(versoes), 1)
        for ref in re.findall(r'(?:/)?assets/[^\s"<>?]+', html):
            self.assertTrue((pasta / ref.lstrip('/')).is_file(), ref)
        return versoes.pop()

    def test_assinatura_reproduzivel_muda_com_o_conteudo_e_preserva_originais(self):
        with tempfile.TemporaryDirectory() as temp:
            a, b, c = (Path(temp) / nome for nome in ['a', 'b', 'c'])
            for p in [a, b, c]:
                p.mkdir()
                self.preparar(p)
            v1 = self.versionar(a)
            self.assertEqual(v1, self.versionar(b))
            with (c / 'assets/js/configuracao.js').open('a') as arq:
                arq.write('\n// Nova configuração de publicação.\n')
            self.assertNotEqual(v1, self.versionar(c))
            for arquivo in (RAIZ / 'assets').rglob('*'):
                if arquivo.is_file():
                    self.assertEqual((a / arquivo.relative_to(RAIZ)).read_bytes(), arquivo.read_bytes())
            css = (a / f'assets/css/site.h{v1}.css').read_text()
            self.assertIn(f'dm-sans.h{v1}.woff2', css)
            self.assertTrue((a / f'assets/fontes/dm-sans.h{v1}.woff2').is_file())


@unittest.skipUnless(os.getenv('BASE_URL'), 'exige Nginx local')
class CacheHTTP(unittest.TestCase):
    def obter(self, caminho):
        return urlopen(os.environ['BASE_URL'].rstrip('/') + caminho, timeout=15)

    def test_html_configuracao_e_codigo_nao_ficam_presos_no_cache(self):
        for caminho in ['/', '/index.html', '/experimentar', '/assets/js/configuracao.js', '/assets/js/site.js']:
            with self.subTest(caminho=caminho), self.obter(caminho) as r:
                self.assertEqual(len(r.headers.get_all('Cache-Control')), 1)
                self.assertIn('no-store', r.headers['Cache-Control'])
                self.assertIn('no-transform', r.headers['Cache-Control'])
                self.assertEqual(r.headers['X-Content-Type-Options'], 'nosniff')
                self.assertIn("frame-ancestors 'none'", r.headers['Content-Security-Policy'])

    def test_endereco_de_outra_publicacao_tem_recuo_sem_cache(self):
        with self.obter('/assets/js/configuracao.h0000000000000000.js') as r:
            self.assertIn('no-store', r.headers['Cache-Control'])
            self.assertEqual(r.read(), (RAIZ / 'assets/js/configuracao.js').read_bytes())
        with self.obter('/assets/imagens/marca/favicon.h0000000000000000.svg') as r:
            self.assertIn('no-store', r.headers['Cache-Control'])
            self.assertEqual(r.read(), (RAIZ / 'assets/imagens/marca/favicon.svg').read_bytes())

    def test_arquivo_ausente_nao_e_guardado_por_cache(self):
        with self.assertRaises(HTTPError) as erro:
            self.obter('/assets/js/inexistente.h0000000000000000.js')
        self.assertEqual(erro.exception.code, 404)
        self.assertIn('no-store', erro.exception.headers['Cache-Control'])
        erro.exception.close()
