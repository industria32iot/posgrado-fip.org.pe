<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/lib/posgradofip.lib.php
 * \ingroup posgradofip
 * \brief   Funciones comunes del módulo (back-office y Portal Web)
 */

/**
 * Tipos de programa
 *
 * @return array<string,string>
 */
function posgradofip_tipos()
{
	return array('doctorado' => 'Doctorado', 'maestria' => 'Maestría', 'diplomado' => 'Diplomado');
}

/**
 * Estados de matrícula
 *
 * @return array<int,string>
 */
function posgradofip_matricula_estados()
{
	return array(0 => 'Postulante', 1 => 'Activo', 2 => 'Egresado', 3 => 'Graduado / Diplomado', 9 => 'Retirado');
}

/**
 * Badge HTML para un estado de matrícula
 *
 * @param int $status Estado
 * @return string
 */
function posgradofip_matricula_badge($status)
{
	$estados = posgradofip_matricula_estados();
	$map = array(0 => 'status0', 1 => 'status4', 2 => 'status6', 3 => 'status6', 9 => 'status9');
	$label = isset($estados[(int) $status]) ? $estados[(int) $status] : '?';
	return dolGetStatus($label, $label, '', isset($map[(int) $status]) ? $map[(int) $status] : 'status0', 1);
}

/**
 * Etiqueta del ciclo según el tipo de programa
 *
 * @param string $tipo  Tipo de programa
 * @param int    $ciclo Número
 * @return string
 */
function posgradofip_ciclo_label($tipo, $ciclo)
{
	if ((int) $ciclo <= 0) {
		return 'Electivo';
	}
	$romanos = array(1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI', 7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X');
	$n = isset($romanos[(int) $ciclo]) ? $romanos[(int) $ciclo] : (string) $ciclo;
	if ($tipo == 'diplomado') {
		return 'Módulo '.((int) $ciclo);
	}
	if ($tipo == 'doctorado') {
		return 'Semestre '.$n;
	}
	return 'Ciclo '.$n;
}

/**
 * Formatea una nota (escala 0-20)
 *
 * @param float|null $nota Nota
 * @return string
 */
function posgradofip_fmt_nota($nota)
{
	if ($nota === null || $nota === '') {
		return '';
	}
	$f = (float) $nota;
	return (floor($f) == $f) ? sprintf('%02d', (int) $f) : number_format($f, 2, '.', '');
}

/**
 * Carga un programa
 *
 * @param DoliDB $db  Base de datos
 * @param int    $id  rowid
 * @return object|null
 */
function posgradofip_fetch_programa($db, $id)
{
	$sql = "SELECT * FROM ".$db->prefix()."posgrado_programa WHERE rowid = ".((int) $id)." AND entity IN (".getEntity('posgradofip').")";
	$resql = $db->query($sql);
	if ($resql && ($obj = $db->fetch_object($resql))) {
		return $obj;
	}
	return null;
}

/**
 * Lista de programas (rowid => etiqueta)
 *
 * @param DoliDB $db         Base de datos
 * @param bool   $onlyactive Solo activos
 * @return array<int,string>
 */
function posgradofip_programas_array($db, $onlyactive = true)
{
	$out = array();
	$sql = "SELECT rowid, ref, label FROM ".$db->prefix()."posgrado_programa WHERE entity IN (".getEntity('posgradofip').")";
	if ($onlyactive) {
		$sql .= " AND active = 1";
	}
	$sql .= " ORDER BY CASE tipo WHEN 'doctorado' THEN 1 WHEN 'maestria' THEN 2 ELSE 3 END, label";
	$resql = $db->query($sql);
	if ($resql) {
		while ($obj = $db->fetch_object($resql)) {
			$out[(int) $obj->rowid] = $obj->label;
		}
	}
	return $out;
}

/**
 * Lista de periodos (rowid => ref)
 *
 * @param DoliDB $db         Base de datos
 * @param bool   $onlyopen   Solo abiertos
 * @return array<int,string>
 */
function posgradofip_periodos_array($db, $onlyopen = false)
{
	$out = array();
	$sql = "SELECT rowid, ref, status FROM ".$db->prefix()."posgrado_periodo WHERE entity IN (".getEntity('posgradofip').")";
	if ($onlyopen) {
		$sql .= " AND status = 1";
	}
	$sql .= " ORDER BY ref DESC";
	$resql = $db->query($sql);
	if ($resql) {
		while ($obj = $db->fetch_object($resql)) {
			$out[(int) $obj->rowid] = $obj->ref.($obj->status ? '' : ' (cerrado)');
		}
	}
	return $out;
}

/**
 * Récord académico de una matrícula
 *
 * @param DoliDB $db            Base de datos
 * @param int    $matriculaid   rowid de la matrícula
 * @param bool   $onlypublished Solo notas publicadas (Portal Web)
 * @return array<int,object>
 */
function posgradofip_fetch_record($db, $matriculaid, $onlypublished = false)
{
	$rows = array();
	$sql = "SELECT n.rowid, n.nota, n.asistencia, n.observacion, n.status, n.date_publication,";
	$sql .= " c.rowid as curso_id, c.ref as curso_ref, c.label as curso_label, c.ciclo, c.tipo as curso_tipo, c.creditos, c.horas,";
	$sql .= " pe.rowid as periodo_id, pe.ref as periodo_ref";
	$sql .= " FROM ".$db->prefix()."posgrado_nota as n";
	$sql .= " INNER JOIN ".$db->prefix()."posgrado_curso as c ON c.rowid = n.fk_curso";
	$sql .= " INNER JOIN ".$db->prefix()."posgrado_periodo as pe ON pe.rowid = n.fk_periodo";
	$sql .= " WHERE n.fk_matricula = ".((int) $matriculaid);
	if ($onlypublished) {
		$sql .= " AND n.status = 1";
	}
	$sql .= " ORDER BY pe.ref ASC, CASE WHEN c.ciclo = 0 THEN 1 ELSE 0 END, c.ciclo ASC, c.position ASC, c.label ASC";
	$resql = $db->query($sql);
	if ($resql) {
		while ($obj = $db->fetch_object($resql)) {
			$rows[] = $obj;
		}
	}
	return $rows;
}

/**
 * Indica si una nota está aprobada según las reglas del programa
 *
 * @param object $row      Fila de nota
 * @param object $programa Programa
 * @return bool|null       null si aún no tiene nota
 */
function posgradofip_aprobado($row, $programa)
{
	if ($row->nota === null || $row->nota === '') {
		return null;
	}
	if ((float) $row->nota < (float) $programa->nota_aprobatoria) {
		return false;
	}
	if ($row->asistencia !== null && $row->asistencia !== '' && (float) $row->asistencia < (float) $programa->asistencia_minima) {
		return false;
	}
	return true;
}

/**
 * Resumen académico: promedio ponderado, créditos/horas, cursos aprobados.
 * Peso de cada curso = créditos; si no tiene créditos, horas; si tampoco, 1.
 *
 * @param array<int,object> $rows     Filas de posgradofip_fetch_record
 * @param object            $programa Programa
 * @return array<string,mixed>
 */
function posgradofip_resumen($rows, $programa)
{
	$sumw = 0.0;
	$sumnw = 0.0;
	$aprob = 0;
	$desaprob = 0;
	$pend = 0;
	$creditos = 0.0;
	$horas = 0;
	// Si un curso se llevó más de una vez, cuenta la última nota registrada
	$last = array();
	foreach ($rows as $r) {
		$last[(int) $r->curso_id] = $r;
	}
	foreach ($last as $r) {
		$ok = posgradofip_aprobado($r, $programa);
		if ($ok === null) {
			$pend++;
			continue;
		}
		$w = ((float) $r->creditos > 0) ? (float) $r->creditos : (((int) $r->horas > 0) ? (float) $r->horas : 1.0);
		$sumw += $w;
		$sumnw += $w * (float) $r->nota;
		if ($ok) {
			$aprob++;
			$creditos += (float) $r->creditos;
			$horas += (int) $r->horas;
		} else {
			$desaprob++;
		}
	}
	$promedio = $sumw > 0 ? round($sumnw / $sumw, 2) : null;
	return array(
		'promedio' => $promedio,
		'cumple_promedio' => ($promedio !== null && $promedio >= (float) $programa->promedio_minimo),
		'aprobados' => $aprob,
		'desaprobados' => $desaprob,
		'pendientes' => $pend,
		'creditos' => $creditos,
		'horas' => $horas,
	);
}

/**
 * Estado de cuenta del alumno a partir de sus facturas de cliente validadas
 *
 * @param DoliDB $db    Base de datos
 * @param int    $socid Tercero (alumno)
 * @return array{lines: array<int,object>, total: float, pagado: float, saldo: float}
 */
function posgradofip_estado_cuenta($db, $socid)
{
	$lines = array();
	$total = 0.0;
	$pagado = 0.0;
	$sql = "SELECT f.rowid, f.ref, f.datef, f.date_lim_reglement, f.total_ttc, f.paye, f.fk_statut, f.type,";
	$sql .= " (SELECT COALESCE(SUM(pf.amount), 0) FROM ".$db->prefix()."paiement_facture as pf WHERE pf.fk_facture = f.rowid) as pagado,";
	$sql .= " (SELECT COALESCE(SUM(rc.amount_ttc), 0) FROM ".$db->prefix()."societe_remise_except as rc WHERE rc.fk_facture = f.rowid) as creditos";
	$sql .= " FROM ".$db->prefix()."facture as f";
	$sql .= " WHERE f.fk_soc = ".((int) $socid);
	$sql .= " AND f.entity IN (".getEntity('invoice').")";
	$sql .= " AND f.fk_statut > 0";   // validadas, pagadas o abandonadas (no borradores)
	$sql .= " AND f.type = 0";  // facturas estándar (las notas de crédito aplicadas se descuentan vía societe_remise_except)
	$sql .= " ORDER BY f.datef ASC, f.rowid ASC";
	$resql = $db->query($sql);
	if ($resql) {
		while ($obj = $db->fetch_object($resql)) {
			$obj->pagado = (float) $obj->pagado + (float) $obj->creditos;
			if ((int) $obj->fk_statut == 3) {
				// Abandonada: no suma deuda
				$obj->saldo = 0.0;
			} elseif ((int) $obj->paye == 1) {
				$obj->saldo = 0.0;
			} else {
				$obj->saldo = (float) $obj->total_ttc - $obj->pagado;
			}
			if ((int) $obj->fk_statut != 3) {
				$total += (float) $obj->total_ttc;
				$pagado += (float) $obj->total_ttc - $obj->saldo;
			}
			$lines[] = $obj;
		}
	}
	return array('lines' => $lines, 'total' => $total, 'pagado' => $pagado, 'saldo' => $total - $pagado);
}

/**
 * Etiqueta de estado de factura
 *
 * @param object $f Línea de posgradofip_estado_cuenta
 * @return string
 */
function posgradofip_factura_estado($f)
{
	if ((int) $f->fk_statut == 3) {
		return 'Anulada';
	}
	if ((int) $f->paye == 1 || $f->saldo <= 0.001) {
		return 'Pagada';
	}
	if ($f->pagado > 0) {
		return 'Pago parcial';
	}
	if (!empty($f->date_lim_reglement) && strtotime($f->date_lim_reglement) < dol_now()) {
		return 'Vencida';
	}
	return 'Pendiente';
}

/**
 * ¿Puede el usuario registrar notas para el curso/periodo?
 *
 * @param DoliDB $db       Base de datos
 * @param User   $user     Usuario
 * @param int    $cursoid  Curso
 * @param int    $periodoid Periodo
 * @return bool
 */
function posgradofip_puede_calificar($db, $user, $cursoid, $periodoid)
{
	if ($user->hasRight('posgradofip', 'notasall')) {
		return true;
	}
	if (!$user->hasRight('posgradofip', 'notas')) {
		return false;
	}
	$sql = "SELECT rowid FROM ".$db->prefix()."posgrado_asignacion WHERE fk_curso = ".((int) $cursoid)." AND fk_periodo = ".((int) $periodoid)." AND fk_user = ".((int) $user->id);
	$resql = $db->query($sql);
	return ($resql && $db->num_rows($resql) > 0);
}

/**
 * Sincroniza el "perfil de estudiante de posgrado" del tercero (atributos complementarios
 * creados por scripts/configurar-dolibarr.sh): programa, estado_academico, cohorte, codigo_uni.
 * Solo escribe los atributos que existan en la instalación.
 *
 * @param DoliDB $db        Base de datos
 * @param User   $user      Usuario que hace el cambio
 * @param int    $socid     Tercero
 * @param object $programa  Programa
 * @param string $cohorte   Ref del periodo de ingreso
 * @param string $codigo    Código de alumno
 * @param int    $status    Estado de la matrícula
 * @return int              <0 error, 0 nada que hacer, >0 actualizado
 */
function posgradofip_sync_perfil($db, $user, $socid, $programa, $cohorte, $codigo, $status)
{
	require_once DOL_DOCUMENT_ROOT.'/societe/class/societe.class.php';
	require_once DOL_DOCUMENT_ROOT.'/core/class/extrafields.class.php';

	$extrafields = new ExtraFields($db);
	$extrafields->fetch_name_optionals_label('societe');
	$def = isset($extrafields->attributes['societe']['type']) ? $extrafields->attributes['societe']['type'] : array();
	if (empty($def)) {
		return 0;
	}

	$soc = new Societe($db);
	if ($soc->fetch((int) $socid) <= 0) {
		return -1;
	}
	$soc->fetch_optionals();

	$mapEstado = array(0 => 'postulante', 1 => 'matriculado', 2 => 'egresado', 3 => 'graduado', 9 => 'retirado');
	$changes = 0;
	$set = function ($key, $value) use (&$soc, $def, &$changes) {
		if (!isset($def[$key]) || $value === null || $value === '') {
			return;
		}
		if (!isset($soc->array_options['options_'.$key]) || (string) $soc->array_options['options_'.$key] !== (string) $value) {
			$soc->array_options['options_'.$key] = $value;
			$changes++;
		}
	};
	if (!empty($programa->clave_crm)) {
		$set('programa', $programa->clave_crm);
	}
	if (isset($mapEstado[(int) $status])) {
		$set('estado_academico', $mapEstado[(int) $status]);
	}
	$set('cohorte', (string) $cohorte);
	$set('codigo_uni', (string) $codigo);

	if (!$changes) {
		return 0;
	}
	$res = $soc->insertExtraFields('', $user);
	return $res < 0 ? -1 : 1;
}

/**
 * Encabezado de la página de configuración
 *
 * @return array<int,array<int,string>>
 */
function posgradofip_admin_prepare_head()
{
	$head = array();
	$head[0][0] = dol_buildpath('/posgradofip/admin/setup.php', 1);
	$head[0][1] = 'Configuración';
	$head[0][2] = 'settings';
	return $head;
}

/**
 * Cabecera común de las páginas de back-office: carga de librerías y control de módulo
 *
 * @return void
 */
function posgradofip_check_enabled()
{
	if (!isModEnabled('posgradofip')) {
		accessforbidden('Módulo Posgrado FIP no activado');
	}
}
