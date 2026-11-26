<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/matriculas.php
 * \ingroup posgradofip
 * \brief   Lista de matrículas (alumnos por programa)
 */

require __DIR__.'/lib/loadmain.inc.php';
dol_include_once('/posgradofip/lib/posgradofip.lib.php');

/** @var DoliDB $db */
/** @var User $user */
/** @var Conf $conf */

posgradofip_check_enabled();
if (!$user->hasRight('posgradofip', 'read')) {
	accessforbidden();
}

$search_programa = GETPOSTINT('search_programa');
$search_periodo = GETPOSTINT('search_periodo');
$search_status = GETPOST('search_status', 'alpha');
$search_all = trim(GETPOST('search_all', 'alphanohtml'));
if (GETPOST('button_removefilter', 'alpha')) {
	$search_programa = $search_periodo = 0;
	$search_status = '';
	$search_all = '';
}
$limit = GETPOSTINT('limit') ? GETPOSTINT('limit') : $conf->liste_limit;
$page = max(0, GETPOSTINT('page'));
$offset = $limit * $page;

$estados = posgradofip_matricula_estados();
$tipos = posgradofip_tipos();

$sql = "SELECT m.rowid, m.codigo, m.status, s.rowid as socid, s.nom as alumno, s.email, p.label as programa, p.tipo, pe.ref as periodo";
$sqlfrom = " FROM ".$db->prefix()."posgrado_matricula as m";
$sqlfrom .= " INNER JOIN ".$db->prefix()."societe as s ON s.rowid = m.fk_soc";
$sqlfrom .= " INNER JOIN ".$db->prefix()."posgrado_programa as p ON p.rowid = m.fk_programa";
$sqlfrom .= " LEFT JOIN ".$db->prefix()."posgrado_periodo as pe ON pe.rowid = m.fk_periodo";
$sqlfrom .= " WHERE m.entity IN (".getEntity('posgradofip').")";
if ($search_programa > 0) {
	$sqlfrom .= " AND m.fk_programa = ".((int) $search_programa);
}
if ($search_periodo > 0) {
	$sqlfrom .= " AND m.fk_periodo = ".((int) $search_periodo);
}
if ($search_status !== '' && $search_status !== '-1') {
	$sqlfrom .= " AND m.status = ".((int) $search_status);
}
if ($search_all !== '') {
	$sqlfrom .= natural_search(array('s.nom', 's.email', 'm.codigo', 's.idprof1', 's.idprof2'), $search_all);
}
$nbtotal = 0;
$resql = $db->query("SELECT COUNT(m.rowid) as nb".$sqlfrom);
if ($resql && ($o = $db->fetch_object($resql))) {
	$nbtotal = (int) $o->nb;
}
$sql .= $sqlfrom." ORDER BY s.nom ASC".$db->plimit($limit, $offset);
$resql = $db->query($sql);

$form = new Form($db);
llxHeader('', 'Matrículas', '', '', 0, 0, '', '', '', 'mod-posgradofip page-matriculas');

$param = '&search_programa='.((int) $search_programa).'&search_periodo='.((int) $search_periodo).'&search_status='.urlencode($search_status).'&search_all='.urlencode($search_all);
$newbutton = $user->hasRight('posgradofip', 'matricula') ? dolGetButtonTitle('Nueva matrícula', '', 'fa fa-plus-circle', dol_buildpath('/posgradofip/matricula.php', 1).'?action=create') : '';
print '<form method="GET" action="'.$_SERVER['PHP_SELF'].'">';
print_barre_liste('Matrículas', $page, $_SERVER['PHP_SELF'], $param, '', '', '', $resql ? $db->num_rows($resql) : 0, $nbtotal, 'user', 0, $newbutton, '', $limit);

print '<div class="liste_titre liste_titre_bydiv centpercent marginbottomonly">';
print '<input name="search_all" class="minwidth200" placeholder="Nombre, correo, DNI o código" value="'.dol_escape_htmltag($search_all).'"> ';
print $form->selectarray('search_programa', posgradofip_programas_array($db, false), $search_programa, 1, 0, 0, '', 0, 0, 0, '', 'minwidth250', 0, '', 0, 1).' ';
print $form->selectarray('search_periodo', posgradofip_periodos_array($db), $search_periodo, 1).' ';
print $form->selectarray('search_status', $estados, $search_status, 1).' ';
print '<input type="submit" class="button smallpaddingimp" value="Filtrar"> ';
print '<input type="submit" class="button button-cancel smallpaddingimp" name="button_removefilter" value="Quitar filtros">';
print '</div>';

print '<div class="div-table-responsive"><table class="noborder centpercent liste">';
print '<tr class="liste_titre"><th>Alumno</th><th>Código</th><th>Programa</th><th>Ingreso</th><th class="center">Estado</th></tr>';
$n = 0;
if ($resql) {
	while ($o = $db->fetch_object($resql)) {
		$n++;
		print '<tr class="oddeven">';
		print '<td class="tdoverflowmax250"><a href="'.dol_buildpath('/posgradofip/matricula.php', 1).'?id='.((int) $o->rowid).'">'.img_picto('', 'user', 'class="pictofixedwidth"').dol_escape_htmltag($o->alumno).'</a>';
		if ($o->email) {
			print '<br><span class="opacitymedium small">'.dol_escape_htmltag($o->email).'</span>';
		}
		print '</td>';
		print '<td class="nowraponall">'.dol_escape_htmltag($o->codigo).'</td>';
		print '<td class="tdoverflowmax300">'.dol_escape_htmltag($o->programa).'</td>';
		print '<td class="nowraponall">'.dol_escape_htmltag($o->periodo).'</td>';
		print '<td class="center">'.posgradofip_matricula_badge($o->status).'</td>';
		print '</tr>';
	}
}
if (!$n) {
	print '<tr><td colspan="5"><span class="opacitymedium">No hay matrículas que coincidan.</span></td></tr>';
}
print '</table></div>';
print '</form>';

llxFooter();
$db->close();
