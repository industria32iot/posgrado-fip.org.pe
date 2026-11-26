<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/matricula.php
 * \ingroup posgradofip
 * \brief   Ficha de matrícula: datos, récord académico y estado de cuenta
 */

require __DIR__.'/lib/loadmain.inc.php';
dol_include_once('/posgradofip/lib/posgradofip.lib.php');
require_once DOL_DOCUMENT_ROOT.'/societe/class/societe.class.php';

/** @var DoliDB $db */
/** @var User $user */
/** @var Conf $conf */

posgradofip_check_enabled();
if (!$user->hasRight('posgradofip', 'read')) {
	accessforbidden();
}
$canedit = $user->hasRight('posgradofip', 'matricula');

$id = GETPOSTINT('id');
$action = GETPOST('action', 'aZ09');
$estados = posgradofip_matricula_estados();

/**
 * Carga una matrícula
 *
 * @param DoliDB $db Base de datos
 * @param int    $id rowid
 * @return object|null
 */
function pf_fetch_matricula($db, $id)
{
	$sql = "SELECT m.*, pe.ref as periodo_ref FROM ".$db->prefix()."posgrado_matricula as m";
	$sql .= " LEFT JOIN ".$db->prefix()."posgrado_periodo as pe ON pe.rowid = m.fk_periodo";
	$sql .= " WHERE m.rowid = ".((int) $id)." AND m.entity IN (".getEntity('posgradofip').")";
	$resql = $db->query($sql);
	return ($resql && ($o = $db->fetch_object($resql))) ? $o : null;
}

$mat = $id > 0 ? pf_fetch_matricula($db, $id) : null;
if ($id > 0 && !$mat) {
	accessforbidden('Matrícula no encontrada');
}

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
if ($canedit && in_array($action, array('add', 'update'))) {
	$socid = ($action == 'add') ? GETPOSTINT('socid') : (int) $mat->fk_soc;
	$fk_programa = ($action == 'add') ? GETPOSTINT('fk_programa') : (int) $mat->fk_programa;
	$fk_periodo = GETPOSTINT('fk_periodo');
	$codigo = trim(GETPOST('codigo', 'alphanohtml'));
	$status = GETPOSTINT('status');
	$note = GETPOST('note_private', 'restricthtml');
	$error = 0;
	if ($socid <= 0 || $fk_programa <= 0) {
		setEventMessages('Elige el alumno (tercero) y el programa.', null, 'errors');
		$error++;
	}
	if (!isset($estados[$status])) {
		$status = 1;
	}
	if (!$error) {
		if ($action == 'add') {
			$sql = "INSERT INTO ".$db->prefix()."posgrado_matricula (entity, fk_soc, fk_programa, fk_periodo, codigo, status, note_private, date_creation, fk_user_creat) VALUES (";
			$sql .= ((int) $conf->entity).", ".((int) $socid).", ".((int) $fk_programa).", ".($fk_periodo > 0 ? (int) $fk_periodo : 'NULL').", ";
			$sql .= ($codigo !== '' ? "'".$db->escape(dol_trunc($codigo, 32, 'right', 'UTF-8', 1))."'" : 'NULL').", ".((int) $status).", ";
			$sql .= ($note !== '' ? "'".$db->escape($note)."'" : 'NULL').", '".$db->idate(dol_now())."', ".((int) $user->id).")";
		} else {
			$sql = "UPDATE ".$db->prefix()."posgrado_matricula SET";
			$sql .= " fk_periodo = ".($fk_periodo > 0 ? (int) $fk_periodo : 'NULL');
			$sql .= ", codigo = ".($codigo !== '' ? "'".$db->escape(dol_trunc($codigo, 32, 'right', 'UTF-8', 1))."'" : 'NULL');
			$sql .= ", status = ".((int) $status);
			$sql .= ", note_private = ".($note !== '' ? "'".$db->escape($note)."'" : 'NULL');
			$sql .= " WHERE rowid = ".((int) $id);
		}
		if ($db->query($sql)) {
			if ($action == 'add') {
				$id = $db->last_insert_id($db->prefix()."posgrado_matricula");
			}
			// Mantiene al día el perfil de estudiante del tercero (CRM)
			$programa = posgradofip_fetch_programa($db, $fk_programa);
			$periodos = posgradofip_periodos_array($db);
			$cohorte = ($fk_periodo > 0 && isset($periodos[$fk_periodo])) ? preg_replace('/ \(cerrado\)$/', '', $periodos[$fk_periodo]) : '';
			if ($programa && posgradofip_sync_perfil($db, $user, $socid, $programa, $cohorte, $codigo, $status) < 0) {
				setEventMessages('La matrícula se guardó, pero no se pudo actualizar el perfil del alumno.', null, 'warnings');
			}
			setEventMessages('Matrícula guardada.', null, 'mesgs');
			header('Location: '.$_SERVER['PHP_SELF'].'?id='.((int) $id));
			exit;
		}
		if ($db->lasterrno() == 'DB_ERROR_RECORD_ALREADY_EXISTS') {
			setEventMessages('Este alumno ya está matriculado en ese programa.', null, 'errors');
		} else {
			setEventMessages($db->lasterror(), null, 'errors');
		}
	}
	$action = ($action == 'add') ? 'create' : 'edit';
}

if ($canedit && $action == 'confirm_delete' && GETPOST('confirm', 'alpha') == 'yes' && $mat) {
	$resql = $db->query("SELECT COUNT(*) as nb FROM ".$db->prefix()."posgrado_nota WHERE fk_matricula = ".((int) $id));
	$o = $resql ? $db->fetch_object($resql) : null;
	if ($o && (int) $o->nb > 0) {
		setEventMessages('La matrícula tiene notas registradas: cámbiala a "Retirado" en lugar de eliminarla.', null, 'errors');
	} else {
		$db->query("DELETE FROM ".$db->prefix()."posgrado_matricula WHERE rowid = ".((int) $id));
		setEventMessages('Matrícula eliminada.', null, 'mesgs');
		header('Location: '.dol_buildpath('/posgradofip/matriculas.php', 1));
		exit;
	}
	$action = '';
}

/*
 * Vista
 */
$form = new Form($db);
llxHeader('', 'Matrícula', '', '', 0, 0, '', '', '', 'mod-posgradofip page-matricula');

if ($action == 'create') {
	if (!$canedit) {
		accessforbidden();
	}
	print load_fiche_titre('Nueva matrícula', '', 'user');
	print '<form method="POST" action="'.$_SERVER['PHP_SELF'].'">';
	print '<input type="hidden" name="token" value="'.newToken().'">';
	print '<input type="hidden" name="action" value="add">';
	print dol_get_fiche_head();
	print '<table class="border centpercent tableforfieldcreate">';
	print '<tr><td class="titlefieldcreate fieldrequired">Alumno (tercero)</td><td>'.$form->select_company(GETPOSTINT('socid'), 'socid', '', 1, 0, 0, array(), 0, 'minwidth300');
	print ' <a href="'.DOL_URL_ROOT.'/societe/card.php?action=create&client=1&backtopage='.urlencode($_SERVER['PHP_SELF'].'?action=create').'">'.img_picto('', 'add', 'class="paddingleft"').' Nuevo tercero</a>';
	print '<br><span class="opacitymedium small">Los interesados que llegan por el formulario web ya están como terceros.</span></td></tr>';
	print '<tr><td class="fieldrequired">Programa</td><td>'.$form->selectarray('fk_programa', posgradofip_programas_array($db), GETPOSTINT('fk_programa'), 1, 0, 0, '', 0, 0, 0, '', 'minwidth400').'</td></tr>';
	print '<tr><td>Periodo de ingreso</td><td>'.$form->selectarray('fk_periodo', posgradofip_periodos_array($db), GETPOSTINT('fk_periodo'), 1).'</td></tr>';
	print '<tr><td>Código de alumno</td><td><input name="codigo" class="maxwidth150" maxlength="32" value="'.dol_escape_htmltag(GETPOST('codigo', 'alphanohtml')).'"></td></tr>';
	print '<tr><td>Estado</td><td>'.$form->selectarray('status', $estados, GETPOSTISSET('status') ? GETPOSTINT('status') : 1).'</td></tr>';
	print '<tr><td class="tdtop">Nota interna</td><td><textarea name="note_private" class="quatrevingtpercent" rows="3">'.dol_escape_htmltag(GETPOST('note_private', 'restricthtml')).'</textarea></td></tr>';
	print '</table>';
	print dol_get_fiche_end();
	print $form->buttonsSaveCancel('Crear', 'Cancelar', array(), false, '', dol_buildpath('/posgradofip/matriculas.php', 1));
	print '</form>';
	llxFooter();
	exit;
}

if (!$mat) {
	header('Location: '.dol_buildpath('/posgradofip/matriculas.php', 1));
	exit;
}

$soc = new Societe($db);
$soc->fetch((int) $mat->fk_soc);
$programa = posgradofip_fetch_programa($db, (int) $mat->fk_programa);
$tipos = posgradofip_tipos();

if ($action == 'delete') {
	print $form->formconfirm($_SERVER['PHP_SELF'].'?id='.((int) $id), 'Eliminar matrícula', '¿Eliminar esta matrícula? Solo es posible si no tiene notas.', 'confirm_delete', '', 0, 1);
}

$linkback = '<a href="'.dol_buildpath('/posgradofip/matriculas.php', 1).'">Volver a la lista</a>';
print load_fiche_titre($soc->getNomUrl(1).' · '.dol_escape_htmltag($programa ? $programa->label : ''), $linkback, 'user');

if ($action == 'edit' && $canedit) {
	print '<form method="POST" action="'.$_SERVER['PHP_SELF'].'?id='.((int) $id).'">';
	print '<input type="hidden" name="token" value="'.newToken().'">';
	print '<input type="hidden" name="action" value="update">';
}
print dol_get_fiche_head();
print '<div class="fichecenter"><div class="fichehalfleft"><table class="border tableforfield centpercent">';
print '<tr><td class="titlefield">Alumno</td><td>'.$soc->getNomUrl(1).'</td></tr>';
print '<tr><td>Correo / celular</td><td>'.dol_print_email($soc->email, 0, $soc->id, 1).($soc->phone_mobile ? ' · '.dol_print_phone($soc->phone_mobile) : ($soc->phone ? ' · '.dol_print_phone($soc->phone) : '')).'</td></tr>';
print '<tr><td>Programa</td><td><a href="'.dol_buildpath('/posgradofip/programas.php', 1).'?id='.((int) $mat->fk_programa).'">'.dol_escape_htmltag($programa ? $programa->label : '').'</a></td></tr>';
if ($action == 'edit' && $canedit) {
	print '<tr><td>Periodo de ingreso</td><td>'.$form->selectarray('fk_periodo', posgradofip_periodos_array($db), (int) $mat->fk_periodo, 1).'</td></tr>';
	print '<tr><td>Código de alumno</td><td><input name="codigo" class="maxwidth150" maxlength="32" value="'.dol_escape_htmltag($mat->codigo).'"></td></tr>';
	print '<tr><td>Estado</td><td>'.$form->selectarray('status', $estados, (int) $mat->status).'</td></tr>';
	print '<tr><td class="tdtop">Nota interna</td><td><textarea name="note_private" class="quatrevingtpercent" rows="3">'.dol_escape_htmltag($mat->note_private).'</textarea></td></tr>';
} else {
	print '<tr><td>Periodo de ingreso</td><td>'.dol_escape_htmltag($mat->periodo_ref).'</td></tr>';
	print '<tr><td>Código de alumno</td><td>'.dol_escape_htmltag($mat->codigo).'</td></tr>';
	print '<tr><td>Estado</td><td>'.posgradofip_matricula_badge($mat->status).'</td></tr>';
	if ($mat->note_private) {
		print '<tr><td class="tdtop">Nota interna</td><td>'.dol_nl2br(dol_escape_htmltag($mat->note_private)).'</td></tr>';
	}
}
print '</table></div><div class="fichehalfright">';

// Resumen académico
$rows = posgradofip_fetch_record($db, (int) $id, false);
$res = $programa ? posgradofip_resumen($rows, $programa) : null;
// Acceso al portal
$portal = 0;
$resql = $db->query("SELECT COUNT(*) as nb FROM ".$db->prefix()."societe_account WHERE fk_soc = ".((int) $soc->id)." AND site = 'dolibarr_portal' AND status = 1");
if ($resql && ($o = $db->fetch_object($resql))) {
	$portal = (int) $o->nb;
}
print '<table class="border tableforfield centpercent">';
if ($res) {
	print '<tr><td class="titlefield">Promedio ponderado</td><td><b>'.($res['promedio'] === null ? '—' : number_format($res['promedio'], 2)).'</b>';
	if ($res['promedio'] !== null) {
		print ' '.($res['cumple_promedio'] ? '<span class="badge badge-status4">cumple mínimo '.posgradofip_fmt_nota($programa->promedio_minimo).'</span>' : '<span class="badge badge-status8">bajo el mínimo '.posgradofip_fmt_nota($programa->promedio_minimo).'</span>');
	}
	print '</td></tr>';
	print '<tr><td>Cursos aprobados / desaprobados</td><td>'.$res['aprobados'].' / '.$res['desaprobados'].($res['pendientes'] ? ' · '.$res['pendientes'].' en curso' : '').'</td></tr>';
	if ((int) $programa->creditos > 0) {
		print '<tr><td>Créditos aprobados</td><td>'.price2num($res['creditos']).' de '.((int) $programa->creditos).'</td></tr>';
	}
}
print '<tr><td>Acceso al Portal Web</td><td>';
if ($portal) {
	print dolGetStatus('Activo', '', '', 'status4', 1);
} else {
	print dolGetStatus('Sin cuenta', '', '', 'status0', 1);
}
if ($user->hasRight('societe', 'creer')) {
	print ' <a class="paddingleft" href="'.DOL_URL_ROOT.'/societe/website.php?id='.((int) $soc->id).'">'.($portal ? 'Gestionar' : 'Crear cuenta (tipo "Portal Dolibarr")').'</a>';
}
if (!isModEnabled('webportal')) {
	print '<br><span class="warning small">El módulo Portal Web no está activado.</span>';
}
print '</td></tr>';
print '</table>';
print '</div></div><div class="clearboth"></div>';
print dol_get_fiche_end();

if ($action == 'edit' && $canedit) {
	print $form->buttonsSaveCancel('Guardar', 'Cancelar', array(), false, '', $_SERVER['PHP_SELF'].'?id='.((int) $id));
	print '</form>';
} else {
	print '<div class="tabsAction">';
	if ($canedit) {
		print '<a class="butAction" href="'.$_SERVER['PHP_SELF'].'?id='.((int) $id).'&action=edit&token='.newToken().'">Modificar</a>';
	}
	if ($user->hasRight('facture', 'creer')) {
		print '<a class="butAction" href="'.DOL_URL_ROOT.'/compta/facture/card.php?action=create&socid='.((int) $soc->id).'&backtopage='.urlencode($_SERVER['PHP_SELF'].'?id='.((int) $id)).'">Nueva factura / cuota</a>';
	}
	if ($canedit) {
		print '<a class="butActionDelete" href="'.$_SERVER['PHP_SELF'].'?id='.((int) $id).'&action=delete&token='.newToken().'">Eliminar</a>';
	}
	print '</div>';
}

// Récord académico
print load_fiche_titre('Récord académico', '', '');
print '<div class="div-table-responsive"><table class="noborder centpercent">';
print '<tr class="liste_titre"><th>Periodo</th><th>Ciclo</th><th>Curso</th><th class="right">Créditos</th><th class="right">Asistencia</th><th class="right">Nota</th><th>Resultado</th><th class="center">Publicada</th></tr>';
foreach ($rows as $r) {
	$ok = posgradofip_aprobado($r, $programa);
	print '<tr class="oddeven">';
	print '<td class="nowraponall">'.dol_escape_htmltag($r->periodo_ref).'</td>';
	print '<td class="nowraponall">'.dol_escape_htmltag(posgradofip_ciclo_label($programa->tipo, $r->ciclo)).'</td>';
	print '<td>';
	if (posgradofip_puede_calificar($db, $user, (int) $r->curso_id, (int) $r->periodo_id)) {
		print '<a href="'.dol_buildpath('/posgradofip/notas.php', 1).'?periodo='.((int) $r->periodo_id).'&curso='.((int) $r->curso_id).'">'.dol_escape_htmltag($r->curso_label).'</a>';
	} else {
		print dol_escape_htmltag($r->curso_label);
	}
	if ($r->observacion) {
		print '<br><span class="opacitymedium small">'.dol_escape_htmltag($r->observacion).'</span>';
	}
	print '</td>';
	print '<td class="right">'.($r->creditos !== null ? price2num($r->creditos) : '').'</td>';
	print '<td class="right">'.($r->asistencia !== null ? price2num($r->asistencia).' %' : '').'</td>';
	print '<td class="right"><b>'.posgradofip_fmt_nota($r->nota).'</b></td>';
	print '<td>'.($ok === null ? '<span class="opacitymedium">En curso</span>' : ($ok ? '<span class="badge badge-status4">Aprobado</span>' : '<span class="badge badge-status8">Desaprobado</span>')).'</td>';
	print '<td class="center">'.($r->status ? img_picto('Visible para el alumno', 'tick') : '<span class="opacitymedium small">Borrador</span>').'</td>';
	print '</tr>';
}
if (empty($rows)) {
	print '<tr><td colspan="8"><span class="opacitymedium">Aún no hay notas. Se registran desde "Registro de notas".</span></td></tr>';
}
print '</table></div>';

// Estado de cuenta
$cuenta = posgradofip_estado_cuenta($db, (int) $soc->id);
print load_fiche_titre('Estado de cuenta', '', '');
print '<div class="div-table-responsive"><table class="noborder centpercent">';
print '<tr class="liste_titre"><th>Factura</th><th>Emisión</th><th>Vence</th><th class="right">Importe</th><th class="right">Pagado</th><th class="right">Saldo</th><th>Estado</th></tr>';
require_once DOL_DOCUMENT_ROOT.'/compta/facture/class/facture.class.php';
$fstatic = new Facture($db);
foreach ($cuenta['lines'] as $f) {
	$fstatic->id = $f->rowid;
	$fstatic->ref = $f->ref;
	$fstatic->statut = $fstatic->status = $f->fk_statut;
	$fstatic->type = $f->type;
	print '<tr class="oddeven">';
	print '<td class="nowraponall">'.$fstatic->getNomUrl(1).'</td>';
	print '<td>'.dol_print_date($db->jdate($f->datef), 'day').'</td>';
	print '<td>'.dol_print_date($db->jdate($f->date_lim_reglement), 'day').'</td>';
	print '<td class="right">'.price($f->total_ttc, 0, '', 1, -1, -1, $conf->currency).'</td>';
	print '<td class="right">'.price($f->total_ttc - $f->saldo, 0, '', 1, -1, -1, $conf->currency).'</td>';
	print '<td class="right">'.price($f->saldo, 0, '', 1, -1, -1, $conf->currency).'</td>';
	print '<td>'.dol_escape_htmltag(posgradofip_factura_estado($f)).'</td>';
	print '</tr>';
}
if (empty($cuenta['lines'])) {
	print '<tr><td colspan="7"><span class="opacitymedium">Sin facturas validadas.</span></td></tr>';
} else {
	print '<tr class="liste_total"><td colspan="3">Total</td><td class="right">'.price($cuenta['total'], 0, '', 1, -1, -1, $conf->currency).'</td><td class="right">'.price($cuenta['pagado'], 0, '', 1, -1, -1, $conf->currency).'</td><td class="right">'.price($cuenta['saldo'], 0, '', 1, -1, -1, $conf->currency).'</td><td></td></tr>';
}
print '</table></div>';
print '<p class="opacitymedium">El estado de cuenta considera las facturas validadas del alumno en todos sus programas. El alumno ve lo mismo en el Portal Web.</p>';

llxFooter();
$db->close();
