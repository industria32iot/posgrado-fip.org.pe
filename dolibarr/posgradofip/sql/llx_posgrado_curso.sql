-- Cursos / módulos del plan de estudios
CREATE TABLE llx_posgrado_curso (
  rowid          integer AUTO_INCREMENT PRIMARY KEY NOT NULL,
  entity         integer DEFAULT 1 NOT NULL,
  fk_programa    integer NOT NULL,
  ref            varchar(32) NOT NULL,
  label          varchar(255) NOT NULL,
  ciclo          integer DEFAULT 0 NOT NULL,     -- ciclo / semestre / módulo (0 = electivo sin ciclo fijo)
  tipo           varchar(16) DEFAULT 'obligatorio' NOT NULL, -- obligatorio | electivo
  creditos       double(5,2) NULL,
  horas          integer NULL,
  position       integer DEFAULT 0 NOT NULL,
  active         smallint DEFAULT 1 NOT NULL,
  tms            timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=innodb;
