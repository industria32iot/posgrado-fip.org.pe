#!/usr/bin/env bash
# Configura Dolibarr (portal.posgrado-fip.org.pe) para el embudo del Posgrado FIP-UNI
# usando su API REST. Se puede ejecutar varias veces: lo que ya existe se deja igual.
#
#   1. Activa los módulos: Terceros, Proyectos (con oportunidades), Agenda,
#      E-Mailing y Categorías.
#   2. Crea el "perfil de estudiante de posgrado" como atributos complementarios
#      del tercero: Programa, Cohorte, Grado previo, Universidad de procedencia,
#      Código de alumno UNI y Estado académico.
#   3. Crea el usuario técnico "api-web" (sin administrador) para el formulario web.
#
# Las claves de las listas no admiten guiones (la API de Dolibarr las rechaza).
# Requisitos: módulo API REST activo y una clave API de un usuario ADMINISTRADOR.
# La clave NO va en este archivo: o la inyecta el proxy (sesiones de Claude con
# credencial guardada para el host) o se pasa en la variable DOLIBARR_API_KEY.
#
# Uso:  DOLIBARR_URL=https://portal.posgrado-fip.org.pe ./scripts/configurar-dolibarr.sh
set -euo pipefail

URL="${DOLIBARR_URL:-https://portal.posgrado-fip.org.pe}"
API="$URL/api/index.php"
AUTH=()
[ -n "${DOLIBARR_API_KEY:-}" ] && AUTH=(-H "DOLAPIKEY: $DOLIBARR_API_KEY")

# llamada <MÉTODO> <ruta> [json]  → imprime "código cuerpo"
llamada() {
  local metodo="$1" ruta="$2" datos="${3:-}"
  local args=(-sS -o /tmp/dol-resp.$$ -w '%{http_code}' -X "$metodo" "${AUTH[@]}"
              -H 'Accept: application/json' -H 'Content-Type: application/json' --max-time 60)
  [ -n "$datos" ] && args+=(--data "$datos")
  local code
  code=$(curl "${args[@]}" "$API/$ruta")
  echo "$code $(head -c 300 /tmp/dol-resp.$$ | tr '\n' ' ')"
  rm -f /tmp/dol-resp.$$
}

echo "== Comprobando acceso de administrador a $URL"
r=$(llamada GET users/info); echo "   $r"
case "$r" in 200*) ;; *) echo "ERROR: la API no responde con un usuario válido (¿módulo API activo? ¿clave de administrador?)"; exit 1;; esac

echo "== 1. Módulos"
for m in modSociete modProjet modAgenda modMailing modCategorie; do
  r=$(llamada PUT "setup/modules/$m/enable"); echo "   $m: ${r:0:120}"
done

echo "== 2. Perfil de estudiante de posgrado (atributos complementarios del tercero)"
extra() { # nombre json
  r=$(llamada POST "setup/extrafields/societe/$1" "$2")
  case "$r" in 200*) echo "   $1: creado";; 409*) echo "   $1: ya existía";; *) echo "   $1: ERROR $r";; esac
}
extra programa '{"label":"Programa de interés","type":"select","pos":"10","size":"","list":"1","alwayseditable":"1","param":{"options":{"doctorado":"Doctorado en Ciencias e Ingeniería de Petróleo y Gas Natural","maestria":"Maestría en Ciencias con mención en Ingeniería de Petróleo y Gas Natural","dip_refinacion":"Diplomado en Procesos de Refinación y Petroquímica","dip_riesgos":"Diplomado en Riesgo de Seguridad y Respuesta a Emergencias"}}}'
extra estado_academico '{"label":"Estado académico","type":"select","pos":"20","size":"","list":"1","alwayseditable":"1","default":"interesado","param":{"options":{"interesado":"Interesado","postulante":"Postulante","admitido":"Admitido","matriculado":"Matriculado","egresado":"Egresado","graduado":"Graduado","retirado":"Retirado"}}}'
extra cohorte '{"label":"Cohorte / semestre (ej. 2027-I)","type":"varchar","size":"20","pos":"30","list":"1","alwayseditable":"1"}'
extra grado_previo '{"label":"Grado académico previo","type":"select","pos":"40","size":"","list":"1","alwayseditable":"1","param":{"options":{"bachiller":"Bachiller","titulo":"Título profesional","maestro":"Maestro","doctor":"Doctor"}}}'
extra universidad '{"label":"Universidad de procedencia","type":"varchar","size":"255","pos":"50","list":"1","alwayseditable":"1"}'
extra codigo_uni '{"label":"Código de alumno UNI","type":"varchar","size":"20","pos":"60","list":"1","alwayseditable":"1"}'

echo "== 3. Usuario técnico api-web"
r=$(llamada GET "users/login/api-web")
case "$r" in
  200*) echo "   api-web: ya existía";;
  *) r=$(llamada POST users '{"login":"api-web","lastname":"Formulario web","firstname":"API","admin":0,"employee":0,"statut":1,"note_private":"Usuario técnico del formulario de posgrado-fip.org.pe (api/lead.php). Sin acceso de administrador."}')
     echo "   api-web: ${r:0:120}";;
esac

echo "== Listo. Falta (no se puede por API): permisos de api-web y su clave API (ver docs/CRM-DOLIBARR.md)."
