<?php
/* Copyright (C) 2026 Unidad de Posgrado FIP-UNI
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 */

// Protección contra llamada directa
if (empty($context) || !is_object($context)) {
	print "Error, template page can't be called as URL";
	exit(1);
}
/** @var MisNotasController $this */
/** @var Context $context */

$e = function ($s) {
	return dol_escape_htmltag((string) $s);
};
$money = function ($n) {
	return 'S/ '.number_format((float) $n, 2, '.', ',');
};
?>
<style>
	.pf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.75rem;margin:1rem 0}
	.pf-kpi{border:1px solid var(--pico-muted-border-color,#ddd);border-radius:.5rem;padding:.75rem 1rem}
	.pf-kpi b{display:block;font-size:1.5rem;line-height:1.2}
	.pf-kpi span{font-size:.85rem;opacity:.75}
	.pf-ok{color:#1a7f37;font-weight:600}.pf-ko{color:#b42318;font-weight:600}.pf-pend{opacity:.7}
	.pf-table{width:100%;overflow-x:auto;display:block}
	.pf-table table{min-width:560px}
	.pf-num{text-align:right;white-space:nowrap}
	.pf-badge{display:inline-block;padding:.1rem .5rem;border-radius:1rem;font-size:.8rem;border:1px solid currentColor}
	.pf-section{margin-bottom:2.5rem}
	@media (max-width:600px){.pf-grid{grid-template-columns:repeat(2,1fr);gap:.5rem}.pf-kpi{padding:.6rem .75rem}.pf-kpi b{font-size:1.1rem}.pf-table table{min-width:520px}}
</style>
<main class="container">

<?php if (empty($this->matriculas)) { ?>
	<article>
		<p>Aún no tienes una matrícula registrada en un programa de posgrado. Si crees que es un error, escribe a la Unidad de Posgrado.</p>
	</article>
<?php } ?>

<?php foreach ($this->matriculas as $m) {
	$p = $m['programa'];
	$res = $m['resumen'];
	$tipos = posgradofip_tipos();
	$estados = posgradofip_matricula_estados();
	?>
	<section class="pf-section">
		<hgroup>
			<h2><?php print $e($p->label); ?></h2>
			<p>
				<?php print $e(isset($tipos[$p->tipo]) ? $tipos[$p->tipo] : $p->tipo); ?>
				<?php if ($m['matricula']->codigo) { print ' · Código '.$e($m['matricula']->codigo); } ?>
				<?php if ($m['matricula']->periodo_ingreso) { print ' · Ingreso '.$e($m['matricula']->periodo_ingreso); } ?>
				· <?php print $e(isset($estados[(int) $m['matricula']->status]) ? $estados[(int) $m['matricula']->status] : ''); ?>
			</p>
		</hgroup>

		<div class="pf-grid">
			<div class="pf-kpi"><b><?php print $res['promedio'] === null ? '—' : $e(number_format($res['promedio'], 2)); ?></b><span>Promedio ponderado (mín. <?php print $e(posgradofip_fmt_nota($p->promedio_minimo)); ?>)</span></div>
			<div class="pf-kpi"><b><?php print (int) $res['aprobados']; ?></b><span>Cursos aprobados</span></div>
			<?php if ((int) $p->creditos > 0) { ?>
			<div class="pf-kpi"><b><?php print $e(rtrim(rtrim(number_format($res['creditos'], 2, '.', ''), '0'), '.')).' / '.(int) $p->creditos; ?></b><span>Créditos aprobados</span></div>
			<?php } ?>
			<?php if ((int) $res['desaprobados'] > 0) { ?>
			<div class="pf-kpi"><b class="pf-ko"><?php print (int) $res['desaprobados']; ?></b><span>Cursos desaprobados</span></div>
			<?php } ?>
		</div>

		<?php if (empty($m['rows'])) { ?>
			<p class="pf-pend">Todavía no hay notas publicadas para este programa.</p>
		<?php } else { ?>
			<div class="pf-table">
			<table class="striped">
				<thead>
					<tr>
						<th>Periodo</th>
						<th><?php print $p->tipo == 'diplomado' ? 'Módulo' : 'Ciclo'; ?></th>
						<th>Curso</th>
						<?php if ((int) $p->creditos > 0) { ?><th class="pf-num">Créditos</th><?php } ?>
						<th class="pf-num">Asistencia</th>
						<th class="pf-num">Nota</th>
						<th>Estado</th>
					</tr>
				</thead>
				<tbody>
				<?php foreach ($m['rows'] as $r) {
					$ok = posgradofip_aprobado($r, $p);
					?>
					<tr>
						<td><?php print $e($r->periodo_ref); ?></td>
						<td><?php print $e(posgradofip_ciclo_label($p->tipo, $r->ciclo)); ?></td>
						<td><?php print $e($r->curso_label); ?><?php if ($r->observacion) { print '<br><small>'.$e($r->observacion).'</small>'; } ?></td>
						<?php if ((int) $p->creditos > 0) { ?><td class="pf-num"><?php print $r->creditos !== null ? $e(rtrim(rtrim($r->creditos, '0'), '.')) : '—'; ?></td><?php } ?>
						<td class="pf-num"><?php print $r->asistencia !== null ? $e(rtrim(rtrim($r->asistencia, '0'), '.')).' %' : '—'; ?></td>
						<td class="pf-num"><b><?php print $e(posgradofip_fmt_nota($r->nota)); ?></b></td>
						<td><?php
						if ($ok === null) {
							print '<span class="pf-pend">En curso</span>';
						} elseif ($ok) {
							print '<span class="pf-ok">Aprobado</span>';
						} else {
							print '<span class="pf-ko">Desaprobado</span>';
						}
						?></td>
					</tr>
				<?php } ?>
				</tbody>
			</table>
			</div>
			<small>Nota mínima aprobatoria: <?php print $e(posgradofip_fmt_nota($p->nota_aprobatoria)); ?> · Asistencia mínima: <?php print $e(rtrim(rtrim($p->asistencia_minima, '0'), '.')); ?> %. Escala vigesimal (0–20).</small>
		<?php } ?>
	</section>
<?php } ?>

	<section class="pf-section" id="estado-cuenta">
		<h2>Estado de cuenta</h2>
		<div class="pf-grid">
			<div class="pf-kpi"><b><?php print $money($this->cuenta['total']); ?></b><span>Total emitido</span></div>
			<div class="pf-kpi"><b class="pf-ok"><?php print $money($this->cuenta['pagado']); ?></b><span>Pagado</span></div>
			<div class="pf-kpi"><b class="<?php print $this->cuenta['saldo'] > 0.001 ? 'pf-ko' : 'pf-ok'; ?>"><?php print $money($this->cuenta['saldo']); ?></b><span>Saldo pendiente</span></div>
		</div>
		<?php if (empty($this->cuenta['lines'])) { ?>
			<p class="pf-pend">No tienes comprobantes emitidos.</p>
		<?php } else { ?>
			<div class="pf-table">
			<table class="striped">
				<thead>
					<tr><th>Comprobante</th><th>Emisión</th><th>Vence</th><th class="pf-num">Importe</th><th class="pf-num">Pagado</th><th class="pf-num">Saldo</th><th>Estado</th></tr>
				</thead>
				<tbody>
				<?php foreach ($this->cuenta['lines'] as $f) {
					$st = posgradofip_factura_estado($f);
					$cls = ($st == 'Pagada') ? 'pf-ok' : (($st == 'Vencida') ? 'pf-ko' : 'pf-pend');
					?>
					<tr>
						<td><?php print $e($f->ref); ?></td>
						<td><?php print $e(dol_print_date($this->db->jdate($f->datef), 'day')); ?></td>
						<td><?php print $f->date_lim_reglement ? $e(dol_print_date($this->db->jdate($f->date_lim_reglement), 'day')) : '—'; ?></td>
						<td class="pf-num"><?php print $money($f->total_ttc); ?></td>
						<td class="pf-num"><?php print $money($f->total_ttc - $f->saldo); ?></td>
						<td class="pf-num"><?php print $money($f->saldo); ?></td>
						<td><span class="pf-badge <?php print $cls; ?>"><?php print $e($st); ?></span></td>
					</tr>
				<?php } ?>
				</tbody>
			</table>
			</div>
			<?php if (isModEnabled('invoice') && getDolGlobalInt('WEBPORTAL_INVOICE_LIST_ACCESS')) { ?>
				<p><a href="<?php print $e($context->getControllerUrl('invoicelist')); ?>">Ver y descargar mis comprobantes</a></p>
			<?php } ?>
		<?php } ?>
	</section>
</main>
