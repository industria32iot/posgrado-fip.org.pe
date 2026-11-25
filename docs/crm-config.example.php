<?php
/**
 * Configuración OPCIONAL del embudo (CRM Dolibarr) · Posgrado FIP-UNI
 * ---------------------------------------------------------------------
 * Lo mínimo es la clave en  privado/dolibarr-api.key  (junto a public_html).
 * Usa este archivo solo para cambiar los valores por defecto:
 * 1. Cópialo como  privado/crm-config.php  (junto a public_html, no dentro).
 * 2. Borra las líneas que no necesites cambiar.
 * 3. Nunca lo subas a GitHub.
 */
return [
    // Dirección de Dolibarr (sin / al final)
    'dolibarr_url' => 'https://portal.posgrado-fip.org.pe',

    // Normalmente vacío: la clave se lee de privado/dolibarr-api.key
    // 'dolibarr_api_key' => '',

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
