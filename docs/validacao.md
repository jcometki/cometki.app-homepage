# Validação da primeira versão

Executada em 12/10/2026 sobre o site servido pela imagem Nginx, em ambiente local.

## Responsividade e navegadores

| Motor | Larguras verificadas |
| --- | --- |
| Chromium | 320, 360, 390, 430, 768, 1024, 1440 e 1920 px |
| WebKit | 390, 768 e 1440 px |

Nas 11 combinações, a largura do documento correspondeu à viewport, sem rolagem horizontal. As imagens visíveis foram carregadas e decodificadas. Fontes locais e imagens responsivas funcionaram.

Revisão visual das capturas completas de desktop e celular, incluindo abertura, seção de IA, galeria e seção de uso no celular.

## Interações

Verificadas nos dois motores:

- Abrir e fechar menu móvel por botão, link e tecla Esc.
- Selecionar as quatro abas por clique e teclado, incluindo setas, Home e End.
- Abrir os quatro prints da galeria, fechar por Esc e retornar o foco ao botão de origem.
- Exibir a chamada móvel após a abertura e recolhê-la quando a chamada final aparece.
- Abrir e fechar a informação de privacidade.
- Conferir o destino de todos os links comerciais: WhatsApp +55 67 99293-8193.
- Carregar título, conteúdo principal e contato com JavaScript desligado.

A revisão no WebKit identificou que cliques nem sempre transferem foco ao botão. O visualizador agora guarda explicitamente o botão de origem, garantindo o retorno ao fechar.

## Acessibilidade

Auditoria automatizada axe-core com regras WCAG 2 A/AA e WCAG 2.1 A/AA em 390 e 1440 px, nos dois motores: **nenhuma violação detectada**.

Há link para pular ao conteúdo, foco visível, diálogos nativos, nomes acessíveis, navegação por teclado nas abas, textos alternativos e respeito à preferência por movimento reduzido.

A auditoria automatizada não equivale a certificação nem substitui testes com leitores de tela e dispositivos físicos.

## Entrega HTTP

- Configuração validada com nginx -t.
- Contêiner saudável com filesystem somente para leitura e diretórios temporários em tmpfs.
- Página principal e /saude respondem 200.
- Rota inexistente e /api/trials respondem 404.
- Documentação do repositório não é incluída na imagem pública.
- Arquivos ocultos protegidos.
- Compressão gzip de CSS conferida.
- Cache dos assets, revalidação do HTML e cabeçalhos de segurança conferidos.
- Nenhum erro JavaScript, recurso ausente ou erro de CSP durante os testes de navegador.
- IDs, âncoras e referências a arquivos do HTML conferidos.

## Limites

- Não houve publicação em domínio público, configuração de DNS ou teste em aparelho físico.
- Os testes conferiram o link comercial, sem enviar mensagens pelo WhatsApp.
- A integração de trials com o Manager está documentada e tem ponto de configuração, mas não está implementada.
- Os prints mostram a interface real do LUNA com dados fictícios; a conversa ilustrativa não é uma chamada de IA ao vivo.
