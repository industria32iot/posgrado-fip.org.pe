/* =====================================================================
   RENDER DE SECCIONES · toma los datos de contenido.js y los pinta.
   Marketing NO necesita editar este archivo.
   ===================================================================== */
(function () {
  'use strict';
  var C = window.CONTENIDO || {};
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (n) { return '<svg><use href="#i-' + n + '"/></svg>'; };
  var vis = function (arr) { return (arr || []).filter(function (x) { return x && x.visible !== false; }); };
  var put = function (sel, html) { var el = $(sel); if (el) el.innerHTML = html; return el; };
  var K = C.contacto || {};
  var wa = function (txt) { return 'https://wa.me/' + (K.whatsapp || '') + (txt ? '?text=' + encodeURIComponent(txt) : ''); };
  var MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
  var DIA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  var parseF = function (f) { var p = String(f).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  var progs = window.PROGRAMAS || [];
  var prog = function (id) { return progs.filter(function (p) { return p.id === id; })[0]; };

  /* 1. Inicio */
  var I = C.inicio;
  if (I && $('#heroCopy')) {
    var img = $('.hero__bg img'); if (img && I.foto) img.src = I.foto;
    put('#heroCopy',
      '<p class="eyebrow eyebrow--light" data-in style="--d:0">' + esc(I.etiqueta) + '</p>' +
      '<h1 data-in style="--d:1">' + esc(I.titulo) + (I.tituloDestacado ? ' <span class="hero__accent">' + esc(I.tituloDestacado) + '</span>' : '') + '</h1>' +
      '<p class="hero__lead" data-in style="--d:2">' + esc(I.subtitulo) + '</p>' +
      '<ul class="hero__pillars" data-in style="--d:3">' + vis(I.pilares).map(function (p) {
        return '<li>' + ic(p.icono || 'shield') + '<div><b>' + esc(p.titulo) + '</b><span>' + esc(p.texto) + '</span></div></li>';
      }).join('') + '</ul>');
  }

  /* 2. Cifras */
  /* Cifras con referencial: true no se publican; la franja se reparte entre las visibles */
  /* auto: "programas" | "totalTesis" | "laboratorios" → el número se calcula de los datos */
  var CI = C.investigacion || {};
  var AUTO = {
    programas: function () { return vis(window.PROGRAMAS || []).filter(function (p) { return !p.borrador; }).length; },
    totalTesis: function () { return +CI.totalTesis || 0; },
    laboratorios: function () { return vis(CI.laboratorios || []).length; }
  };
  var cifrasVis = vis(C.cifras).filter(function (c) { if (c.referencial) { if (window.console) console.info('Cifra oculta por ser referencial: ' + (c.texto || '')); return false; } return true; })
    .map(function (c) { return c.auto && AUTO[c.auto] ? Object.assign({}, c, { numero: AUTO[c.auto]() }) : c; })
    .filter(function (c) { return +c.numero > 0; });   /* una cifra automática en 0 no se muestra */
  var cg = $('#cifras');
  if (cg) { cg.style.setProperty('--n', cifrasVis.length); cg.classList.toggle('stats__grid--pocas', cifrasVis.length <= 3); }
  put('#cifras', cifrasVis.map(function (c) {
    var shown = (c.prefijo || '') + Number(c.numero).toLocaleString('en-US') + (c.sufijo || '');
    return '<div class="stat">' + ic(c.icono || 'award') + '<b data-count="' + c.numero + '" data-prefix="' + esc(c.prefijo || '') + '" data-suffix="' + esc(c.sufijo || '') + '">' + shown + '</b><span>' + esc(c.texto) + '</span></div>';
  }).join(''));

  /* 3. Calendario */
  var A = C.calendario;
  if (A) put('#admisionIn',
    '<div class="adm__head"><div><p class="eyebrow">' + esc(A.etiqueta) + '</p><h2>' + esc(A.titulo) + '</h2></div>' +
      '<a class="btn btn--primary" href="#solicitar">Solicita información ' + ic('arrow') + '</a></div>' +
    '<div class="adm">' +
      /* Doctorado y Maestría: 4 pasos, solo título y fecha */
      '<div class="adm__card adm__card--main"><div class="adm__top"><span class="adm__k">' + esc(A.alcance || 'Doctorado y Maestría') + '</span>' +
        (A.estadoInscripcion ? '<span class="adm__tag"><i></i>' + esc(A.estadoInscripcion) + '</span>' : '') + '</div>' +
        '<ol class="steps steps--adm">' + vis(A.pasos).map(function (p, i) {
          return '<li title="' + esc(p.texto) + '"><i class="steps__c">' + (i + 1) + '</i><b>' + esc(p.titulo) + '</b><em>' + esc(p.fecha) + '</em>' +
            (p.detalle ? '<small>' + esc(p.detalle) + '</small>' : '') + '</li>';
        }).join('') + '</ol></div>' +
      /* Diplomados: inscripción directa */
      (function () {
        var dips = progs.filter(function (p) { return p.tipo === 'diplomado' && p.visible !== false; });
        if (!dips.length) return '';
        return '<div class="adm__card"><span class="adm__k">Diplomados · sin examen</span><ul class="dips">' + dips.map(function (p) {
          return '<li><a href="' + wa('Hola, quisiera información del ' + p.nombre) + '" target="_blank" rel="noopener"><b>' + esc(p.etiqueta || p.corto) + '</b>' +
            '<span>' + (p.proximoInicio ? 'Inicio: ' + esc(p.proximoInicio) : 'Inicio por confirmar') + '</span><em class="dips__wa">' + ic('wa') + 'Consultar</em></a></li>';
        }).join('') + '</ul></div>';
      })() +
    '</div>' +
    '<p class="small steps__nota">' + esc(A.nota) + ' · <a href="#programas">Ver requisitos por programa</a></p>');

  /* Próximamente: Escuela de Líderes + Cursos en una sola franja */
  var E0 = C.escuelaLideres, CU0 = C.cursos;
  if ($('#soon') && (E0 || CU0)) {
    var listaTxt = function (arr) { arr = arr.map(function (x) { return x.toLowerCase(); }); return arr.length > 1 ? arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1] : arr.join(''); };
    var item = function (icon, t, d) { return '<li><span class="soon__ico">' + ic(icon) + '</span><div><b>' + esc(t) + '</b><span>' + esc(d) + '</span></div></li>'; };
    var PX = C.proximamente || {};
    put('#soon',
      '<div class="soon__head"><span class="soon__badge"><i></i>Próximamente' + (PX.fecha ? ' <em>· ' + esc(PX.fecha) + '</em>' : '') + '</span><h2>Nuevas líneas de formación</h2></div>' +
      '<ul class="soon__list">' +
        (E0 ? item('cap', E0.titulo, (E0.temas && E0.temas.length ? listaTxt(E0.temas).replace(/^./, function (c) { return c.toUpperCase(); }) : E0.texto)) : '') +
        (CU0 ? item('flask', CU0.titulo, listaTxt(vis(CU0.lista).map(function (c) { return c.nombre; })).replace(/^./, function (c) { return c.toUpperCase(); })) : '') +
      '</ul>' +
      /* Mini formulario de lista de espera */
      '<form class="soon__form" novalidate>' +
        '<div class="soon__row"><label class="sr-only" for="soonMail">Correo electrónico</label>' +
        '<input id="soonMail" type="email" name="email" autocomplete="email" required placeholder="Tu correo electrónico">' +
        '<button class="btn btn--primary" type="submit">Avísame</button></div>' +
        '<label class="soon__ok"><input type="checkbox" name="privacidad" required> Acepto la <a href="privacidad.html" target="_blank" rel="noopener">política de privacidad</a></label>' +
        '<p class="soon__err" role="alert" hidden></p>' +
      '</form>');
    var sf = $('#soon .soon__form');
    if (sf) sf.addEventListener('submit', function (e) {
      e.preventDefault();
      var mail = sf.elements.email, ok = sf.elements.privacidad, err = $('#soon .soon__err');
      var msg = !mail.value.trim() || !mail.checkValidity() ? 'Escribe un correo electrónico válido.' : !ok.checked ? 'Acepta la política de privacidad para continuar.' : '';
      err.textContent = msg; err.hidden = !msg;
      if (msg) { (mail.checkValidity() && mail.value.trim() ? ok : mail).focus(); return; }
      var correo = mail.value.trim();
      var done = function () { sf.outerHTML = '<p class="soon__done" role="status">' + ic('check') + '¡Listo! Te avisaremos cuando abra la convocatoria.</p>'; };
      if (PX.formularioAviso) {
        var abrir = function () {   /* si el servicio no admite CORS: se abre el formulario con el correo como parámetro */
          var u = PX.formularioAviso + (PX.formularioAviso.indexOf('?') > -1 ? '&' : '?') + 'email=' + encodeURIComponent(correo);
          window.open(u, '_blank', 'noopener');
        };
        try {
          fetch(PX.formularioAviso, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'email=' + encodeURIComponent(correo) })
            .then(function (r) { if (!r.ok) abrir(); done(); })
            .catch(function () { abrir(); done(); });
        } catch (x) { abrir(); done(); }
      } else {
        window.open(wa('Hola, quiero que me avisen cuando abran la Escuela de Líderes o los Cursos especializados de la FIP-UNI. Mi correo: ' + correo), '_blank', 'noopener');
        done();
      }
    });
  }

  /* 4 y 5. Escuela de Líderes y cursos (versión anterior, si existen los contenedores) */
  var E = C.escuelaLideres;
  if (E) put('#exec',
    '<p class="eyebrow eyebrow--light">Formación ejecutiva</p><h2>' + esc(E.titulo) + '</h2><p>' + esc(E.texto) + '</p>' +
    '<ul class="exec__list">' + (E.temas || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
    '<div class="exec__foot"><span class="badge">' + esc(E.estado) + '</span><a class="btn btn--light" href="' + wa('Hola, quiero información sobre la ' + E.titulo + ' FIP-UNI') + '" target="_blank" rel="noopener">' + esc(E.boton) + '</a></div>');
  var CU = C.cursos;
  if (CU) put('#cursos',
    '<div class="courses__head"><p class="eyebrow">Formación técnica</p><h2>' + esc(CU.titulo) + '</h2><p>' + esc(CU.texto) + '</p></div>' +
    '<div class="courses__grid">' + vis(CU.lista).map(function (c) {
      return '<a class="course" href="' + wa('Hola, quisiera información del curso de ' + c.nombre) + '" target="_blank" rel="noopener"><img src="' + esc(c.foto) + '" alt="" loading="lazy"><span>' + esc(c.nombre) + '</span></a>';
    }).join('') + '</div>');

  /* 6. ¿Por qué? + trayectoria */
  /* Total de tesis: una sola fuente (investigacion.totalTesis). Si no existe, se usa la suma de las líneas. */
  var INV = C.investigacion || {};
  var lineasTesis = (INV.lineas || []).reduce(function (s, l) { return s + (l && +l.tesis > 0 ? +l.tesis : 0); }, 0);
  var TOTAL_TESIS = +INV.totalTesis > 0 ? +INV.totalTesis : lineasTesis;
  var conTotal = function (s) { return String(s == null ? '' : s).replace(/\{totalTesis\}/g, TOTAL_TESIS); };

  var PQ = C.porQue;
  if (PQ) {
    put('#porqueTitulo', esc(PQ.titulo));
    /* Razones compactas: ícono + título + texto corto; enlazan a su sección */
    put('#porqueGrid', vis(PQ.tarjetas).map(function (t) {
      var tag = t.enlace ? 'a' : 'div', href = t.enlace ? ' href="' + esc(t.enlace) + '"' : '';
      return '<li><' + tag + href + ' class="why2__item"><span class="why2__ico">' + ic(t.icono || 'shield') + '</span>' +
        '<span class="why2__txt"><b>' + esc(t.titulo) + '</b><span>' + esc(conTotal(t.texto)) + '</span></span>' +
        (t.enlace ? '<span class="why2__go">' + ic('arrow') + '</span>' : '') + '</' + tag + '></li>';
    }).join(''));
  }
  put('#trayectoriaList', vis(C.trayectoria).map(function (t) {
    return '<li' + (t.destacado ? ' class="is-now"' : '') + '><b>' + esc(t.anio) + '</b><i></i><span>' + esc(t.texto) + '</span></li>';
  }).join(''));

  /* 7. Docentes */
  var inic = function (n) {
    var w = String(n).replace(/^(Dr\.|Dra\.|MSc\.|Mg\.|Ing\.|PhD\.?)\s*/i, '').split(/\s+/).filter(function (x) { return x.replace('.', '').length > 1; });
    var b = w.length >= 4 ? w[2] : w[1];
    return ((w[0] || '')[0] || '') + ((b || '')[0] || '');
  };
  var docs = vis(C.docentes);
  if ($('#docentesGrid')) put('#docentesGrid', docs.map(function (d, di) {
    /* Sin foto: iniciales en serif con un tono distinto por docente (rotación de 4) */
    var av = d.foto ? '<img class="avatar avatar--img avatar--foto" src="' + esc(d.foto) + '" alt="' + esc(d.nombre) + '" loading="lazy" width="400" height="400">' : '<span class="avatar avatar--t' + (di % 4) + '">' + esc(inic(d.nombre)) + '</span>';
    return '<article class="prof">' + '<div class="prof__top">' + av + '<div><h3>' + esc(d.nombre) + '</h3><p class="role">' + esc(d.cargo) + '</p></div></div>' +
      '<p class="prof__sum">' + esc(d.resumen) + '</p>' +
      ((d.sellos && d.sellos.length) ? '<ul class="prof__seals">' + d.sellos.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' : '') + '</article>';
  }).join(''));
  /* Flechas del carrusel de docentes */
  var track = $('#docentesGrid');
  if (track) document.querySelectorAll('.fac__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = track.querySelector('.prof'); var step = card ? card.getBoundingClientRect().width + 16 : 300;
      track.scrollBy({ left: step * +b.dataset.dir, behavior: (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'auto' : 'smooth' });
    });
  });

  /* 8. Investigación */
  var R = C.investigacion;
  if (R && $('#investigacion')) {
    /* Foto: formato (vertical u horizontal) y texto alternativo */
    /* Foto opcional de personas (16:9, a todo el ancho). "" = no se muestra */
    var rbox = $('.research__img'), rimg = $('.research__img img');
    if (rbox && rimg) {
      if (R.fotoPersonas) { rimg.src = R.fotoPersonas; rimg.alt = R.fotoPersonasAlt || ''; rbox.hidden = false; }
      else rbox.hidden = true;
      rimg.addEventListener('error', function () { rbox.hidden = true; });
    }

    /* Campo escuela: reemplaza la foto genérica; si su foto no carga, vuelve a la foto de respaldo */
    var CE = R.campoEscuela;
    var CEL = R.campoEscuelaLab;   /* si el campo escuela va en Laboratorios, no se repite junto a los convenios */
    if (rbox && rimg && CE && CE.visible && CE.foto && !(CEL && CEL.visible)) {
      var fallback = function () {
        rbox.classList.remove('field-card');
        var ov = rbox.querySelector('.field-card__ov'); if (ov) ov.remove();
        rimg.removeEventListener('error', fallback);
        rimg.src = R.foto || ''; rimg.alt = R.fotoAlt || '';
      };
      rimg.addEventListener('error', fallback);
      rbox.classList.add('field-card');
      rimg.src = CE.foto; rimg.alt = CE.fotoAlt || R.fotoAlt || CE.titulo || '';
      rbox.insertAdjacentHTML('beforeend',
        '<div class="field-card__ov"><span class="field-card__k">Campo escuela</span>' +
        '<h3>' + esc(CE.titulo) + '</h3>' + (CE.texto ? '<p>' + esc(CE.texto) + '</p>' : '') +
        (CE.enlace ? '<a class="more" href="' + esc(CE.enlace) + '" target="_blank" rel="noopener">Conocer más ' + ic('arrow') + '</a>' : '') + '</div>');
    }

    /* Líneas normalizadas y control del total de tesis */
    var lineasObj = (R.lineas || []).map(function (l) { return typeof l === 'string' ? { nombre: l } : (l || {}); });
    if (lineasTesis !== TOTAL_TESIS && window.console) {
      console.warn('Tesis: las líneas suman ' + lineasTesis + ' y el total es ' + TOTAL_TESIS + '. Faltan clasificar ' + (TOTAL_TESIS - lineasTesis) + '.');
    }
    put('#invTitulo', esc(R.titulo));
    put('#invTexto', esc(conTotal(R.texto)));

    /* Líneas: texto simple u objeto { nombre, tesis, enlace }.
       Con menos tesis que "minimoTesisVisible" se muestra solo "Ver tesis →". */
    var minT = +R.minimoTesisVisible > 0 ? +R.minimoTesisVisible : 2;
    put('#invLineas', lineasObj.map(function (o, i) {
      var lid = ' id="linea-' + (i < 9 ? '0' : '') + (i + 1) + '"';
      var muchas = +o.tesis >= minT, badge = '';
      if (o.enlace) badge = '<em class="lines__tesis">' + (muchas ? esc(o.tesis) + ' tesis' : 'Ver tesis') + ' ' + ic('arrow') + '</em>';
      else if (muchas) badge = '<em class="lines__tesis">' + esc(o.tesis) + ' tesis</em>';
      if (o.enlace) return '<li' + lid + '><a class="lines__a" href="' + esc(o.enlace) + '" target="_blank" rel="noopener" title="Ver tesis en el Repositorio UNI"><span class="lines__n">' + esc(o.nombre) + '</span>' + badge + '</a></li>';
      return '<li' + lid + '><span class="lines__n">' + esc(o.nombre) + '</span>' + badge + '</li>';
    }).join(''));

    /* Convenios: { nacionales: [], internacionales: [] } o una lista (= internacionales).
       El detalle solo se muestra si confirmado es true. */
    var norm = function (arr) { return (arr || []).map(function (c) { return typeof c === 'string' ? { nombre: c } : (c || {}); }).filter(function (c) { return c.nombre && c.visible !== false; }); };
    var CV = R.convenios || [];
    var grupos = Array.isArray(CV)
      ? [{ k: 'Internacionales', l: norm(CV) }]
      : [{ k: 'Nacionales', l: norm(CV.nacionales) }, { k: 'Internacionales', l: norm(CV.internacionales) }];
    grupos = grupos.filter(function (g) { return g.l.length; });
    var card = function (c) {
      var det = (c.confirmado === true && c.detalle) ? '<p>' + esc(c.detalle) + '</p>' : '';
      return '<li>' + (c.logo ? '<img src="' + esc(c.logo) + '" alt="' + esc(c.nombre) + '" loading="lazy">' : '<b>' + esc(c.nombre) + '</b>') +
        '<span class="agreements__info">' + (c.pais ? '<small>' + esc(c.pais) + '</small>' : '') + det + '</span></li>';
    };
    put('#convenios', grupos.length
      ? '<p class="eyebrow">Alianzas</p><h3 class="sub-h3">' + (grupos.length > 1 ? 'Convenios' : 'Convenios ' + grupos[0].k.toLowerCase()) + '</h3>' +
        grupos.map(function (g) {
          return (grupos.length > 1 ? '<em class="agreements__g">' + g.k + '</em>' : '') + '<ul class="agreements">' + g.l.map(card).join('') + '</ul>';
        }).join('')
      : '');
    /* LABORATORIOS: encabezado, tarjeta destacada (campo escuela) y tarjetas de laboratorio */
    put('#labsTexto', esc(R.labsTexto || ''));
    var labs = vis(R.laboratorios);
    var nLin = lineasObj.length;
    var media = function (foto, icono, alt) {   /* foto con respaldo al ícono si no carga */
      return (foto ? '<img class="lab__img" src="' + esc(foto) + '" alt="' + esc(alt) + '" loading="lazy" width="1200" height="750">' : '') +
        '<span class="lab__ico"' + (foto ? ' hidden' : '') + '>' + ic(icono || 'flask') + '</span>';
    };
    var tags = function (arr) {
      arr = (arr || []).filter(function (n) { return +n >= 1; });
      if (!arr.length) return '';
      return '<ul class="lab__tags">' + arr.map(function (n) {
        var nn = (+n < 10 ? '0' : '') + (+n);
        return '<li><a href="' + (+n <= nLin ? '#linea-' + nn : '#investigacion') + '">Línea ' + nn + '</a></li>';
      }).join('') + '</ul>';
    };
    /* Columnas sin huecos: escritorio 4 columnas (la destacada ocupa 2, 3 o 4 según cuántos labs haya);
       tablet 2 columnas (la destacada ocupa la fila; si quedan impares, el último ocupa 2) */
    var feat = (CEL && CEL.visible && CE) ? CE : null;
    var n = labs.length, s4 = 2;
    if (feat) { [2, 3, 4].some(function (s) { if ((s + n) % 4 === 0) { s4 = s; return true; } return false; }); }
    var rest4 = ((feat ? s4 : 0) + n) % 4, last4 = rest4 ? 4 - rest4 + 1 : 1;
    var last2 = n % 2 ? 2 : 1;
    put('#labsList',
      (feat ? '<li class="lab lab--feature" style="--s4:' + s4 + '">' + media(feat.foto, CEL.icono || 'field', feat.fotoAlt || feat.titulo) +
        '<span class="lab__k">Campo escuela</span><b>' + esc(feat.titulo) + '</b>' + (feat.texto ? '<span class="lab__d">' + esc(feat.texto) + '</span>' : '') + '</li>' : '') +
      labs.map(function (l, i) {
        var isLast = i === n - 1;
        return '<li class="lab' + (isLast ? ' lab--last' : '') + '"' + (isLast ? ' style="--l4:' + last4 + ';--l2:' + last2 + '"' : '') + '>' +
          media(l.foto, l.icono, l.nombre) + '<b>' + esc(l.nombre) + '</b>' +
          (l.detalle ? '<span class="lab__d">' + esc(l.detalle) + '</span>' : '') +
          (l.equipos ? '<span class="lab__eq">Equipos: ' + esc(l.equipos) + '</span>' : '') +
          tags(l.lineas) + '</li>';
      }).join(''));
    /* Si una foto no carga, se oculta y vuelve el ícono */
    document.querySelectorAll('#labsList .lab__img').forEach(function (img) {
      img.addEventListener('error', function () { var ico = img.nextElementSibling; img.remove(); if (ico) ico.hidden = false; });
    });
    /* Indicadores: los referenciales no se publican; "auto" calcula el número;
       el de tesis va primero y destacado. */
    var labsVis = vis(R.laboratorios).length;
    var ind = vis(R.indicadores).filter(function (k) {
      if (k.referencial) { if (window.console) console.info('Indicador oculto por ser referencial: ' + (k.texto || '')); return false; }
      return true;
    }).map(function (k) {
      var n = k.auto === 'totalTesis' ? TOTAL_TESIS : k.auto === 'lineas' ? lineasObj.filter(function (o) { return o.nombre && o.visible !== false; }).length : k.auto === 'laboratorios' ? labsVis : +k.numero || 0;
      return { k: k, n: n, main: k.auto === 'totalTesis' };
    }).sort(function (a, b) { return (b.main ? 1 : 0) - (a.main ? 1 : 0); });
    var enlaceTesis = (ind.filter(function (x) { return x.main; })[0] || { k: {} }).k.enlace || '';
    var isExt = function (u) { return /^https?:/i.test(u); };

    /* Panel de tesis: "Tesis recientes" si la más reciente tiene menos de 12 meses; si no, "Tesis destacadas" */
    var tr = vis(R.tesisRecientes);
    var fechaTesis = function (t) { if (t.fecha) { var d = parseF(t.fecha); if (!isNaN(d)) return d; } var y = parseInt(t.anio, 10); return y ? new Date(y, 11, 31) : null; };
    var masReciente = tr.reduce(function (m, t) { var d = fechaTesis(t); return d && (!m || d > m) ? d : m; }, null);
    var reciente = !!masReciente && ((new Date() - masReciente) / (1000 * 60 * 60 * 24 * 30.44)) <= 12;
    var tituloPanel = R.tituloTesis || (reciente ? 'Tesis recientes' : 'Tesis destacadas');

    put('#invResultados', (ind.length || tr.length) ?
      '<p class="eyebrow">Impacto</p><h3 class="sub-h3">Resultados de investigación</h3>' +
      '<div class="results__grid">' +
        (ind.length ? '<div class="results__kpis results__kpis--n' + Math.min(ind.length, 4) + '">' + ind.map(function (x) {
          var k = x.k;
          return '<div class="kpi' + (x.main ? ' kpi--main' : '') + '"><b data-count="' + x.n + '" data-prefix="' + esc(k.prefijo || '') + '" data-suffix="' + esc(k.sufijo || '') + '">' + esc((k.prefijo || '') + x.n + (k.sufijo || '')) + '</b>' +
            '<span class="kpi__t">' + esc(k.texto) + '</span><span class="kpi__d">' + esc(k.detalle || '') + '</span>' +
            (k.enlace ? '<a class="more" href="' + esc(k.enlace) + '"' + (isExt(k.enlace) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(k.enlaceTexto || 'Ver más') + ' ' + ic('arrow') + '</a>' : '') + '</div>';
        }).join('') + '</div>' : '') +
        (tr.length ? '<div class="theses' + (reciente ? '' : ' theses--old') + '"><span class="theses__k">' + esc(tituloPanel) + '</span><ul>' + tr.map(function (t) {
          return '<li><a href="' + esc(t.enlace) + '" target="_blank" rel="noopener">' +
            (reciente ? '<em>' + esc(t.anio) + '</em><b>' + esc(t.titulo) + '</b><span>' + esc(t.autor) + '</span>'
                      : '<b>' + esc(t.titulo) + '</b><span>' + esc(t.autor) + (t.anio ? ' · ' + esc(t.anio) : '') + '</span>') + '</a></li>';
        }).join('') + '</ul>' +
        (enlaceTesis ? '<a class="theses__all" href="' + esc(enlaceTesis) + '" target="_blank" rel="noopener">Ver las ' + esc(TOTAL_TESIS) + ' tesis en el Repositorio UNI ' + ic('arrow') + '</a>' : '') +
        '</div>' : '') +
      '</div>' : '');
  }

  /* 9–10. AGENDA: charlas (izquierda) + noticias (derecha) en una sola sección */
  var AG = C.agenda || {};
  put('#agendaEtiqueta', esc(AG.etiqueta || 'Agenda y actualidad'));
  put('#agendaTitulo', esc(AG.titulo || 'Lo que viene en el Posgrado FIP-UNI'));

  /* Charlas */
  var CH = C.charlas;
  if (CH && $('#agendaCharlas')) {
    var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    var sesAll = vis(CH.sesiones).filter(function (s) { return parseF(s.fecha) >= hoy; }).sort(function (a, b) { return String(a.fecha + a.hora).localeCompare(String(b.fecha + b.hora)); });
    var ses = sesAll.slice(0, 3);
    var hora12 = function (h) { var p = h.split(':'), H = +p[0]; return ((H % 12) || 12) + ':' + p[1] + (H < 12 ? ' a. m.' : ' p. m.'); };
    var gcal = function (s, p) {
      var d = parseF(s.fecha), hm = s.hora.split(':');
      var ini = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), +hm[0] + 5, +hm[1])); /* Lima = UTC-5 */
      var fin = new Date(ini.getTime() + (s.duracion || 45) * 60000);
      var z = function (x) { return x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
      return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Charla informativa: ' + (p ? p.corto : '') + ' – Posgrado FIP-UNI') +
        '&dates=' + z(ini) + '/' + z(fin) + '&details=' + encodeURIComponent('Charla gratuita por Google Meet.' + (s.enlaceMeet ? ' Enlace: ' + s.enlaceMeet : ' El enlace se enviará por correo y WhatsApp.')) + '&location=' + encodeURIComponent(s.enlaceMeet || 'Google Meet');
    };
    /* Título automático según el tipo de programa de las sesiones */
    var tiposSes = sesAll.map(function (s) { var p = prog(s.programa); return p ? p.tipo : ''; }).filter(Boolean)
      .filter(function (v, i, a) { return a.indexOf(v) === i; });
    var tituloCh = CH.titulo || (tiposSes.length === 1 ? 'Próximas charlas: ' + window.TIPOS[tiposSes[0]].plural.toLowerCase() : 'Próximas charlas por Google Meet');
    var form = CH.formularioInscripcion;
    var sesionHTML = function (s) {
      var p = prog(s.programa), d = parseF(s.fecha), pend = s.confirmada === false;
      var horas = p ? String((p.facts || [''])[0]).split('·')[0].trim() : '';   /* solo las horas: "384 horas" */
      var reservar = form
        ? '<a class="btn btn--primary" href="' + esc(form) + '" target="_blank" rel="noopener">Inscribirme</a>'
        : '<a class="btn btn--primary" href="#solicitar" data-tipo="Charla informativa" data-prog-id="' + esc(s.programa) + '">Reservar mi lugar</a>';
      return '<article class="session"><div class="session__date"><span>' + DIA[d.getDay()] + '</span><b>' + d.getDate() + '</b><span>' + MES[d.getMonth()] + '</span></div>' +
        '<div class="session__body"><span class="cat">' + (p ? esc(window.TIPOS[p.tipo].singular + (horas ? ' · ' + horas : '')) : '') +
        (pend ? ' <em class="session__pend">Por confirmar</em>' : '') + '</span>' +
        '<h3>' + esc(p ? p.corto : s.programa) + '</h3>' +
        '<ul class="session__meta"><li>' + ic('clock') + hora12(s.hora) + ' (hora de Lima) · ' + (s.duracion || 45) + ' min</li><li>' + ic('video') + 'Google Meet</li></ul>' +
        '<div class="session__actions">' + (pend
          ? '<a class="btn btn--primary" href="#solicitar" data-tipo="Charla informativa" data-prog-id="' + esc(s.programa) + '">Avísame</a>'
          : reservar + '<a class="btn btn--outline" target="_blank" rel="noopener" href="' + esc(gcal(s, p)) + '">Agregar a mi calendario</a>') + '</div></div></article>';
    };
    put('#agendaCharlas',
      '<h3 class="agenda__sub">' + esc(tituloCh) + '</h3>' + (CH.texto ? '<p class="agenda__lead">' + esc(CH.texto) + '</p>' : '') +
      '<div class="sessions">' + (ses.length ? ses.map(sesionHTML).join('') :
        '<article class="session session--empty"><div class="session__body"><h3>Muy pronto anunciaremos nuevas fechas</h3><p>Déjanos tus datos y te avisaremos de la próxima charla.</p>' +
        '<a class="btn btn--primary" href="#solicitar" data-tipo="Charla informativa">Avísame</a></div></article>') + '</div>' +
      (sesAll.length > 3 ? '<a class="more agenda__more" href="' + esc(form || '#solicitar') + '"' + (form ? ' target="_blank" rel="noopener"' : ' data-tipo="Charla informativa"') + '>Ver más fechas ' + ic('arrow') + '</a>' : '') +
      ((CH.temas || []).length ? '<ul class="agenda__topics">' + CH.temas.map(function (t) { return '<li>' + ic('check') + esc(t) + '</li>'; }).join('') + '</ul>' : ''));
  }

  /* Noticias: orden por ámbito (posgrado → facultad → estudiantes) y luego fecha */
  var fFecha = function (f) { var d = parseF(f); return d.getDate() + ' ' + MES[d.getMonth()] + ' ' + d.getFullYear(); };
  var ORD = { posgrado: 0, facultad: 1, estudiantes: 2 };
  var news = vis(C.noticias).slice().sort(function (a, b) {
    var oa = a.ambito in ORD ? ORD[a.ambito] : 9, ob = b.ambito in ORD ? ORD[b.ambito] : 9;
    return oa - ob || String(b.fecha).localeCompare(String(a.fecha));
  });
  /* Como máximo 1 noticia estudiantil */
  var nEst = 0;
  news = news.filter(function (n) { if (n.ambito === 'estudiantes') { nEst++; return nEst <= 1; } return true; }).slice(0, 4);
  if ($('#agendaNoticias')) {
    var meta = function (n) { return '<span class="cat">' + esc(n.categoria) + (n.fecha ? ' · <time datetime="' + esc(n.fecha) + '">' + fFecha(n.fecha) + '</time>' : '') + '</span>'; };
    var linkAttrs = function (n) { return n.enlace ? ' href="' + esc(n.enlace) + '" target="_blank" rel="noopener"' : ''; };
    var first = news[0], rest = news.slice(1);
    put('#agendaNoticias',
      '<h3 class="agenda__sub">Noticias</h3>' +
      (first ? '<' + (first.enlace ? 'a' : 'article') + ' class="nw nw--main"' + linkAttrs(first) + '>' +
        (first.foto ? '<img src="' + esc(first.foto) + '" alt="" loading="lazy" width="1200" height="750">' : '') +
        '<div class="nw__body">' + meta(first) + '<h4>' + esc(first.titulo) + '</h4>' + (first.resumen ? '<p>' + esc(first.resumen) + '</p>' : '') + '</div></' + (first.enlace ? 'a' : 'article') + '>' : '') +
      (rest.length ? '<ul class="nw__list">' + rest.map(function (n) {
        var tag = n.enlace ? 'a' : 'div';
        return '<li><' + tag + ' class="nw__row"' + linkAttrs(n) + '>' + meta(n) + '<b>' + esc(n.titulo) + '</b></' + tag + '></li>';
      }).join('') + '</ul>' : '') +
      (C.noticiasMasEnlace ? '<a class="more agenda__more" href="' + esc(C.noticiasMasEnlace) + '" target="_blank" rel="noopener">Ver todas las noticias ' + ic('arrow') + '</a>' : ''));
  }
  /* 11. Testimonios */
  var TE = C.testimonios;
  var reales = TE ? vis(TE.lista).filter(function (t) { return t.real === true && String(t.nombre || '').trim() && String(t.texto || '').trim(); }) : [];
  /* Modo ejemplo (solo para el boceto): muestra los testimonios de ejemplo con nombre genérico y etiqueta "Ejemplo" */
  var modoEj = !!(TE && TE.modoEjemplo) && reales.length < 2;
  if (modoEj) {
    reales = vis(TE.lista).filter(function (t) { return String(t.texto || '').trim(); }).map(function (t) {
      return t.real === true ? t : { ejemplo: true, nombre: 'Nombre del egresado', programa: t.programa, anio: t.anio, cargo: t.cargo, empresa: t.empresa, texto: t.texto };
    });
    if (window.console) console.warn('Testimonios en MODO EJEMPLO: poner testimonios.modoEjemplo = false antes de publicar.');
    document.body.insertAdjacentHTML('afterbegin', '<div class="demo-bar" role="status">MODO EJEMPLO: hay testimonios de muestra visibles</div>');
  }
  var secTesti = $('#testimonios'), secEgr = $('#egresados');
  if (secTesti && reales.length >= 2) {
    secTesti.hidden = false;
    var iniciales = function (n) { var w = String(n).trim().split(/\s+/); return ((w[0] || '')[0] || '') + ((w[1] || '')[0] || ''); };

    /* ORDEN: 1) destacados, 2) más recientes (anio), 3) intercalando programas */
    var grupoProg = function (t) { var p = String(t.programa || '').toLowerCase(); return /doctor/.test(p) ? 'doc' : /maestr/.test(p) ? 'mae' : /diplom/.test(p) ? 'dip' : 'otro'; };
    var porFecha = function (a, b) { return (parseInt(b.anio, 10) || 0) - (parseInt(a.anio, 10) || 0); };
    var intercalar = function (arr) {   /* reparte por programa: doc, mae, dip, doc, mae… */
      var g = {}, orden = ['doc', 'mae', 'dip', 'otro'], out = [];
      arr.forEach(function (t) { (g[grupoProg(t)] = g[grupoProg(t)] || []).push(t); });
      var quedan = true;
      while (quedan) { quedan = false; orden.forEach(function (k) { if (g[k] && g[k].length) { out.push(g[k].shift()); quedan = true; } }); }
      return out;
    };
    var dest = reales.filter(function (t) { return t.destacado === true; }).sort(porFecha);
    var resto = intercalar(reales.filter(function (t) { return t.destacado !== true; }).sort(porFecha));
    var maxT = +TE.maximo > 0 ? +TE.maximo : 9;
    reales = dest.concat(resto).slice(0, maxT);

    put('#testiGrid', reales.map(function (t) {
      var av = t.foto ? '<img class="avatar avatar--sm avatar--img" src="' + esc(t.foto) + '" alt="">' : '<span class="avatar avatar--sm">' + (t.ejemplo ? ic('user') : esc(iniciales(t.nombre))) + '</span>';
      var cargo = [t.cargo, t.empresa].filter(Boolean).join(' · ');
      var prog = [t.programa, t.anio].filter(Boolean).join(' ');
      return '<figure class="quote' + (t.ejemplo ? ' quote--ej' : '') + '">' + (t.ejemplo ? '<span class="quote__ej">Ejemplo</span>' : '') + '<blockquote>' + esc(t.texto) + '</blockquote><figcaption>' + av +
        '<div><b>' + esc(t.nombre) + '</b>' + (cargo ? '<span>' + esc(cargo) + '</span>' : '') + (prog ? '<em class="quote__prog">' + esc(prog) + '</em>' : '') + '</div>' +
        (t.linkedin ? '<a class="quote__in" href="' + esc(t.linkedin) + '" target="_blank" rel="noopener" aria-label="LinkedIn de ' + esc(t.nombre) + '">' + ic('in') + '</a>' : '') +
        '</figcaption></figure>';
    }).join(''));
    /* 2 o 3: cuadrícula fija. Más de 3: carrusel con flechas (3 visibles a la vez). */
    var grid = $('#testiGrid'), nav = $('.testi__nav'), carrusel = reales.length > 3;
    grid.classList.toggle('quotes--2', reales.length === 2);
    grid.classList.toggle('quotes--track', carrusel);
    if (nav) {
      nav.hidden = !carrusel;
      nav.querySelectorAll('.fac__btn').forEach(function (b) {
        b.addEventListener('click', function () {
          var card = grid.querySelector('.quote'); var step = card ? card.getBoundingClientRect().width + 20 : 320;
          var calma = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          grid.scrollBy({ left: step * +b.dataset.dir, behavior: calma ? 'auto' : 'smooth' });
        });
      });
      var upd = function () {   /* desactiva la flecha en los extremos */
        var b = nav.querySelectorAll('.fac__btn');
        b[0].disabled = grid.scrollLeft <= 2;
        b[1].disabled = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2;
      };
      grid.addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
      setTimeout(upd, 50);
    }
  } else {
    if (secTesti) { secTesti.hidden = true; if (window.console) console.info('Testimonios ocultos: se necesitan al menos 2 testimonios reales.'); }
    /* Alternativa: "Nuestros egresados investigan" con tesis reales del repositorio */
    var EI = C.egresadosInvestigan, tes = vis((C.investigacion || {}).tesisRecientes);
    if (secEgr && EI && EI.visible && tes.length) {
      secEgr.hidden = false;
      put('#egresadosTitulo', esc(EI.titulo || 'Nuestros egresados investigan'));
      put('#egresadosGrid', tes.slice(0, 3).map(function (t) {
        return '<article class="alumnus"><span class="alumnus__k">' + ic('book') + 'Tesis de maestría</span>' +
          '<h3>' + esc(t.titulo) + '</h3><p><b>' + esc(t.autor) + '</b>' + (t.anio ? ' <span>· ' + esc(t.anio) + '</span>' : '') + '</p>' +
          (t.enlace ? '<a class="more" href="' + esc(t.enlace) + '" target="_blank" rel="noopener">Leer tesis ' + ic('arrow') + '</a>' : '') + '</article>';
      }).join(''));
    }
  }
  /* Nada apunta a #testimonios si está oculta */
  if (secTesti && secTesti.hidden) document.querySelectorAll('a[href$="#testimonios"]').forEach(function (a) { a.setAttribute('href', secEgr && !secEgr.hidden ? '#egresados' : '#agenda'); });

  /* 12. Preguntas frecuentes */
  /* Preguntas en dos columnas, agrupables por tema (filtros solo si hay más de 4) */
  var faqs = vis(C.faq), TEMAS = { admision: 'Admisión', programas: 'Programas', inversion: 'Inversión' };
  /* {modalidades}: se arma con datos → "Modalidad" de cada programa */
  var modTxt = (window.PROGRAMAS || []).filter(function (p) { return !p.borrador; }).map(function (p) {
    var m = (p.datos || []).filter(function (d) { return /modalidad/i.test(d[0]); })[0];
    var nom = p.tipo === 'diplomado' ? 'Diplomado en ' + String(p.etiqueta || p.corto).replace(/^Diplomado en /, '') : window.TIPOS[p.tipo].singular;
    var val = String(m ? m[1] : '').replace(/\.$/, '');
    return m ? nom + ': ' + val.charAt(0).toLowerCase() + val.slice(1) : '';
  }).filter(Boolean).join('. ') + '.';
  faqs = faqs.map(function (f) { return (f.respuesta || '').indexOf('{modalidades}') > -1 ? { tema: f.tema, pregunta: f.pregunta, respuesta: f.respuesta.replace(/\{modalidades\}/g, modTxt) } : f; });
  put('#faqList', faqs.map(function (f) {
    return '<details data-tema="' + esc(f.tema || '') + '"><summary>' + esc(f.pregunta) + ic('chev') + '</summary><p>' + esc(f.respuesta) + '</p></details>';
  }).join(''));
  var temasUsados = Object.keys(TEMAS).filter(function (k) { return faqs.some(function (f) { return f.tema === k; }); });
  var fFiltros = $('#faqFiltros');
  /* Filtros solo con 10 preguntas o más (con menos, se leen de un vistazo) */
  if (fFiltros && faqs.length >= 10 && temasUsados.length > 1) {
    fFiltros.hidden = false;
    fFiltros.innerHTML = '<button class="chip is-on" data-t="" role="tab" aria-selected="true">Todas</button>' +
      temasUsados.map(function (k) { return '<button class="chip" data-t="' + k + '" role="tab" aria-selected="false">' + TEMAS[k] + '</button>'; }).join('');
    fFiltros.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      fFiltros.querySelectorAll('.chip').forEach(function (c) { var on = c === b; c.classList.toggle('is-on', on); c.setAttribute('aria-selected', String(on)); });
      document.querySelectorAll('#faqList details').forEach(function (d) { d.hidden = !!b.dataset.t && d.dataset.tema !== b.dataset.t; });
    });
  }
  /* Una sola pregunta abierta a la vez */
  document.querySelectorAll('#faqList details').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) document.querySelectorAll('#faqList details[open]').forEach(function (o) { if (o !== d) o.open = false; }); });
  });
  /* Cierre de la sección */
  var FC = C.faqCierre;
  if (FC) put('#faqCierre',
    '<p class="faq__help-t"><b>' + esc(FC.titulo) + '</b> ' + esc(FC.texto || '') + '</p>' +
    '<div class="faq__help-btns"><a class="btn btn--primary btn--sm" href="' + wa('Hola, quisiera hablar con un asesor académico de posgrado FIP-UNI') + '" target="_blank" rel="noopener">' + ic('wa') + ' WhatsApp</a>' +
    '<a class="more" href="#solicitar" data-modal-form>Solicita información ' + ic('arrow') + '</a></div>');

  /* JSON-LD FAQPage (SEO) con las preguntas visibles, en texto plano */
  if (faqs.length && $('#faqList')) {
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqs.map(function (f) { return { '@type': 'Question', name: String(f.pregunta), acceptedAnswer: { '@type': 'Answer', text: String(f.respuesta) } }; })
    }).replace(/</g, '\\u003c');
    document.head.appendChild(ld);
  }

  /* Modal del formulario #solicitar (se mueve el mismo nodo, sin duplicar ids).
     Se abre con cualquier [data-modal-form] y, en celular (≤640px), con cualquier
     enlace a #solicitar, porque allí el formulario no se muestra en la portada. */
  var formNode = $('#solicitar');
  if (formNode && typeof HTMLDialogElement === 'function') {
    var dlg = document.createElement('dialog');
    dlg.className = 'form-dialog';
    dlg.setAttribute('aria-label', 'Solicita información');
    dlg.innerHTML = '<button type="button" class="form-dialog__x" aria-label="Cerrar">' + ic('x') + '</button>';
    document.body.appendChild(dlg);
    var marker = document.createComment('lugar del formulario');
    formNode.parentNode.insertBefore(marker, formNode);
    var devolver = function () { if (marker.parentNode) marker.parentNode.insertBefore(formNode, marker); };
    var origen = null, mqMovil = window.matchMedia('(max-width:640px)');
    var abrirForm = function (desde) {
      origen = desde || null;
      dlg.appendChild(formNode);
      if (!dlg.open) dlg.showModal();
      var first = formNode.querySelector('input:not([type=radio]), select'); if (first) first.focus();
    };
    /* Se escucha en document (fase de burbuja): primero corren los handlers que
       preseleccionan programa o tipo, y luego se abre el modal */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || dlg.contains(a)) return;
      var href = a.getAttribute('href') || '';
      var esForm = a.hasAttribute('data-modal-form') || (mqMovil.matches && /(^|index\.html)#solicitar$/.test(href) && document.querySelector('.hero'));
      if (!esForm) return;
      e.preventDefault();
      abrirForm(a);
    });
    dlg.querySelector('.form-dialog__x').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });   /* clic fuera */
    dlg.addEventListener('close', function () { devolver(); if (origen) origen.focus(); });   /* Esc también dispara close */
    /* Llegada desde otra página con #solicitar en celular: abrir el modal */
    if (mqMovil.matches && location.hash === '#solicitar' && document.querySelector('.hero')) setTimeout(function () { abrirForm(null); }, 300);
  }

  /* 13. Contacto, mapa, pie de página y redes (en todas las páginas) */
  /* Visítanos: franja compacta sin mapa (dirección, horario y botones; el resto del contacto va en el pie) */
  if ($('#visitCard')) put('#visitCard',
    '<div class="visit__id"><p class="eyebrow">Visítanos</p><h2 class="sub-h3" id="visitTitulo">Unidad de Posgrado FIP-UNI</h2></div>' +
    '<ul class="visit__list">' +
      '<li>' + ic('pin') + '<span><b>' + esc(K.direccion) + '</b>' + (K.referencia ? esc(K.referencia) : '') + (K.comoLlegar ? ' · ' + esc(K.comoLlegar) : '') + '</span></li>' +
      (K.horario ? '<li>' + ic('clock') + '<span><b>Horario de atención</b>' + esc(K.horario) + '</span></li>' : '') +
    '</ul>' +
    '<div class="visit__btns">' +
      '<a class="btn btn--primary" href="' + esc(K.mapsEnlace || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(K.direccion || '')) + '" target="_blank" rel="noopener">' + ic('pin') + ' Cómo llegar</a>' +
      (K.telefonoLink ? '<a class="btn btn--outline" href="tel:' + esc(K.telefonoLink) + '">' + ic('phone') + ' Llamar</a>' : '') +
    '</div>');
  /* Pie: solo teléfono, WhatsApp (todos los números en una línea) y correo.
     La dirección y el horario ya están en "Visítanos". */
  var waNums = (K.whatsapps && K.whatsapps.length) ? K.whatsapps : [{ numero: K.whatsapp, texto: K.whatsappTexto }];
  put('#footerContacto',
    (K.telefono ? '<li>' + ic('phone') + '<a href="tel:' + esc(K.telefonoLink) + '">' + esc(K.telefono) + '</a></li>' : '') +
    '<li>' + ic('wa') + '<span>' + waNums.filter(function (w) { return w.numero; }).map(function (w) {
      return '<a href="https://wa.me/' + esc(String(w.numero).replace(/\D/g, '')) + '" target="_blank" rel="noopener" aria-label="WhatsApp ' + esc(w.texto || w.numero) + '">' + esc(String(w.texto || w.numero).replace(/^\+51\s*/, '')) + '</a>';
    }).join(' · ') + '</span></li>' +
    (K.correo ? '<li>' + ic('mail') + '<a href="mailto:' + esc(K.correo) + '">' + esc(K.correo) + '</a></li>' : ''));
  var redIc = { facebook: 'fb', instagram: 'ig', youtube: 'yt', x: 'xx', twitter: 'xx', linkedin: 'in' };
  var redesOk = vis(C.redes).filter(function (r) { return r.url; });
  var fr = $('#footerRedes');
  if (fr) {
    fr.innerHTML = redesOk.map(function (r) { return '<a href="' + esc(r.url) + '" target="_blank" rel="noopener" aria-label="' + esc(r.red) + '">' + ic(redIc[r.red] || 'globe') + '</a>'; }).join('');
    if (C.redesTitulo && redesOk.length) fr.insertAdjacentHTML('beforebegin', '<p class="social__t">' + esc(C.redesTitulo) + '</p>');
  }
  /* Datos estructurados para Google: la Unidad (CollegeOrUniversity) y cada programa (Course).
     En programa.html solo se describe el programa abierto. */
  (function () {
    var base = String(C.sitioUrl || '').replace(/\/?$/, '/');
    if (!base || base === '/') return;
    var unidad = {
      '@type': 'CollegeOrUniversity',
      name: 'Unidad de Posgrado de la Facultad de Ingeniería de Petróleo, Gas Natural y Petroquímica (FIP-UNI)',
      url: base, logo: base + 'assets/logo-uni.png', email: K.correo || undefined, telephone: K.telefonoLink || undefined,
      address: { '@type': 'PostalAddress', streetAddress: K.direccion || undefined, addressLocality: 'Lima', addressCountry: 'PE' },
      parentOrganization: { '@type': 'CollegeOrUniversity', name: 'Universidad Nacional de Ingeniería', url: 'https://www.uni.edu.pe/' },
      sameAs: vis(C.redes).filter(function (r) { return r.url; }).map(function (r) { return r.url; })
    };
    var idAbierto = $('#pMain') ? new URLSearchParams(location.search).get('id') : null;
    var cursos = vis(window.PROGRAMAS || []).filter(function (p) { return !p.borrador && (!idAbierto || p.id === idAbierto); }).map(function (p) {
      var mod = (p.datos || []).filter(function (d) { return /modalidad/i.test(d[0]); })[0];
      return { '@type': 'Course', name: p.nombre, description: p.resumen || p.nombre, url: base + 'programa.html?id=' + p.id,
        provider: { '@type': 'CollegeOrUniversity', name: unidad.name, url: base },
        hasCourseInstance: mod ? { '@type': 'CourseInstance', courseMode: String(mod[1]) } : undefined };
    });
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [unidad].concat(cursos) }).replace(/</g, '\\u003c');
    document.head.appendChild(s);
  })();  /* Comunidad estudiantil (SPE) en una línea discreta */
  var spe = $('#footerSPE'); if (spe) spe.hidden = C.mostrarSPE === false;
  document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = wa(a.getAttribute('data-wa')); });
  document.querySelectorAll('[data-tel]').forEach(function (a) { a.href = 'tel:' + K.telefonoLink; a.textContent = K.telefono; });
  document.querySelectorAll('[data-mail]').forEach(function (a) { a.href = 'mailto:' + K.correo; a.textContent = K.correo; });
})();
