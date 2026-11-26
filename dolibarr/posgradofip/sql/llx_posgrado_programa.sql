-- Programas de posgrado (doctorado, maestría, diplomado)
CREATE TABLE llx_posgrado_programa (
  rowid              integer AUTO_INCREMENT PRIMARY KEY NOT NULL,
  entity             integer DEFAULT 1 NOT NULL,
  ref                varchar(32) NOT NULL,
  label              varchar(255) NOT NULL,
  tipo               varchar(16) NOT NULL,          -- doctorado | maestria | diplomado
  clave_crm          varchar(32) NULL,              -- clave del atributo 'programa' del tercero (doctorado, maestria, dip_refinacion, dip_riesgos)
  grado              varchar(255) NULL,             -- grado o diploma que otorga
  duracion           varchar(128) NULL,
  modalidad          varchar(128) NULL,
  creditos           integer NULL,
  horas              integer NULL,
  nota_aprobatoria   double(5,2) DEFAULT 14 NOT NULL,  -- nota mínima para aprobar un curso (escala 0-20)
  promedio_minimo    double(5,2) DEFAULT 14 NOT NULL,  -- promedio ponderado mínimo para graduarse / obtener diploma
  asistencia_minima  double(5,2) DEFAULT 80 NOT NULL,  -- % de asistencia mínima
  active             smallint DEFAULT 1 NOT NULL,
  date_creation      datetime NULL,
  tms                timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=innodb;
