<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/webportal/controllers/misnotas.controller.class.php
 * \ingroup posgradofip
 * \brief   Portal Web: récord académico (notas publicadas) y estado de cuenta del alumno conectado
 */

require_once DOL_DOCUMENT_ROOT.'/webportal/class/controller.class.php';
dol_include_once('/posgradofip/lib/posgradofip.lib.php');

/**
 * Class MisNotasController
 */
class MisNotasController extends Controller
{
	/** @var array<int,array<string,mixed>> Matrículas del alumno con su récord */
	public $matriculas = array();

	/** @var array<string,mixed> Estado de cuenta */
	public $cuenta = array();

	/**
	 * Solo para alumnos conectados con cuenta de tercero
	 *
	 * @return bool
	 */
	public function checkAccess()
	{
		$context = Context::getInstance();
		$this->accessRight = isModEnabled('posgradofip') && !empty($context->logged_thirdparty) && $context->logged_thirdparty->id > 0;
		return parent::checkAccess();
	}

	/**
	 * Carga de datos
	 *
	 * @return int
	 */
	public function action()
	{
		$context = Context::getInstance();
		if (!$context->controllerInstance->checkAccess()) {
			return -1;
		}

		$hookRes = $this->hookDoAction();
		if (empty($hookRes)) {
			$context->title = 'Mis notas y pagos';
			$context->desc = 'Récord académico y estado de cuenta de tus programas de posgrado.';

			// La identidad sale SIEMPRE de la sesión del portal, nunca de parámetros de la URL
			$socid = (int) $context->logged_thirdparty->id;

			$sql = "SELECT m.rowid, m.codigo, m.status, m.fk_programa, pe.ref as periodo_ingreso";
			$sql .= " FROM ".$this->db->prefix()."posgrado_matricula as m";
			$sql .= " LEFT JOIN ".$this->db->prefix()."posgrado_periodo as pe ON pe.rowid = m.fk_periodo";
			$sql .= " WHERE m.fk_soc = ".$socid." AND m.status <> 9";
			$sql .= " AND m.entity IN (".getEntity('posgradofip').")";
			$sql .= " ORDER BY m.rowid";
			$resql = $this->db->query($sql);
			if ($resql) {
				while ($obj = $this->db->fetch_object($resql)) {
					$programa = posgradofip_fetch_programa($this->db, (int) $obj->fk_programa);
					if (!$programa) {
						continue;
					}
					$rows = posgradofip_fetch_record($this->db, (int) $obj->rowid, true);
					$this->matriculas[] = array(
						'matricula' => $obj,
						'programa' => $programa,
						'rows' => $rows,
						'resumen' => posgradofip_resumen($rows, $programa),
					);
				}
			}

			$this->cuenta = posgradofip_estado_cuenta($this->db, $socid);
		}

		return 1;
	}

	/**
	 * Vista
	 *
	 * @return void
	 */
	public function display()
	{
		$context = Context::getInstance();
		if (!$context->controllerInstance->checkAccess()) {
			$this->display404();
			return;
		}

		$this->loadTemplate('header');
		$this->loadTemplate('menu');
		$this->loadTemplate('hero-header-banner');

		$hookRes = $this->hookPrintPageView();
		if (empty($hookRes)) {
			$this->tplPath = dol_buildpath('/posgradofip/webportal/tpl', 0);
			$this->loadTemplate('misnotas');
			$this->tplPath = '';
		}

		$this->loadTemplate('footer');
	}
}
