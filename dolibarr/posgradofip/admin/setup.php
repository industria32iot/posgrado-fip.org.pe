<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/admin/setup.php
 * \ingroup posgradofip
 * \brief   Configuración: requisitos y configuración recomendada de la Unidad de Posgrado FIP-UNI
 */

require __DIR__.'/../lib/loadmain.inc.php';
require_once DOL_DOCUMENT_ROOT.'/core/lib/admin.lib.php';
dol_include_once('/posgradofip/lib/posgradofip.lib.php');
dol_include_once('/posgradofip/class/posgradofipconfig.class.php');

/** @var DoliDB $db */
/** @var User $user */
/** @var Conf $conf */

if (!$user->admin) {
	accessforbidden();
}

$action = GETPOST('action', 'aZ09');
$cfg = new PosgradoFipConfig($db);

if ($action == 'apply' || $action == 'applyall') {
	$report = $cfg->apply($user, $action == 'applyall');
	if ($report['applied']) {
		setEventMessages(count($report['applied']).' ajuste(s) aplicados.', null, 'mesgs');
	} else {
		setEventMessages('No había nada que cambiar.', null, 'mesgs');
	}
	if ($report['kept']) {
		setEventMessages(count($report['kept']).' ajuste(s) se mantuvieron porque ya tenían un valor propio. Usa "Aplicar toda la configuración" para reemplazarlos.', null, 'warnings');
	}
	if ($report['errors']) {
		setEventMessages('No se pudo aplicar: '.implode(', ', $report['errors']), null, 'errors');
	}
	header('Location: '.$_SERVER['PHP_SELF']);
	exit;
}

llxHeader('', 'Posgrado FIP - Configuración', '', '', 0, 0, '', '', '', 'mod-posgradofip page-admin');
$linkback = '<a href="'.DOL_URL_ROOT.'/admin/modules.php?restore_lastsearch_values=1">Volver a la lista de módulos</a>';
print load_fiche_titre('Posgrado FIP', $linkback, 'title_setup');
print dol_get_fiche_head(posgradofip_admin_prepare_head(), 'settings', '', -1, 'fa-graduation-cap');

$ok = img_picto('Correcto', 'tick');
$ko = img_warning('Pendiente');

// Requisitos
print load_fiche_titre('Módulos necesarios', '', '');
$checks = array(
	array(isModEnabled('societe'), 'Terceros', 'Cada alumno es un tercero (cliente).'),
	array(isModEnabled('invoice'), 'Facturas', 'Las cuotas, matrículas y derechos se emiten como facturas; el alumno ve su estado de cuenta.'),
	array(isModEnabled('webportal'), 'Portal Web', 'Acceso de alumnos a notas y pagos: '.dol_buildpath('/public/webportal/', 2)),
	array(getDolGlobalInt('WEBPORTAL_USER_LOGGED') > 0, 'Usuario de servicio del Portal Web', 'Sin él, el portal rechaza a todos los alumnos ("configuración incompleta").'),
);
$faltan = $cfg->portalUserMissingRights();
if ($faltan !== null) {
	$checks[] = array(empty($faltan), 'Permisos del usuario de servicio', empty($faltan) ? 'Lectura de terceros y facturas: el alumno ve sus comprobantes en el portal.' : 'Faltan: '.implode(', ', $faltan).'. Pulsa "Completar lo pendiente" para asignarlos.');
}
print '<table class="noborder centpercent">';
print '<tr class="liste_titre"><th>Requisito</th><th>Para qué</th><th class="center">Estado</th></tr>';
foreach ($checks as $c) {
	print '<tr class="oddeven"><td>'.dol_escape_htmltag($c[1]).'</td><td>'.dol_escape_htmltag($c[2]).'</td><td class="center">'.($c[0] ? $ok : $ko).'</td></tr>';
}
print '</table><br>';

// Configuración recomendada
print load_fiche_titre('Configuración recomendada (datos y estilo de posgrado-fip.org.pe)', '', '');
print '<div class="div-table-responsive"><table class="noborder centpercent">';
print '<tr class="liste_titre"><th>Grupo</th><th>Ajuste</th><th>Valor actual</th><th>Recomendado</th><th class="center">Estado</th></tr>';
$pend = 0;
foreach ($cfg->getSettings() as $name => $def) {
	$applied = $cfg->isApplied($name, $def[0]);
	if (!$applied) {
		$pend++;
	}
	$cur = $cfg->current($name);
	$swatch = function ($v) {
		if (preg_match('/^\d{1,3},\d{1,3},\d{1,3}$/', $v)) {
			return '<span style="display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:middle;margin-right:4px;border:1px solid #ccc;background:rgb('.$v.')"></span>';
		}
		if (preg_match('/^#[0-9a-f]{6}$/i', $v)) {
			return '<span style="display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:middle;margin-right:4px;border:1px solid #ccc;background:'.$v.'"></span>';
		}
		return '';
	};
	print '<tr class="oddeven">';
	print '<td class="nowraponall opacitymedium">'.dol_escape_htmltag($def[2]).'</td>';
	print '<td>'.dol_escape_htmltag($def[1]).'<br><span class="opacitymedium small">'.dol_escape_htmltag($name).'</span></td>';
	print '<td class="tdoverflowmax250">'.$swatch($cur).($cur === '' ? '<span class="opacitymedium">(vacío)</span>' : dol_escape_htmltag($cur)).'</td>';
	print '<td class="tdoverflowmax250">'.$swatch($def[0]).dol_escape_htmltag($def[0]).'</td>';
	print '<td class="center">'.($applied ? $ok : $ko).'</td>';
	print '</tr>';
}
$logoOk = getDolGlobalString('MAIN_INFO_SOCIETE_LOGO') === 'logo-uni.png';
print '<tr class="oddeven"><td class="opacitymedium">Apariencia</td><td>Logo: escudo de la UNI<br><span class="opacitymedium small">MAIN_INFO_SOCIETE_LOGO</span></td><td>'.dol_escape_htmltag(getDolGlobalString('MAIN_INFO_SOCIETE_LOGO')).'</td><td><img src="'.dol_buildpath('/posgradofip/img/logo-uni.png', 1).'" alt="" style="height:32px"></td><td class="center">'.($logoOk ? $ok : $ko).'</td></tr>';
print '</table></div>';

print '<div class="center margintoponly">';
print '<form method="POST" action="'.$_SERVER['PHP_SELF'].'" style="display:inline">';
print '<input type="hidden" name="token" value="'.newToken().'"><input type="hidden" name="action" value="apply">';
print '<input type="submit" class="button" value="Completar lo pendiente"></form> ';
print '<form method="POST" action="'.$_SERVER['PHP_SELF'].'" style="display:inline" onsubmit="return confirm(\'Se reemplazarán también los valores que se hayan configurado a mano. ¿Continuar?\');">';
print '<input type="hidden" name="token" value="'.newToken().'"><input type="hidden" name="action" value="applyall">';
print '<input type="submit" class="button button-cancel" value="Aplicar toda la configuración recomendada"></form>';
print '</div>';
print '<p class="opacitymedium">"Completar lo pendiente" solo llena lo vacío o lo que sigue con el valor de fábrica de Dolibarr (es lo que se hace al activar el módulo). Los datos vienen de posgrado-fip.org.pe; revisa el RUC y el nombre del director(a) en Empresa/Organización, porque no figuran en la web.</p>';

print '<br><div class="info">';
print '<b>Puesta en marcha</b><ol>';
print '<li>Revisa programas, cursos y reglas de aprobación en <a href="'.dol_buildpath('/posgradofip/programas.php', 1).'">Posgrado → Programas y cursos</a> (vienen cargados desde posgrado-fip.org.pe; confirma la nota aprobatoria y los créditos por curso según el reglamento).</li>';
print '<li>Revisa los periodos y asigna docentes en <a href="'.dol_buildpath('/posgradofip/asignaciones.php', 1).'">Asignación docente</a>.</li>';
print '<li>Crea los grupos <i>Docentes</i> (permiso "Registrar notas en los cursos asignados") y <i>Coordinación</i> (todos los permisos de Posgrado FIP).</li>';
print '<li>Matricula a los alumnos y crea su cuenta del portal en la ficha del tercero → "Cuentas de sitios web" (tipo "Portal Dolibarr").</li>';
print '<li>Emite las cuotas como facturas del alumno: el portal muestra lo pagado y el saldo.</li>';
print '</ol></div>';

print dol_get_fiche_end();
llxFooter();
$db->close();
