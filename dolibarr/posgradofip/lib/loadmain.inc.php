<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * \file    posgradofip/lib/loadmain.inc.php
 * \ingroup posgradofip
 * \brief   Carga main.inc.php de Dolibarr (funciona en custom/ y con enlaces simbólicos)
 *
 * Se incluye en el ámbito global de cada página: require __DIR__.'/lib/loadmain.inc.php';
 */

$res = 0;
if (!empty($_SERVER["CONTEXT_DOCUMENT_ROOT"])) {
	$res = @include str_replace("..", "", $_SERVER["CONTEXT_DOCUMENT_ROOT"])."/main.inc.php";
}
if (!$res && !empty($_SERVER['SCRIPT_FILENAME'])) {
	$pfDir = dirname($_SERVER['SCRIPT_FILENAME']);
	for ($pfI = 0; $pfI < 5 && !$res; $pfI++) {
		if (file_exists($pfDir.'/main.inc.php')) {
			$res = @include $pfDir.'/main.inc.php';
		}
		$pfDir = dirname($pfDir);
	}
}
if (!$res) {
	die("Include of main fails");
}
