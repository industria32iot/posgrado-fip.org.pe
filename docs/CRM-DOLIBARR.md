# Prueba en Hostinger + CRM Dolibarr + embudo de captación

Guía para publicar la web nueva en **`nuevo.posgrado-fip.org.pe`** (sin tocar el sitio actual), instalar **Dolibarr** en **`crm.posgrado-fip.org.pe`** y conectar el formulario "Solicita información" al CRM.

```
Visitante ──► Web (nuevo.posgrado-fip.org.pe) ──► /api/lead.php ──► Dolibarr (crm.posgrado-fip.org.pe)
   │ llega por un anuncio con ?utm_...           (PHP en Hostinger,        Tercero (prospecto) + contacto
   │                                              guarda la clave API)     + Oportunidad en etapa "Interesado"
   └──────────────────────────────► WhatsApp (respuesta inmediata del asesor, como hasta ahora)
```

Tiempo estimado: 45–60 minutos. Todo se hace en **hPanel** (panel de Hostinger) y en **GitHub**.

---

## 0. Respaldo del sitio actual (obligatorio, antes de todo)

1. hPanel → **Sitios web** → `posgrado-fip.org.pe` → **Archivos → Copias de seguridad**.
2. Genera una copia nueva y descarga **Archivos** (todo `public_html`) y **Bases de datos** (cada una).
3. Guarda los archivos `.zip` / `.sql` fuera de Hostinger (tu PC y Google Drive / OneDrive de la Unidad).

> Con esto se puede volver al sitio actual en cualquier momento. Esta prueba no lo modifica.

---

## 1. Subdominio de prueba `nuevo.posgrado-fip.org.pe`

1. hPanel → **Dominios → Subdominios** → crear `nuevo`. Hostinger crea la carpeta (normalmente `public_html/nuevo`) y activa SSL en unos minutos.
2. hPanel → **Archivos → Cuentas FTP** → **crear una cuenta FTP limitada a esa carpeta** (`public_html/nuevo`).
   Así, aunque la clave se filtrara, solo podría tocar la copia de prueba.
3. Anota: **servidor FTP**, **usuario** y **contraseña** de esa cuenta.

### Conectar GitHub con Hostinger

GitHub → repositorio → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret           | Valor                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| `FTP_SERVER`     | servidor FTP (ej. `ftp.posgrado-fip.org.pe` o la IP que muestra hPanel) |
| `FTP_USERNAME`   | usuario de la cuenta FTP limitada                                     |
| `FTP_PASSWORD`   | contraseña de esa cuenta                                              |
| `FTP_SERVER_DIR` | `/` (la cuenta ya está limitada a `public_html/nuevo`)                 |

Luego: **Actions → Publicar en Hostinger → Run workflow**. En 1–2 minutos la web estará en `https://nuevo.posgrado-fip.org.pe`.
A partir de ahí se publica sola con cada cambio en `main`. Mientras sea de prueba lleva `noindex` (Google no la indexa).

> La web funciona aunque el CRM aún no exista: el formulario sigue abriendo WhatsApp y el envío al CRM simplemente no se registra.

---

## 2. Instalar Dolibarr en `crm.posgrado-fip.org.pe`

### 2.1 Base de datos

hPanel → **Bases de datos → Administración** → crear una base MySQL nueva (ej. `uXXX_crm`) con su usuario y una **contraseña larga**. Anota los cuatro datos (nombre de base, usuario, contraseña, servidor `localhost`).

### 2.2 Archivos

1. Descarga la **última versión estable** de Dolibarr (`.zip`) desde <https://www.dolibarr.org/downloads.php>.
2. hPanel → **Administrador de archivos** → en tu carpeta personal (`/home/uXXX/`, **fuera de `public_html`**) crea `dolibarr/`, sube el `.zip` y usa **Extraer**. Debe quedar `/home/uXXX/dolibarr/htdocs/…`.
3. Crea también `/home/uXXX/dolibarr-documents/` (ahí Dolibarr guarda adjuntos y bloqueos; no debe ser accesible desde la web).
4. hPanel → **Dominios → Subdominios** → crear `crm` con **carpeta personalizada** apuntando a `/home/uXXX/dolibarr/htdocs`.
   Si tu plan no permite carpetas fuera de `public_html`, usa `public_html/crm` y sube ahí el **contenido** de `htdocs`.
5. Verifica que el SSL de `crm.posgrado-fip.org.pe` esté activo (hPanel → **Seguridad → SSL**).

### 2.3 Instalador web

1. Abre `https://crm.posgrado-fip.org.pe/install/`.
2. Idioma **Español (Perú)**. Directorio de documentos: `/home/uXXX/dolibarr-documents`. URL: `https://crm.posgrado-fip.org.pe`.
3. Base de datos: los datos del paso 2.1 (**no** marques "crear base de datos": ya existe).
4. Crea el usuario **administrador** con contraseña robusta (no uses `admin`).
5. Al terminar, deja que el instalador cree el archivo **`install.lock`** (bloquea el instalador). Si no lo crea, créalo vacío en `/home/uXXX/dolibarr-documents/install.lock`.

### 2.4 Módulos a activar

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

1. **Usuarios y grupos → Nuevo usuario**: `web-formulario`, sin acceso de administrador.
2. Permisos mínimos: **Terceros** (leer, crear), **Contactos** (crear), **Proyectos** (leer, crear).
3. En la ficha del usuario → **Clave para API** → generar y copiar.

### 2.7 Archivo de configuración del formulario

1. Copia [`docs/crm-config.example.php`](crm-config.example.php) como **`crm-config.php`** y completa la clave API, el ID de etapa y los valores por programa.
2. Súbelo a **`/home/uXXX/crm-config.php`** (carpeta personal, **fuera de `public_html`**). `/api/lead.php` lo encuentra solo.
3. Prueba: envía el formulario en `https://nuevo.posgrado-fip.org.pe` → en Dolibarr debe aparecer el tercero y una oportunidad `WEB-…` en "Interesado".

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

## 5. Pasar la web nueva a producción (cuando la prueba esté aprobada)

1. Nuevo respaldo del sitio actual (paso 0).
2. Crea una cuenta FTP limitada a `public_html` (o cambia `FTP_SERVER_DIR`) y actualiza los secrets.
3. En GitHub → **Settings → Secrets and variables → Actions → Variables**: `HOSTINGER_NOINDEX` = `false` (para que Google indexe la web).
4. Ejecuta **Publicar en Hostinger**. El `.htaccess` incluido hace funcionar las rutas `/programa/...` y `/privacidad`.
