# Prueba en Hostinger + CRM Dolibarr + embudo de captación

Guía para publicar la web nueva en **`nuevo.posgrado-fip.org.pe`** (sin tocar el sitio actual), instalar **Dolibarr** en **`portal.posgrado-fip.org.pe`** y conectar el formulario "Solicita información" al CRM.

```
Visitante ──► Web (nuevo.posgrado-fip.org.pe) ──► /api/lead.php ──► Dolibarr (portal.posgrado-fip.org.pe)
   │ llega por un anuncio con ?utm_...           (PHP en Hostinger,        Tercero (prospecto) + contacto
   │                                              guarda la clave API)     + Oportunidad en etapa "Interesado"
   └──────────────────────────────► WhatsApp (respuesta inmediata del asesor, como hasta ahora)
```

Tiempo estimado: 45–60 minutos. Todo se hace en **hPanel** (panel de Hostinger) y en **GitHub**, sin secrets: la clave del CRM vive en el servidor, como en colibriperu.org.pe.

---

## 0. Respaldo del sitio actual (obligatorio, antes de todo)

1. hPanel → **Sitios web** → `posgrado-fip.org.pe` → **Archivos → Copias de seguridad**.
2. Genera una copia nueva y descarga **Archivos** (todo `public_html`) y **Bases de datos** (cada una).
3. Guarda los archivos `.zip` / `.sql` fuera de Hostinger (tu PC y Google Drive / OneDrive de la Unidad).

> Con esto se puede volver al sitio actual en cualquier momento. Esta prueba no lo modifica.

---

## 1. Subdominio de prueba `nuevo.posgrado-fip.org.pe`

1. hPanel → **Dominios → Subdominios** → crear `nuevo`. Hostinger crea la carpeta (normalmente `public_html/nuevo`) y activa SSL en unos minutos.

### Publicar la web (sin secrets, como en colibriperu.org.pe)

1. GitHub → **Actions → Publicar en Hostinger** → abre la última ejecución (se ejecuta sola con cada cambio en `main`, o con **Run workflow**).
2. Al final de la página, en **Artifacts**, descarga **`sitio-hostinger`** (.zip).
3. hPanel → **Administrador de archivos** → `public_html/nuevo/` → sube el .zip → clic derecho → **Extraer** → borra el .zip.
   Deben quedar `index.html`, `assets/`, `api/lead.php` y el archivo oculto `.htaccess`.
4. Abre `https://nuevo.posgrado-fip.org.pe`. Mientras sea de prueba lleva `noindex` (Google no la indexa).

> La web funciona aunque el CRM aún no exista: el formulario sigue abriendo WhatsApp y el envío al CRM simplemente no se registra.

<details>
<summary>Opcional: que se publique sola por FTP</summary>

Crea en hPanel una **cuenta FTP limitada a `public_html/nuevo`** y guarda en GitHub → **Settings → Secrets and variables → Actions**: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` y `FTP_SERVER_DIR` (`/` si la cuenta ya está limitada a esa carpeta). Desde entonces el workflow también la sube por FTPS en cada cambio.
</details>

---

## 2. Instalar Dolibarr en `portal.posgrado-fip.org.pe`

### 2.1 Base de datos

hPanel → **Bases de datos → Administración** → crear una base MySQL nueva (ej. `uXXX_crm`) con su usuario y una **contraseña larga**. Anota los cuatro datos (nombre de base, usuario, contraseña, servidor `localhost`).

### 2.2 Archivos (mismo esquema que crm.colibriperu.org.pe)

1. Descarga la **última versión estable** de Dolibarr (`.zip`) desde <https://www.dolibarr.org/downloads.php>.
2. hPanel → **Dominios → Subdominios** → crear `portal`, con carpeta **`public_html/portal`**.
3. **Administrador de archivos** → sube el .zip, **Extrae**, y copia el **contenido de `htdocs/`** dentro de `public_html/portal/` (borra antes el `index.html` / `default.php` de «Coming soon» que crea Hostinger).
4. Crea **`dolibarr-documentos/`** junto a `public_html` (no dentro): ahí Dolibarr guarda adjuntos y el bloqueo del instalador.
5. Verifica que el SSL de `portal.posgrado-fip.org.pe` esté activo (hPanel → **Seguridad → SSL**).

6. Si en `public_html/portal/` **no** hay un archivo `.htaccess`, crea uno con esta única línea, para que las reglas de la web principal (`public_html/.htaccess`) no afecten a Dolibarr:
   ```
   RewriteEngine On
   ```

> **Al volver a publicar la web no borres `public_html/portal/`.**

### 2.3 Instalador web

1. Abre `https://portal.posgrado-fip.org.pe/install/`.
2. Idioma **Español (Perú)**. Directorio de documentos: la ruta completa de `dolibarr-documentos` (ej. `/home/uXXX/domains/posgrado-fip.org.pe/dolibarr-documentos`). URL: `https://portal.posgrado-fip.org.pe`.
3. Base de datos: los datos del paso 2.1 (**no** marques "crear base de datos": ya existe).
4. Crea el usuario **administrador** con contraseña robusta (no uses `admin`).
5. Al terminar, deja que el instalador cree el archivo **`install.lock`** (bloquea el instalador). Si no lo crea, créalo vacío dentro de `dolibarr-documentos/`.

### 2.4 Configuración automática por API (recomendado)

`scripts/configurar-dolibarr.sh` hace por la API los pasos 2.4 y 2.6 (salvo permisos y clave) y crea el
**perfil de estudiante de posgrado**. Requisitos: módulo **API REST** activo y la clave API de un administrador
(`DOLIBARR_API_KEY=... ./scripts/configurar-dolibarr.sh`, o desde una sesión de Claude con la credencial guardada).

**Perfil de estudiante de posgrado** (atributos complementarios del tercero):

| Campo | Tipo | Valores |
| --- | --- | --- |
| Programa de interés | lista | Doctorado · Maestría · Diplomado en Refinación y Petroquímica · Diplomado en Riesgos y Seguridad (claves `doctorado`, `maestria`, `dip_refinacion`, `dip_riesgos`; `lead.php` las traduce desde los `id` de `programas.js`) |
| Estado académico | lista | Interesado · Postulante · Admitido · Matriculado · Egresado · Graduado · Retirado |
| Cohorte / semestre | texto | ej. `2027-I` |
| Grado académico previo | lista | Bachiller · Título profesional · Maestro · Doctor |
| Universidad de procedencia | texto | |
| Código de alumno UNI | texto | |

El formulario web llena **Programa** y deja **Estado académico = Interesado**; el resto lo completa la Unidad de Posgrado.

**Etapas del embudo:** basta con las de serie de Dolibarr (Proyectos → oportunidades):
Prospección (= Interesado, ID 1) → Calificación (= Contactado) → Propuesta (= Charla/entrevista) → Negociación (= Postulante) → Ganada (= Matriculado) / Perdida.
Renombrarlas en **Diccionarios → Estado de oportunidad** es opcional.

### 2.4.1 Módulos a activar (manual, si no se usa el script)

Inicio → **Configuración → Módulos/Aplicaciones**:

| Módulo                               | Para qué                                                       |
| ------------------------------------ | -------------------------------------------------------------- |
| **Terceros** (con Contactos)         | Cada interesado queda como *cliente potencial*.                |
| **Proyectos**                        | En su configuración, activa **"usar proyectos para seguir oportunidades"**. Cada solicitud es una oportunidad del embudo. |
| **Agenda**                           | Registrar llamadas, WhatsApp y charlas con cada interesado.    |
| **E-Mailing**                        | Campañas de correo a prospectos por programa.                  |
| **API REST (servicios web)**         | Para que la web registre a los interesados.                    |

### 2.5 Etapas del embudo

Inicio → **Configuración → Diccionarios → Estado de oportunidad** (*Opportunity status*). Ajusta las etiquetas y el % de probabilidad:

| Etapa                   | Prob. | Qué significa                                               |
| ----------------------- | ----- | ----------------------------------------------------------- |
| **Interesado**          | 10 %  | Llenó el formulario (aquí entra cada solicitud web).        |
| **Contactado**          | 20 %  | Un asesor habló con él (WhatsApp / llamada).                |
| **Charla / entrevista** | 40 %  | Asistió a la charla informativa o a una entrevista.         |
| **Postulante**          | 70 %  | Presentó expediente o pagó la carpeta.                      |
| **Matriculado** (ganada) | 100 % | Se matriculó.                                              |
| **Perdido**             | 0 %   | No continúa (anota el motivo).                              |

Anota el **ID** de "Interesado": va en `etapa_inicial_id` del archivo de configuración.

### 2.6 Usuario técnico para la web (clave API)

1. **Usuarios y grupos → Nuevo usuario**: `api-web` (mismo nombre que en Colibrí), sin acceso de administrador.
2. Permisos mínimos: **Terceros** (leer, crear), **Contactos** (crear), **Proyectos** (leer, crear).
3. En la ficha del usuario → **Clave para API** → generar y copiar.

### 2.7 Clave de la API en el servidor (sin secrets)

1. Crea la carpeta **`privado/`** junto a `public_html` (no dentro), como en Colibrí.
2. Dentro, crea el archivo **`dolibarr-api.key`** con **solo la clave** (una línea).
   > **Importante:** si `privado/` queda dentro de `public_html` (o de la carpeta del subdominio), `api/lead.php` **ignora la clave** por seguridad y el formulario responde "CRM no configurado". El motivo queda en el registro de errores de PHP (hPanel → Avanzado → Registros de errores).
3. Listo: `api/lead.php` la encuentra solo y usa por defecto `https://portal.posgrado-fip.org.pe`, la etapa con ID 1 y los dominios `nuevo.`, `www.` y `posgrado-fip.org.pe`.
4. Opcional: para cambiar la etapa inicial o poner el **valor de cada programa** (valor del embudo), copia [`docs/crm-config.example.php`](crm-config.example.php) como `privado/crm-config.php` y edítalo.
5. Prueba: envía el formulario en `https://nuevo.posgrado-fip.org.pe` → en Dolibarr debe aparecer el tercero y una oportunidad validada `WEB-…` en "Interesado".

---

## 3. Cómo usar el embudo para conseguir más matrículas

1. **Velocidad de respuesta:** el formulario abre WhatsApp y además crea la oportunidad. Meta: contactar a cada interesado en **menos de 1 hora** en horario de atención y pasarlo a *Contactado*.
2. **Origen de cada interesado:** usa enlaces con UTM en cada canal; el origen queda en la oportunidad. Ejemplos:
   - Facebook/Instagram: `https://nuevo.posgrado-fip.org.pe/?utm_source=facebook&utm_medium=cpc&utm_campaign=admision-2027`
   - Correo a egresados FIP: `…/?utm_source=egresados&utm_medium=email&utm_campaign=maestria-2027`
   - Directo a un programa: `…/programa/maestria-petroleo-gas-natural?utm_source=linkedin&utm_medium=organic`
3. **Charla informativa como paso intermedio:** invita a todos los *Contactados* a la próxima charla (sección Agenda de la web). Es el paso que más convierte.
4. **Seguimiento por correo:** con E-Mailing, envía a los *Interesados* de cada programa el brochure, fechas de admisión y testimonios.
5. **Revisión semanal:** en Proyectos → oportunidades, revisa cuántos hay en cada etapa, el valor del embudo y qué canal (UTM) trae más *Postulantes*. Invierte más en ese canal.

---

## 4. Protección de datos personales (Ley N.º 29733)

Guardar los datos del formulario en Dolibarr es **tratamiento de datos personales**:

- Valida con la Oficina de Asesoría Legal la **política de privacidad** (`/privacidad`, hoy "pendiente de validación") **antes** de usar el CRM con personas reales.
- Inscribe el banco de datos de interesados ante la Autoridad Nacional de Protección de Datos Personales si corresponde.
- Da acceso a Dolibarr solo al personal de la Unidad de Posgrado, con contraseñas robustas, y mantén Dolibarr actualizado.
- Cada oportunidad guarda la fecha del consentimiento de privacidad.

---

## 5. Pasar la web nueva a producción (`https://posgrado-fip.org.pe`)

1. **Respaldo** del sitio actual (paso 0): archivos de `public_html` y bases de datos, descargados fuera de Hostinger.
2. **Retira el sitio anterior** de `public_html/`: borra sus archivos y carpetas (por ejemplo `index.php`, `wp-*`, `.htaccess` antiguo).
   **No borres** `portal/`, `nuevo/`, `.well-known/` ni la carpeta `privado/` (que está fuera de `public_html`).
   Es necesario porque, si queda un `index.php`, Hostinger lo muestra antes que el `index.html` de la web nueva.
3. Descarga el artefacto **`sitio-hostinger`** de la última ejecución de **Actions → Publicar en Hostinger** (se compila para producción e indexable), súbelo a `public_html/` y **Extrae**.
4. **Copia de prueba:** en `public_html/nuevo/` reemplaza todo por un `.htaccess` con
   `Redirect 301 / https://posgrado-fip.org.pe/` para que no quede contenido duplicado (o elimina el subdominio).
5. Comprueba: `https://posgrado-fip.org.pe`, `/programa/maestria-petroleo-gas-natural` (al recargar), `/privacidad`,
   que `https://www.posgrado-fip.org.pe` redirija al dominio sin `www`, y un envío del formulario (WhatsApp y, si ya está Dolibarr, la oportunidad en el CRM).

---

## 6. Gestión académica y Portal del alumno (módulo **Posgrado FIP**)

El módulo propio `dolibarr/posgradofip` convierte el CRM en el sistema académico de la Unidad:

| Quién | Qué hace | Dónde |
| --- | --- | --- |
| **Coordinación** | Programas, plan de estudios, periodos, asignación de docentes, matrículas, publicación de notas | Menú **Posgrado** |
| **Docente** | Registra asistencia y notas **solo en sus cursos asignados**; quedan en borrador | Posgrado → Registro de notas |
| **Alumno** (doctorado, maestría y diplomados) | Ve sus notas publicadas, promedio ponderado, créditos y su estado de cuenta; descarga comprobantes | `https://portal.posgrado-fip.org.pe/public/webportal/` → **Mis notas y pagos** |

Viene cargado con los 4 programas y sus 47 cursos (de `src/data/programas.js`) y los periodos 2027-I y 2027-II.
Los pagos son **facturas** normales de Dolibarr del alumno (matrícula, cuotas, derechos): el portal muestra lo emitido, lo pagado y el saldo.
Al matricular, el módulo actualiza el **perfil de estudiante** del tercero (paso 2.4): estado académico, cohorte y código UNI.

### 6.1 Instalar

1. GitHub → **Actions → Módulo Dolibarr** → última ejecución → **Artifacts** → descarga `module_posgradofip-1.0.0`.
   Se descarga como `module_posgradofip-1.0.0.zip`: **súbelo tal cual**, sin descomprimirlo ni cambiarle el nombre
   (Dolibarr exige el formato `module_<nombre>-<versión>.zip`). También se genera en local con `./scripts/empaquetar-modulo-dolibarr.sh`.
2. Dolibarr → **Inicio → Configuración → Módulos → "Desplegar/instalar un módulo externo"** → sube `module_posgradofip-1.0.0.zip`.
   Si Dolibarr dice que la carpeta `custom` no es escribible, sube el contenido con el **Administrador de archivos** de hPanel a `public_html/portal/custom/posgradofip/`.
3. En la lista de módulos activa **Posgrado FIP**. Se activan solos **Terceros**, **Facturas** y **Portal Web**.
4. Al activarse, el módulo **completa la configuración recomendada** sin pisar lo que ya se haya configurado a mano. Para revisarla o forzarla: rueda dentada del módulo → **"Aplicar toda la configuración recomendada"**.

### 6.2 Qué configura automáticamente

| Grupo | Ajustes |
| --- | --- |
| Institución | Nombre, dirección (Av. Túpac Amaru N.º 210, Pabellón D1, Rímac), Perú / Lima, teléfono, WhatsApp, correo, web, Facebook y X de la UNI, moneda **PEN**, año fiscal desde enero, idioma es_PE |
| Apariencia | Título "Portal Posgrado FIP-UNI" (en lugar de "Dolibarr 24.0.4"), escudo UNI como logo y favicon, colores de posgrado-fip.org.pe (verde petróleo `#003c36`/`#004d44`, crema `#f7f4ef`, dorado `#c9982b`), tipografías **Inter** y **Source Serif 4** (incluidas en el módulo, sin Google Fonts) y fondo del inicio de sesión |
| Portal Web | Título, color, escudo, lista de comprobantes visible, presupuestos y pedidos ocultos, **captcha** en el acceso y el **usuario de servicio** `portal-alumnos` (sin él el portal rechaza a todos: "configuración incompleta"). Ese usuario solo puede leer terceros y facturas, y el portal lo limita siempre al alumno conectado. |
| Seguridad | Cierra el explorador público del API (`/api/index.php/explorer`) |

### 6.3 Puesta en marcha

1. **Revisar el reglamento** en Posgrado → Programas y cursos: la nota mínima aprobatoria (viene en **14**), el promedio mínimo (14), la asistencia mínima (80 %) y los **créditos de cada curso** (la web no los publica; sin créditos, el promedio pesa igual cada curso). Al Diplomado en Riesgos le faltan 2 de sus 8 módulos (la web lista 6 ejes).
2. **Usuarios y grupos**: crea el grupo *Docentes* (permiso "Registrar notas en los cursos asignados" y "Ver programas…") y el grupo *Coordinación* (todos los permisos de Posgrado FIP, Terceros y Facturas).
3. **Asignación docente** por periodo (Posgrado → Asignación docente).
4. **Matricular**: Posgrado → Nueva matrícula (los interesados del formulario web ya están como terceros). En la ficha de la matrícula, **Crear cuenta** → tipo "Portal Dolibarr", con el correo del alumno como usuario.
5. **Cobrar**: botón **Nueva factura / cuota** en la matrícula; registra los pagos en la factura como siempre.
6. **Notas**: el docente guarda en borrador; coordinación revisa y pulsa **Guardar y publicar**. Si un docente corrige una nota publicada, vuelve a borrador hasta que coordinación la publique otra vez. Al **cerrar el periodo** (Posgrado → Periodos) los docentes ya no pueden modificar notas.

### 6.4 Pendiente de completar a mano

- **RUC** de la UNI y **director(a)** de la Unidad (Empresa/Organización): no figuran en la web.
- **Correo saliente (SMTP)** con `posgrado-fip@uni.edu.pe` (Configuración → Correos): sin él no funcionan "¿Olvidó su contraseña?" ni el envío de comprobantes.
- **Pago en línea con Niubiz**: Dolibarr no lo trae; por ahora los pagos de BCP, Scotiabank o Niubiz se registran a mano en cada factura.
- **IGV**: confirmar con contabilidad el tratamiento de los servicios educativos antes de emitir comprobantes.
