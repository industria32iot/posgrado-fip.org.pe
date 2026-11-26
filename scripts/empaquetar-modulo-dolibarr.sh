#!/usr/bin/env bash
# Empaqueta el módulo Dolibarr "Posgrado FIP" (dolibarr/posgradofip) en el formato que acepta
# Dolibarr en Configuración → Módulos → "Desplegar/instalar un módulo externo":
#   module_posgradofip-<versión>.zip  con la carpeta posgradofip/ en la raíz.
#
# Uso:  ./scripts/empaquetar-modulo-dolibarr.sh  [carpeta-de-salida]   (por defecto dist-dolibarr/)
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
SALIDA="${1:-$RAIZ/dist-dolibarr}"
VERSION=$(sed -n "s/.*\$this->version = '\([^']*\)'.*/\1/p" "$RAIZ/dolibarr/posgradofip/core/modules/modPosgradoFip.class.php")
[ -n "$VERSION" ] || { echo "No se pudo leer la versión del módulo"; exit 1; }

mkdir -p "$SALIDA"
ZIP="$SALIDA/module_posgradofip-$VERSION.zip"
rm -f "$ZIP"
(cd "$RAIZ/dolibarr" && zip -qr -X "$ZIP" posgradofip -x '*.DS_Store' -x '*/.git*')
echo "Listo: $ZIP"
