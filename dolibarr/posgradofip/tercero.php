<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/tercero.php
 * \ingroup posgradofip
 * \brief   Pestaña "Posgrado" en la ficha del tercero: matrículas del alumno
 */

require __DIR__.'/lib/loadmain.inc.php';
dol_include_once('/posgradofip/lib/posgradofip.lib.php');
require_once DOL_DOCUMENT_ROOT.'/societe/class/societe.class.php';
require_once DOL_DOCUMENT_ROOT.'/core/lib/company.lib.php';

/** @var DoliDB $db */
/** @var User $user */

posgradofip_check_enabled();
if (!$user->hasRight('posgradofip', 'read')) {
	accessforbidden();
}
$socid = GETPOSTINT('socid');
if ($user->socid > 0) {
	$socid = $user->socid;
}
$object = new Societe($db);
if ($socid <= 0 || $object->fetch($socid) <= 0) {
	accessforbidden('Tercero no encontrado');
}
restrictedArea($user, 'societe', $socid, '&societe');

llxHeader('', $object->name.' - Posgrado', '', '', 0, 0, '', '', '', 'mod-posgradofip page-tercero');
$head = societe_prepare_head($object);
print dol_get_fiche_head($head, 'posgradofip', 'Tercero', -1, 'company');
dol_banner_tab($object, 'socid', '<a href="'.DOL_URL_ROOT.'/societe/list.php">Volver a la lista</a>', ($user->socid ? 0 : 1), 'rowid', 'nom');
print dol_get_fiche_end();

$tipos = posgradofip_tipos();
$sql = "SELECT m.rowid, m.codigo, m.status, m.fk_programa, p.label as programa, p.tipo, pe.ref as periodo";
$sql .= " FROM ".$db->prefix()."posgrado_matricula as m";
$sql .= " INNER JOIN ".$db->prefix()."posgrado_programa as p ON p.rowid = m.fk_programa";
$sql .= " LEFT JOIN ".$db->prefix()."posgrado_periodo as pe ON pe.rowid = m.fk_periodo";
$sql .= " WHERE m.fk_soc = ".((int) $socid)." AND m.entity IN (".getEntity('posgradofip').") ORDER BY m.rowid";
$resql = $db->query($sql);

$newbutton = $user->hasRight('posgradofip', 'matricula') ? dolGetButtonTitle('Nueva matrícula', '', 'fa fa-plus-circle', dol_buildpath('/posgradofip/matricula.php', 1).'?action=create&socid='.((int) $socid)) : '';
print load_fiche_titre('Matrículas de posgrado', $newbutton, '');
print '<div class="div-table-responsive"><table class="noborder centpercent">';
print '<tr class="liste_titre"><th>Programa</th><th>Tipo</th><th>Código</th><th>Ingreso</th><th class="right">Promedio</th><th class="center">Estado</th></tr>';
$n = 0;
if ($resql) {
	while ($o = $db->fetch_object($resql)) {
		$n++;
		$programa = posgradofip_fetch_programa($db, (int) $o->fk_programa);
		$res = $programa ? posgradofip_resumen(posgradofip_fetch_record($db, (int) $o->rowid), $programa) : null;
		print '<tr class="oddeven">';
		print '<td><a href="'.dol_buildpath('/posgradofip/matricula.php', 1).'?id='.((int) $o->rowid).'">'.img_picto('', 'fa-graduation-cap', 'class="pictofixedwidth"').dol_escape_htmltag($o->programa).'</a></td>';
		print '<td>'.dol_escape_htmltag(isset($tipos[$o->tipo]) ? $tipos[$o->tipo] : $o->tipo).'</td>';
		print '<td>'.dol_escape_htmltag($o->codigo).'</td>';
		print '<td>'.dol_escape_htmltag($o->periodo).'</td>';
		print '<td class="right">'.($res && $res['promedio'] !== null ? number_format($res['promedio'], 2) : '').'</td>';
		print '<td class="center">'.posgradofip_matricula_badge($o->status).'</td>';
		print '</tr>';
	}
}
if (!$n) {
	print '<tr><td colspan="6"><span class="opacitymedium">Este tercero no tiene matrículas.</span></td></tr>';
}
print '</table></div>';

llxFooter();
$db->close();
