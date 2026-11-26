<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/programas.php
 * \ingroup posgradofip
 * \brief   Programas de posgrado y su plan de estudios (cursos)
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

$id = GETPOSTINT('id');
$action = GETPOST('action', 'aZ09');
$cursoid = GETPOSTINT('cursoid');
$tipos = posgradofip_tipos();

/*
 * Acciones
 */
if (GETPOST('cancel', 'alpha')) {
	if ($action == 'add' && $id <= 0 && basename($_SERVER['PHP_SELF']) == 'matricula.php') {
		header('Location: '.dol_buildpath('/posgradofip/matriculas.php', 1));
	} else {
		header('Location: '.$_SERVER['PHP_SELF'].($id > 0 ? '?id='.((int) $id) : ''));
	}
	exit;
}
$dec = function ($name) {
	$v = trim(str_replace(',', '.', GETPOST($name, 'alphanohtml')));
	return ($v === '') ? 'NULL' : (string) ((float) $v);
};
$int = function ($name) {
	$v = trim(GETPOST($name, 'alphanohtml'));
	return ($v === '') ? 'NULL' : (string) ((int) $v);
};
$str = function ($name, $maxlen = 255) use ($db) {
	$v = trim(GETPOST($name, 'alphanohtml'));
	return ($v === '') ? 'NULL' : "'".$db->escape(dol_trunc($v, $maxlen, 'right', 'UTF-8', 1))."'";
};

if ($canedit && in_array($action, array('add', 'update'))) {
	$ref = trim(GETPOST('ref', 'alphanohtml'));
	$label = trim(GETPOST('label', 'alphanohtml'));
	$tipo = GETPOST('tipo', 'aZ09');
	$error = 0;
	if ($ref === '' || $label === '' || !isset($tipos[$tipo])) {
		setEventMessages('Código, nombre y tipo son obligatorios.', null, 'errors');
		$error++;
	}
	foreach (array('nota_aprobatoria', 'promedio_minimo') as $k) {
		$v = (float) str_replace(',', '.', GETPOST($k, 'alphanohtml'));
		if ($v < 0 || $v > 20) {
			setEventMessages('Las notas deben estar entre 0 y 20.', null, 'errors');
			$error++;
			break;
		}
	}
	if (!$error) {
		$fields = array(
			'ref' => "'".$db->escape(dol_trunc($ref, 32, 'right', 'UTF-8', 1))."'",
			'label' => "'".$db->escape($label)."'",
			'tipo' => "'".$db->escape($tipo)."'",
			'clave_crm' => $str('clave_crm', 32),
			'grado' => $str('grado'),
			'duracion' => $str('duracion', 128),
			'modalidad' => $str('modalidad', 128),
			'creditos' => $int('creditos'),
			'horas' => $int('horas'),
			'nota_aprobatoria' => (string) ((float) str_replace(',', '.', GETPOST('nota_aprobatoria', 'alphanohtml'))),
			'promedio_minimo' => (string) ((float) str_replace(',', '.', GETPOST('promedio_minimo', 'alphanohtml'))),
			'asistencia_minima' => (string) min(100, max(0, (float) str_replace(',', '.', GETPOST('asistencia_minima', 'alphanohtml')))),
			'active' => GETPOSTINT('active') ? '1' : '0',
		);
		if ($action == 'add') {
			$sql = "INSERT INTO ".$db->prefix()."posgrado_programa (entity, ".implode(', ', array_keys($fields)).", date_creation)";
			$sql .= " VALUES (".((int) $conf->entity).", ".implode(', ', $fields).", '".$db->idate(dol_now())."')";
		} else {
			$set = array();
			foreach ($fields as $k => $v) {
				$set[] = $k.' = '.$v;
			}
			$sql = "UPDATE ".$db->prefix()."posgrado_programa SET ".implode(', ', $set)." WHERE rowid = ".((int) $id)." AND entity IN (".getEntity('posgradofip').")";
		}
		if ($db->query($sql)) {
			if ($action == 'add') {
				$id = $db->last_insert_id($db->prefix()."posgrado_programa");
			}
			setEventMessages('Programa guardado.', null, 'mesgs');
			header('Location: '.$_SERVER['PHP_SELF'].'?id='.((int) $id));
			exit;
		}
		setEventMessages($db->lasterror(), null, 'errors');
	}
	$action = ($action == 'add') ? 'create' : 'edit';
}

if ($canedit && $id > 0 && in_array($action, array('addcurso', 'updatecurso'))) {
	$ref = trim(GETPOST('cref', 'alphanohtml'));
	$label = trim(GETPOST('clabel', 'alphanohtml'));
	if ($ref === '' || $label === '') {
		setEventMessages('Código y nombre del curso son obligatorios.', null, 'errors');
	} else {
		$fields = array(
			'ref' => "'".$db->escape(dol_trunc($ref, 32, 'right', 'UTF-8', 1))."'",
			'label' => "'".$db->escape($label)."'",
			'ciclo' => (string) max(0, GETPOSTINT('cciclo')),
			'tipo' => "'".(GETPOST('ctipo', 'aZ09') == 'electivo' ? 'electivo' : 'obligatorio')."'",
			'creditos' => $dec('ccreditos'),
			'horas' => $int('choras'),
			'position' => (string) GETPOSTINT('cposition'),
			'active' => GETPOSTINT('cactive') ? '1' : '0',
		);
		if ($action == 'addcurso') {
			$sql = "INSERT INTO ".$db->prefix()."posgrado_curso (entity, fk_programa, ".implode(', ', array_keys($fields)).")";
			$sql .= " VALUES (".((int) $conf->entity).", ".((int) $id).", ".implode(', ', $fields).")";
		} else {
			$set = array();
			foreach ($fields as $k => $v) {
				$set[] = $k.' = '.$v;
			}
			$sql = "UPDATE ".$db->prefix()."posgrado_curso SET ".implode(', ', $set)." WHERE rowid = ".((int) $cursoid)." AND fk_programa = ".((int) $id);
		}
		if ($db->query($sql)) {
			setEventMessages('Curso guardado.', null, 'mesgs');
			header('Location: '.$_SERVER['PHP_SELF'].'?id='.((int) $id).'#cursos');
			exit;
		}
		setEventMessages($db->lasterror(), null, 'errors');
	}
	$action = ($action == 'addcurso') ? '' : 'editcurso';
}

if ($canedit && $id > 0 && $action == 'deletecurso' && $cursoid > 0) {
	$sql = "SELECT COUNT(*) as nb FROM ".$db->prefix()."posgrado_nota WHERE fk_curso = ".((int) $cursoid);
	$resql = $db->query($sql);
	$obj = $resql ? $db->fetch_object($resql) : null;
	if ($obj && (int) $obj->nb > 0) {
		// Con notas registradas no se borra: se desactiva
		$db->query("UPDATE ".$db->prefix()."posgrado_curso SET active = 0 WHERE rowid = ".((int) $cursoid)." AND fk_programa = ".((int) $id));
		setEventMessages('El curso tiene notas registradas: se desactivó en lugar de eliminarse.', null, 'warnings');
	} else {
		$db->query("DELETE FROM ".$db->prefix()."posgrado_asignacion WHERE fk_curso = ".((int) $cursoid));
		$db->query("DELETE FROM ".$db->prefix()."posgrado_curso WHERE rowid = ".((int) $cursoid)." AND fk_programa = ".((int) $id));
		setEventMessages('Curso eliminado.', null, 'mesgs');
	}
	header('Location: '.$_SERVER['PHP_SELF'].'?id='.((int) $id).'#cursos');
	exit;
}

/*
 * Vista
 */
$form = new Form($db);
llxHeader('', 'Programas y cursos', '', '', 0, 0, '', '', '', 'mod-posgradofip page-programas');

$programa = $id > 0 ? posgradofip_fetch_programa($db, $id) : null;

if ($action == 'create' || ($action == 'edit' && $programa)) {
	if (!$canedit) {
		accessforbidden();
	}
	$p = $programa ? $programa : (object) array('ref' => '', 'label' => '', 'tipo' => 'maestria', 'clave_crm' => '', 'grado' => '', 'duracion' => '', 'modalidad' => '', 'creditos' => '', 'horas' => '', 'nota_aprobatoria' => 14, 'promedio_minimo' => 14, 'asistencia_minima' => 80, 'active' => 1);
	$v = function ($k) use ($p) {
		return dol_escape_htmltag(GETPOSTISSET($k) ? GETPOST($k, 'alphanohtml') : (string) $p->$k);
	};
	print load_fiche_titre($programa ? 'Editar programa' : 'Nuevo programa', '', 'fa-graduation-cap');
	print '<form method="POST" action="'.$_SERVER['PHP_SELF'].'">';
	print '<input type="hidden" name="token" value="'.newToken().'">';
	print '<input type="hidden" name="action" value="'.($programa ? 'update' : 'add').'">';
	print '<input type="hidden" name="id" value="'.((int) $id).'">';
	print dol_get_fiche_head();
	print '<table class="border centpercent tableforfieldcreate">';
	print '<tr><td class="titlefieldcreate fieldrequired">Código</td><td><input name="ref" class="maxwidth150" maxlength="32" value="'.$v('ref').'"></td></tr>';
	print '<tr><td class="fieldrequired">Nombre</td><td><input name="label" class="minwidth500" value="'.$v('label').'"></td></tr>';
	print '<tr><td class="fieldrequired">Tipo</td><td>'.$form->selectarray('tipo', $tipos, GETPOSTISSET('tipo') ? GETPOST('tipo', 'aZ09') : $p->tipo).'</td></tr>';
	print '<tr><td>'.$form->textwithpicto('Clave en el CRM', 'Valor del atributo "Programa de interés" del tercero (doctorado, maestria, dip_refinacion, dip_riesgos). Al matricular, se actualiza el perfil del alumno.').'</td><td><input name="clave_crm" class="maxwidth150" maxlength="32" value="'.$v('clave_crm').'"></td></tr>';
	print '<tr><td>Grado / diploma que otorga</td><td><input name="grado" class="minwidth500" value="'.$v('grado').'"></td></tr>';
	print '<tr><td>Duración</td><td><input name="duracion" class="minwidth300" value="'.$v('duracion').'"></td></tr>';
	print '<tr><td>Modalidad</td><td><input name="modalidad" class="minwidth300" value="'.$v('modalidad').'"></td></tr>';
	print '<tr><td>Créditos</td><td><input name="creditos" type="number" min="0" class="width75" value="'.$v('creditos').'"></td></tr>';
	print '<tr><td>Horas académicas</td><td><input name="horas" type="number" min="0" class="width75" value="'.$v('horas').'"></td></tr>';
	print '<tr><td>Nota mínima aprobatoria por curso</td><td><input name="nota_aprobatoria" type="number" step="0.01" min="0" max="20" class="width75" value="'.$v('nota_aprobatoria').'"> <span class="opacitymedium">escala 0–20</span></td></tr>';
	print '<tr><td>Promedio ponderado mínimo</td><td><input name="promedio_minimo" type="number" step="0.01" min="0" max="20" class="width75" value="'.$v('promedio_minimo').'"> <span class="opacitymedium">para graduarse u obtener el diploma</span></td></tr>';
	print '<tr><td>Asistencia mínima (%)</td><td><input name="asistencia_minima" type="number" step="0.01" min="0" max="100" class="width75" value="'.$v('asistencia_minima').'"></td></tr>';
	print '<tr><td>Activo</td><td><input type="checkbox" name="active" value="1"'.((GETPOSTISSET('label') ? GETPOSTINT('active') : (int) $p->active) ? ' checked' : '').'></td></tr>';
	print '</table>';
	print dol_get_fiche_end();
	print $form->buttonsSaveCancel($programa ? 'Guardar' : 'Crear', 'Cancelar', array(), false, '', $_SERVER['PHP_SELF'].($programa ? '?id='.((int) $id) : ''));
	print '</form>';
} elseif ($programa) {
	// Ficha del programa
	$linkback = '<a href="'.$_SERVER['PHP_SELF'].'">Volver a la lista</a>';
	print load_fiche_titre(dol_escape_htmltag($programa->label), $linkback, 'fa-graduation-cap');
	print dol_get_fiche_head();
	print '<div class="fichecenter"><div class="fichehalfleft"><table class="border tableforfield centpercent">';
	print '<tr><td class="titlefield">Código</td><td>'.dol_escape_htmltag($programa->ref).'</td></tr>';
	print '<tr><td>Tipo</td><td>'.dol_escape_htmltag(isset($tipos[$programa->tipo]) ? $tipos[$programa->tipo] : $programa->tipo).'</td></tr>';
	print '<tr><td>Grado / diploma</td><td>'.dol_escape_htmltag($programa->grado).'</td></tr>';
	print '<tr><td>Duración</td><td>'.dol_escape_htmltag($programa->duracion).'</td></tr>';
	print '<tr><td>Modalidad</td><td>'.dol_escape_htmltag($programa->modalidad).'</td></tr>';
	print '</table></div><div class="fichehalfright"><table class="border tableforfield centpercent">';
	print '<tr><td class="titlefield">Créditos / horas</td><td>'.($programa->creditos ? ((int) $programa->creditos).' créditos' : '').($programa->horas ? ' '.((int) $programa->horas).' horas' : '').'</td></tr>';
	print '<tr><td>Nota aprobatoria</td><td>'.posgradofip_fmt_nota($programa->nota_aprobatoria).'</td></tr>';
	print '<tr><td>Promedio mínimo</td><td>'.posgradofip_fmt_nota($programa->promedio_minimo).'</td></tr>';
	print '<tr><td>Asistencia mínima</td><td>'.price2num($programa->asistencia_minima).' %</td></tr>';
	print '<tr><td>Clave en el CRM</td><td>'.dol_escape_htmltag($programa->clave_crm).'</td></tr>';
	print '<tr><td>Estado</td><td>'.($programa->active ? dolGetStatus('Activo', '', '', 'status4', 1) : dolGetStatus('Inactivo', '', '', 'status5', 1)).'</td></tr>';
	print '</table></div></div><div class="clearboth"></div>';
	print dol_get_fiche_end();
	if ($canedit) {
		print '<div class="tabsAction"><a class="butAction" href="'.$_SERVER['PHP_SELF'].'?id='.((int) $id).'&action=edit&token='.newToken().'">Modificar</a></div>';
	}

	// Plan de estudios
	print '<a id="cursos"></a>';
	print load_fiche_titre('Plan de estudios', '', '');
	if ($canedit) {
		print '<form method="POST" action="'.$_SERVER['PHP_SELF'].'?id='.((int) $id).'#cursos">';
		print '<input type="hidden" name="token" value="'.newToken().'">';
		print '<input type="hidden" name="action" value="'.($action == 'editcurso' ? 'updatecurso' : 'addcurso').'">';
		print '<input type="hidden" name="cursoid" value="'.((int) $cursoid).'">';
	}
	print '<div class="div-table-responsive"><table class="noborder centpercent">';
	print '<tr class="liste_titre"><th>'.($programa->tipo == 'diplomado' ? 'Módulo' : 'Ciclo').'</th><th>Código</th><th>Curso</th><th>Tipo</th><th class="right">Créditos</th><th class="right">Horas</th><th class="right">Orden</th><th class="center">Activo</th>'.($canedit ? '<th></th>' : '').'</tr>';

	$sql = "SELECT * FROM ".$db->prefix()."posgrado_curso WHERE fk_programa = ".((int) $id)." ORDER BY CASE WHEN ciclo = 0 THEN 1 ELSE 0 END, ciclo, position, label";
	$resql = $db->query($sql);
	$editrow = function ($c) use ($programa) {
		$val = function ($k, $default = '') use ($c) {
			return dol_escape_htmltag($c ? (string) $c->$k : $default);
		};
		$out = '<tr class="oddeven">';
		$out .= '<td><input name="cciclo" type="number" min="0" class="width50" value="'.$val('ciclo', '1').'" title="0 = electivo"></td>';
		$out .= '<td><input name="cref" class="width100" maxlength="32" value="'.$val('ref').'"></td>';
		$out .= '<td><input name="clabel" class="minwidth300 widthcentpercentminusx" value="'.$val('label').'"></td>';
		$out .= '<td><select name="ctipo" class="flat"><option value="obligatorio">Obligatorio</option><option value="electivo"'.($c && $c->tipo == 'electivo' ? ' selected' : '').'>Electivo</option></select></td>';
		$out .= '<td class="right"><input name="ccreditos" type="number" step="0.5" min="0" class="width50" value="'.$val('creditos').'"></td>';
		$out .= '<td class="right"><input name="choras" type="number" min="0" class="width50" value="'.$val('horas').'"></td>';
		$out .= '<td class="right"><input name="cposition" type="number" class="width50" value="'.$val('position', '0').'"></td>';
		$out .= '<td class="center"><input type="checkbox" name="cactive" value="1"'.(!$c || $c->active ? ' checked' : '').'></td>';
		$out .= '<td class="nowraponall"><input type="submit" class="button smallpaddingimp" value="'.($c ? 'Guardar' : 'Agregar').'">';
		if ($c) {
			$out .= ' <a class="button button-cancel smallpaddingimp" href="'.$_SERVER['PHP_SELF'].'?id='.((int) $programa->rowid).'#cursos">Cancelar</a>';
		}
		$out .= '</td></tr>';
		return $out;
	};
	$nb = 0;
	if ($resql) {
		while ($c = $db->fetch_object($resql)) {
			$nb++;
			if ($canedit && $action == 'editcurso' && $cursoid == $c->rowid) {
				print $editrow($c);
				continue;
			}
			print '<tr class="oddeven'.($c->active ? '' : ' opacitymedium').'">';
			print '<td class="nowraponall">'.dol_escape_htmltag(posgradofip_ciclo_label($programa->tipo, $c->ciclo)).'</td>';
			print '<td class="nowraponall">'.dol_escape_htmltag($c->ref).'</td>';
			print '<td>'.dol_escape_htmltag($c->label).'</td>';
			print '<td>'.($c->tipo == 'electivo' ? 'Electivo' : 'Obligatorio').'</td>';
			print '<td class="right">'.($c->creditos !== null ? price2num($c->creditos) : '').'</td>';
			print '<td class="right">'.($c->horas !== null ? (int) $c->horas : '').'</td>';
			print '<td class="right">'.((int) $c->position).'</td>';
			print '<td class="center">'.($c->active ? img_picto('', 'tick') : '').'</td>';
			if ($canedit) {
				print '<td class="nowraponall right">';
				print '<a class="editfielda paddingright" href="'.$_SERVER['PHP_SELF'].'?id='.((int) $id).'&action=editcurso&cursoid='.((int) $c->rowid).'&token='.newToken().'#cursos">'.img_edit().'</a>';
				print '<a class="paddingleft" href="'.$_SERVER['PHP_SELF'].'?id='.((int) $id).'&action=deletecurso&cursoid='.((int) $c->rowid).'&token='.newToken().'" onclick="return confirm(\'¿Eliminar el curso? Si tiene notas, solo se desactivará.\');">'.img_delete().'</a>';
				print '</td>';
			}
			print '</tr>';
		}
	}
	if (!$nb) {
		print '<tr><td colspan="9"><span class="opacitymedium">Sin cursos registrados.</span></td></tr>';
	}
	if ($canedit && $action != 'editcurso') {
		print '<tr class="liste_titre"><td colspan="9">Agregar curso</td></tr>';
		print $editrow(null);
	}
	print '</table></div>';
	if ($canedit) {
		print '</form>';
	}
	print '<p class="opacitymedium">El promedio ponderado usa los créditos de cada curso; si un curso no tiene créditos, usa las horas, y si tampoco tiene horas, pesa 1. Ciclo 0 = electivo sin ciclo fijo.</p>';
} else {
	// Lista
	$newbutton = $canedit ? dolGetButtonTitle('Nuevo programa', '', 'fa fa-plus-circle', $_SERVER['PHP_SELF'].'?action=create') : '';
	print load_fiche_titre('Programas de posgrado', $newbutton, 'fa-graduation-cap');
	$sql = "SELECT p.*, (SELECT COUNT(*) FROM ".$db->prefix()."posgrado_curso c WHERE c.fk_programa = p.rowid AND c.active = 1) as nbcursos,";
	$sql .= " (SELECT COUNT(*) FROM ".$db->prefix()."posgrado_matricula m WHERE m.fk_programa = p.rowid AND m.status = 1) as nbactivos";
	$sql .= " FROM ".$db->prefix()."posgrado_programa as p WHERE p.entity IN (".getEntity('posgradofip').")";
	$sql .= " ORDER BY p.active DESC, CASE p.tipo WHEN 'doctorado' THEN 1 WHEN 'maestria' THEN 2 ELSE 3 END, p.label";
	$resql = $db->query($sql);
	print '<div class="div-table-responsive"><table class="noborder centpercent">';
	print '<tr class="liste_titre"><th>Código</th><th>Programa</th><th>Tipo</th><th>Duración</th><th class="right">Cursos</th><th class="right">Alumnos activos</th><th class="center">Estado</th></tr>';
	if ($resql) {
		while ($p = $db->fetch_object($resql)) {
			print '<tr class="oddeven">';
			print '<td class="nowraponall"><a href="'.$_SERVER['PHP_SELF'].'?id='.((int) $p->rowid).'">'.img_picto('', 'fa-graduation-cap', 'class="pictofixedwidth"').dol_escape_htmltag($p->ref).'</a></td>';
			print '<td>'.dol_escape_htmltag($p->label).'</td>';
			print '<td>'.dol_escape_htmltag(isset($tipos[$p->tipo]) ? $tipos[$p->tipo] : $p->tipo).'</td>';
			print '<td>'.dol_escape_htmltag($p->duracion).'</td>';
			print '<td class="right">'.((int) $p->nbcursos).'</td>';
			print '<td class="right">'.((int) $p->nbactivos).'</td>';
			print '<td class="center">'.($p->active ? dolGetStatus('Activo', '', '', 'status4', 3) : dolGetStatus('Inactivo', '', '', 'status5', 3)).'</td>';
			print '</tr>';
		}
	}
	print '</table></div>';
}

llxFooter();
$db->close();
