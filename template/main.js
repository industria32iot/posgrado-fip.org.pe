/* Posgrado FIP-UNI · Interacciones y render desde programas.js */
(function () {
  'use strict';
  var CC = (window.CONTENIDO && window.CONTENIDO.contacto) || {};
  var WA = CC.whatsapp || '51998028384';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var wa = function (txt) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Íconos (sprite compartido) ---------- */
  var I = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    chev: '<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    cap: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/></g>',
    flask: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7 15h10"/></g>',
    user: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></g>',
    users: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.6-5.5 6.5-5.5s5.5 2 6.5 5.5"/><path d="M15 4.8a3.5 3.5 0 0 1 0 6.4M17.5 14.8c2 .7 3.3 2.5 4 5.2"/></g>',
    bank: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M3 9l9-5 9 5z"/><path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 21h18M3 18h18"/></g>',
    award: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/></g>',
    shield: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke-linecap="round"/></g>',
    factory: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 21V11l5 3V11l5 3V5h4l1 16z"/><path d="M3 21h18"/></g>',
    link: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></g>',
    clock: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>',
    book: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/></g>',
    screen: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></g>',
    pin: '<g fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></g>',
    phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    mail: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3.5 6l8.5 7 8.5-7"/></g>',
    globe: '<g fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></g>',
    video: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></g>',
    brochure: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2z"/><path d="M9 3v16M15 5v16"/></g>',
    lock: '<g fill="none" stroke="currentColor" stroke-width="1.7"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></g>',
    wa: '<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/>',
    fb: '<path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21z"/>',
    ig: '<g fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".9" fill="currentColor" stroke="none"/></g>',
    yt: '<path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/>',
    xx: '<path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/>',
    "in": '<path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/>',
    /* Íconos de laboratorios */
    core: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="6" ry="2.2"/><path d="M6 5v14c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2V5"/><path d="M6 10c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2M6 14.6c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2" stroke-dasharray="2.2 1.6"/></g>',
    gauge: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 13l4.2-3.6"/><circle cx="12" cy="13" r="1.1" fill="currentColor" stroke="none"/><path d="M6.5 13h1.2M16.3 13h1.2M12 7.5v1.2M8.1 9.1l.8.8"/><path d="M10 3h4M12 3v2"/></g>',
    drop: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5c-2.6 3.6-4 5.8-4 7.8a4 4 0 0 0 8 0c0-2-1.4-4.2-4-7.8z"/><path d="M5 16h14l-1.6 5.5H6.6z"/><path d="M6 18.5h12"/></g>',
    fuel: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 3h6M6.5 3v14.5a2 2 0 0 0 4 0V3"/><path d="M6.5 11.5h4"/><path d="M17.5 8c-1.3 1.8-2 2.9-2 3.9a2 2 0 0 0 4 0c0-1-.7-2.1-2-3.9z"/></g>',
    grid: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="3.5" width="19" height="13" rx="1.5"/><path d="M8 20.5h8M12 16.5v4"/><path d="M6 13l3-5.5 3 2.5 3-4 3 7z" stroke-width="1.3"/><path d="M6 13h12M9 7.5l3 5.5 3-7" stroke-width="1.1"/></g>',
    field: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 21h19"/><path d="M8.5 21l3.5-10 3.5 10"/><path d="M3.5 9.5l15-3.5"/><path d="M3.5 9.5c-.9.2-1.4 1.3-1 2.2l.6 1.1M3 12.8V21"/><circle cx="17.5" cy="15" r="2"/><path d="M17.5 13l-.6-6.2"/></g>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    x: '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  };
  var sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">';
  Object.keys(I).forEach(function (k) { sprite += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + I[k] + '</symbol>'; });
  $('#icons').innerHTML = sprite + '</svg>';
  var ic = function (n) { return '<svg><use href="#i-' + n + '"/></svg>'; };

  /* ---------- Datos ordenados ---------- */
  var ORDEN_TIPOS = ['doctorado', 'maestria', 'diplomado'];
  var PROGS = (window.PROGRAMAS || []).slice().sort(function (a, b) {
    return ORDEN_TIPOS.indexOf(a.tipo) - ORDEN_TIPOS.indexOf(b.tipo) || (a.orden || 99) - (b.orden || 99);
  });
  var T = window.TIPOS;
  var url = function (p) { return 'programa.html?id=' + encodeURIComponent(p.id); };
  var porTipo = function (t) { return PROGS.filter(function (p) { return p.tipo === t; }); };

  function card(p, wide) {
    var icons = ['clock', 'book', 'screen'];
    return '<article class="prog' + (wide ? ' prog--wide' : '') + (p.borrador ? ' is-draft' : '') + '" data-type="' + p.tipo + '">' +
      '<a class="prog__img" href="' + url(p) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(p.img) + '" alt="" loading="lazy" width="1200" height="750">' +
      '<span class="tag">' + T[p.tipo].singular + '</span>' + (p.estado ? '<span class="state">' + esc(p.estado) + '</span>' : '') + '</a>' +
      '<div class="prog__body"><h3><a href="' + url(p) + '">' + esc(p.corto) + '</a></h3>' +
      (wide && p.resumen && !p.borrador ? '<p class="prog__sum">' + esc(p.resumen.length > 170 ? p.resumen.slice(0, p.resumen.lastIndexOf(' ', 168)) + '…' : p.resumen) + '</p>' : '') +
      '<ul class="facts">' + (p.facts || []).map(function (f, i) { return '<li>' + ic(icons[i % 3]) + esc(f) + '</li>'; }).join('') +
      (p.requisito ? '<li class="facts__req">' + ic('cap') + '<span>Requisito: <b>' + esc(p.requisito) + '</b></span></li>' : '') + '</ul>' +
      '<a class="more" href="' + url(p) + '">' + (p.borrador ? 'Ver avance' : 'Ver programa completo') + ' ' + ic('arrow') + '</a></div></article>';
  }

  /* ---------- Menú "Programas" (mega menú) ---------- */
  var mega = $('#mega');
  if (mega) {
    mega.innerHTML = '<div class="mega__cols">' + ORDEN_TIPOS.map(function (t) {
      var list = porTipo(t); if (!list.length) return '';
      return '<div class="mega__col"><b>' + T[t].plural + '</b><ul>' + list.map(function (p) {
        return '<li><a href="' + url(p) + '">' + esc(p.corto) + (p.estado ? '<em>' + esc(p.estado) + '</em>' : '') + '</a></li>';
      }).join('') + '</ul></div>';
    }).join('') + '</div><a class="mega__all" href="index.html#programas">Ver todos los programas ' + ic('arrow') + '</a>';
  }

  /* ---------- Pie de página ---------- */
  var fp = $('#footerProgs');
  if (fp) fp.innerHTML = PROGS.filter(function (p) { return !p.borrador; }).map(function (p) {
    /* nombre corto: Doctorado / Maestría / Diplomado en <etiqueta> */
    var n = p.tipo === 'diplomado' ? 'Diplomado en ' + (p.etiqueta || p.corto).replace(/^Diplomado en /, '') : T[p.tipo].singular;
    return '<li><a href="' + url(p) + '">' + esc(n) + '</a></li>';
  }).join('') + '<li><a href="index.html#programas">Ver todos →</a></li>';

  /* ---------- Selects del formulario ---------- */
  $$('select[name="programa"]').forEach(function (sel) {
    sel.innerHTML = '<option value="" disabled selected>Selecciona un programa</option>' + ORDEN_TIPOS.map(function (t) {
      var list = porTipo(t); if (!list.length) return '';
      /* Texto visible: nombre corto (el grupo ya indica el tipo). Valor enviado: nombre oficial completo. */
      /* Agrupado por nivel, con el nombre oficial del programa (sin repetir el nivel) */
      return '<optgroup label="' + T[t].plural + '">' + list.map(function (p) {
        return '<option value="' + esc(p.nombre) + '" data-id="' + p.id + '" data-tipo="' + esc(T[t].singular) + '">' + esc(p.corto) + '</option>';
      }).join('') + '</optgroup>';
    }).join('');
    /* Al elegir, el campo muestra "Tipo · nombre corto" para que se entienda sin abrir la lista */
    var txt = sel.parentNode.querySelector('.selectbox__txt');
    /* Campo cerrado: muestra "Nivel · nombre oficial" en varias líneas si hace falta */
    var mark = function () {
      if (!txt) return;
      var o = sel.options[sel.selectedIndex];
      txt.textContent = (o && sel.value) ? o.dataset.tipo + ' · ' + o.textContent : 'Selecciona un programa';
      txt.classList.toggle('is-empty', !sel.value);
    };
    sel.addEventListener('change', mark);
    sel._mark = mark;
  });

  /* ---------- Portada: catálogo agrupado por grado + filtros ---------- */
  var cat = $('#catalogo'), filters = $('#filters');
  if (cat) {
    /* Una sola fila con todos los programas (ordenados de mayor a menor grado) */
    cat.innerHTML = '<div class="pgrid pgrid--' + Math.min(PROGS.length, 4) + ' pgrid--all">' + PROGS.map(function (p) { return card(p, false); }).join('') + '</div>';
    var opts = [['todos', 'Todos', PROGS.length]].concat(ORDEN_TIPOS.map(function (t) { return [t, T[t].plural, porTipo(t).length]; }));
    filters.innerHTML = opts.filter(function (o) { return o[2]; }).map(function (o, i) {
      return '<button class="chip' + (i ? '' : ' is-on') + '" data-filter="' + o[0] + '" role="tab" aria-selected="' + !i + '">' + o[1] + ' <small>' + o[2] + '</small></button>';
    }).join('');
    $$('.chip', filters).forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.dataset.filter;
        $$('.chip', filters).forEach(function (c) { var on = c === chip; c.classList.toggle('is-on', on); c.setAttribute('aria-selected', String(on)); });
        /* Las tarjetas que no corresponden se desvanecen; las demás se reacomodan */
        $$('.prog', cat).forEach(function (c) {
          var show = f === 'todos' || c.dataset.type === f;
          if (show && c.hidden) { c.hidden = false; c.classList.add('is-out'); requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.remove('is-out'); }); }); }
          else if (!show && !c.hidden) { c.classList.add('is-out'); setTimeout(function () { if (c.classList.contains('is-out')) c.hidden = true; }, reduce ? 0 : 220); }
        });
      });
    });
  }

  /* ---------- Página de detalle (programa.html?id=...) ---------- */
  var pMain = $('#pMain');
  if (pMain) {
    var id = new URLSearchParams(location.search).get('id');
    var p = PROGS.filter(function (x) { return x.id === id; })[0] || PROGS[0];
    document.title = p.nombre + ' | Posgrado FIP-UNI';
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', p.resumen || p.nombre);
    $('#pImg').src = p.img;
    $('#pTipo').textContent = T[p.tipo].singular + (p.estado ? ' · ' + p.estado : '');
    $('#pNombre').textContent = p.nombre;
    $('#pCrumb').textContent = T[p.tipo].singular;
    var fi = ['clock', 'book', 'screen'];
    $('#pFacts').innerHTML = (p.facts || []).map(function (f, i) { return '<li>' + ic(fi[i % 3]) + esc(f) + '</li>'; }).join('');

    var ticks = function (arr) { return '<ul class="ticks">' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; };
    var h = '';
    if (p.borrador) h += '<div class="notice">' + ic('clock') + '<div><b>Programa en preparación</b><p>Muy pronto publicaremos el plan de estudios, requisitos e inversión. Déjanos tus datos y te avisaremos apenas abra la convocatoria.</p></div></div>';
    h += '<section class="block"><h2>Presentación</h2><p class="lead-p">' + esc(p.resumen) + '</p></section>';
    if (p.perfil) h += '<section class="block"><h2>' + esc(p.perfilTitulo || 'Perfil del egresado') + '</h2>' + ticks(p.perfil) + '</section>';
    if (p.plan) h += '<section class="block"><h2>Plan de estudios</h2><div class="plan' + (p.plan.length === 4 ? ' plan--4' : '') + '">' + p.plan.map(function (c) {
      return '<div><b>' + esc(c.t) + '</b>' + c.c.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>';
    }).join('') + '</div>' + (p.planNota ? '<p class="small">' + esc(p.planNota) + '</p>' : '') + '</section>';
    if (p.modulos) h += '<section class="block"><h2>' + esc(p.modulosTitulo || 'Módulos') + '</h2><ol class="modules">' + p.modulos.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ol></section>';
    if (p.lineas) h += '<section class="block"><h2>Líneas de investigación</h2><ul class="lines">' + p.lineas.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></section>';
    if (p.requisitos) h += '<section class="block" id="requisitos"><h2>Requisitos de admisión</h2>' + ticks(p.requisitos) + '</section>';
    if (p.convenios) h += '<section class="block"><h2>Convenios</h2><div class="partners">' + p.convenios.map(function (c) { return '<b>' + esc(c) + '</b>'; }).join('') + '</div></section>';
    pMain.innerHTML = h;

    var kv = function (rows, cls) { return '<dl class="kv' + (cls ? ' ' + cls : '') + '">' + rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>'; };
    var s = '<h3>Datos del programa</h3>' + kv(p.datos || []);
    if (p.inversion) s += '<h3>Inversión</h3>' + kv(p.inversion, 'kv--price');
    if (p.inversionNota) s += '<p class="small">' + esc(p.inversionNota) + '</p>';
    /* El formulario vive solo en la portada: se enlaza con el programa preseleccionado */
    var formUrl = 'index.html?programa=' + encodeURIComponent(p.id) + '#solicitar';
    s += '<div class="side-btns"><a class="btn btn--primary btn--block" href="' + formUrl + '">Solicita información</a>' +
      '<a class="btn btn--outline btn--block" href="' + wa('Hola, quisiera información del ' + p.nombre) + '" target="_blank" rel="noopener">' + ic('wa') + ' Consultar por WhatsApp</a></div>';
    $('#pSide').innerHTML = s;
    $('#waFloat').href = wa('Hola, quisiera información del ' + p.nombre);
    $$('.js-solicitar').forEach(function (a) { a.href = formUrl; });
    var mismos = PROGS.filter(function (x) { return x.id !== p.id && x.tipo === p.tipo; });
    var otros = mismos.concat(PROGS.filter(function (x) { return x.id !== p.id && x.tipo !== p.tipo; })).slice(0, 3);
    $('#pOtros').innerHTML = otros.map(function (x) { return card(x, false); }).join('');
  }

  /* ---------- Header con sombra ---------- */
  var header = $('#header');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Menú móvil ---------- */
  var nav = $('#nav'), burger = $('#burger');
  function setNav(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    burger.innerHTML = ic(open ? 'x' : 'menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
  $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });

  /* ---------- Submenú ---------- */
  var subLi = $('.has-sub'), subBtn = $('.nav__sub-btn');
  function setSub(open) { subLi.classList.toggle('is-open', open); subBtn.setAttribute('aria-expanded', String(open)); }
  subBtn.addEventListener('click', function (e) { e.stopPropagation(); setSub(!subLi.classList.contains('is-open')); });
  document.addEventListener('click', function (e) { if (!subLi.contains(e.target)) setSub(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setSub(false); setNav(false); } });

  /* ---------- Enlace activo (solo portada) ---------- */
  var links = $$('.nav > ul > li > a');
  var targets = links.map(function (a) { var h = a.getAttribute('href').split('#')[1]; return h && document.getElementById(h); });
  /* Se marca la sección cuyo inicio ya pasó bajo el menú (la que se está leyendo),
     no la que recién se asoma por abajo. */
  if ($('#catalogo')) {
    var spyTick = false;
    var spyRun = function () {
      spyTick = false;
      var line = header.offsetHeight + 140, best = -1, bestTop = -Infinity;
      targets.forEach(function (t, i) {
        if (!t) return;
        var r = t.getBoundingClientRect();
        if (r.top <= line && r.bottom > line && r.top > bestTop) { best = i; bestTop = r.top; }
      });
      links.forEach(function (a, i) { a.classList.toggle('is-active', i === best); });
    };
    window.addEventListener('scroll', function () { if (!spyTick) { spyTick = true; requestAnimationFrame(spyRun); } }, { passive: true });
    window.addEventListener('hashchange', function () { setTimeout(spyRun, 50); });
    spyRun();
  }

  /* ---------- Contadores ---------- */
  function animate(el) {
    var end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + Math.round(end * e).toLocaleString('en-US') + suf;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { animate(en.target); co.unobserve(en.target); } });
    }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { co.observe(el); });
  }

  /* ---------- Formulario ----------
     Sin backend: abre WhatsApp con los datos. Para guardar registros,
     reemplazar el bloque ENVÍO por un fetch() a su servicio (Sheets, CRM, API). */
  var form = $('#solicitar');
  if (form) {
    $$('[data-tipo]').forEach(function (b) {
      b.addEventListener('click', function () { $$('input[name="tipo"]', form).forEach(function (r) { r.checked = r.value === b.dataset.tipo; }); });
    });
    /* Llegada desde una ficha de programa: index.html?programa=ID#solicitar */
    var qp = new URLSearchParams(location.search).get('programa');
    if (qp) {
      var o = $('option[data-id="' + qp.replace(/"/g, '') + '"]', form.elements.programa);
      if (o) { form.elements.programa.value = o.value; form.elements.programa.dispatchEvent(new Event('change')); }
    }
    /* Botones que preseleccionan un programa (ej. "Reservar mi lugar" de la charla) */
    $$('[data-prog-id]').forEach(function (b) {
      b.addEventListener('click', function () {
        var sel = form.elements.programa, opt = $('option[data-id="' + b.dataset.progId + '"]', sel);
        if (opt) { sel.value = opt.value; sel.dispatchEvent(new Event('change')); }
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('input:not([type=radio]), select', form).forEach(function (f) {
        var bad = f.type === 'checkbox' ? !f.checked : (!f.checkValidity() || !f.value.trim());
        f.closest('.field').classList.toggle('is-bad', bad);
        if (bad) ok = false;
      });
      $('.lead__err', form).hidden = ok;
      if (!ok) { var first = $('.is-bad input, .is-bad select', form); if (first) first.focus(); return; }
      var d = form.elements;
      var msg = 'Hola, solicito ' + d.tipo.value.toLowerCase() + ' del programa:\n• ' + d.programa.value + '\n\n' +
        'Nombre: ' + d.nombres.value.trim() + ' ' + d.apellidos.value.trim() + '\nCorreo: ' + d.correo.value.trim() + '\nCelular: ' + d.celular.value.trim();
      /* ENVÍO */
      window.open(wa(msg), '_blank', 'noopener');
      form.innerHTML = '<div class="lead__done"><div class="ico">' + ic('check') + '</div><h2 class="lead__title">¡Gracias, ' + esc(d.nombres.value.trim()) + '!</h2><p class="small">Un asesor académico se comunicará contigo muy pronto.</p></div>';
    });
    $$('input, select', form).forEach(function (f) {
      f.addEventListener('change', function () { var fl = f.closest('.field'); if (fl) fl.classList.remove('is-bad'); });
      f.addEventListener('input', function () { var fl = f.closest('.field'); if (fl) fl.classList.remove('is-bad'); });
    });
  }

  /* ---------- Aparición suave escalonada ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var rv = $$('.head, .pgrid--all .prog, .finder, .why2__list li, .tl, .exec, .courses, .research__img, .lines--cards li, .inv__alliance .partners, .prof, .nw, .nw__list li, .quote, .alumnus, .history li, .labs li, .compare, .steps li, .faq details, .block, .pgrid--3 .prog, .visit__in > *, .session');
    rv.forEach(function (el) {
      el.classList.add('reveal');
      var sib = Array.prototype.filter.call(el.parentNode.children, function (c) { return rv.indexOf(c) > -1; });
      el.style.setProperty('--i', Math.min(sib.indexOf(el), 6));
    });
    var draw = $$('.steps, .history ol, .tl__line');
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.concat(draw).forEach(function (el) { ro.observe(el); });
  } else {
    $$('.steps, .history ol, .tl__line').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Barra de progreso + header compacto + parallax del inicio ---------- */
  document.body.insertAdjacentHTML('afterbegin', '<div class="progress" aria-hidden="true"></div>');
  var bar = $('.progress'), heroBg = $('.hero__bg'), phBg = $('.phero__bg'), ticking = false;
  function onFrame() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    header.classList.toggle('is-compact', y > 140);
    if (!reduce) {
      var bg = heroBg || phBg;
      if (bg && y < innerHeight * 1.2) bg.style.transform = 'translate3d(0,' + (y * 0.28) + 'px,0)';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }, { passive: true });
  onFrame();

  /* ---------- Palabra rotativa del titular ---------- */
  var rot = $('#rot');
  if (rot && !reduce) {
    var words = $$('span', rot), wi = 0;
    setInterval(function () {
      var cur = words[wi]; wi = (wi + 1) % words.length;
      cur.classList.remove('is-on'); cur.classList.add('is-out');
      setTimeout(function () { cur.classList.remove('is-out'); }, 700);
      words[wi].classList.add('is-on');
    }, 2800);
  }

  /* ---------- Efecto "spotlight" que sigue al cursor en tarjetas ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
    $$('.why2__list li, .tl, .prog, .prof, .quote, .labs li, .session, .nw--main, .finder__opts button').forEach(function (el) { el.classList.add('spot'); });
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.spot'); if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- Buscador de programa (2 preguntas) ---------- */
  var finder = $('#finder');
  if (finder) {
    var goal = null, steps = $$('.finder__step', finder), dots = $$('.finder__dots i', finder);
    var byId = function (id) { return PROGS.filter(function (p) { return p.id === id; })[0]; };
    function go(name, n) {
      steps.forEach(function (s) { s.classList.toggle('is-on', s.dataset.step === name); });
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i < n); });
    }
    function result(id, why) {
      var p = byId(id); if (!p) return;
      $('.finder__result', finder).innerHTML =
        '<div class="fres"><div class="fres__img"><img src="' + esc(p.img) + '" alt=""></div><div class="fres__body">' +
        '<span class="fres__k">Te recomendamos</span><span class="tag tag--inline">' + T[p.tipo].singular + '</span>' +
        '<h4>' + esc(p.corto) + '</h4><p>' + esc(why) + '</p>' +
        '<ul class="facts">' + (p.facts || []).map(function (f) { return '<li>' + ic('check') + esc(f) + '</li>'; }).join('') + '</ul>' +
        '<div class="fres__btns"><a class="btn btn--primary" href="' + url(p) + '">Ver programa</a>' +
        '<a class="btn btn--outline" href="#solicitar" data-fsel="' + p.id + '">Solicita información</a>' +
        '<button type="button" class="finder__back finder__restart">↺ Empezar de nuevo</button></div></div></div>';
      go('3', 3);
      var b = $('[data-fsel]', finder);
      b.addEventListener('click', function () { var o = $('option[data-id="' + p.id + '"]', form.elements.programa); if (o) { form.elements.programa.value = o.value; form.elements.programa.dispatchEvent(new Event('change')); } });
      $('.finder__restart', finder).addEventListener('click', function () { go('1', 1); });
    }
    finder.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('finder__back') && !b.classList.contains('finder__restart')) { go('1', 1); return; }
      var a = b.dataset.a; if (!a) return;
      if (a === 'investigar' || a === 'grado') { goal = a; go('2a', 2); }
      else if (a === 'actualizar') { goal = a; go('2b', 2); }
      else if (a === 'maestro') result('doctorado-petroleo-gas-natural', goal === 'investigar' ? 'Con tu grado de Maestro puedes dar el salto a la investigación de alto nivel y publicar en revistas indexadas.' : 'Ya tienes una maestría: el siguiente nivel es el grado de Doctor, con líneas de investigación en transición energética.');
      else if (a === 'bachiller') result('maestria-petroleo-gas-natural', goal === 'investigar' ? 'La maestría en Ciencias es tu primer paso en la investigación y la puerta de entrada al doctorado.' : 'Obtén el grado de Maestro con una formación profunda en reservorios, producción y procesamiento.');
      else if (a === 'refinacion') result('diplomado-refinacion-petroquimica', 'Formación práctica en procesos de refinación y petroquímica, con visitas técnicas a plantas.');
      else if (a === 'seguridad') result('diplomado-riesgos-seguridad', 'Domina el análisis de riesgos y el diseño de planes de respuesta a emergencias en instalaciones de hidrocarburos.');
    });
  }

  /* ---------- Celular: el WhatsApp flotante se oculta mientras se ve el formulario ---------- */
  var waF = $('.wa-float'), formSol = $('#solicitar');
  if (waF && formSol) {
    var mq = window.matchMedia('(max-width:640px)'), waTick = false;
    var waCheck = function () {
      waTick = false;
      var r = formSol.getBoundingClientRect();
      var visible = formSol.isConnected && formSol.closest('.hero') && r.bottom > 0 && r.top < window.innerHeight;
      var tapa = mq.matches && !!visible;
      waF.classList.toggle('wa-float--off', tapa);
      var tip = $('.wa-tip'); if (tip) tip.classList.toggle('wa-float--off', tapa);
    };
    var waSched = function () { if (!waTick) { waTick = true; setTimeout(waCheck, 60); } };
    window.addEventListener('scroll', waSched, { passive: true });
    window.addEventListener('resize', waSched);
    if ('IntersectionObserver' in window) new IntersectionObserver(waSched).observe(formSol);
    waCheck();
  }

  /* ---------- La burbuja "¿Tienes dudas?" no tapa el pie de página ---------- */
  var pie = $('.footer');
  if (pie) {
    var pieCheck = function () {
      var tip = $('.wa-tip');
      if (tip) tip.classList.toggle('wa-tip--off', pie.getBoundingClientRect().top < window.innerHeight);
    };
    window.addEventListener('scroll', pieCheck, { passive: true });
    window.addEventListener('resize', pieCheck);
  }

  /* ---------- Burbuja de WhatsApp (aparece a los 6 s, una vez por sesión) ---------- */
  var waBtn = $('.wa-float');
  if (waBtn) {
    var seen = false; try { seen = sessionStorage.getItem('waTip') === '1'; } catch (e) {}
    if (!seen) setTimeout(function () {
      var tip = document.createElement('div');
      tip.className = 'wa-tip';
      tip.innerHTML = '<b>¿Tienes dudas?</b> Escríbenos, un asesor te responde.<button type="button" aria-label="Cerrar">' + ic('x') + '</button>';
      document.body.appendChild(tip);
      if (pieCheck) pieCheck();
      requestAnimationFrame(function () { tip.classList.add('is-in'); });
      $('button', tip).addEventListener('click', function () { tip.remove(); });
      try { sessionStorage.setItem('waTip', '1'); } catch (e) {}
    }, 6000);
  }

  $('#year').textContent = new Date().getFullYear();
})();
