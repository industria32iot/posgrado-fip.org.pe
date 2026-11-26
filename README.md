# Posgrado FIP-UNI · Sitio web

Sitio web de la **Unidad de Posgrado de la Facultad de Ingeniería de Petróleo, Gas Natural y Petroquímica (FIP)** de la Universidad Nacional de Ingeniería: Doctorado, Maestría y Diplomados.

Es una aplicación de una sola página (SPA) hecha con **React 19**, **Vite 8**, **React Router 7** y **CSS Modules**, migrada desde una plantilla HTML + CSS + JavaScript plano.

---

## Requisitos

- [Node.js](https://nodejs.org/) **20.19 o superior**, o **22.12 o superior**
- npm (viene con Node.js)

Comprueba tu versión:

```bash
node -v
```

## Instalación

```bash
git clone https://github.com/industria32iot/posgrado-fip.org.pe.git
```

```bash
cd posgrado-fip.org.pe
```

```bash
npm install
```

## Ejecución

| Comando           | Qué hace                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga en caliente en `http://localhost:5173`. |
| `npm run build`   | Genera la versión de producción optimizada en `dist/`.                     |
| `npm run preview` | Sirve `dist/` en `http://localhost:4173` para revisarla antes de publicar. |
| `npm run lint`    | Revisa el código con [oxlint](https://oxc.rs/docs/guide/usage/linter).     |

```bash
npm run dev
```

## Páginas

| Ruta             | Página                                                                         |
| ---------------- | ------------------------------------------------------------------------------ |
| `/`              | Portada con todas las secciones y el formulario "Solicita información".        |
| `/programa/:id`  | Ficha de cada programa (antes `programa.html?id=...`). Ej.: `/programa/maestria-petroleo-gas-natural`. |
| `/privacidad`    | Política de privacidad.                                                        |

Los enlaces con ancla funcionan desde cualquier página: `/#admision`, `/#docentes`, `/#faq`… Desde una ficha, "Solicita información" lleva a `/?programa=<id>#solicitar`, con el programa ya elegido en el formulario.

---

## Editar el contenido (marketing)

**No hace falta tocar componentes ni CSS.** Todos los textos, cifras, fechas, fotos y programas están en dos archivos:

| Archivo                  | Contenido                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| `src/data/contenido.js`  | Portada, cifras, calendario de admisión, docentes, investigación, agenda, testimonios, preguntas frecuentes, contacto y redes. |
| `src/data/programas.js`  | Catálogo de programas: menú, tarjetas, formulario, fichas y datos para Google.                 |

Cada bloque tiene comentarios con las reglas de edición: `visible: false` para ocultar algo sin borrarlo, `referencial: true` para cifras sin confirmar, formato de fechas `AAAA-MM-DD`, etc. Busca la palabra **`CONFIRMAR`** para ver los datos pendientes de validar.

**Fotos:** guárdalas en `public/assets/` y escribe la ruta sin `public/`, por ejemplo `foto: "assets/portada.jpg"`. Los créditos de las fotos de uso libre están en `public/assets/CREDITOS-FOTOS.txt`.

Si el servidor de desarrollo está en marcha, los cambios se ven al guardar. Para publicarlos, vuelve a ejecutar `npm run build`.

---

## Estructura del proyecto

```
├── public/
│   ├── assets/               Fotos referenciadas desde los datos (se copian tal cual a dist/)
│   ├── favicon.png
│   └── .htaccess             Redirección de rutas para Apache (ver "Publicar")
├── src/
│   ├── main.jsx              Punto de entrada: estilos globales + router
│   ├── App.jsx               Rutas y efectos globales
│   ├── assets/               Logos de la UNI (Vite los optimiza y les pone hash)
│   ├── data/                 contenido.js y programas.js (contenido editable)
│   ├── styles/global.css     Variables, reset y clases de diseño compartidas
│   ├── hooks/                Hooks personalizados (ver abajo)
│   ├── utils/                Datos derivados, SEO, testimonios y utilidades
│   ├── pages/                HomePage, ProgramPage, PrivacyPage
│   └── components/
│       ├── layout/           Header, Footer, WhatsAppFloat, Layout y efectos (barra de progreso, spotlight, scroll a anclas)
│       ├── sections/         Una carpeta por sección de la portada: Componente.jsx + Componente.module.css
│       │                     Hero, LeadForm, Stats, Programs, ComingSoon, Admission, WhyUs,
│       │                     Faculty, Research, Agenda, Testimonials, Alumni, Faq, Visit
│       └── ui/               Piezas reutilizables: Icon, Brand, ProgramCard, Reveal, CarouselNav, SmartLink, JsonLd
├── index.html                Metadatos SEO / Open Graph y fuentes de Google
└── vite.config.js
```

### Estilos: CSS Modules + capa global

- **`src/styles/global.css`** contiene la base del diseño: variables de color (`--verde`, `--oro`…), tipografías, reset, clases compartidas (`container`, `section`, `eyebrow`, `head`, `btn`, `chip`, `more`, `tag`, `avatar`, `lines`) y las animaciones de aparición. Se usan como texto normal: `className="btn btn--primary"`.
- **Cada componente tiene su `*.module.css`**, con clases locales que no chocan con las de otros componentes. Vite convierte los nombres a camelCase: `.hero__bg` se usa como `styles.heroBg`.
- Para combinar clases se usa `cx()` (`src/utils/cx.js`): `cx(s.prog, isDraft && s.isDraft)`.

### Interactividad: hooks de React (sin jQuery ni manipulación directa del DOM)

| Hook / componente                    | Reemplaza a                                                       |
| ------------------------------------ | ----------------------------------------------------------------- |
| `useScrollFrame`, `useScrolledPast`  | Listeners de scroll: cabecera con sombra o compacta, parallax, barra de progreso. |
| `useScrollSpy`                       | Enlace activo del menú según la sección visible.                  |
| `useInView`, `useDraw`, `<Reveal>`   | `IntersectionObserver`: aparición suave y líneas que se dibujan.  |
| `useCountUp`                         | Contadores animados de las cifras.                                |
| `useCarousel`                        | Flechas de los carruseles de docentes y testimonios.              |
| `useFilterTransition`                | Filtro de programas con desvanecimiento.                          |
| `useMediaQuery`, `useSpot`           | `matchMedia`: celular, "reducir movimiento", efecto spotlight.    |
| `LeadFormContext`, `<FormLink>`      | Formulario compartido entre el hero y el modal, con preselección de programa o tipo. |

Todas las animaciones respetan la preferencia del sistema **"reducir movimiento"**.

### Formulario "Solicita información"

Valida los campos y abre WhatsApp con un mensaje prellenado. En el despliegue de Hostinger, además registra al interesado en el **CRM Dolibarr** (`portal.posgrado-fip.org.pe`) mediante `public/api/lead.php`, con el programa, el tipo de solicitud y el origen de la visita (UTM). La clave de la API se guarda en el servidor, en `privado/dolibarr-api.key` junto a `public_html` (igual que en colibriperu.org.pe), nunca en el código ni en GitHub.

Instalación, configuración del CRM y uso del embudo: **[docs/CRM-DOLIBARR.md](docs/CRM-DOLIBARR.md)**.

### Portal académico (Dolibarr)

`dolibarr/posgradofip/` es un módulo propio de Dolibarr para la gestión académica: programas, cursos, matrículas, registro de notas por docentes y la página **"Mis notas y pagos"** del Portal Web, donde los alumnos ven sus notas publicadas y su estado de cuenta. Al activarlo aplica la configuración recomendada y el estilo de esta web. Se empaqueta con `./scripts/empaquetar-modulo-dolibarr.sh` o desde **Actions → Módulo Dolibarr**. Guía: **[docs/CRM-DOLIBARR.md §6](docs/CRM-DOLIBARR.md#6-gestión-académica-y-portal-del-alumno-módulo-posgrado-fip)**.

---

## Publicar

```bash
npm run build
```

Sube el contenido de **`dist/`** a tu hosting. Como es una SPA, el servidor debe responder con `index.html` en cualquier ruta (`/programa/...`, `/privacidad`):

- **GitHub Pages:** se publica solo con `.github/workflows/deploy-pages.yml` en cada push a `main` (compila con la base `/<repositorio>/` y crea `404.html` para las rutas). Requisito único: *Settings → Pages → Source: GitHub Actions*. El sitio queda en `https://industria32iot.github.io/posgrado-fip.org.pe/`.
- **Hostinger:** `.github/workflows/deploy-hostinger.yml` compila en cada cambio y deja el .zip `sitio-hostinger` en Actions para subirlo con el administrador de archivos (sin secrets); por FTP es opcional. Prueba en `nuevo.posgrado-fip.org.pe`. Ver [docs/CRM-DOLIBARR.md](docs/CRM-DOLIBARR.md).
- **Apache / cPanel:** ya está resuelto con `public/.htaccess`, que se copia a `dist/`.
- **Netlify:** crea `public/_redirects` con la línea `/*  /index.html  200`.
- **Vercel:** usa una regla `rewrites` de `/(.*)` a `/index.html` en `vercel.json`.
- **Nginx:** `try_files $uri /index.html;`
- **Subcarpeta** (ej. `https://dominio/posgrado/`): define `base: '/posgrado/'` en `vite.config.js`. El router y las rutas de las imágenes se ajustan solos.

Antes de publicar, revisa en `src/data/contenido.js` el dominio definitivo (`sitioUrl`) y en `index.html` la URL de `og:image`.

---

## Notas de la migración

- El diseño se mantuvo idéntico a la plantilla original. Se comparó con capturas de pantalla en 1440, 1024, 768 y 390 px de ancho: las fichas y la política de privacidad coinciden al píxel, y en la portada solo hay diferencias de suavizado de texto (menos de 100 píxeles).
- Se eliminó el código de funciones que la plantilla ya no mostraba (buscador de programas, palabra rotativa, comparador, barra superior), además de sus estilos.
- La plantilla HTML original no forma parte del repositorio (está excluida en `.gitignore`). Sigue disponible en el historial de git, en el commit que la agregó.
