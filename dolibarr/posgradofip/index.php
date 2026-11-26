<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/index.php
 * \ingroup posgradofip
 * \brief   Tablero del módulo Posgrado
 */

require __DIR__.'/lib/loadmain.inc.php';
dol_include_once('/posgradofip/lib/posgradofip.lib.php');

/** @var DoliDB $db */
/** @var User $user */
/** @var Translate $langs */

posgradofip_check_enabled();
if (!$user->hasRight('posgradofip', 'read') && !$user->hasRight('posgradofip', 'notas')) {
	accessforbidden();
}

llxHeader('', 'Posgrado', '', '', 0, 0, '', '', '', 'mod-posgradofip page-index');

print load_fiche_titre('Posgrado FIP-UNI', '', 'fa-graduation-cap');

print '<div class="fichecenter"><div class="fichethirdleft">';

// Matrículas por programa
if ($user->hasRight('posgradofip', 'read')) {
	$estados = posgradofip_matricula_estados();
	$sql = "SELECT p.rowid, p.label, p.tipo, m.status, COUNT(m.rowid) as nb";
	$sql .= " FROM ".$db->prefix()."posgrado_programa as p";
	$sql .= " LEFT JOIN ".$db->prefix()."posgrado_matricula as m ON m.fk_programa = p.rowid";
	$sql .= " WHERE p.entity IN (".getEntity('posgradofip').") AND p.active = 1";
	$sql .= " GROUP BY p.rowid, p.label, p.tipo, m.status";
	$sql .= " ORDER BY CASE p.tipo WHEN 'doctorado' THEN 1 WHEN 'maestria' THEN 2 ELSE 3 END, p.label";
	$resql = $db->query($sql);
	$data = array();
	if ($resql) {
		while ($obj = $db->fetch_object($resql)) {
			if (!isset($data[$obj->rowid])) {
				$data[$obj->rowid] = array('label' => $obj->label, 'counts' => array());
			}
			if ($obj->status !== null) {
				$data[$obj->rowid]['counts'][(int) $obj->status] = (int) $obj->nb;
			}
		}
	}
	print '<div class="div-table-responsive-no-min"><table class="noborder centpercent">';
	print '<tr class="liste_titre"><th>Programa</th><th class="right">Postulantes</th><th class="right">Activos</th><th class="right">Egresados</th></tr>';
	foreach ($data as $pid => $d) {
		print '<tr class="oddeven">';
		print '<td class="tdoverflowmax300"><a href="'.dol_buildpath('/posgradofip/matriculas.php', 1).'?search_programa='.((int) $pid).'">'.dol_escape_htmltag($d['label']).'</a></td>';
		print '<td class="right">'.(isset($d['counts'][0]) ? $d['counts'][0] : 0).'</td>';
		print '<td class="right">'.(isset($d['counts'][1]) ? $d['counts'][1] : 0).'</td>';
		print '<td class="right">'.((isset($d['counts'][2]) ? $d['counts'][2] : 0) + (isset($d['counts'][3]) ? $d['counts'][3] : 0)).'</td>';
		print '</tr>';
	}
	if (empty($data)) {
		print '<tr><td colspan="4"><span class="opacitymedium">No hay programas activos.</span></td></tr>';
	}
	print '</table></div>';
}

print '</div><div class="fichetwothirdright">';

// Mis cursos (docente) / notas pendientes de publicar (coordinación)
$sql = "SELECT c.rowid as curso_id, c.label as curso, p.label as programa, pe.rowid as periodo_id, pe.ref as periodo,";
$sql .= " (SELECT COUNT(*) FROM ".$db->prefix()."posgrado_nota n WHERE n.fk_curso = c.rowid AND n.fk_periodo = pe.rowid AND n.status = 0) as borradores";
$sql .= " FROM ".$db->prefix()."posgrado_asignacion as a";
$sql .= " INNER JOIN ".$db->prefix()."posgrado_curso as c ON c.rowid = a.fk_curso";
$sql .= " INNER JOIN ".$db->prefix()."posgrado_programa as p ON p.rowid = c.fk_programa";
$sql .= " INNER JOIN ".$db->prefix()."posgrado_periodo as pe ON pe.rowid = a.fk_periodo";
$sql .= " WHERE pe.status = 1 AND a.entity IN (".getEntity('posgradofip').")";
if (!$user->hasRight('posgradofip', 'notasall')) {
	$sql .= " AND a.fk_user = ".((int) $user->id);
}
$sql .= " ORDER BY pe.ref DESC, p.label, c.ciclo, c.position";
$resql = $db->query($sql);
print '<div class="div-table-responsive-no-min"><table class="noborder centpercent">';
print '<tr class="liste_titre"><th colspan="2">'.($user->hasRight('posgradofip', 'notasall') ? 'Cursos con docente asignado (periodos abiertos)' : 'Mis cursos (periodos abiertos)').'</th><th class="right">Notas sin publicar</th></tr>';
$n = 0;
if ($resql) {
	while ($obj = $db->fetch_object($resql)) {
		$n++;
		print '<tr class="oddeven">';
		print '<td class="nowraponall">'.dol_escape_htmltag($obj->periodo).'</td>';
		print '<td class="tdoverflowmax400"><a href="'.dol_buildpath('/posgradofip/notas.php', 1).'?periodo='.((int) $obj->periodo_id).'&curso='.((int) $obj->curso_id).'">'.dol_escape_htmltag($obj->curso).'</a><br><span class="opacitymedium small">'.dol_escape_htmltag($obj->programa).'</span></td>';
		print '<td class="right">'.((int) $obj->borradores ? '<span class="badge badge-warning">'.((int) $obj->borradores).'</span>' : '0').'</td>';
		print '</tr>';
	}
}
if (!$n) {
	print '<tr><td colspan="3"><span class="opacitymedium">No hay cursos asignados en periodos abiertos.</span></td></tr>';
}
print '</table></div>';

print '</div></div>';

llxFooter();
$db->close();
