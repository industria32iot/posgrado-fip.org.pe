-- Nota de un alumno en un curso y periodo
CREATE TABLE llx_posgrado_nota (
  rowid              integer AUTO_INCREMENT PRIMARY KEY NOT NULL,
  entity             integer DEFAULT 1 NOT NULL,
  fk_matricula       integer NOT NULL,
  fk_curso           integer NOT NULL,
  fk_periodo         integer NOT NULL,
  nota               double(5,2) NULL,    -- escala 0-20
  asistencia         double(5,2) NULL,    -- porcentaje
  observacion        varchar(255) NULL,
  status             smallint DEFAULT 0 NOT NULL,  -- 0 borrador (no visible para el alumno), 1 publicada
  date_publication   datetime NULL,
  fk_user_modif      integer NULL,
  tms                timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=innodb;
