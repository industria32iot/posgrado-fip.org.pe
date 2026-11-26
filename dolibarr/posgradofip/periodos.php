<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/periodos.php
 * \ingroup posgradofip
 * \brief   Periodos académicos (2027-I, 2027-II...)
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
$rowid = GETPOSTINT('rowid');

if ($canedit && in_array($action, array('add', 'update'))) {
	$ref = trim(GETPOST('ref', 'alphanohtml'));
	if (!preg_match('/^[0-9A-Za-z\-_. ]{1,32}$/', $ref)) {
		setEventMessages('Código de periodo no válido (ej. 2027-I).', null, 'errors');
	} else {
		$ds = dol_mktime(0, 0, 0, GETPOSTINT('dsmonth'), GETPOSTINT('dsday'), GETPOSTINT('dsyear'));
		$de = dol_mktime(0, 0, 0, GETPOSTINT('demonth'), GETPOSTINT('deday'), GETPOSTINT('deyear'));
		$label = trim(GETPOST('label', 'alphanohtml'));
		$fields = array(
			'ref' => "'".$db->escape($ref)."'",
			'label' => $label === '' ? 'NULL' : "'".$db->escape($label)."'",
			'date_start' => $ds ? "'".$db->idate($ds)."'" : 'NULL',
			'date_end' => $de ? "'".$db->idate($de)."'" : 'NULL',
			'status' => GETPOSTINT('status') ? '1' : '0',
		);
		if ($action == 'add') {
			$sql = "INSERT INTO ".$db->prefix()."posgrado_periodo (entity, ".implode(', ', array_keys($fields)).") VALUES (".((int) $conf->entity).", ".implode(', ', $fields).")";
		} else {
			$set = array();
			foreach ($fields as $k => $v) {
				$set[] = $k.' = '.$v;
			}
			$sql = "UPDATE ".$db->prefix()."posgrado_periodo SET ".implode(', ', $set)." WHERE rowid = ".((int) $rowid)." AND entity IN (".getEntity('posgradofip').")";
		}
		if ($db->query($sql)) {
			setEventMessages('Periodo guardado.', null, 'mesgs');
			header('Location: '.$_SERVER['PHP_SELF']);
			exit;
		}
		setEventMessages($db->lasterror(), null, 'errors');
	}
	$action = ($action == 'update') ? 'edit' : '';
}

if ($canedit && $action == 'setstatus' && $rowid > 0 && GETPOST('token', 'alpha') == currentToken()) {
	$db->query("UPDATE ".$db->prefix()."posgrado_periodo SET status = 1 - status WHERE rowid = ".((int) $rowid)." AND entity IN (".getEntity('posgradofip').")");
	header('Location: '.$_SERVER['PHP_SELF']);
	exit;
}

$form = new Form($db);
llxHeader('', 'Periodos académicos', '', '', 0, 0, '', '', '', 'mod-posgradofip page-periodos');
print load_fiche_titre('Periodos académicos', '', 'calendar');

if ($canedit) {
	print '<form method="POST" action="'.$_SERVER['PHP_SELF'].'">';
	print '<input type="hidden" name="token" value="'.newToken().'">';
	print '<input type="hidden" name="action" value="'.($action == 'edit' ? 'update' : 'add').'">';
	print '<input type="hidden" name="rowid" value="'.((int) $rowid).'">';
}
print '<div class="div-table-responsive"><table class="noborder centpercent">';
print '<tr class="liste_titre"><th>Periodo</th><th>Descripción</th><th>Inicio</th><th>Fin</th><th class="center">Registro de notas</th>'.($canedit ? '<th></th>' : '').'</tr>';

$rowform = function ($o) use ($form) {
	$out = '<tr class="oddeven">';
	$out .= '<td><input name="ref" class="width100" maxlength="32" placeholder="2027-I" value="'.dol_escape_htmltag($o ? $o->ref : '').'"></td>';
	$out .= '<td><input name="label" class="minwidth200" value="'.dol_escape_htmltag($o ? $o->label : '').'"></td>';
	$out .= '<td>'.$form->selectDate($o && $o->date_start ? $o->date_start : -1, 'ds', 0, 0, 1, '', 1, 0).'</td>';
	$out .= '<td>'.$form->selectDate($o && $o->date_end ? $o->date_end : -1, 'de', 0, 0, 1, '', 1, 0).'</td>';
	$out .= '<td class="center"><select name="status" class="flat"><option value="1">Abierto</option><option value="0"'.($o && !$o->status ? ' selected' : '').'>Cerrado</option></select></td>';
	$out .= '<td class="nowraponall"><input type="submit" class="button smallpaddingimp" value="'.($o ? 'Guardar' : 'Agregar').'">';
	if ($o) {
		$out .= ' <a class="button button-cancel smallpaddingimp" href="'.$_SERVER['PHP_SELF'].'">Cancelar</a>';
	}
	$out .= '</td></tr>';
	return $out;
};

$resql = $db->query("SELECT * FROM ".$db->prefix()."posgrado_periodo WHERE entity IN (".getEntity('posgradofip').") ORDER BY ref DESC");
if ($resql) {
	while ($o = $db->fetch_object($resql)) {
		$o->date_start = $db->jdate($o->date_start);
		$o->date_end = $db->jdate($o->date_end);
		if ($canedit && $action == 'edit' && $rowid == $o->rowid) {
			print $rowform($o);
			continue;
		}
		print '<tr class="oddeven">';
		print '<td class="nowraponall"><b>'.dol_escape_htmltag($o->ref).'</b></td>';
		print '<td>'.dol_escape_htmltag($o->label).'</td>';
		print '<td>'.dol_print_date($o->date_start, 'day').'</td>';
		print '<td>'.dol_print_date($o->date_end, 'day').'</td>';
		print '<td class="center">';
		$badge = $o->status ? dolGetStatus('Abierto', '', '', 'status4', 1) : dolGetStatus('Cerrado', '', '', 'status6', 1);
		print $canedit ? '<a href="'.$_SERVER['PHP_SELF'].'?action=setstatus&rowid='.((int) $o->rowid).'&token='.newToken().'" title="Abrir / cerrar">'.$badge.'</a>' : $badge;
		print '</td>';
		if ($canedit) {
			print '<td class="right"><a class="editfielda" href="'.$_SERVER['PHP_SELF'].'?action=edit&rowid='.((int) $o->rowid).'&token='.newToken().'">'.img_edit().'</a></td>';
		}
		print '</tr>';
	}
}
if ($canedit && $action != 'edit') {
	print '<tr class="liste_titre"><td colspan="6">Agregar periodo</td></tr>';
	print $rowform(null);
}
print '</table></div>';
if ($canedit) {
	print '</form>';
}
print '<p class="opacitymedium">En un periodo cerrado los docentes ya no pueden modificar notas; la coordinación (permiso "todos los cursos") sí.</p>';

llxFooter();
$db->close();
