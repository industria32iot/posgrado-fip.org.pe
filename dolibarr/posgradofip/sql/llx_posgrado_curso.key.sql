ALTER TABLE llx_posgrado_curso ADD UNIQUE INDEX uk_posgrado_curso_ref (ref, entity);
ALTER TABLE llx_posgrado_curso ADD INDEX idx_posgrado_curso_programa (fk_programa);
ALTER TABLE llx_posgrado_curso ADD CONSTRAINT fk_posgrado_curso_programa FOREIGN KEY (fk_programa) REFERENCES llx_posgrado_programa (rowid);
