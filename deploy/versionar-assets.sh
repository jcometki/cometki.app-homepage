#!/bin/sh
# Empacota arquivos estáticos com uma assinatura do conteúdo, sem compilar o frontend.
set -eu
script=$0
case "$script" in /*) ;; *) script="$(pwd)/$script";; esac
cd "${1:-/usr/share/nginx/html}"
lista=$(mktemp)
mapa=$(mktemp)
destinos=$(mktemp)
temporario=$(mktemp)
trap 'rm -f "$lista" "$mapa" "$destinos" "$temporario"' EXIT

somar() {
    if command -v sha256sum >/dev/null 2>&1; then sha256sum "$@"; else shasum -a 256 "$@"; fi
}

find assets -type f | LC_ALL=C sort > "$lista"
while IFS= read -r arquivo; do
    case "$arquivo" in *[!a-zA-Z0-9_./-]*) echo "Nome de arquivo não suportado no empacotamento" >&2; exit 1;; esac
done < "$lista"

# Caminhos relativos e ordem fixa tornam o resultado independente da máquina e da data.
versao=$({ { cat "$lista"; find . -type f -name '*.html'; } | LC_ALL=C sort | while IFS= read -r arquivo; do somar "$arquivo"; done; somar "$script" | cut -c1-64; } | somar | cut -c1-16)
find . -type f -name '*.html' > "$destinos"

while IFS= read -r arquivo; do
    nome=${arquivo##*/}
    case "$nome" in *.*) ;; *) continue;; esac
    prefixo=${nome%.*}
    extensao=${nome##*.}
    novo="$prefixo.h$versao.$extensao"
    destino="${arquivo%/*}/$novo"
    cp "$arquivo" "$destino"
    printf '%s|%s\n' "$nome" "$novo" >> "$mapa"
    case "$extensao" in css|js) printf '%s\n' "$destino" >> "$destinos";; esac
done < "$lista"

# A mesma assinatura vale para todas as pastas, inclusive nomes repetidos.
# Os originais ficam disponíveis para links antigos, mas sem cache para JS/CSS.
while IFS='|' read -r antigo novo; do
    padrao=$(printf '%s' "$antigo" | sed 's/\./[.]/g')
    while IFS= read -r destino; do
        sed "s#$padrao#$novo#g" "$destino" > "$temporario"
        cat "$temporario" > "$destino"
    done < "$destinos"
done < "$mapa"
