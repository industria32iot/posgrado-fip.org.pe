/* =========================================================
   CATÁLOGO DE PROGRAMAS · Posgrado FIP-UNI
   ---------------------------------------------------------
   Para AGREGAR un programa: copie un bloque { ... }, cambie el
   "id" (sin espacios ni tildes) y complete los datos.
   El menú, la portada, el formulario, el pie de página y la
   página de detalle (/programa/<id>) se actualizan solos.

   tipo:     "doctorado" | "maestria" | "diplomado"
   orden:    número para ordenar dentro de su tipo (1 = primero)
   estado:   texto de la etiqueta (ej. "Inscripciones abiertas") o null
   borrador: true = aún sin información completa (muestra "Próximamente")
   img: ruta dentro de public/ (ej. "assets/petroleo-gas.jpg" = public/assets/petroleo-gas.jpg)
   ========================================================= */
export const PROGRAMAS = [

  /* ------------------------- DOCTORADO ------------------------- */
  {
    id: "doctorado-petroleo-gas-natural",
    etiqueta: "Doctorado",   // nombre muy corto (enlaces de Admisión)
    requisito: "Grado de Maestro",   // se muestra en la tarjeta
    tipo: "doctorado", orden: 1, estado: null,
    nombre: "Doctorado en Ciencias e Ingeniería de Petróleo y Gas Natural",
    corto: "Ciencias e Ingeniería de Petróleo y Gas Natural",
    img: "assets/petroleo-gas.jpg",
    // CONFIRMAR modalidad: ¿presencial o semipresencial? (la web actual dice presencial)
    facts: ["3 años · 6 semestres", "64 créditos", "Semipresencial"],
    resumen: "Incrementa las capacidades de investigación de profesionales de la ingeniería y carreras afines vinculados a la industria de hidrocarburos. Forma capital humano capaz de generar conocimiento y aplicarlo a las necesidades de energía y valor agregado del país, en el contexto de la sostenibilidad y la transición energética. Cuenta con docentes nacionales e invitados de universidades extranjeras.",
    perfilTitulo: "Perfil del egresado",
    perfil: [
      "Desarrolla y dirige investigación en Ciencias de la Ingeniería con soluciones originales e innovadoras.",
      "Organiza y dirige proyectos de investigación en el ámbito empresarial o académico.",
      "Lidera y fomenta la creación de grupos de investigación."
    ],
    lineas: ["Exploración y geología", "Producción y completación de pozos", "Ingeniería y gestión de reservorios", "Recuperación mejorada de reservorios", "Refinación de petróleo y combustibles renovables", "Procesamiento y masificación del gas natural"],
    plan: [
      { t: "Ciclo I", c: ["Metodología de la investigación I", "Matemática aplicada", "Geología y exploración de petróleo y gas natural", "Refinación de petróleo y combustibles"] },
      { t: "Ciclo II", c: ["Metodología de la investigación II", "Ingeniería y gestión de reservorios", "Tecnología sostenible del gas natural"] },
      { t: "Ciclo III", c: ["Proyecto de investigación I", "Electivos 1, 2 y 3"] },
      { t: "Ciclo IV", c: ["Proyecto de investigación II", "Electivo 4"] },
      { t: "Ciclo V", c: ["Proyecto de investigación III", "Redacción del artículo técnico-científico"] },
      { t: "Ciclo VI", c: ["Proyecto de investigación IV", "Redacción y publicación en revista indexada"] }
    ],
    planNota: "Electivos: Recuperación secundaria y terciaria (EOR) · Nanotecnología en la industria de hidrocarburos · Gestión energética sostenible · Innovación tecnológica y sostenibilidad.",
    requisitos: [
      "Grado académico de Maestro (de investigación o académico).",
      "Admisión inicial: evaluación de méritos y de conocimientos.",
      "Admisión definitiva (al año): aceptación de un asesor y plan de tesis aprobado.",
      "Expediente: solicitud, diploma y certificados de maestría, dos cartas de presentación, DNI, 4 fotografías, declaración jurada y recibo de pago."
    ],
    datos: [["Duración", "3 años · 6 semestres"], ["Créditos", "64"], ["Modalidad", "Semipresencial, clases virtuales síncronas"], ["Grado", "Doctor en Ciencias e Ingeniería de Petróleo y Gas Natural"]],
    inversion: [["Carpeta", "S/ 250"], ["Derecho de admisión", "S/ 875"], ["Matrícula (por ciclo)", "S/ 919"], ["Por crédito", "S/ 532"]],
    inversionNota: null
  },

  /* ------------------------- MAESTRÍAS ------------------------- */
  {
    id: "maestria-petroleo-gas-natural",
    etiqueta: "Maestría",   // nombre muy corto (enlaces de Admisión)
    requisito: "Grado de Bachiller",   // se muestra en la tarjeta
    tipo: "maestria", orden: 1, estado: null,
    nombre: "Maestría en Ciencias con mención en Ingeniería de Petróleo y Gas Natural",
    corto: "Ciencias con mención en Ingeniería de Petróleo y Gas Natural",
    img: "assets/refineria-torres.jpg",
    facts: ["2 años · 4 ciclos", "48 créditos", "Semipresencial"],
    resumen: "Formación de posgrado para profesionales de las diferentes ramas de la ingeniería relacionadas con la industria de hidrocarburos, con conocimientos y habilidades para la investigación que cubren la demanda de especialistas en petróleo y gas natural.",
    perfilTitulo: "Al completar el programa podrás",
    perfil: [
      "Diseñar y dimensionar equipos de producción, procesamiento, transporte y transformación.",
      "Aplicar técnicas de ingeniería desde el reservorio hasta la utilización energética.",
      "Liderar equipos que evalúan y desarrollan proyectos de petróleo y gas natural.",
      "Resolver como investigador los retos de la industria de hidrocarburos."
    ],
    plan: [
      { t: "Ciclo I", c: ["Matemática aplicada", "Estadística y probabilidades aplicada", "Geología de los hidrocarburos", "Ingeniería de equipos y procesos, inspección y mantenimiento"] },
      { t: "Ciclo II", c: ["Economía del petróleo y gas natural", "Ingeniería de reservorios aplicada", "Ingeniería de producción aplicada", "Taller de tesis I"] },
      { t: "Ciclo III", c: ["Proyectos en hidrocarburos", "Tratamiento y procesos de separación y conversión", "Transporte y almacenamiento", "Electivo"] },
      { t: "Ciclo IV", c: ["Seguridad y protección del medio ambiente", "Planeamiento estratégico", "Taller de tesis II", "Electivo"] }
    ],
    planNota: "Electivos: Recuperación mejorada de petróleo · Recuperación terciaria (EOR) · Simulación matemática de reservorios · Innovación y nueva tecnología en hidrocarburos.",
    requisitos: [
      "Grado académico de Bachiller (en ingeniería o carreras afines).",
      "Currículum vitae documentado y certificados de estudios de pregrado.",
      "Dos cartas de presentación de profesores reconocidos.",
      "Solicitud, DNI, 4 fotografías, declaración jurada y recibo de pago por derecho de admisión."
    ],
    convenios: ["University of Alberta, Edmonton (Canadá)", "University of Oklahoma (EE. UU.)", "Texas A&M University (EE. UU.)"],
    datos: [["Duración", "2 años · 4 ciclos de 4 meses"], ["Créditos", "48 (promedio mínimo 14)"], ["Modalidad", "Semipresencial"], ["Grado", "Maestro en Ciencias con mención en Ingeniería de Petróleo y Gas Natural"]],
    inversion: null,
    inversionNota: "Solicita el detalle de costos y formas de pago a un asesor."
  },

  /* ------------------------- DIPLOMADOS ------------------------- */
  {
    id: "diplomado-refinacion-petroquimica",
    proximoInicio: "",   // ej. "Marzo 2027". Vacío = "Próximo inicio por confirmar"
    etiqueta: "Procesos de Refinación y Petroquímica",   // nombre muy corto (enlaces de Admisión)
    requisito: "Bachiller o Título profesional",   // se muestra en la tarjeta
    tipo: "diplomado", orden: 1, estado: null,
    nombre: "Diplomado en Ingeniería de Procesos de Refinación y Petroquímica de Hidrocarburos",
    corto: "Ingeniería de Procesos de Refinación y Petroquímica de Hidrocarburos",
    img: "assets/refineria-noche.jpg",
    facts: ["384 horas · 6 módulos", "Virtual síncrona (Zoom)", "Visitas técnicas"],
    resumen: "Actualiza, fortalece y amplía tus competencias técnicas en refinación y petroquímica. Aprende a comprender, analizar y optimizar los procesos de transformación de los hidrocarburos con un desempeño acorde a las exigencias del sector energético e industrial. Incluye visitas técnicas a refinerías y plantas petroquímicas.",
    modulos: ["Ingeniería de procesos de refinación", "Ingeniería de procesos petroquímicos", "Economía de la refinación y comercio exterior de crudo y productos", "Simulación de procesos", "Planeamiento estratégico de los hidrocarburos", "Materiales de ingeniería en refinación y petroquímica"],
    requisitos: ["Grado académico de Bachiller o Título profesional.", "Currículum vitae (no documentado) y copia de DNI.", "Diploma: asistencia mínima de 80 % y promedio ponderado ≥ 14."],
    datos: [["Duración", "384 horas académicas"], ["Modalidad", "Virtual síncrona (Zoom)"], ["Horario", "Mié. y vie. 16:00–22:00 · Sáb. y dom. 9:00–13:00"]],
    inversion: [["Matrícula", "S/ 200"], ["Al contado", "S/ 4,800"], ["En 6 cuotas", "S/ 800 / mes"]],
    inversionNota: "Pago en BCP, Scotiabank o Niubiz."
  },
  {
    id: "diplomado-riesgos-seguridad",
    proximoInicio: "",   // ej. "Marzo 2027". Vacío = "Próximo inicio por confirmar"
    etiqueta: "Seguridad y Respuesta a Emergencias",   // nombre muy corto (enlaces de Admisión)
    requisito: "Bachiller o Título profesional",   // se muestra en la tarjeta
    tipo: "diplomado", orden: 2, estado: null,
    nombre: "Diplomado en Estudio de Riesgo de Seguridad y Plan de Respuesta a Emergencias en el Sector Hidrocarburos",
    corto: "Estudio de Riesgo de Seguridad y Plan de Respuesta a Emergencias",
    img: "assets/seguridad-casco.jpg",
    // CONFIRMAR: ¿8 módulos o 6 ejes temáticos? Unificar facts, datos y modulos.
    facts: ["388 horas · 8 módulos", "Virtual síncrona (Zoom)", "Sector hidrocarburos"],
    resumen: "Domina las herramientas para identificar, evaluar y cuantificar riesgos en instalaciones de hidrocarburos y para diseñar sistemas de protección y planes de respuesta, con talleres aplicados en cada módulo.",
    modulosTitulo: "Ejes temáticos",
    modulos: ["Conceptos básicos: peligro, riesgo, propiedades fisicoquímicas de los hidrocarburos y combustión", "Accidentología e investigación de accidentes industriales", "Lectura de planos: PFD, P&ID y layout de instalaciones", "Diseño de sistemas de protección contra incendios", "Análisis de árbol de eventos (ETA) y estudio de alcance de consecuencias (EAC)", "Análisis cuantitativo de riesgos (ACR / QRA)"],
    requisitos: ["Grado académico de Bachiller o Título profesional.", "Currículum vitae y copia de DNI."],
    datos: [["Duración", "388 horas · 6 meses"], ["Módulos", "8"], ["Modalidad", "Virtual síncrona (Zoom)"]],
    inversion: null,
    inversionNota: "Solicita el brochure con el plan completo, horarios e inversión."
  }
];

export const TIPOS = {
  doctorado: { singular: "Doctorado", plural: "Doctorado" },
  maestria:  { singular: "Maestría",  plural: "Maestría" },
  diplomado: { singular: "Diplomado", plural: "Diplomados" }
};
