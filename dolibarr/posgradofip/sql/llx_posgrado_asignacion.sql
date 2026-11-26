-- Docente asignado a un curso en un periodo
CREATE TABLE llx_posgrado_asignacion (
  rowid          integer AUTO_INCREMENT PRIMARY KEY NOT NULL,
  entity         integer DEFAULT 1 NOT NULL,
  fk_curso       integer NOT NULL,
  fk_periodo     integer NOT NULL,
  fk_user        integer NOT NULL,
  tms            timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=innodb;
