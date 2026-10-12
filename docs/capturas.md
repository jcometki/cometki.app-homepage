# Capturas reais no tema Élevé

As imagens da homepage foram capturadas no aplicativo LUNA em execução local, a partir do checkout jcometki/luna, commit 9446e02, em 12/10/2026.

O aplicativo usou um banco MariaDB descartável e separado, com o seed Studio Aurora e dados fictícios adicionais. O tema foi selecionado pela configuração real da empresa: eleve. Nenhum componente da interface foi redesenhado para parecer um print.

## Conteúdo

| Arquivo | Origem | Tela |
| --- | --- | --- |
| agenda-desktop.webp | /agenda | Grade diária por profissional |
| agenda-celular.webp | /agenda, visão lista | Agenda adaptada ao celular |
| conversas-desktop.webp | /conversas/{id} | Atendimento da assistente e lista de conversas |
| conversas-celular.webp | /conversas/{id} | Conversa na interface móvel |
| financeiro-*.webp | /financeiro | Resultado, recebimentos e despesas |
| equipe-*.webp | /financeiro/equipe | Comissões e pagamentos |
| clientes-*.webp | /clientes | Cadastro e busca |
| inicio-celular.webp | /painel | Resumo do dia no celular |

Os prints de desktop usam viewport de 1440 × 960. Os móveis usam 390 × 780, com 390 × 844 para a conversa. O formato WebP preserva o conteúdo; a moldura de aparelho pertence à homepage, fora da captura.

Nomes, agendamentos, pagamentos e mensagens são demonstrações. A conversa com a assistente é um roteiro fictício, gravado no ambiente demonstrativo e renderizado pelo aplicativo real. Não representa um atendimento a cliente real nem uma execução ao vivo da IA. As integrações externas e o worker ficaram desligados.

## Atualizar

1. Criar banco local descartável e aplicar as migrations do aplicativo.
2. Usar o seed de demonstração, nunca banco ou dados de produção.
3. Ativar o tema Élevé na configuração da empresa.
4. Preparar exemplos coerentes com os recursos disponíveis.
5. Entrar como proprietária e capturar as telas de desktop e celular.
6. Conferir textos, recortes, ausência de dados reais e conteúdo comercial.
7. Converter para WebP, preservar resolução e atualizar os arquivos.
8. Atualizar esta procedência e repetir a revisão visual da homepage.

Paleta: fundo #121010, superfície #1d1816, texto #f6eddc, texto suave #bfae92, borda #3a2f25 e principal #d4a853.
