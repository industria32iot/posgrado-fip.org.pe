/* =====================================================================
   CONTENIDO EDITABLE DEL SITIO · Posgrado FIP-UNI
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que marketing necesita editar (junto con
   programas.js para los programas). El diseño se actualiza solo.

   REGLAS SIMPLES
   • Cambie solo el texto que está entre comillas "...".
   • No borre las comas ni las llaves { } [ ].
   • Para agregar un elemento (noticia, docente, etc.), copie un bloque
     { ... } completo, péguelo debajo y sepárelo con una coma.
   • Para ocultar un elemento sin borrarlo, ponga  visible: false
   • Fotos: guárdelas en public/assets/ (o la subcarpeta indicada) y escriba
     la ruta sin "public/", ej. "assets/portada.jpg".
     Medidas recomendadas en cada sección (formato .jpg, < 300 KB).
   • Fechas: formato "AAAA-MM-DD" (ej. "2027-03-26").
   ===================================================================== */
export const CONTENIDO = {

  /* -------------------------------------------------------------------
     1. INICIO (portada)
     Foto: assets/portada.jpg · 1920 × 1080 px · horizontal
     ------------------------------------------------------------------- */
  inicio: {
    etiqueta: "Unidad de Posgrado UNI",
    titulo: "Doctorado, Maestría",
    tituloDestacado: "y Diplomado",          // va en dorado y cursiva
    subtitulo: "Formación avanzada para líderes del sector energético.",
    foto: "assets/portada.jpg",
    pilares: [
      { icono: "shield", titulo: "Respaldo UNI", texto: "Prestigio y excelencia académica desde 1876" },
      { icono: "user",   titulo: "Docentes", texto: "Expertos con experiencia académica e investigativa" },
      { icono: "cap",    titulo: "Formación especializada", texto: "Programas actualizados con enfoque práctico" }
    ]
  },

  /* -------------------------------------------------------------------
     2. CIFRAS (franja verde)
     referencial: true = cifra sin confirmar: NO se muestra.
     numero: solo dígitos · prefijo/sufijo opcionales ("+", "%")
     Íconos disponibles: bank, award, users, user, flask, globe, cap, book
     ------------------------------------------------------------------- */
  cifras: [
    { icono: "bank",  numero: 150, texto: "Años de la UNI" },
    { icono: "award", numero: 80,  texto: "Años de Ingeniería de Petróleo" },
    /* auto: el número se calcula solo (no escribir "numero"):
       "programas"    = programas visibles de programas.js
       "totalTesis"   = investigacion.totalTesis
       "laboratorios" = laboratorios visibles de investigacion.laboratorios */
    { icono: "cap",   auto: "programas",    texto: "Programas de posgrado" },
    { icono: "book",  auto: "totalTesis",   texto: "Tesis de maestría" },
    { icono: "flask", auto: "laboratorios", texto: "Laboratorios especializados" },
    // CONFIRMAR con la Unidad de Posgrado (la web actual dice 120+ docentes).
    { icono: "users", numero: 2500, prefijo: "+", texto: "Profesionales formados", referencial: true },
    // CONFIRMAR con la Unidad de Posgrado (la web actual dice 120+ docentes).
    { icono: "user",  numero: 20,   sufijo: "+",  texto: "Docentes especializados", referencial: true }
  ],

  /* -------------------------------------------------------------------
     3. CALENDARIO DE ADMISIÓN
     ------------------------------------------------------------------- */
  calendario: {
    etiqueta: "Admisión 2027-I",
    titulo: "Calendario de admisión",
    alcance: "Doctorado y Maestría",
    estadoInscripcion: "Abre en enero",   // etiqueta dorada sobre el paso 1. Ej.: "Inscripciones abiertas". "" = se oculta   // a qué programas aplican estas fechas
    descripcion: "Dos convocatorias al año: semestre I (inscripciones hasta fines de marzo) y semestre II (inscripciones hasta fines de agosto).",
    pasos: [
      { titulo: "Inscripción", fecha: "Enero – marzo 2027", detalle: "Registro y documentos", texto: "Registro en la Escuela Central de Posgrado y entrega de documentos." },
      { titulo: "Evaluación", fecha: "29 mar – 2 abr", detalle: "Expediente y entrevista", texto: "Revisión del expediente académico y entrevista personal." },
      { titulo: "Resultados", fecha: "6 abr", detalle: "Lista de ingresantes", texto: "Publicación de la lista de ingresantes." },
      { titulo: "Inicio de clases", fecha: "Abril 2027", detalle: "Matrícula en línea", texto: "Matrícula en línea e inicio del semestre académico." }
    ],
    nota: "Fechas referenciales · sujetas a la convocatoria oficial."
  },

  /* -------------------------------------------------------------------
     4. ESCUELA DE LÍDERES (formación ejecutiva)
     estado: texto de la etiqueta dorada (ej. "Próxima convocatoria", "Inscripciones abiertas")
     ------------------------------------------------------------------- */
  /* PRÓXIMAMENTE (banner de Escuela de Líderes y Cursos)
     fecha:           texto junto a "Próximamente" (ej. "Previsto para 2027-II"). "" = no se muestra
     formularioAviso: URL de Google Forms o CRM para la lista de espera.
                      "" = el correo se envía por WhatsApp */
  proximamente: {
    fecha: "",            // CONFIRMAR
    formularioAviso: ""   // CONFIRMAR
  },  escuelaLideres: {
    titulo: "Escuela de Líderes",
    texto: "Desarrolla habilidades directivas para liderar equipos y proyectos de alto impacto en la industria energética.",
    temas: ["Liderazgo efectivo", "Gestión estratégica", "Innovación y mejora", "Toma de decisiones"],
    estado: "Próxima convocatoria",
    boton: "Avísame cuando abra"
  },

  /* -------------------------------------------------------------------
     5. CURSOS ESPECIALIZADOS (formación técnica)
     Foto: assets/cursos/ · 800 × 450 px
     ------------------------------------------------------------------- */
  cursos: {
    titulo: "Cursos especializados",
    texto: "Actualización técnica en áreas clave de la industria energética. Modalidad flexible · Certificación UNI.",
    lista: [
      { nombre: "Petróleo y gas natural",     foto: "assets/curso-petroleo.jpg" },
      { nombre: "Refinación y petroquímica",  foto: "assets/curso-refinacion.jpg" },
      { nombre: "Seguridad y medio ambiente", foto: "assets/curso-ambiente.jpg" },
      { nombre: "Gestión energética",         foto: "assets/curso-gestion.jpg" }
    ]
  },

  /* -------------------------------------------------------------------
     6a. ¿POR QUÉ ESTUDIAR EN POSGRADO FIP-UNI? (5 tarjetas)
     enlace: a qué sección lleva (#investigacion, #docentes, #trayectoria,
             #laboratorios, #convenios, #programas, #charla...)
     ------------------------------------------------------------------- */
  porQue: {
    titulo: "Formación especializada para líderes del sector energético",
    tarjetas: [
      { icono: "flask",   titulo: "Investigación y convenios", texto: "6 líneas de investigación y convenios con University of Alberta, Oklahoma y Texas A&M.", enlaceTexto: "Ver investigación", enlace: "#investigacion" },
      { icono: "user",    titulo: "Docentes con experiencia industrial", texto: "Exministro de Energía, líderes de Petroperú y profesores de universidades de EE. UU.", enlaceTexto: "Conoce a los docentes", enlace: "#docentes" },
      { icono: "book",    titulo: "Producción académica", texto: "{totalTesis} tesis de maestría publicadas en el Repositorio UNI desde 2010.", enlaceTexto: "Ver tesis", enlace: "#invResultados" },
      { icono: "factory", titulo: "Infraestructura especializada", texto: "Laboratorios de núcleos, fluidos de perforación, PVT y análisis de derivados.", enlaceTexto: "Nuestros laboratorios", enlace: "#laboratorios" }
    ]
  },

  /* -------------------------------------------------------------------
     6b. TRAYECTORIA (línea de tiempo en "¿Por qué estudiar?")
     destacado: true = se pinta en dorado
     ------------------------------------------------------------------- */
  trayectoria: [
    { anio: "1876", texto: "Fundación de la Escuela de Ingenieros, hoy UNI." },
    { anio: "1946", texto: "Se crea la especialidad de Ingeniería de Petróleo (Ley N.º 10410)." },
    { anio: "1950", texto: "Se inaugura el núcleo central de la infraestructura de la Facultad." },
    { anio: "1972", texto: "Egresa la primera promoción de Ingenieros Petroquímicos." },
    { anio: "1983", texto: "Con la Ley Universitaria N.º 23733 nace la Facultad de Ingeniería de Petróleo." },
    { anio: "2010", texto: "Se publica la primera tesis de maestría del Posgrado FIP en el Repositorio UNI." },   // VERIFICAR con la Unidad de Posgrado (año de creación o primeros graduados)
    { anio: "2026", texto: "80 años formando a los ingenieros que mueven la energía del Perú.", destacado: true }
  ],

  /* -------------------------------------------------------------------
     7. DOCENTES
     Foto: assets/docentes/  · 400 × 400 px · cuadrada, fondo neutro
     Si no hay foto, deje  foto: ""  y se mostrarán las iniciales.
     sellos: 1 o 2 instituciones clave (se muestran como etiquetas).
     ------------------------------------------------------------------- */
  docentes: [
    { nombre: "Dr. Eleodoro Mayorga Alba", sellos: ["Banco Mundial", "MINEM"], cargo: "Exministro de Energía y Minas del Perú", resumen: "Doctor en Matemáticas Aplicadas a la Economía (Universidad de París X). Execonomista petrolero principal del Banco Mundial.", foto: "" },
    { nombre: "Dr. Miguel J. Bagajewicz", sellos: ["Caltech", "U. de Oklahoma"], cargo: "Profesor emérito, University of Oklahoma", resumen: "Ph.D. en Ingeniería Química (Caltech). Más de 280 publicaciones en ingeniería de procesos e integración energética.", foto: "" },
    { nombre: "Dr. Alfredo Friedlander", sellos: ["IFP", "Repsol YPF"], cargo: "Director ejecutivo, Instituto Petroquímico Argentino", resumen: "Doctor en Química (Universidad de Buenos Aires y Universidad de París). Trayectoria en IFP, Repsol YPF y PGM.", foto: "" },
    { nombre: "Dr. Jorge Seminario", sellos: ["Southern Illinois U.", "UNI"], cargo: "Profesor Lanatter y Herbert Fox", resumen: "Doctor y Máster en Ciencias (Southern Illinois University). Ingeniero UNI. Investigación en nanomateriales y captura de CO₂.", foto: "" },
    { nombre: "MSc. Miguel Ángel Pérez Navarro", sellos: ["Petroperú", "Refinería Talara"], cargo: "Petroperú · Refinación y Ductos", resumen: "Lideró la Gerencia General y el Proyecto de Modernización de la Refinería Talara. Magíster en Gestión de la Energía (ESAN).", foto: "" },
    { nombre: "MSc. Emilio Porras Sosa", sellos: ["UNI", "La Pampilla"], cargo: "Docente investigador, jefe de proyecto (UNI)", resumen: "Maestro en Ciencias e Ingeniero Químico (UNI). Experiencia en Refinería La Pampilla y Petroperú.", foto: "" },
    { nombre: "Dr. Carlos Raúl Sebastián Calvo", sellos: ["IPEN", "Petrobras"], cargo: "Exdirector ejecutivo, IPEN", resumen: "Doctor en Educación e Ingeniero Petroquímico (UNI). Experiencia en Petrobras y la Agencia Internacional de Energía Atómica.", foto: "" }
  ],

  /* -------------------------------------------------------------------
     8. INVESTIGACIÓN
     Foto: assets/investigacion.jpg
       · fotoFormato "vertical"   → proporción 4:5, mínimo 1000 × 1250 px
       · fotoFormato "horizontal" → proporción 4:3, mínimo 1200 × 900 px
     Reemplazar por foto propia de un laboratorio FIP (núcleos, PVT,
     fluidos de perforación).
     ------------------------------------------------------------------- */
  investigacion: {
    titulo: "Líneas de investigación para la transición energética",

    /* TOTAL DE TESIS: única fuente del número. Se usa en el subtítulo, en la tarjeta
       "Producción académica" (¿Por qué estudiar?) y en Resultados de investigación,
       mediante el marcador {totalTesis}. No escribir el número a mano en los textos. */
    totalTesis: 32,   // Fuente: Repositorio UNI. Actualizar cada semestre.
    fechaConsultaRepositorio: "2026-11-05",   // fecha de la última consulta al repositorio (AAAA-MM-DD)

    texto: "{totalTesis} tesis de maestría respaldan nuestras seis líneas de investigación.",
    foto: "assets/investigacion.jpg",
    fotoFormato: "horizontal",   // "vertical" (4:5, foto mín. 1000 × 1250 px) u "horizontal" (4:3, mín. 1200 × 900 px)
    fotoAlt: "Material de laboratorio para análisis de muestras",
    /* fotoPersonas: foto de investigadores o estudiantes en el laboratorio (16:9, mín. 1600 × 900 px),
       se muestra a todo el ancho entre las líneas y los convenios. "" = no se muestra */
    fotoPersonas: "",   // CONFIRMAR: foto propia
    fotoPersonasAlt: "",   // describir lo que se ve en la foto (accesibilidad y Google)

    /* LÍNEAS DE INVESTIGACIÓN
       Cada línea puede ser un texto simple ("Exploración y geología") o un objeto:
         nombre: texto de la línea
         tesis:  número de tesis de maestría relacionadas (null = no se muestra la etiqueta)
         enlace: búsqueda en el Repositorio UNI ("" = la línea no es enlace)
       Números: tesis de maestría de la Unidad de Posgrado FIP clasificadas por título,
       consulta del 08/11/2026. Actualizar cada semestre. */
    minimoTesisVisible: 2,   // por debajo de este número se muestra solo "Ver tesis" (sin el número)
    // Las tesis de las 6 líneas deben sumar totalTesis (hoy 32).
    // Faltan clasificar 3 tesis: CONFIRMAR con la Unidad de Posgrado.
    lineas: [
      { nombre: "Exploración y geología", tesis: 1, enlace: "https://repositorio.uni.edu.pe/search?query=%22Facultad%20de%20Ingenier%C3%ADa%20de%20Petr%C3%B3leo%2C%20Gas%20Natural%20y%20Petroqu%C3%ADmica.%20Unidad%20de%20Posgrado%22%20AND%20dc.title%3A(lutitas%20OR%20shale%20OR%20geolog%C3%ADa%20OR%20exploraci%C3%B3n)" },
      { nombre: "Producción y completación de pozos", tesis: 4, enlace: "https://repositorio.uni.edu.pe/search?query=%22Facultad%20de%20Ingenier%C3%ADa%20de%20Petr%C3%B3leo%2C%20Gas%20Natural%20y%20Petroqu%C3%ADmica.%20Unidad%20de%20Posgrado%22%20AND%20dc.title%3A(estimulaciones%20OR%20fracturamiento%20OR%20completaci%C3%B3n%20OR%20maduros)" },
      { nombre: "Ingeniería y gestión de reservorios", tesis: 4, enlace: "https://repositorio.uni.edu.pe/search?query=%22Facultad%20de%20Ingenier%C3%ADa%20de%20Petr%C3%B3leo%2C%20Gas%20Natural%20y%20Petroqu%C3%ADmica.%20Unidad%20de%20Posgrado%22%20AND%20dc.title%3A(reservorios%20OR%20yacimientos%20OR%20%22simulaci%C3%B3n%20num%C3%A9rica%22)%20-dc.title%3A(completaci%C3%B3n%20OR%20fr%C3%ADo%20OR%20estimulaciones)" },
      { nombre: "Recuperación mejorada de reservorios", tesis: 3, enlace: "https://repositorio.uni.edu.pe/search?query=%22Facultad%20de%20Ingenier%C3%ADa%20de%20Petr%C3%B3leo%2C%20Gas%20Natural%20y%20Petroqu%C3%ADmica.%20Unidad%20de%20Posgrado%22%20AND%20dc.title%3A(recobro%20OR%20fr%C3%ADo%20OR%20%22gel%20polim%C3%A9rico%22)" },
      { nombre: "Refinación de petróleo y combustibles renovables", tesis: 5, enlace: "https://repositorio.uni.edu.pe/search?query=%22Facultad%20de%20Ingenier%C3%ADa%20de%20Petr%C3%B3leo%2C%20Gas%20Natural%20y%20Petroqu%C3%ADmica.%20Unidad%20de%20Posgrado%22%20AND%20dc.title%3A(refiner%C3%ADas%20OR%20pir%C3%B3lisis%20OR%20catalizadores%20OR%20petroqu%C3%ADmica%20OR%20ZinCo)" },
      { nombre: "Procesamiento y masificación del gas natural", tesis: 12, enlace: "https://repositorio.uni.edu.pe/search?query=%22Facultad%20de%20Ingenier%C3%ADa%20de%20Petr%C3%B3leo%2C%20Gas%20Natural%20y%20Petroqu%C3%ADmica.%20Unidad%20de%20Posgrado%22%20AND%20dc.title%3A(%22gas%20natural%22%20OR%20GNL%20OR%20GNV%20OR%20%22co2%22)%20-dc.title%3A(veh%C3%ADculos%20OR%20petroqu%C3%ADmica%20OR%20prefactibilidad)" }
    ],

    /* CONVENIOS
       Dos grupos: nacionales e internacionales. Un grupo vacío no se muestra.
       Cada convenio:
         nombre:     nombre corto (para que quepa en una línea)
         pais:       país de la institución
         detalle:    qué incluye el convenio, en una línea
         confirmado: false = el detalle NO se muestra. Poner true solo cuando la
                     Unidad de Posgrado valide el detalle.
         logo:       ruta del logo (assets/convenios/…, PNG transparente, alto 60 px) o "" */
    convenios: {
      // Agregar solo convenios vigentes y firmados (ver lista oficial de la Unidad de Posgrado)
      nacionales: [],
      internacionales: [
        { nombre: "U. of Alberta", pais: "Canadá", detalle: "", confirmado: false, logo: "" },    // CONFIRMAR qué incluye
        { nombre: "U. of Oklahoma", pais: "EE. UU.", detalle: "", confirmado: false, logo: "" },  // CONFIRMAR qué incluye
        { nombre: "Texas A&M", pais: "EE. UU.", detalle: "", confirmado: false, logo: "" }        // CONFIRMAR qué incluye
      ]
    },

    /* CAMPO ESCUELA (opcional). Reemplaza la foto genérica de laboratorio.
       visible: false = se muestra la foto de "foto" (arriba).
       Si la foto del campo escuela no existe o no carga, se muestra la foto de respaldo.
       foto: 1200 × 900 px mínimo, horizontal. */
    campoEscuela: {
      visible: true,
      foto: "assets/lote-ix.jpg",   // FALTA: foto propia del Lote IX
      fotoAlt: "Campo petrolero del Lote IX en Talara",
      titulo: "Lote IX · Talara",
      texto: "Campo petrolero operado por UNIENERGIA ABC S.A.C., empresa de la UNI: un centro de investigación y capacitación en operación real.",   // CONFIRMAR datos con la Facultad
      enlace: ""                    // opcional: página con más información
    },
    /* RESULTADOS DE INVESTIGACIÓN (indicadores)
       Campos:
         numero:      cifra (se ignora si se usa "auto")
         auto:        "totalTesis" | "lineas" | "laboratorios" = el número se calcula solo
                      con totalTesis, con las líneas visibles o con los laboratorios visibles
         texto / detalle / enlaceTexto / enlace: textos y enlace del indicador
         referencial: true = cifra estimada: NO se muestra en el sitio.
       El indicador de tesis se muestra primero y destacado. */
    indicadores: [
      { auto: "totalTesis", prefijo: "", sufijo: "", texto: "Tesis de maestría publicadas", detalle: "Repositorio Institucional UNI", enlaceTexto: "Ver tesis", enlace: "https://repositorio.uni.edu.pe/search?query=%22Facultad%20de%20Ingenier%C3%ADa%20de%20Petr%C3%B3leo%2C%20Gas%20Natural%20y%20Petroqu%C3%ADmica.%20Unidad%20de%20Posgrado%22" },
      { auto: "lineas", prefijo: "", sufijo: "", texto: "Líneas de investigación", detalle: "Alineadas a la transición energética", enlaceTexto: "Ver líneas", enlace: "#investigacion" },
      { auto: "laboratorios", prefijo: "", sufijo: "", texto: "Laboratorios especializados", detalle: "Núcleos, PVT, fluidos de perforación y más", enlaceTexto: "Ver laboratorios", enlace: "#laboratorios" },
      // OCULTO hasta tener el dato oficial de la Unidad de Posgrado. Cambiar a referencial: false.
      { numero: 50, prefijo: "+", sufijo: "", texto: "Graduados de maestría", detalle: "Maestros en Ciencias formados en la FIP", referencial: true },
      // OCULTO hasta tener el dato oficial de la Unidad de Posgrado. Cambiar a referencial: false.
      { numero: 30, prefijo: "+", sufijo: "", texto: "Publicaciones académicas", detalle: "Artículos y ponencias de docentes y egresados", referencial: true }
    ],
    /* TESIS DEL PANEL OSCURO
       tituloTesis: "" = automático: "Tesis recientes" si la más reciente tiene menos de
       12 meses; si no, "Tesis destacadas". Escribir un texto para fijarlo a mano. */
    tituloTesis: "",
    /* Las 3 últimas tesis sustentadas (enlace al repositorio). anio: "AAAA" (opcional fecha: "AAAA-MM-DD") */
    tesisRecientes: [
      { anio: "2024", autor: "José Pablo Marín García", titulo: "Método de inversión genética para mejorar el modelado de reservorios en la cuenca Marañón", enlace: "https://repositorio.uni.edu.pe/handle/20.500.14076/28813" },
      { anio: "2024", autor: "Karen Teresa Uriarte Uriarte", titulo: "Modelo de regalías petroleras y su relación con mayores ingresos para nuevas concesiones de los campos de producción petroleros del Perú", enlace: "https://repositorio.uni.edu.pe/handle/20.500.14076/28814" },
      { anio: "2024", autor: "Javier Francisco Huaytán Ponce", titulo: "Evaluación de la instalación de micro-planta de GNL para el abastecimiento de gas natural en las regiones industriales del Norte del Perú", enlace: "https://repositorio.uni.edu.pe/handle/20.500.14076/28332" }
    ],
    /* LABORATORIOS ESPECIALIZADOS
       labsTexto: texto corto bajo el título "Laboratorios especializados".
       Cada laboratorio:
         icono:   fuel | core | drop | gauge | grid (uno distinto por laboratorio)
         nombre / detalle: nombre y para qué sirve (una línea)
         foto:    assets/labs/<nombre>.jpg · 800 × 600 px · horizontal. "" = se muestra el ícono
         lineas:  números de las líneas de investigación que respalda, ej. [3, 4].
                  Se muestran como etiquetas "Línea 03" que llevan a esa línea. [] = sin etiquetas
         equipos: equipos o software principales. "" = no se muestra (no inventar) */
    labsTexto: "Espacios donde los estudiantes de posgrado desarrollan la parte experimental de su tesis.",   // CONFIRMAR que el posgrado tiene acceso
    laboratorios: [
      { icono: "fuel",  nombre: "Normalización de Petróleo y Derivados", detalle: "Calidad y propiedades de crudos, combustibles y derivados.", foto: "", lineas: [5], equipos: "" },          // CONFIRMAR líneas y equipos
      { icono: "core",  nombre: "Análisis de Núcleos", detalle: "Porosidad y permeabilidad de rocas reservorio.", foto: "", lineas: [1, 3, 4], equipos: "" },                                  // CONFIRMAR líneas y equipos
      { icono: "drop",  nombre: "Fluidos de Perforación", detalle: "Formulación y control de lodos de perforación.", foto: "", lineas: [2], equipos: "" },                                     // CONFIRMAR líneas y equipos
      { icono: "gauge", nombre: "PVT", detalle: "Comportamiento de fluidos del reservorio a presión y temperatura.", foto: "", lineas: [3, 4, 6], equipos: "" },                              // CONFIRMAR líneas y equipos
      { icono: "grid",  nombre: "Computación", detalle: "Simulación de reservorios y procesos.", foto: "", lineas: [3, 4], equipos: "" }                                                        // CONFIRMAR líneas y equipos
    ],
    /* CAMPO ESCUELA EN LABORATORIOS
       visible: true = se muestra como primera tarjeta destacada de Laboratorios.
       Nombre, texto y foto se toman del bloque "campoEscuela" (arriba), para no
       duplicar la información. Mientras esté visible aquí, la foto junto a los
       convenios muestra la foto de laboratorio (sin el texto del campo escuela). */
    campoEscuelaLab: {
      visible: true,
      icono: "field"
    }
  },

  /* -------------------------------------------------------------------
     9–10. AGENDA (charlas a la izquierda + noticias a la derecha)
     ------------------------------------------------------------------- */
  agenda: {
    etiqueta: "Agenda y actualidad",
    titulo: "Lo que viene en el Posgrado FIP-UNI"
  },

  /* -------------------------------------------------------------------
     9. NOTICIAS
     Orden: primero por ámbito (posgrado → facultad → estudiantes) y luego por
     fecha, de la más reciente a la más antigua. Se muestran 4: la primera con foto
     y resumen; las otras 3 en lista compacta.
       ambito:    "posgrado" | "facultad" | "estudiantes" (opcional; sin ámbito va al final)
       foto:      assets/noticias/ · 1200 × 675 px (16:9) · solo la usa la primera
       enlace:    URL de la nota completa o "" (sin enlace, la fila no es clicable)
     noticiasMasEnlace (abajo): enlace a "Ver todas las noticias" o "" para ocultarlo.
     ------------------------------------------------------------------- */
  noticiasMasEnlace: "",   // ej. página de noticias de la Facultad o Facebook
  noticias: [
    { ambito: "facultad", fecha: "2026-11-01", categoria: "Aniversario · 2026", titulo: "80 años de la Ingeniería de Petróleo en la UNI", resumen: "Desde la Ley N.º 10410 de 1946, la especialidad ha formado a generaciones de profesionales que lideran la exploración, producción y refinación de hidrocarburos en el país.", foto: "assets/noticia-refineria.jpg", enlace: "" },
    { ambito: "estudiantes", fecha: "2026-10-20", categoria: "Comunidad estudiantil", titulo: "SPE UNI Student Chapter, media partner del VIII GASPET 2026", resumen: "El capítulo estudiantil de la Society of Petroleum Engineers en la UNI participa en uno de los principales eventos de gas y petróleo del país.", foto: "", enlace: "https://pe.linkedin.com/in/speuni" },
    { ambito: "estudiantes", fecha: "2026-10-10", categoria: "Competencias", titulo: "Inscripciones abiertas para PetroBowl 2027", resumen: "SPE UNI convoca a estudiantes para formar el equipo que competirá en la competencia internacional de conocimientos técnicos de la industria.", foto: "", enlace: "https://pe.linkedin.com/in/speuni" }
  ],

  /* -------------------------------------------------------------------
     10. CHARLAS INFORMATIVAS (Google Meet)
     fecha: "AAAA-MM-DD" · hora: "HH:MM" en 24 h (hora de Lima)
     programa: id del programa en programas.js
     enlaceMeet: pegue el enlace de Meet o deje "" (se envía por correo)
     confirmada: true | false (opcional). false = muestra "Por confirmar"
     Las charlas con fecha pasada se ocultan solas. Se muestran hasta 3.
     formularioInscripcion: URL de un formulario externo (Google Forms, etc.).
       "" = el botón "Reservar mi lugar" lleva al formulario de la portada.
     titulo: "" = automático según los programas de las sesiones
       (ej. "Próximas charlas: diplomados").
     ------------------------------------------------------------------- */
  charlas: {
    titulo: "",   // "" = automático
    texto: "Una sesión gratuita de 45 minutos con el coordinador académico. Sin costo y sin compromiso.",
    temas: ["Plan de estudios y docentes", "Horarios y modalidad virtual síncrona", "Requisitos, inversión y facilidades de pago", "Preguntas en vivo con el asesor"],
    sesiones: [
      { fecha: "2026-11-26", hora: "19:00", duracion: 45, programa: "diplomado-refinacion-petroquimica", enlaceMeet: "", confirmada: false },
      { fecha: "2026-11-28", hora: "10:00", duracion: 45, programa: "diplomado-riesgos-seguridad", enlaceMeet: "", confirmada: false }
    ],
    formularioInscripcion: "",   // "" = formulario de la portada
  },

  /* -------------------------------------------------------------------
     11. TESTIMONIOS
     Solo se publican los testimonios con real: true y nombre. Con menos de 2
     testimonios reales, la sección se oculta y se muestra "Nuestros egresados
     investigan" (abajo).
       real:     true SOLO con testimonio real y autorización firmada
       nombre:   nombre y apellido del egresado
       programa: "Maestría", "Doctorado", "Diplomado en Refinación"…
       anio:     año de egreso (ej. "2023")
       cargo / empresa: cargo actual y empresa
       foto:     assets/testimonios/ · 200 × 200 px · cuadrada ("" = iniciales)
       linkedin: URL del perfil de LinkedIn ("" = no se muestra)
       destacado: true = va siempre primero (usar en 2 o 3 testimonios)
       texto:    la cita (máx. 35 palabras)
     Los 3 textos de abajo son EJEMPLOS (real: false): no se publican.
     ------------------------------------------------------------------- */
  testimonios: {
    /* modoEjemplo: true = muestra los testimonios de ejemplo (real: false) con la
       etiqueta "Ejemplo", solo para presentar el boceto. PONER false ANTES DE PUBLICAR. */
    modoEjemplo: false,
    /* ORDEN automático: 1) destacado: true, 2) más recientes (anio), 3) intercalando
       Doctorado, Maestría y Diplomado. Con más de 3 se muestran en carrusel con flechas. */
    maximo: 9,   // cantidad máxima de testimonios en el carrusel
    lista: [
      { real: false, nombre: "", programa: "Maestría", anio: "", cargo: "Ingeniero de producción", empresa: "Sector upstream", foto: "", linkedin: "", texto: "La maestría me dio las herramientas de ingeniería de reservorios que hoy aplico todos los días en la optimización de la producción de campo." },   // CONFIRMAR
      { real: false, nombre: "", programa: "Diplomado en Refinación", anio: "", cargo: "Ingeniera de procesos", empresa: "Refinería", foto: "", linkedin: "", texto: "Las clases síncronas me permitieron estudiar sin dejar mi trabajo en planta, y las visitas técnicas conectaron la teoría con la operación real." },   // CONFIRMAR
      { real: false, nombre: "", programa: "Doctorado", anio: "", cargo: "Docente investigador", empresa: "Universidad", foto: "", linkedin: "", texto: "El doctorado me permitió publicar en revistas indexadas y formar un grupo de investigación en transición energética." },   // CONFIRMAR
      { real: false, nombre: "", programa: "Diplomado en Riesgos", anio: "", cargo: "Supervisor de seguridad", empresa: "Planta de procesamiento", foto: "", linkedin: "", texto: "Aprendí a evaluar riesgos con métodos cuantitativos y hoy lidero el plan de respuesta a emergencias de mi planta." },   // CONFIRMAR: completar con un egresado real
      { real: false, nombre: "", programa: "Maestría", anio: "", cargo: "Analista de reservorios", empresa: "Operadora petrolera", foto: "", linkedin: "", texto: "La tesis me permitió aplicar simulación de reservorios a un campo real del noroeste y presentar los resultados a la gerencia." }   // CONFIRMAR: completar con un egresado real
    ]
  },

  /* NUESTROS EGRESADOS INVESTIGAN: se muestra en lugar de Testimonios mientras
     haya menos de 2 testimonios reales. Usa las tesis de investigacion.tesisRecientes. */
  egresadosInvestigan: { visible: false, titulo: "Nuestros egresados investigan" },   // oculto: repetía las 3 tesis de "Tesis destacadas"
  /* -------------------------------------------------------------------
     12. PREGUNTAS FRECUENTES
     tema: "admision" | "programas" | "inversion" (para los filtros).
     {modalidades} se reemplaza por la modalidad de cada programa (programas.js → datos → "Modalidad").
     Los filtros por tema solo aparecen cuando hay 10 preguntas o más.
     faqCierre: ayuda breve bajo el título (WhatsApp + Solicita información).
     ------------------------------------------------------------------- */
  faq: [
    { tema: "admision", pregunta: "¿Quiénes pueden postular?", respuesta: "Los profesionales con grado de Bachiller pueden postular a la Maestría y a los Diplomados (en los diplomados también se acepta Título profesional). Para el Doctorado se requiere el grado de Maestro. Los requisitos exactos se detallan en las bases de cada convocatoria." },
    { tema: "admision", pregunta: "¿Cómo es el proceso de admisión?", respuesta: "Te inscribes en la Escuela Central de Posgrado con tu expediente (solicitud, grado académico, certificados, cartas de presentación, DNI, fotografías, declaración jurada y recibo de pago). Luego hay una evaluación de méritos y una entrevista, según las bases de cada convocatoria." },
    { tema: "admision", pregunta: "¿Cuándo son las convocatorias?", respuesta: "El Doctorado y la Maestría tienen dos convocatorias al año (semestre I y semestre II). Los diplomados tienen inscripción directa, sin examen. Revisa las fechas en el Calendario de admisión." },
    { tema: "programas", pregunta: "¿Qué modalidades de estudio ofrecen?", respuesta: "{modalidades}" },
    { tema: "programas", pregunta: "¿Cuánto duran los programas?", respuesta: "Doctorado: 3 años (6 semestres, 64 créditos). Maestría: 2 años (4 ciclos, 48 créditos). Diplomados: entre 384 y 388 horas académicas, según el programa." },
    { tema: "inversion", pregunta: "¿Cuál es la inversión?", respuesta: "Depende del programa. Por ejemplo, el Diplomado en Refinación y Petroquímica cuesta S/ 4,800 al contado o 6 cuotas de S/ 800, más una matrícula de S/ 200. Revisa la ficha de cada programa o pide la información completa por WhatsApp." },
    { tema: "inversion", pregunta: "¿Puedo pagar en cuotas?", respuesta: "En el Diplomado en Refinación y Petroquímica sí: 6 cuotas mensuales de S/ 800. Para el Doctorado se paga por ciclo y por crédito. Consulta las opciones de cada programa con un asesor." }
  ],
  faqCierre: {
    titulo: "¿No encuentras tu respuesta?",
    texto: "Un asesor académico te orienta."
  },
  /* -------------------------------------------------------------------
     13. CONTACTO Y REDES (pie de página, mapa y botones de WhatsApp)
     whatsapp: solo números con código de país (51...)
     ------------------------------------------------------------------- */
  /* sitioUrl: dirección final del sitio (con / al final). Se usa en los datos para Google (SEO). */
  sitioUrl: "https://www.posgrado-fip.org.pe/",   // CONFIRMAR dominio definitivo
  contacto: {
    direccion: "Av. Túpac Amaru N° 210, Rímac, Lima",
    referencia: "Unidad de Posgrado FIP, Pabellón D1",
    horario: "Lunes a viernes · 8:00 a 17:00",
    telefono: "(01) 481-1070 anexo 6005",
    telefonoLink: "+5114811070",
    whatsapp: "51998028384",   // número principal: alimenta todos los botones de WhatsApp
    /* whatsapps: números que se muestran en el pie, cada uno con su enlace */
    whatsapps: [ { numero: "51998028384", texto: "+51 998 028 384" }, { numero: "51985294314", texto: "+51 985 294 314" } ],
    whatsappTexto: "+51 998 028 384 · 985 294 314",
    correo: "posgrado-fip@uni.edu.pe",
    web: "https://www.fip.uni.edu.pe/",
    /* Visítanos: enlace de Google Maps para el botón "Cómo llegar" y una línea de referencia */
    mapsEnlace: "https://www.google.com/maps/search/?api=1&query=Facultad+de+Ingenieria+de+Petroleo+UNI+Av.+Tupac+Amaru+210+Rimac",
    comoLlegar: ""   // CONFIRMAR: indicaciones de acceso (puerta de ingreso, pabellón). "" = no se muestra
  },
  /* redesTitulo: título sobre los íconos. "" = sin título */
  redesTitulo: "",   // con 2–3 íconos no hace falta título
  mostrarSPE: true,   // true = muestra "Comunidad estudiantil: SPE UNI Student Chapter" en el pie
  redes: [
    { red: "facebook",  url: "https://www.facebook.com/UNIoficial.pe" },
    { red: "instagram", url: "" },   // CONFIRMAR URL completa (antes bit.ly). "" = no se muestra
    { red: "youtube",   url: "" },   // CONFIRMAR URL completa (antes bit.ly). "" = no se muestra
    { red: "x",         url: "https://twitter.com/UNIoficial" }
  ]
};
