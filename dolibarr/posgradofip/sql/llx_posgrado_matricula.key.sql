ALTER TABLE llx_posgrado_matricula ADD UNIQUE INDEX uk_posgrado_matricula (fk_soc, fk_programa, entity);
ALTER TABLE llx_posgrado_matricula ADD INDEX idx_posgrado_matricula_programa (fk_programa);
ALTER TABLE llx_posgrado_matricula ADD CONSTRAINT fk_posgrado_mat_programa FOREIGN KEY (fk_programa) REFERENCES llx_posgrado_programa (rowid);
ALTER TABLE llx_posgrado_matricula ADD CONSTRAINT fk_posgrado_mat_soc FOREIGN KEY (fk_soc) REFERENCES llx_societe (rowid);
