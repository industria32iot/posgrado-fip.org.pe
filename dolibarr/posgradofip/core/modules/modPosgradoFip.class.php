<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/core/modules/modPosgradoFip.class.php
 * \ingroup posgradofip
 * \brief   Descriptor of module PosgradoFip (gestión académica: programas, cursos, matrículas y notas)
 */

include_once DOL_DOCUMENT_ROOT.'/core/modules/DolibarrModules.class.php';

/**
 * Descriptor class of module PosgradoFip
 */
class modPosgradoFip extends DolibarrModules
{
	/**
	 * Constructor
	 *
	 * @param DoliDB $db Database handler
	 */
	public function __construct($db)
	{
		$this->db = $db;

		$this->numero = 515150;
		$this->rights_class = 'posgradofip';
		$this->family = "hr";
		$this->module_position = '90';
		$this->name = preg_replace('/^mod/i', '', get_class($this));
		$this->description = "Gestión académica de posgrado: programas, cursos, matrículas, notas y estado de cuenta en el Portal Web";
		$this->descriptionlong = $this->description;
		$this->editor_name = 'Unidad de Posgrado FIP-UNI';
		$this->editor_url = 'https://posgrado-fip.org.pe';
		$this->version = '1.0.2';
		$this->const_name = 'MAIN_MODULE_'.strtoupper($this->name);
		$this->picto = 'fa-graduation-cap';

		$this->module_parts = array(
			'triggers' => 0,
			'login' => 0,
			'substitutions' => 0,
			'menus' => 0,
			'tpl' => 0,
			'barcode' => 0,
			'models' => 0,
			'theme' => 0,
			'css' => array('/posgradofip/css/posgradofip.css'),
			'js' => array(),
			// webportal: menú y cabecera del portal; webportaldao: controlador "misnotas"; webPortalCustomCss: estilo FIP
			'hooks' => array('data' => array('webportal', 'webportaldao', 'webPortalCustomCss'), 'entity' => '0'),
			'moduleforexternal' => 0,
		);

		$this->dirs = array("/posgradofip/temp");
		$this->config_page_url = array("setup.php@posgradofip");
		// Se activan automáticamente al activar este módulo
		$this->depends = array('modSociete', 'modFacture', 'modWebPortal');
		$this->requiredby = array();
		$this->conflictwith = array();
		$this->langfiles = array("posgradofip@posgradofip");
		$this->phpmin = array(7, 4);
		$this->need_dolibarr_version = array(20, 0);
		$this->warnings_activation = array();
		$this->warnings_activation_ext = array();

		$this->const = array();

		$this->tabs = array(
			// Pestaña "Posgrado" en la ficha del tercero (alumno)
			array('data' => 'thirdparty:+posgradofip:Posgrado:posgradofip@posgradofip:$user->hasRight("posgradofip","read"):/posgradofip/tercero.php?socid=__ID__'),
		);

		$this->dictionaries = array();
		$this->boxes = array();
		$this->cronjobs = array();

		// Permisos
		$this->rights = array();
		$r = 0;
		$this->rights[$r][0] = $this->numero.'01';
		$this->rights[$r][1] = 'Ver programas, matrículas y récord académico';
		$this->rights[$r][4] = 'read';
		$r++;
		$this->rights[$r][0] = $this->numero.'02';
		$this->rights[$r][1] = 'Configurar programas, cursos, periodos y docentes';
		$this->rights[$r][4] = 'config';
		$r++;
		$this->rights[$r][0] = $this->numero.'03';
		$this->rights[$r][1] = 'Crear y modificar matrículas';
		$this->rights[$r][4] = 'matricula';
		$r++;
		$this->rights[$r][0] = $this->numero.'04';
		$this->rights[$r][1] = 'Registrar notas en los cursos asignados (docente)';
		$this->rights[$r][4] = 'notas';
		$r++;
		$this->rights[$r][0] = $this->numero.'05';
		$this->rights[$r][1] = 'Registrar notas en todos los cursos y publicarlas (coordinación)';
		$this->rights[$r][4] = 'notasall';
		$r++;

		// Menús
		$this->menu = array();
		$r = 0;
		$this->menu[$r++] = array(
			'fk_menu' => '',
			'type' => 'top',
			'titre' => 'Posgrado',
			'prefix' => img_picto('', $this->picto, 'class="pictofixedwidth valignmiddle"'),
			'mainmenu' => 'posgradofip',
			'leftmenu' => '',
			'url' => '/posgradofip/index.php',
			'langs' => 'posgradofip@posgradofip',
			'position' => 1000 + $r,
			'enabled' => 'isModEnabled("posgradofip")',
			'perms' => '$user->hasRight("posgradofip","read") || $user->hasRight("posgradofip","notas")',
			'target' => '',
			'user' => 0,
		);
		$left = array(
			array('pf_matriculas', 'Matrículas', '/posgradofip/matriculas.php', '$user->hasRight("posgradofip","read")', 'fk_mainmenu=posgradofip', 'user'),
			array('pf_matricula_new', 'Nueva matrícula', '/posgradofip/matricula.php?action=create', '$user->hasRight("posgradofip","matricula")', 'fk_mainmenu=posgradofip,fk_leftmenu=pf_matriculas', ''),
			array('pf_notas', 'Registro de notas', '/posgradofip/notas.php', '$user->hasRight("posgradofip","notas") || $user->hasRight("posgradofip","notasall")', 'fk_mainmenu=posgradofip', 'edit'),
			array('pf_programas', 'Programas y cursos', '/posgradofip/programas.php', '$user->hasRight("posgradofip","read")', 'fk_mainmenu=posgradofip', 'fa-graduation-cap'),
			array('pf_periodos', 'Periodos académicos', '/posgradofip/periodos.php', '$user->hasRight("posgradofip","read")', 'fk_mainmenu=posgradofip', 'calendar'),
			array('pf_asignaciones', 'Asignación docente', '/posgradofip/asignaciones.php', '$user->hasRight("posgradofip","read")', 'fk_mainmenu=posgradofip', 'hrm'),
		);
		foreach ($left as $l) {
			$this->menu[$r++] = array(
				'fk_menu' => $l[4],
				'type' => 'left',
				'titre' => $l[1],
				'prefix' => $l[5] ? img_picto('', $l[5], 'class="pictofixedwidth valignmiddle paddingright"') : '',
				'mainmenu' => 'posgradofip',
				'leftmenu' => $l[0],
				'url' => $l[2],
				'langs' => 'posgradofip@posgradofip',
				'position' => 1000 + $r,
				'enabled' => 'isModEnabled("posgradofip")',
				'perms' => $l[3],
				'target' => '',
				'user' => 0,
			);
		}
	}

	/**
	 * Function called when module is enabled.
	 *
	 * @param string $options Options when enabling module ('', 'noboxes')
	 * @return int 1 if OK, 0 if KO
	 */
	public function init($options = '')
	{
		// Dolibarr inicializa el módulo ANTES de activar sus dependencias. Se activan aquí primero para que
		// sus permisos y constantes existan al aplicar la configuración (p. ej. "Facturas: leer" del portal).
		require_once DOL_DOCUMENT_ROOT.'/core/lib/admin.lib.php';
		foreach ($this->depends as $dep) {
			$depname = strtolower(preg_replace('/^mod/', '', $dep));
			if ($depname == 'facture') {
				$depname = 'invoice';
			}
			if (!isModEnabled($depname)) {
				activateModule($dep, 1);
			}
		}

		$result = $this->_load_tables('/posgradofip/sql/');
		if ($result < 0) {
			return -1;
		}

		$this->remove($options);

		$sql = array();
		$result = $this->_init($sql, $options);

		// Configuración recomendada de la Unidad de Posgrado FIP-UNI: solo completa lo vacío
		// o lo que sigue con el valor de fábrica de Dolibarr (no pisa lo configurado a mano).
		// Para forzarla: Configuración del módulo → "Aplicar toda la configuración recomendada".
		global $user;
		if ($result > 0 && is_object($user)) {
			dol_include_once('/posgradofip/class/posgradofipconfig.class.php');
			$cfg = new PosgradoFipConfig($this->db);
			$cfg->apply($user, false);
		}
		if ($result > 0) {
			// Nueva revisión del CSS del Portal Web: los navegadores descargan el estilo actualizado tras una actualización del módulo
			global $conf;
			require_once DOL_DOCUMENT_ROOT.'/core/lib/admin.lib.php';
			dolibarr_set_const($this->db, 'WEBPORTAL_PARAMS_REV', (string) (getDolGlobalInt('WEBPORTAL_PARAMS_REV') + 1), 'chaine', 0, '', (int) $conf->entity);
		}

		return $result;
	}

	/**
	 * Function called when module is disabled. Data is kept.
	 *
	 * @param string $options Options when disabling module
	 * @return int 1 if OK, 0 if KO
	 */
	public function remove($options = '')
	{
		$sql = array();
		return $this->_remove($sql, $options);
	}
}
