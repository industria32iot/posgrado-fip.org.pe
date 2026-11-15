<?php
/**
 * Configuración del embudo (CRM Dolibarr) · Posgrado FIP-UNI
 * ---------------------------------------------------------------------
 * 1. Copia este archivo como  crm-config.php
 * 2. Súbelo a tu carpeta personal de Hostinger, FUERA de public_html
 *    (hPanel → Administrador de archivos → carpeta raíz /home/uXXXXXXX/).
 *    /api/lead.php lo encuentra solo, subiendo desde su carpeta.
 * 3. Nunca lo subas a GitHub: contiene la clave de la API.
 */
return [
    // Dirección de Dolibarr (sin / al final)
    'dolibarr_url' => 'https://crm.posgrado-fip.org.pe',

    // Clave API del usuario "web-formulario" (Dolibarr → Usuarios → web-formulario → Clave para API)
    'dolibarr_api_key' => 'PEGAR_AQUI_LA_CLAVE',

    // Sitios que pueden enviar el formulario
    'origenes_permitidos' => [
        'https://nuevo.posgrado-fip.org.pe',
        'https://www.posgrado-fip.org.pe',
        'https://posgrado-fip.org.pe',
    ],

    // ID de la etapa "Interesado" en Dolibarr → Configuración → Diccionarios → Estado de oportunidad
    'etapa_inicial_id' => 1,

    // Valor estimado de cada matrícula (S/) para calcular el valor del embudo.
    // Las claves son los "id" de src/data/programas.js. 0 o ausente = sin valor.
    'valor_por_programa' => [
        'doctorado-petroleo-gas-natural'      => 0,   // CONFIRMAR
        'maestria-petroleo-gas-natural'       => 0,   // CONFIRMAR
        'diplomado-refinacion-petroquimica'   => 5000, // matrícula S/ 200 + S/ 4,800 al contado
        'diplomado-riesgos-seguridad'         => 0,   // CONFIRMAR
    ],
];
