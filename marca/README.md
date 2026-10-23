# LUNA — Identidade oficial

Versão 1.0 · 23 de outubro de 2026

Identidade aprovada: **opção 03, Monograma**. O L curvo em dourado e o nome
serifado LUNA formam a assinatura principal. A marca do produto não carrega
assinatura da empresa. No site, a única menção institucional é a frase
**“produto cometki.cloud”**, ao final do rodapé.

## Arquivos prontos

| Pasta | Conteúdo | Uso |
| --- | --- | --- |
| `vetores/` | Logo horizontal, vertical e ícone em SVG | Sites, impressão, apresentações e edição em ferramentas vetoriais |
| `png/` | As mesmas composições com fundo transparente | Aplicações rápidas em artes e documentos |
| `perfis/` | Três avatares quadrados, em PNG e SVG | WhatsApp, Instagram e outros perfis; composição segura para recorte circular |
| `divulgacao/` | Feed, story, capa e compartilhamento | Peças prontas para divulgação da LUNA |
| `fontes/` | DM Sans e Instrument Serif, com licenças OFL | Edição dos textos de apoio nas peças |

Variações de cor: **principal** (ouro + marfim), **café**, **branca** e
**dourada**. Os SVGs têm contornos vetoriais, sem depender de uma fonte instalada.

Os PNGs horizontais têm 2400 × 888 px; os verticais, 1600 × 1294 px;
os ícones transparentes, 1024 × 1024 px; os perfis, 1080 × 1080 px.
Feed: 1080 × 1350 px. Story: 1080 × 1920 px. Capa: 1920 × 1080 px.
Compartilhamento: 1200 × 630 px.

Abra `apresentacao.html` para visualizar o kit. As artes editáveis estão em
`divulgacao/modelos.html`, com fontes e logos locais: não precisam de internet.
Para exportar novamente, capture cada elemento `.arte` em seu tamanho original
com escala de pixels 1, após carregar fontes e imagens. Os IDs correspondem
aos nomes dos PNGs. A aparência de botão nas artes é gráfica: ao publicar,
configure o link da campanha ou o adesivo de link da rede social.

## Paleta e aplicação

| Cor | Hexadecimal | Função |
| --- | --- | --- |
| Café | `#342c25` | Fundo principal e marca sobre superfícies claras |
| Ouro | `#edc77e` | Monograma e destaques |
| Marfim | `#fff4e3` | Nome sobre fundo café e textos principais |
| Areia | `#cbb896` | Alternativa mais clara, sem branco intenso |

Use a versão principal sobre café; sobre areia, use a versão café.
Preserve as proporções, os espaços entre símbolo e nome e os vazados das letras.
Reserve ao redor uma margem mínima de 15% da altura da composição.
Em aplicações muito pequenas, use apenas o ícone. Evite sombras, contornos,
esticar o desenho ou acrescentar “por Cometki” à assinatura.

O story deixa espaço acima e abaixo para a interface da rede social. Os perfis
foram compostos com o símbolo centralizado dentro da área segura circular.

## Origem e método

O conceito foi apresentado por geração de imagem e aprovado pelo usuário.
A arte final usa os contornos do monograma e das letras do conceito aprovado,
vetorizados e revisados; não usa a imagem de apresentação como logo.
As cores foram normalizadas para a paleta Élevé do site. As peças comerciais
foram diagramadas em HTML/CSS e exportadas para PNG, mantendo os SVGs originais.
Não há fotografia gerada nem alteração das capturas reais do aplicativo.

Briefing de finalização: preservar o monograma L fluido e a tipografia serifada
da opção 03; remover a assinatura da empresa; usar ouro e marfim sobre café,
criar versões de uma cor, perfis e divulgação, com ênfase na IA, no WhatsApp
e nas campanhas. O nome desenhado é parte da marca; DM Sans e Instrument Serif
são as fontes dos textos de apoio, com licenças incluídas.

## Website e aplicação

Os arquivos leves do site ficam em `assets/imagens/marca/`, no repositório
`jcometki/cometki.app-homepage`. O kit completo fica em `marca/` e não é
incluído no contêiner público. A aplicação LUNA tem outro repositório;
a troca de identidade dentro dela deve ser feita pelo chat responsável,
reutilizando estes SVGs. Esta entrega atualiza a homepage comercial.
