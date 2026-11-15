<?php
/**
 * Embudo de captación · Posgrado FIP-UNI
 * ---------------------------------------------------------------------
 * Recibe el formulario "Solicita información" de la web y registra al
 * interesado en Dolibarr (crm.posgrado-fip.org.pe) mediante su API REST:
 *   1. Tercero como "Cliente potencial" (se reutiliza si el correo ya existe)
 *   2. Contacto con nombre, correo y celular
 *   3. Oportunidad (proyecto con seguimiento de oportunidad) en la etapa
 *      inicial del embudo, con el programa, el tipo de solicitud y el origen (UTM)
 *
 * La clave de la API NO está aquí ni en GitHub. Igual que en colibriperu.org.pe,
 * se guarda en el servidor FUERA de public_html, en:
 *     privado/dolibarr-api.key        (solo la clave, una línea)
 * Por seguridad, si ese archivo está dentro de una carpeta pública (public_html,
 * la raíz del sitio, etc.) se ignora y el formulario responde "CRM no configurado".
 * Opcional: privado/crm-config.php (o crm-config.php) para cambiar la URL del CRM,
 * los dominios permitidos, la etapa inicial o el valor por programa.
 * Ambos se buscan subiendo desde esta carpeta (ver docs/CRM-DOLIBARR.md).
 *
 * Responde JSON: {"ok":true} o {"ok":false,"error":"..."}
 */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function responder(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

/* ---------- Configuración (fuera de public_html) ---------- */
/* ¿La ruta está dentro de una carpeta que el servidor web publica?
   (la raíz del sitio actual o cualquier public_html / www / htdocs, incluida
   la del dominio principal cuando este sitio es un subdominio en public_html/nuevo) */
function enCarpetaPublica(string $ruta): bool
{
    $ruta = realpath($ruta);
    if ($ruta === false) return true;
    $raiz = realpath((string) ($_SERVER['DOCUMENT_ROOT'] ?? ''));
    if ($raiz !== false && $raiz !== '' && strpos($ruta . '/', rtrim($raiz, '/') . '/') === 0) return true;
    foreach (explode('/', str_replace('\\', '/', $ruta)) as $parte) {
        if (in_array(strtolower($parte), ['public_html', 'www', 'htdocs', 'html'], true)) return true;
    }
    return false;
}
/* Busca un archivo subiendo desde esta carpeta (hasta 6 niveles).
   Con $soloPrivado, ignora los que estén en una carpeta pública: así la clave
   nunca se usa desde un lugar donde alguien podría descargarla. */
function buscarArriba(array $nombres, bool $soloPrivado = false): ?string
{
    $dir = __DIR__;
    for ($i = 0; $i < 6; $i++) {
        foreach ($nombres as $n) {
            $f = "$dir/$n";
            if (!is_file($f)) continue;
            if ($soloPrivado && enCarpetaPublica($f)) {
                error_log("lead.php: se ignora $f porque está en una carpeta pública; muévelo junto a public_html (no dentro) y borra esa copia.");
                continue;
            }
            return $f;
        }
        $parent = dirname($dir);
        if ($parent === $dir) break;
        $dir = $parent;
    }
    return null;
}
function cargarConfig(): array
{
    $cfg = [
        'dolibarr_url'        => 'https://crm.posgrado-fip.org.pe',
        'dolibarr_api_key'    => '',
        'origenes_permitidos' => [
            'https://nuevo.posgrado-fip.org.pe',
            'https://www.posgrado-fip.org.pe',
            'https://posgrado-fip.org.pe',
        ],
        'etapa_inicial_id'    => 1,
        'valor_por_programa'  => [],
    ];
    if ($f = buscarArriba(['privado/crm-config.php', 'crm-config.php'])) {
        $c = require $f;
        if (is_array($c)) $cfg = array_merge($cfg, $c);
    }
    if ($cfg['dolibarr_api_key'] === '' && ($f = buscarArriba(['privado/dolibarr-api.key'], true))) {
        $cfg['dolibarr_api_key'] = trim((string) file_get_contents($f));
    }
    return $cfg;
}
$cfg = cargarConfig();
if (empty($cfg['dolibarr_url']) || empty($cfg['dolibarr_api_key'])) {
    responder(503, ['ok' => false, 'error' => 'CRM no configurado']);
}

/* ---------- CORS: solo los dominios permitidos ---------- */
$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
$permitidos = $cfg['origenes_permitidos'] ?? [];
if ($origen !== '') {
    if (!in_array($origen, $permitidos, true)) responder(403, ['ok' => false, 'error' => 'Origen no permitido']);
    header('Access-Control-Allow-Origin: ' . $origen);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') responder(204, []);
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') responder(405, ['ok' => false, 'error' => 'Método no permitido']);

/* ---------- Límite simple por IP: 5 envíos cada 10 minutos ---------- */
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
$marca = sys_get_temp_dir() . '/fip-lead-' . hash('sha256', $ip . ($cfg['dolibarr_api_key'] ?? ''));
$hits = array_filter(
    is_file($marca) ? (array) json_decode((string) file_get_contents($marca), true) : [],
    fn($t) => is_int($t) && $t > time() - 600
);
if (count($hits) >= 5) responder(429, ['ok' => false, 'error' => 'Demasiados envíos, intenta más tarde']);
$hits[] = time();
@file_put_contents($marca, json_encode(array_values($hits)));

/* ---------- Datos del formulario ---------- */
$crudo = (string) file_get_contents('php://input', false, null, 0, 16385);
if (strlen($crudo) > 16384) responder(413, ['ok' => false, 'error' => 'Solicitud demasiado grande']);
$in = json_decode($crudo, true);
if (!is_array($in)) responder(400, ['ok' => false, 'error' => 'JSON inválido']);

/* Campo trampa para bots: los humanos no lo ven ni lo llenan */
if (!empty($in['website'])) responder(200, ['ok' => true]);

$txt = function (string $k, int $max) use ($in): string {
    $v = trim((string) ($in[$k] ?? ''));
    $v = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $v) ?? '';
    return mb_substr($v, 0, $max);
};
$nombres    = $txt('nombres', 60);
$apellidos  = $txt('apellidos', 60);
$correo     = $txt('correo', 100);
$celular    = preg_replace('/[^0-9+ ]/', '', $txt('celular', 20)) ?? '';
$programa   = $txt('programa', 200);
$programaId = $txt('programaId', 80);
$tipo       = $txt('tipo', 40);
$pagina     = $txt('pagina', 300);
$consentimiento = $txt('consentimiento', 100);
$utm = [];
foreach (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as $k) {
    if (($v = $txt($k, 100)) !== '') $utm[$k] = $v;
}

if ($nombres === '' || $apellidos === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)
    || strlen(preg_replace('/\D/', '', $celular) ?? '') < 9 || $programa === '' || empty($in['privacidad'])) {
    responder(422, ['ok' => false, 'error' => 'Datos incompletos']);
}

/* ---------- Cliente de la API de Dolibarr ---------- */
function dolibarr(array $cfg, string $metodo, string $ruta, ?array $datos = null): array
{
    $ch = curl_init(rtrim($cfg['dolibarr_url'], '/') . '/api/index.php/' . ltrim($ruta, '/'));
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST  => $metodo,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'DOLAPIKEY: ' . $cfg['dolibarr_api_key'],
            'Accept: application/json',
            'Content-Type: application/json',
        ],
    ]);
    if ($datos !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($datos, JSON_UNESCAPED_UNICODE));
    $resp = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$code, $resp === false ? null : json_decode((string) $resp, true)];
}

$nombreCompleto = $nombres . ' ' . $apellidos;
$origenTxt = $utm ? implode(' · ', array_map(fn($k, $v) => "$k=$v", array_keys($utm), $utm)) : 'directo / orgánico';

/* 1. Tercero: reutilizar si ya existe un registro con ese correo.
   Solo se busca con correos de caracteres comunes: así nada del correo puede
   alterar el filtro (sqlfilters) de Dolibarr. Si tiene otros caracteres, se crea uno nuevo. */
$socid = 0;
if (preg_match('/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$/', $correo)) {
    $filtro = rawurlencode("(t.email:=:'" . $correo . "')");
    [$code, $existentes] = dolibarr($cfg, 'GET', "thirdparties?limit=1&sqlfilters=$filtro");
    $socid = ($code === 200 && is_array($existentes) && !empty($existentes[0]['id'])) ? (int) $existentes[0]['id'] : 0;
}

if ($socid === 0) {
    [$code, $id] = dolibarr($cfg, 'POST', 'thirdparties', [
        'name'      => $nombreCompleto,
        'client'    => 2,           // 2 = cliente potencial (prospecto)
        'email'     => $correo,
        'phone'     => $celular,
        'note_private' => "Origen: formulario web\n$origenTxt",
    ]);
    if ($code >= 300 || !is_numeric($id)) responder(502, ['ok' => false, 'error' => 'No se pudo registrar (tercero)']);
    $socid = (int) $id;

    /* 2. Contacto de la persona */
    dolibarr($cfg, 'POST', 'contacts', [
        'socid'        => $socid,
        'firstname'    => $nombres,
        'lastname'     => $apellidos,
        'email'        => $correo,
        'phone_mobile' => $celular,
    ]);
}

/* 3. Oportunidad en la primera etapa del embudo */
$ref = 'WEB-' . date('ymd-His') . '-' . substr(bin2hex(random_bytes(2)), 0, 4);
[$code, $pid] = dolibarr($cfg, 'POST', 'projects', [
    'ref'               => $ref,
    'title'             => mb_substr("$programa · $nombreCompleto", 0, 255),
    'socid'             => $socid,
    'usage_opportunity' => 1,
    'usage_task'        => 1,
    'opp_status'        => (int) ($cfg['etapa_inicial_id'] ?? 1),
    'opp_percent'       => 10,
    'opp_amount'        => (float) (($cfg['valor_por_programa'][$programaId] ?? 0)),
    'date_start'        => time(),
    'description'       => "Solicitud: $tipo\nPrograma: $programa\nCorreo: $correo\nCelular: $celular\n"
                         . "Origen: $origenTxt\nPágina: $pagina\nConsentimiento de datos personales (Ley 29733): sí, "
                         . date('Y-m-d H:i') . ($consentimiento !== '' ? " · $consentimiento" : ''),
]);
if ($code >= 300 || !is_numeric($pid)) responder(502, ['ok' => false, 'error' => 'No se pudo registrar (oportunidad)']);

/* Validar la oportunidad: en borrador no aparece en el embudo (igual que en colibriperu.org.pe) */
dolibarr($cfg, 'POST', 'projects/' . (int) $pid . '/validate', ['notrigger' => 0]);

responder(200, ['ok' => true]);
