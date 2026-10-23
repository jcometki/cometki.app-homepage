# Identidade oficial LUNA — 23/10/2026

O usuário aprovou definitivamente a opção **03 / Monograma**: símbolo L curvo,
dourado, acompanhado do nome LUNA em letras serifadas. Esta é a identidade
principal da homepage e dos materiais comerciais preparados neste repositório.

A assinatura empresarial foi removida da logo, do cabeçalho, dos CTAs,
dos textos comerciais e dos metadados. A única menção institucional visível
é **“produto cometki.cloud”**, no fim do rodapé. O nome do produto no copyright
é LUNA. Os endereços técnicos `luna.cometki.app` e o contato de WhatsApp
permanecem os mesmos. A informação de privacidade aponta para a equipe
responsável pelo produto, identificada no rodapé.

Os vetores e materiais para download estão em [marca/](../marca/README.md).
A homepage utiliza a assinatura horizontal, favicon, ícone Apple Touch e
nova imagem de compartilhamento. Ícones PNG de 192 e 512 px também estão
preparados para integrações futuras. O antigo endereço `simbolo.svg` entrega
o novo desenho para compatibilidade; ele não é a referência do cabeçalho.

O kit completo fica fora do contexto Docker e da imagem Nginx. Não foram
adicionadas dependências de execução ou chamadas externas. Os contornos
vetoriais da marca não dependem de fontes carregadas no navegador.
As peças usam cores planas; os arquivos transparentes têm vazados preservados.

A mudança foi aplicada somente à homepage comercial e aos materiais de marca.
O aplicativo, o Manager, trials, DNS e certificados não fazem parte desta
alteração. A integração da identidade no aplicativo é uma dependência do
chat responsável por ele; os SVGs estão prontos para reutilização.
