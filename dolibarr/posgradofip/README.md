# Posgrado FIP · módulo Dolibarr

Gestión académica de la Unidad de Posgrado de la FIP-UNI sobre Dolibarr 20 o superior (probado en 24.0.4):
programas, plan de estudios, periodos, docentes, matrículas, notas y estado de cuenta, con la página
**"Mis notas y pagos"** en el Portal Web para los alumnos de doctorado, maestría y diplomados.

Instalación, configuración automática y uso: [`docs/CRM-DOLIBARR.md`](../../docs/CRM-DOLIBARR.md), sección 6.

| Archivo | Contenido |
| --- | --- |
| `core/modules/modPosgradoFip.class.php` | Descriptor: permisos, menús, pestaña del tercero, hooks, dependencias |
| `sql/` | Tablas `llx_posgrado_*` y datos iniciales (4 programas, 47 cursos, periodos 2027) |
| `class/posgradofipconfig.class.php` | Configuración recomendada (institución, apariencia, Portal Web, seguridad) |
| `class/actions_posgradofip.class.php` | Hooks del Portal Web: controlador `misnotas`, menú y estilo |
| `webportal/` | Controlador y plantilla de "Mis notas y pagos" |
| `lib/posgradofip.lib.php` | Promedio ponderado, aprobación, estado de cuenta, sincronización del perfil del alumno |
| `css/`, `fonts/`, `img/` | Identidad de posgrado-fip.org.pe (Inter y Source Serif 4 con licencia OFL, escudo UNI) |

Seguridad: el alumno se identifica siempre por su sesión del portal (nunca por parámetros de la URL), solo ve
notas **publicadas**, y los docentes solo pueden calificar los cursos que tienen asignados en periodos abiertos.
