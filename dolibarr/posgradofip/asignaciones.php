<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/asignaciones.php
 * \ingroup posgradofip
 * \brief   Docente responsable de cada curso en un periodo
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
$canedit = $user->hasRight('posgradofip', 'config');
$action = GETPOST('action', 'aZ09');
$periodos = posgradofip_periodos_array($db);
$periodo = GETPOSTINT('periodo');
if (!$periodo || !isset($periodos[$periodo])) {
	$open = posgradofip_periodos_array($db, true);
	$periodo = $open ? (int) array_key_last($open) : ($periodos ? (int) array_key_first($periodos) : 0);
	// array_key_last del listado DESC = el periodo abierto más antiguo (el vigente)
}
$programa = GETPOSTINT('programa');

if ($canedit && $action == 'save' && $periodo > 0) {
	$docentes = GETPOST('docente', 'array');
	$db->begin();
	$error = 0;
	foreach ($docentes as $cursoid => $uid) {
		$cursoid = (int) $cursoid;
		$uid = (int) $uid;
		if ($cursoid <= 0) {
			continue;
		}
		if (!$db->query("DELETE FROM ".$db->prefix()."posgrado_asignacion WHERE fk_curso = ".$cursoid." AND fk_periodo = ".((int) $periodo))) {
			$error++;
		}
		if ($uid > 0 && !$db->query("INSERT INTO ".$db->prefix()."posgrado_asignacion (entity, fk_curso, fk_periodo, fk_user) VALUES (".((int) $conf->entity).", ".$cursoid.", ".((int) $periodo).", ".$uid.")")) {
			$error++;
		}
	}
	if ($error) {
		$db->rollback();
		setEventMessages($db->lasterror(), null, 'errors');
	} else {
		$db->commit();
		setEventMessages('Asignaciones guardadas.', null, 'mesgs');
		header('Location: '.$_SERVER['PHP_SELF'].'?periodo='.((int) $periodo).'&programa='.((int) $programa));
		exit;
	}
}

$form = new Form($db);
llxHeader('', 'Asignación docente', '', '', 0, 0, '', '', '', 'mod-posgradofip page-asignaciones');
print load_fiche_titre('Asignación docente', '', 'hrm');

if (empty($periodos)) {
	print '<div class="warning">Primero crea un periodo académico.</div>';
	llxFooter();
	exit;
}

print '<form method="GET" action="'.$_SERVER['PHP_SELF'].'" class="marginbottomonly">';
print 'Periodo '.$form->selectarray('periodo', $periodos, $periodo, 0, 0, 0, '', 0, 0, 0, '', 'minwidth100');
print ' &nbsp; Programa '.$form->selectarray('programa', posgradofip_programas_array($db), $programa, 1, 0, 0, '', 0, 0, 0, '', 'minwidth300');
print ' <input type="submit" class="button smallpaddingimp" value="Ver">';
print '</form>';

// Docente actual por curso
$asig = array();
$resql = $db->query("SELECT fk_curso, fk_user FROM ".$db->prefix()."posgrado_asignacion WHERE fk_periodo = ".((int) $periodo));
if ($resql) {
	while ($o = $db->fetch_object($resql)) {
		$asig[(int) $o->fk_curso] = (int) $o->fk_user;
	}
}

// Usuarios internos activos
$users = array();
$resql = $db->query("SELECT rowid, firstname, lastname, login FROM ".$db->prefix()."user WHERE statut = 1 AND (fk_soc IS NULL OR fk_soc = 0) AND entity IN (0, ".((int) $conf->entity).") ORDER BY lastname, firstname");
if ($resql) {
	while ($o = $db->fetch_object($resql)) {
		$users[(int) $o->rowid] = trim($o->lastname.' '.$o->firstname) ?: $o->login;
	}
}

$sql = "SELECT c.rowid, c.label, c.ciclo, p.label as programa, p.tipo FROM ".$db->prefix()."posgrado_curso as c";
$sql .= " INNER JOIN ".$db->prefix()."posgrado_programa as p ON p.rowid = c.fk_programa";
$sql .= " WHERE c.active = 1 AND p.active = 1 AND p.entity IN (".getEntity('posgradofip').")";
if ($programa > 0) {
	$sql .= " AND p.rowid = ".((int) $programa);
}
$sql .= " ORDER BY CASE p.tipo WHEN 'doctorado' THEN 1 WHEN 'maestria' THEN 2 ELSE 3 END, p.label, CASE WHEN c.ciclo = 0 THEN 1 ELSE 0 END, c.ciclo, c.position";
$resql = $db->query($sql);

if ($canedit) {
	print '<form method="POST" action="'.$_SERVER['PHP_SELF'].'">';
	print '<input type="hidden" name="token" value="'.newToken().'">';
	print '<input type="hidden" name="action" value="save">';
	print '<input type="hidden" name="periodo" value="'.((int) $periodo).'">';
	print '<input type="hidden" name="programa" value="'.((int) $programa).'">';
}
print '<div class="div-table-responsive"><table class="noborder centpercent">';
print '<tr class="liste_titre"><th>Programa</th><th>Ciclo</th><th>Curso</th><th>Docente</th></tr>';
$last = '';
if ($resql) {
	while ($c = $db->fetch_object($resql)) {
		print '<tr class="oddeven">';
		print '<td class="tdoverflowmax200">'.($last != $c->programa ? dol_escape_htmltag($c->programa) : '').'</td>';
		$last = $c->programa;
		print '<td class="nowraponall">'.dol_escape_htmltag(posgradofip_ciclo_label($c->tipo, $c->ciclo)).'</td>';
		print '<td>'.dol_escape_htmltag($c->label).'</td>';
		print '<td>';
		$cur = isset($asig[(int) $c->rowid]) ? $asig[(int) $c->rowid] : 0;
		if ($canedit) {
			print $form->selectarray('docente['.((int) $c->rowid).']', $users, $cur, 1, 0, 0, '', 0, 0, 0, '', 'minwidth200');
		} else {
			print $cur && isset($users[$cur]) ? dol_escape_htmltag($users[$cur]) : '<span class="opacitymedium">Sin asignar</span>';
		}
		print '</td></tr>';
	}
}
print '</table></div>';
if ($canedit) {
	print '<div class="center"><input type="submit" class="button button-save" value="Guardar asignaciones"></div>';
	print '</form>';
}
print '<p class="opacitymedium">Los docentes deben ser usuarios internos de Dolibarr con el permiso "Registrar notas en los cursos asignados". Solo verán y calificarán los cursos que tengan asignados aquí.</p>';

llxFooter();
$db->close();
