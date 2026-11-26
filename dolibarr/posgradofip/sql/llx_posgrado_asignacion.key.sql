ALTER TABLE llx_posgrado_asignacion ADD UNIQUE INDEX uk_posgrado_asignacion (fk_curso, fk_periodo, fk_user);
ALTER TABLE llx_posgrado_asignacion ADD INDEX idx_posgrado_asignacion_user (fk_user);
ALTER TABLE llx_posgrado_asignacion ADD CONSTRAINT fk_posgrado_asig_curso FOREIGN KEY (fk_curso) REFERENCES llx_posgrado_curso (rowid);
ALTER TABLE llx_posgrado_asignacion ADD CONSTRAINT fk_posgrado_asig_periodo FOREIGN KEY (fk_periodo) REFERENCES llx_posgrado_periodo (rowid);
