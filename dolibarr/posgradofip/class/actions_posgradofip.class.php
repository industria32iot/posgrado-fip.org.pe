<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/class/actions_posgradofip.class.php
 * \ingroup posgradofip
 * \brief   Hooks del Portal Web (alumnos): página "Mis notas y pagos"
 */

/**
 * Class ActionsPosgradoFip
 */
class ActionsPosgradoFip
{
	/** @var DoliDB */
	public $db;
	/** @var string */
	public $error = '';
	/** @var string[] */
	public $errors = array();
	/** @var array<string,mixed> */
	public $results = array();
	/** @var string */
	public $resprints = '';

	/**
	 * Constructor
	 *
	 * @param DoliDB $db Database handler
	 */
	public function __construct($db)
	{
		$this->db = $db;
	}

	/**
	 * Registra el controlador "misnotas" en el Portal Web
	 *
	 * @param array<string,mixed> $parameters Parámetros
	 * @param Context             $context    Contexto del Portal Web
	 * @param string              $action     Acción
	 * @param HookManager         $hookmanager Hook manager
	 * @return int
	 */
	public function initController($parameters, &$context, &$action, $hookmanager)
	{
		if (!isModEnabled('posgradofip') || !is_object($context) || !method_exists($context, 'addControllerDefinition')) {
			return 0;
		}
		$path = dol_buildpath('/posgradofip/webportal/controllers/misnotas.controller.class.php', 0);
		$context->addControllerDefinition('misnotas', $path, 'MisNotasController');
		return 0;
	}

	/**
	 * Estilo del Portal Web con la identidad de posgrado-fip.org.pe (fuentes y paleta)
	 *
	 * @param array<string,mixed> $parameters Parámetros
	 * @param object              $object     WebPortalTheme
	 * @param string              $action     Acción
	 * @param HookManager         $hookmanager Hook manager
	 * @return int
	 */
	public function webPortalCustomCss($parameters, &$object, &$action, $hookmanager)
	{
		if (!isModEnabled('posgradofip')) {
			return 0;
		}
		$fonts = dol_buildpath('/posgradofip/fonts/', 1);
		$this->resprints = '
@font-face { font-family: "Inter"; font-style: normal; font-weight: 400; font-display: swap; src: url("'.$fonts.'inter-latin-400-normal.woff2") format("woff2"); }
@font-face { font-family: "Inter"; font-style: normal; font-weight: 500; font-display: swap; src: url("'.$fonts.'inter-latin-500-normal.woff2") format("woff2"); }
@font-face { font-family: "Inter"; font-style: normal; font-weight: 600; font-display: swap; src: url("'.$fonts.'inter-latin-600-normal.woff2") format("woff2"); }
@font-face { font-family: "Inter"; font-style: normal; font-weight: 700; font-display: swap; src: url("'.$fonts.'inter-latin-700-normal.woff2") format("woff2"); }
@font-face { font-family: "Source Serif 4"; font-style: normal; font-weight: 500; font-display: swap; src: url("'.$fonts.'source-serif-4-latin-500-normal.woff2") format("woff2"); }
@font-face { font-family: "Source Serif 4"; font-style: normal; font-weight: 600; font-display: swap; src: url("'.$fonts.'source-serif-4-latin-600-normal.woff2") format("woff2"); }
@font-face { font-family: "Source Serif 4"; font-style: normal; font-weight: 700; font-display: swap; src: url("'.$fonts.'source-serif-4-latin-700-normal.woff2") format("woff2"); }
:root {
	--pf-verde: #004d44; --pf-verde-700: #003c36; --pf-verde-50: #e6f0ee; --pf-oro: #c9982b; --pf-crema: #f7f4ef; --pf-tinta: #17181c;
	--pico-font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
body { font-family: var(--pico-font-family); }
h1, h2, h3, h4, hgroup > *:first-child, .hero-header__title, .brand__name, .login-page__title {
	font-family: "Source Serif 4", Georgia, "Times New Roman", serif; letter-spacing: -0.01em;
}
h2, h3 { color: var(--pf-verde-700); }
.primary-top-nav { background: #fff; border-bottom: 3px solid var(--pf-oro); }
.hero-header { background: linear-gradient(135deg, var(--pf-verde-700), var(--pf-verde)); color: #fff; }
.hero-header .hero-header__title, .hero-header .hero-header__desc { color: #fff; }
button, [type=submit], [role=button] { border-radius: 999px; font-weight: 600; }
.home-links-card { border-top: 3px solid var(--pf-oro); }
.login-page, body.login-page { background: linear-gradient(4deg, var(--pf-crema) 52%, var(--pf-verde-700) 52.1%) !important; }
.login-screen__background { display: none; }
.login-screen { background: #fff; border-radius: 16px; border-top: 4px solid var(--pf-oro); box-shadow: 0 2px 4px rgba(23,24,28,.06), 0 24px 48px rgba(23,24,28,.14); }
.login { --login-logo-height: 96px; --login-form-offset: 120px; }
.login__logo { height: 96px; max-width: 100%; background-position: center top; margin-bottom: 64px; position: relative; }
.login__logo::after { content: "Portal del alumno · Posgrado FIP-UNI"; position: absolute; left: 0; right: 0; top: 108px; text-align: center; font-family: "Source Serif 4", Georgia, serif; font-weight: 600; font-size: 1.15rem; color: var(--pf-verde-700); }
.login__field { padding: 14px 0; }
.login__icon { color: var(--pf-verde); }
.login__input:focus, .login__input:hover { border-bottom-color: var(--pf-verde) !important; }
.login__submit { background: var(--pf-verde) !important; color: #fff !important; border: 0 !important; border-radius: 999px !important; justify-content: center; margin-top: 2.2rem; }
.login__submit:hover { background: var(--pf-verde-700) !important; }
.login__submit .button__icon { color: #fff; }
footer { border-top: 1px solid #e6e1da; }
';
		return 0;
	}

	/**
	 * Agrega "Mis notas y pagos" al menú superior del Portal Web
	 *
	 * @param array<string,mixed> $parameters Parámetros
	 * @param Context             $context    Contexto
	 * @param string              $action     Acción
	 * @param HookManager         $hookmanager Hook manager
	 * @return int
	 */
	public function PrintTopMenu($parameters, &$context, &$action, $hookmanager)
	{
		if (!isModEnabled('posgradofip') || !is_object($context) || empty($context->logged_thirdparty) || empty($context->logged_thirdparty->id)) {
			return 0;
		}
		$this->results['misnotas'] = array(
			'id' => 'misnotas',
			'rank' => 5,
			'url' => $context->getControllerUrl('misnotas'),
			'name' => 'Mis notas y pagos',
		);
		return 0;
	}
}
