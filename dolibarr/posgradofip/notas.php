<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/notas.php
 * \ingroup posgradofip
 * \brief   Registro de notas por curso y periodo (docentes y coordinación)
 */

require __DIR__.'/lib/loadmain.inc.php';
dol_include_once('/posgradofip/lib/posgradofip.lib.php');

/** @var DoliDB $db */
/** @var User $user */
/** @var Conf $conf */

posgradofip_check_enabled();
$all = $user->hasRight('posgradofip', 'notasall');
if (!$all && !$user->hasRight('posgradofip', 'notas')) {
	accessforbidden();
}

$action = GETPOST('action', 'aZ09');
$periodos = posgradofip_periodos_array($db);
$periodo = GETPOSTINT('periodo');
$curso = GETPOSTINT('curso');
if (!$periodo || !isset($periodos[$periodo])) {
	$open = posgradofip_periodos_array($db, true);
	$periodo = $open ? (int) array_key_last($open) : 0;
}

// Estado del periodo
$periodoAbierto = false;
if ($periodo > 0) {
	$resql = $db->query("SELECT status FROM ".$db->prefix()."posgrado_periodo WHERE rowid = ".((int) $periodo));
	$o = $resql ? $db->fetch_object($resql) : null;
	$periodoAbierto = ($o && (int) $o->status == 1);
}

// Cursos que el usuario puede calificar en el periodo
$cursos = array();
if ($periodo > 0) {
	$sql = "SELECT c.rowid, c.label, c.ciclo, p.label as programa, p.tipo FROM ".$db->prefix()."posgrado_curso as c";
	$sql .= " INNER JOIN ".$db->prefix()."posgrado_programa as p ON p.rowid = c.fk_programa";
	if (!$all) {
		$sql .= " INNER JOIN ".$db->prefix()."posgrado_asignacion as a ON a.fk_curso = c.rowid AND a.fk_periodo = ".((int) $periodo)." AND a.fk_user = ".((int) $user->id);
	}
	$sql .= " WHERE c.active = 1 AND p.active = 1 AND p.entity IN (".getEntity('posgradofip').")";
	$sql .= " ORDER BY CASE p.tipo WHEN 'doctorado' THEN 1 WHEN 'maestria' THEN 2 ELSE 3 END, p.label, CASE WHEN c.ciclo = 0 THEN 1 ELSE 0 END, c.ciclo, c.position";
	$resql = $db->query($sql);
	if ($resql) {
		while ($o = $db->fetch_object($resql)) {
			$cursos[(int) $o->rowid] = $o->programa.' — '.posgradofip_ciclo_label($o->tipo, $o->ciclo).' — '.$o->label;
		}
	}
}
if ($curso && !isset($cursos[$curso])) {
	$curso = 0;
}

$cursoObj = null;
$programa = null;
if ($curso > 0) {
	$resql = $db->query("SELECT * FROM ".$db->prefix()."posgrado_curso WHERE rowid = ".((int) $curso));
	$cursoObj = $resql ? $db->fetch_object($resql) : null;
	$programa = $cursoObj ? posgradofip_fetch_programa($db, (int) $cursoObj->fk_programa) : null;
}

$puedeEditar = $cursoObj && posgradofip_puede_calificar($db, $user, $curso, $periodo) && ($periodoAbierto || $all);

/*
 * Guardar
 */
if ($action == 'save' && $puedeEditar) {
	$notas = GETPOST('nota', 'array');
	$asist = GETPOST('asistencia', 'array');
	$obs = GETPOST('observacion', 'array');
	$publicar = $all && GETPOST('publicar', 'alpha') ? 1 : 0;
	$despublicar = $all && GETPOST('despublicar', 'alpha') ? 1 : 0;

	// Solo matrículas del programa del curso (evita escribir en matrículas ajenas)
	$validas = array();
	$resql = $db->query("SELECT rowid FROM ".$db->prefix()."posgrado_matricula WHERE fk_programa = ".((int) $cursoObj->fk_programa)." AND entity IN (".getEntity('posgradofip').")");
	if ($resql) {
		while ($o = $db->fetch_object($resql)) {
			$validas[(int) $o->rowid] = 1;
		}
	}

	$parse = function ($v, $max) {
		$v = trim(str_replace(',', '.', (string) $v));
		if ($v === '') {
			return null;
		}
		if (!is_numeric($v) || (float) $v < 0 || (float) $v > $max) {
			return false;
		}
		return round((float) $v, 2);
	};

	$db->begin();
	$error = 0;
	$errores = array();
	foreach ($notas as $mid => $valor) {
		$mid = (int) $mid;
		if (!isset($validas[$mid])) {
			continue;
		}
		$n = $parse($valor, 20);
		$a = $parse(isset($asist[$mid]) ? $asist[$mid] : '', 100);
		if ($n === false || $a === false) {
			$errores[] = $mid;
			continue;
		}
		$o = isset($obs[$mid]) ? trim(dol_trunc(dol_string_nohtmltag((string) $obs[$mid]), 255, 'right', 'UTF-8', 1)) : '';

		$resql = $db->query("SELECT rowid, status FROM ".$db->prefix()."posgrado_nota WHERE fk_matricula = ".$mid." AND fk_curso = ".((int) $curso)." AND fk_periodo = ".((int) $periodo));
		$ex = $resql ? $db->fetch_object($resql) : null;

		if (!$ex && $n === null && $a === null && $o === '') {
			continue; // nada que guardar
		}
		$status = $ex ? (int) $ex->status : 0;
		if ($publicar) {
			$status = 1;
		} elseif ($despublicar) {
			$status = 0;
		} elseif (!$all) {
			// Si un docente modifica una nota ya publicada, vuelve a borrador hasta que coordinación la publique
			$status = 0;
		}
		$vals = "nota = ".($n === null ? 'NULL' : $n).", asistencia = ".($a === null ? 'NULL' : $a).", observacion = ".($o === '' ? 'NULL' : "'".$db->escape($o)."'");
		$vals .= ", status = ".$status.", fk_user_modif = ".((int) $user->id);
		if ($status == 1 && (!$ex || (int) $ex->status == 0)) {
			$vals .= ", date_publication = '".$db->idate(dol_now())."'";
		}
		if ($ex) {
			$sql = "UPDATE ".$db->prefix()."posgrado_nota SET ".$vals." WHERE rowid = ".((int) $ex->rowid);
		} else {
			$sql = "INSERT INTO ".$db->prefix()."posgrado_nota (entity, fk_matricula, fk_curso, fk_periodo, nota, asistencia, observacion, status, fk_user_modif, date_publication) VALUES (";
			$sql .= ((int) $conf->entity).", ".$mid.", ".((int) $curso).", ".((int) $periodo).", ".($n === null ? 'NULL' : $n).", ".($a === null ? 'NULL' : $a).", ";
			$sql .= ($o === '' ? 'NULL' : "'".$db->escape($o)."'").", ".$status.", ".((int) $user->id).", ".($status == 1 ? "'".$db->idate(dol_now())."'" : 'NULL').")";
		}
		if (!$db->query($sql)) {
			$error++;
			break;
		}
	}
	if ($error) {
		$db->rollback();
		setEventMessages($db->lasterror(), null, 'errors');
	} else {
		$db->commit();
		if ($errores) {
			setEventMessages(count($errores).' fila(s) no se guardaron: la nota debe estar entre 0 y 20 y la asistencia entre 0 y 100.', null, 'warnings');
		}
		setEventMessages($publicar ? 'Notas guardadas y publicadas: los alumnos ya las ven en el Portal Web.' : ($despublicar ? 'Notas retiradas del Portal Web.' : 'Notas guardadas como borrador.'), null, 'mesgs');
		header('Location: '.$_SERVER['PHP_SELF'].'?periodo='.((int) $periodo).'&curso='.((int) $curso));
		exit;
	}
}

/*
 * Vista
 */
$form = new Form($db);
llxHeader('', 'Registro de notas', '', '', 0, 0, '', '', '', 'mod-posgradofip page-notas');
print load_fiche_titre('Registro de notas', '', 'edit');

if (empty($periodos)) {
	print '<div class="warning">No hay periodos académicos. Créalos en "Periodos académicos".</div>';
	llxFooter();
	exit;
}

print '<form method="GET" action="'.$_SERVER['PHP_SELF'].'" class="marginbottomonly">';
print 'Periodo '.$form->selectarray('periodo', $periodos, $periodo, 0, 0, 0, 'onchange="this.form.curso.value=\'\';this.form.submit()"');
print ' &nbsp; Curso '.$form->selectarray('curso', $cursos, $curso, 1, 0, 0, 'onchange="this.form.submit()"', 0, 0, 0, '', 'minwidth500 maxwidth100pc');
print ' <noscript><input type="submit" class="button smallpaddingimp" value="Ver"></noscript>';
print '</form>';

if (empty($cursos)) {
	print '<div class="opacitymedium">'.($all ? 'No hay cursos activos.' : 'No tienes cursos asignados en este periodo. La coordinación los asigna en "Asignación docente".').'</div>';
} elseif (!$cursoObj) {
	print '<div class="opacitymedium">Elige un curso.</div>';
} else {
	if (!$periodoAbierto) {
		print '<div class="warning">El periodo está cerrado.'.($all ? ' Como coordinación aún puedes corregir notas.' : ' Ya no se pueden modificar notas.').'</div>';
	}

	// Alumnos: matrículas activas del programa + cualquiera que ya tenga nota en este curso/periodo
	$sql = "SELECT m.rowid as mid, m.codigo, m.status as mstatus, s.nom as alumno, n.nota, n.asistencia, n.observacion, n.status";
	$sql .= " FROM ".$db->prefix()."posgrado_matricula as m";
	$sql .= " INNER JOIN ".$db->prefix()."societe as s ON s.rowid = m.fk_soc";
	$sql .= " LEFT JOIN ".$db->prefix()."posgrado_nota as n ON n.fk_matricula = m.rowid AND n.fk_curso = ".((int) $curso)." AND n.fk_periodo = ".((int) $periodo);
	$sql .= " WHERE m.fk_programa = ".((int) $cursoObj->fk_programa)." AND m.entity IN (".getEntity('posgradofip').")";
	$sql .= " AND (m.status = 1 OR n.rowid IS NOT NULL)";
	$sql .= " ORDER BY s.nom";
	$resql = $db->query($sql);

	if ($puedeEditar) {
		print '<form method="POST" action="'.$_SERVER['PHP_SELF'].'">';
		print '<input type="hidden" name="token" value="'.newToken().'">';
		print '<input type="hidden" name="action" value="save">';
		print '<input type="hidden" name="periodo" value="'.((int) $periodo).'">';
		print '<input type="hidden" name="curso" value="'.((int) $curso).'">';
	}
	print '<div class="div-table-responsive"><table class="noborder centpercent">';
	print '<tr class="liste_titre"><th>Alumno</th><th>Código</th><th class="right">Asistencia (%)</th><th class="right">Nota (0–20)</th><th>Observación</th><th>Resultado</th><th class="center">Publicada</th></tr>';
	$n = 0;
	$sum = 0;
	$cnt = 0;
	if ($resql) {
		while ($r = $db->fetch_object($resql)) {
			$n++;
			$ok = posgradofip_aprobado($r, $programa);
			if ($r->nota !== null) {
				$sum += (float) $r->nota;
				$cnt++;
			}
			print '<tr class="oddeven">';
			print '<td class="tdoverflowmax250"><a href="'.dol_buildpath('/posgradofip/matricula.php', 1).'?id='.((int) $r->mid).'">'.dol_escape_htmltag($r->alumno).'</a>'.((int) $r->mstatus != 1 ? ' <span class="opacitymedium small">('.dol_escape_htmltag(posgradofip_matricula_estados()[(int) $r->mstatus]).')</span>' : '').'</td>';
			print '<td class="nowraponall">'.dol_escape_htmltag($r->codigo).'</td>';
			if ($puedeEditar) {
				print '<td class="right"><input type="number" step="0.01" min="0" max="100" name="asistencia['.((int) $r->mid).']" class="width75 right" value="'.dol_escape_htmltag($r->asistencia !== null ? price2num($r->asistencia) : '').'"></td>';
				print '<td class="right"><input type="number" step="0.01" min="0" max="20" name="nota['.((int) $r->mid).']" class="width75 right" value="'.dol_escape_htmltag($r->nota !== null ? price2num($r->nota) : '').'"></td>';
				print '<td><input name="observacion['.((int) $r->mid).']" class="minwidth200 maxwidth300" maxlength="255" value="'.dol_escape_htmltag($r->observacion).'"></td>';
			} else {
				print '<td class="right">'.($r->asistencia !== null ? price2num($r->asistencia).' %' : '').'</td>';
				print '<td class="right"><b>'.posgradofip_fmt_nota($r->nota).'</b></td>';
				print '<td>'.dol_escape_htmltag($r->observacion).'</td>';
			}
			print '<td>'.($ok === null ? '' : ($ok ? '<span class="badge badge-status4">Aprobado</span>' : '<span class="badge badge-status8">Desaprobado</span>')).'</td>';
			print '<td class="center">'.($r->status === null ? '' : ((int) $r->status ? img_picto('Visible para el alumno', 'tick') : '<span class="opacitymedium small">Borrador</span>')).'</td>';
			print '</tr>';
		}
	}
	if (!$n) {
		print '<tr><td colspan="7"><span class="opacitymedium">No hay alumnos activos matriculados en este programa.</span></td></tr>';
	} elseif ($cnt) {
		print '<tr class="liste_total"><td colspan="3">Promedio del curso ('.$cnt.' notas)</td><td class="right">'.number_format($sum / $cnt, 2).'</td><td colspan="3"></td></tr>';
	}
	print '</table></div>';
	print '<p class="opacitymedium small">Nota mínima aprobatoria: '.posgradofip_fmt_nota($programa->nota_aprobatoria).' · Asistencia mínima: '.price2num($programa->asistencia_minima).' %. ';
	print $all ? 'Las notas en borrador no las ve el alumno hasta que se publiquen.' : 'Al guardar, las notas quedan en borrador; la coordinación las publica en el Portal Web.';
	print '</p>';
	if ($puedeEditar && $n) {
		print '<div class="center">';
		print '<input type="submit" class="button button-save" value="Guardar borrador">';
		if ($all) {
			print ' <input type="submit" class="button" name="publicar" value="Guardar y publicar">';
			print ' <input type="submit" class="button button-cancel" name="despublicar" value="Retirar del portal">';
		}
		print '</div>';
	}
	if ($puedeEditar) {
		print '</form>';
	}
}

llxFooter();
$db->close();
