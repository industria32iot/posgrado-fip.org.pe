-- Matrícula de un alumno (tercero) en un programa
CREATE TABLE llx_posgrado_matricula (
  rowid              integer AUTO_INCREMENT PRIMARY KEY NOT NULL,
  entity             integer DEFAULT 1 NOT NULL,
  fk_soc             integer NOT NULL,
  fk_programa        integer NOT NULL,
  fk_periodo         integer NULL,       -- periodo de ingreso
  codigo             varchar(32) NULL,   -- código de alumno
  status             smallint DEFAULT 1 NOT NULL,  -- 0 postulante, 1 activo, 2 egresado, 3 graduado, 9 retirado
  note_private       text NULL,
  date_creation      datetime NULL,
  fk_user_creat      integer NULL,
  tms                timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=innodb;
