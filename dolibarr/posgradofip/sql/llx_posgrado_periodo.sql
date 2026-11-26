-- Periodos académicos (2027-I, 2027-II, ...)
CREATE TABLE llx_posgrado_periodo (
  rowid          integer AUTO_INCREMENT PRIMARY KEY NOT NULL,
  entity         integer DEFAULT 1 NOT NULL,
  ref            varchar(32) NOT NULL,
  label          varchar(255) NULL,
  date_start     date NULL,
  date_end       date NULL,
  status         smallint DEFAULT 1 NOT NULL,   -- 1 abierto (se pueden registrar notas), 0 cerrado
  tms            timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=innodb;
