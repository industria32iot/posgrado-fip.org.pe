<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/class/posgradofipconfig.class.php
 * \ingroup posgradofip
 * \brief   Configuración recomendada del portal de la Unidad de Posgrado FIP-UNI
 *
 * Datos tomados de posgrado-fip.org.pe (src/data/contenido.js) y colores de src/styles/global.css.
 */

require_once DOL_DOCUMENT_ROOT.'/core/lib/admin.lib.php';

/**
 * Class PosgradoFipConfig
 */
class PosgradoFipConfig
{
	/** @var DoliDB */
	public $db;

	/** Login del usuario de servicio del Portal Web */
	const PORTAL_USER_LOGIN = 'portal-alumnos';

	/**
	 * Constructor
	 *
	 * @param DoliDB $db Base de datos
	 */
	public function __construct($db)
	{
		$this->db = $db;
	}

	/**
	 * Ajustes recomendados: clave => [valor, descripción, grupo, valores por defecto de Dolibarr que se pueden reemplazar]
	 *
	 * @return array<string,array{0:string,1:string,2:string,3?:string[]}>
	 */
	public function getSettings()
	{
		$favicon = dol_buildpath('/posgradofip/img/favicon.png', 1);
		// URL absoluta: la usa el CSS del Portal Web antes de que el alumno inicie sesión
		$logoPublico = dol_buildpath('/posgradofip/img/logo-uni.png', 2);
		return array(
			// Institución
			'MAIN_INFO_SOCIETE_NOM' => array('Unidad de Posgrado FIP-UNI', 'Nombre de la institución', 'Institución'),
			'MAIN_INFO_SOCIETE_ADDRESS' => array('Av. Túpac Amaru N.º 210, Pabellón D1', 'Dirección', 'Institución'),
			'MAIN_INFO_SOCIETE_TOWN' => array('Rímac, Lima', 'Distrito / ciudad', 'Institución'),
			'MAIN_INFO_SOCIETE_COUNTRY' => array('PE', 'País (Perú)', 'Institución'),
			'MAIN_INFO_SOCIETE_STATE' => array('Lima', 'Departamento', 'Institución'),
			'MAIN_INFO_SOCIETE_TEL' => array('(01) 481-1070 anexo 6005', 'Teléfono', 'Institución'),
			'MAIN_INFO_SOCIETE_MOBILE' => array('+51 998 028 384', 'Celular / WhatsApp', 'Institución'),
			'MAIN_INFO_SOCIETE_MAIL' => array('posgrado-fip@uni.edu.pe', 'Correo', 'Institución'),
			'MAIN_INFO_SOCIETE_WEB' => array('https://posgrado-fip.org.pe', 'Web', 'Institución'),
			'MAIN_INFO_SOCIETE_FACEBOOK_URL' => array('https://www.facebook.com/UNIoficial.pe', 'Facebook', 'Institución'),
			'MAIN_INFO_SOCIETE_TWITTER_URL' => array('https://twitter.com/UNIoficial', 'X (Twitter)', 'Institución'),
			'MAIN_MONNAIE' => array('PEN', 'Moneda: sol peruano', 'Institución', array('EUR', 'USD')),
			'SOCIETE_FISCAL_MONTH_START' => array('1', 'Inicio del año fiscal: enero', 'Institución'),
			'MAIN_LANG_DEFAULT' => array('es_PE', 'Idioma: español (Perú)', 'Institución', array('auto', 'en_US', 'es_ES')),
			// Apariencia (paleta de posgrado-fip.org.pe)
			'MAIN_APPLICATION_TITLE' => array('Portal Posgrado FIP-UNI', 'Título de la aplicación (reemplaza "Dolibarr 24.0.4")', 'Apariencia'),
			'MAIN_FAVICON_URL' => array($favicon, 'Favicon: escudo UNI', 'Apariencia'),
			'MAIN_MANIFEST_APPLI_THEME_COLOR' => array('#003c36', 'Color de la app instalable', 'Apariencia'),
			'MAIN_SHOW_LOGO' => array('1', 'Mostrar el logo en el menú', 'Apariencia'),
			'THEME_ELDY_TOPMENU_BACK1' => array('0,60,54', 'Menú superior: verde petróleo #003c36', 'Apariencia', array('38,60,92')),
			'THEME_ELDY_VERMENU_BACK1' => array('247,244,239', 'Menú lateral: crema #f7f4ef', 'Apariencia', array('248,248,248')),
			'THEME_ELDY_BACKTITLE1' => array('247,244,239', 'Cabecera de tablas: crema', 'Apariencia', array('241,241,243')),
			'THEME_ELDY_TOPBORDER_TITLE1' => array('230,225,218', 'Bordes de tablas: línea #e6e1da', 'Apariencia', array('215,215,215', '201,152,43')),
			'THEME_ELDY_TEXTTITLENOTAB' => array('0,77,68', 'Títulos: verde #004d44', 'Apariencia', array('0,135,160')),
			'THEME_ELDY_TEXTTITLELINK' => array('0,60,54', 'Enlaces en títulos', 'Apariencia', array('10, 20, 100')),
			'THEME_ELDY_TEXTLINK' => array('0,77,68', 'Enlaces', 'Apariencia', array('10, 20, 100')),
			'THEME_ELDY_USE_HOVER' => array('230,240,238', 'Fila resaltada: verde claro #e6f0ee', 'Apariencia', array('240,242,249')),
			'THEME_ELDY_BTNACTION' => array('0,77,68', 'Botones de acción', 'Apariencia'),
			'THEME_ELDY_TEXTBTNACTION' => array('255,255,255', 'Texto de botones', 'Apariencia'),
			'MAIN_LOGIN_BACKGROUND_STYLE' => array('background: linear-gradient(4deg, #f7f4ef 52%, #003c36 52.1%);', 'Fondo del inicio de sesión', 'Apariencia'),
			// Portal Web de alumnos
			'WEBPORTAL_TITLE' => array('Portal del alumno · Posgrado FIP-UNI', 'Título del Portal Web', 'Portal Web'),
			'WEBPORTAL_LOGIN_LOGO_URL' => array($logoPublico, 'Escudo UNI en el acceso y el menú del portal', 'Portal Web'),
			'WEBPORTAL_PRIMARY_COLOR' => array('#004d44', 'Color principal del portal', 'Portal Web'),
			'WEBPORTAL_INVOICE_LIST_ACCESS' => array('1', 'El alumno ve y descarga sus comprobantes', 'Portal Web'),
			'WEBPORTAL_PROPAL_LIST_ACCESS' => array('0', 'Ocultar presupuestos', 'Portal Web'),
			'WEBPORTAL_ORDER_LIST_ACCESS' => array('0', 'Ocultar pedidos', 'Portal Web'),
			'MAIN_SECURITY_ENABLECAPTCHA_WEBPORTAL' => array('1', 'Captcha en el acceso de alumnos', 'Portal Web'),
			// Seguridad
			'API_EXPLORER_DISABLED' => array('1', 'Cerrar el explorador público del API (/api/index.php/explorer)', 'Seguridad'),
		);
	}

	/**
	 * Valor actual de una constante (texto)
	 *
	 * @param string $name Nombre
	 * @return string
	 */
	public function current($name)
	{
		return (string) getDolGlobalString($name);
	}

	/**
	 * ¿El valor actual ya es el recomendado?
	 *
	 * @param string $name  Nombre
	 * @param string $value Recomendado
	 * @return bool
	 */
	public function isApplied($name, $value)
	{
		$cur = $this->current($name);
		if ($name == 'MAIN_INFO_SOCIETE_COUNTRY' || $name == 'MAIN_INFO_SOCIETE_STATE') {
			return $cur !== '' && strpos(':'.$cur.':', ':'.$value.':') !== false;
		}
		return $cur === (string) $value;
	}

	/**
	 * Aplica la configuración recomendada
	 *
	 * @param User $user      Usuario
	 * @param bool $overwrite true = reemplaza todo; false = solo completa lo vacío o lo que sigue con el valor por defecto de Dolibarr
	 * @return array{applied: string[], kept: string[], errors: string[]}
	 */
	public function apply($user, $overwrite = false)
	{
		global $conf, $mysoc;

		$report = array('applied' => array(), 'kept' => array(), 'errors' => array());
		$entity = (int) $conf->entity;

		foreach ($this->getSettings() as $name => $def) {
			$value = $def[0];
			$replaceable = isset($def[3]) ? $def[3] : array();
			$cur = $this->current($name);
			if ($this->isApplied($name, $value)) {
				continue;
			}
			if (!$overwrite && $cur !== '' && !in_array($cur, $replaceable, true)) {
				$report['kept'][] = $name;
				continue;
			}
			if ($name == 'MAIN_INFO_SOCIETE_COUNTRY') {
				$value = $this->countryString($value);
			} elseif ($name == 'MAIN_INFO_SOCIETE_STATE') {
				$value = $this->stateString($value);
			}
			if ($value === '') {
				$report['errors'][] = $name;
				continue;
			}
			if (dolibarr_set_const($this->db, $name, $value, 'chaine', 0, '', $entity) > 0) {
				$report['applied'][] = $name;
			} else {
				$report['errors'][] = $name;
			}
		}

		// Logo UNI (login, menú, PDF y Portal Web)
		$r = $this->installLogo($overwrite);
		if ($r > 0) {
			$report['applied'][] = 'MAIN_INFO_SOCIETE_LOGO';
		} elseif ($r < 0) {
			$report['errors'][] = 'MAIN_INFO_SOCIETE_LOGO';
		}

		// Usuario de servicio del Portal Web
		$r = $this->ensurePortalUser($user, $overwrite);
		if ($r > 0) {
			$report['applied'][] = 'WEBPORTAL_USER_LOGGED';
		} elseif ($r < 0) {
			$report['errors'][] = 'WEBPORTAL_USER_LOGGED';
		}

		// Cambia la revisión de CSS del portal para que el navegador recargue los colores
		if (!empty($report['applied'])) {
			dolibarr_set_const($this->db, 'WEBPORTAL_PARAMS_REV', (string) (getDolGlobalInt('WEBPORTAL_PARAMS_REV') + 1), 'chaine', 0, '', $entity);
			dolibarr_set_const($this->db, 'MAIN_IHM_PARAMS_REV', (string) (getDolGlobalInt('MAIN_IHM_PARAMS_REV') + 1), 'chaine', 0, '', $entity);
		}

		return $report;
	}

	/**
	 * "id:code:label" del país
	 *
	 * @param string $code Código ISO
	 * @return string
	 */
	private function countryString($code)
	{
		$resql = $this->db->query("SELECT rowid, code, label FROM ".$this->db->prefix()."c_country WHERE code = '".$this->db->escape($code)."'");
		if ($resql && ($o = $this->db->fetch_object($resql))) {
			return $o->rowid.':'.$o->code.':'.$o->label;
		}
		return '';
	}

	/**
	 * "id:code:label" del departamento en Perú
	 *
	 * @param string $label Nombre
	 * @return string
	 */
	private function stateString($label)
	{
		$sql = "SELECT d.rowid, d.code_departement, d.nom FROM ".$this->db->prefix()."c_departements as d";
		$sql .= " INNER JOIN ".$this->db->prefix()."c_regions as r ON r.code_region = d.fk_region";
		$sql .= " INNER JOIN ".$this->db->prefix()."c_country as c ON c.rowid = r.fk_pays";
		$sql .= " WHERE c.code = 'PE' AND d.nom = '".$this->db->escape($label)."'";
		$resql = $this->db->query($sql);
		if ($resql && ($o = $this->db->fetch_object($resql))) {
			return $o->rowid.':'.$o->code_departement.':'.$o->nom;
		}
		return '';
	}

	/**
	 * Copia el escudo UNI como logo de la institución y genera las miniaturas
	 *
	 * @param bool $overwrite Reemplazar un logo existente
	 * @return int 1 instalado, 0 sin cambios, -1 error
	 */
	public function installLogo($overwrite = false)
	{
		global $conf;
		require_once DOL_DOCUMENT_ROOT.'/core/lib/files.lib.php';
		require_once DOL_DOCUMENT_ROOT.'/core/lib/images.lib.php';

		if (empty($conf->mycompany->dir_output)) {
			return -1;
		}
		$entity = (int) $conf->entity;
		$dir = $conf->mycompany->dir_output.'/logos/';
		dol_mkdir($dir);
		$sizes = getDefaultImageSizes();
		$changed = 0;
		// Logo principal (login, PDF, portal): escudo a color. Logo cuadrado (menú superior oscuro): escudo blanco.
		foreach (array('MAIN_INFO_SOCIETE_LOGO' => 'logo-uni.png', 'MAIN_INFO_SOCIETE_LOGO_SQUARRED' => 'logo-uni-blanco.png') as $const => $file) {
			$cur = getDolGlobalString($const);
			if ($cur == $file || (!$overwrite && $cur !== '' && !in_array($cur, array('logo-uni.png', 'logo-uni-blanco.png'), true))) {
				continue;
			}
			if (dol_copy(dol_buildpath('/posgradofip/img/'.$file, 0), $dir.$file, '0', 1) < 0) {
				return -1;
			}
			dolibarr_set_const($this->db, $const, $file, 'chaine', 0, '', $entity);
			$small = vignette($dir.$file, $sizes['maxwidthsmall'], $sizes['maxheightsmall'], '_small', $sizes['quality']);
			if (image_format_supported($small) >= 0 && preg_match('/([^\\/:]+)$/i', $small, $reg)) {
				dolibarr_set_const($this->db, $const.'_SMALL', $reg[1], 'chaine', 0, '', $entity);
			}
			$mini = vignette($dir.$file, $sizes['maxwidthmini'], $sizes['maxheightmini'], '_mini', $sizes['quality']);
			if (image_format_supported($mini) >= 0 && preg_match('/([^\\/:]+)$/i', $mini, $reg)) {
				dolibarr_set_const($this->db, $const.'_MINI', $reg[1], 'chaine', 0, '', $entity);
			}
			$changed++;
		}
		return $changed ? 1 : 0;
	}

	/** Permisos mínimos del usuario de servicio del Portal Web: [módulo, permiso, descripción] */
	const PORTAL_USER_RIGHTS = array(
		array('societe', 'lire', 'Terceros: leer'),
		array('facture', 'lire', 'Facturas: leer'),
	);

	/**
	 * Permisos mínimos que le faltan al usuario de servicio del Portal Web
	 *
	 * @return string[]|null  Descripciones de los permisos que faltan; null si no hay usuario configurado
	 */
	public function portalUserMissingRights()
	{
		require_once DOL_DOCUMENT_ROOT.'/user/class/user.class.php';
		$id = getDolGlobalInt('WEBPORTAL_USER_LOGGED');
		$u = new User($this->db);
		if ($id <= 0 || $u->fetch($id) <= 0) {
			return null;
		}
		$u->loadRights('', 1);
		$missing = array();
		foreach (self::PORTAL_USER_RIGHTS as $r) {
			if (!$u->hasRight($r[0], $r[1])) {
				$missing[] = $r[2];
			}
		}
		return $missing;
	}

	/**
	 * Crea (si no existe) el usuario interno con el que el Portal Web consulta los datos de cada alumno,
	 * y se asegura de que tenga sus permisos mínimos (lectura de terceros y facturas). El portal lo limita
	 * siempre al alumno conectado.
	 *
	 * Los permisos se revisan siempre, también si el usuario ya existía: Dolibarr inicializa el módulo antes
	 * de activar sus dependencias, y si Facturas aún no estaba activo su permiso no se pudo asignar.
	 *
	 * @param User $user      Usuario que ejecuta
	 * @param bool $overwrite Reasignar aunque ya haya otro usuario configurado
	 * @return int 1 cambios aplicados, 0 sin cambios, -1 error
	 */
	public function ensurePortalUser($user, $overwrite = false)
	{
		global $conf;
		require_once DOL_DOCUMENT_ROOT.'/user/class/user.class.php';
		require_once DOL_DOCUMENT_ROOT.'/core/lib/security2.lib.php';

		$changed = 0;
		$current = getDolGlobalInt('WEBPORTAL_USER_LOGGED');
		$u = new User($this->db);

		if ($current > 0 && !$overwrite && $u->fetch($current) > 0) {
			// Ya hay un usuario de servicio configurado (el nuestro u otro elegido a mano): solo se completan permisos
		} else {
			$u = new User($this->db);
			if ($u->fetch(0, self::PORTAL_USER_LOGIN) <= 0) {
				$u = new User($this->db);
				$u->login = self::PORTAL_USER_LOGIN;
				$u->lastname = 'Portal de alumnos';
				$u->firstname = '';
				$u->admin = 0;
				$u->employee = 0;
				$u->statut = 1;
				$u->status = 1;
				$u->entity = (int) $conf->entity;
				$u->note_private = 'Usuario de servicio del Portal Web (módulo Posgrado FIP). No inicia sesión: el portal lo usa para mostrar a cada alumno solo sus propios datos.';
				if ($u->create($user) <= 0) {
					return -1;
				}
				// Contraseña aleatoria que nadie conoce: el usuario no se usa para entrar al back-office
				$u->setPassword($user, getRandomPassword(true, null, 32), 0, 0, 1);
				$changed++;
			}
			if ($current != $u->id) {
				if (dolibarr_set_const($this->db, 'WEBPORTAL_USER_LOGGED', (string) $u->id, 'chaine', 0, '', (int) $conf->entity) <= 0) {
					return -1;
				}
				$changed++;
			}
		}

		$missing = $this->portalUserMissingRights();
		if (!empty($missing)) {
			foreach (self::PORTAL_USER_RIGHTS as $r) {
				$u->addrights(0, $r[0], $r[1]);
			}
			$after = $this->portalUserMissingRights();
			if (!empty($after)) {
				return -1;  // el permiso no existe todavía (módulo inactivo)
			}
			$changed++;
		}
		return $changed ? 1 : 0;
	}
}
