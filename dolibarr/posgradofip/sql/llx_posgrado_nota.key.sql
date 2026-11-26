ALTER TABLE llx_posgrado_nota ADD UNIQUE INDEX uk_posgrado_nota (fk_matricula, fk_curso, fk_periodo);
ALTER TABLE llx_posgrado_nota ADD INDEX idx_posgrado_nota_curso (fk_curso, fk_periodo);
ALTER TABLE llx_posgrado_nota ADD CONSTRAINT fk_posgrado_nota_mat FOREIGN KEY (fk_matricula) REFERENCES llx_posgrado_matricula (rowid);
ALTER TABLE llx_posgrado_nota ADD CONSTRAINT fk_posgrado_nota_curso FOREIGN KEY (fk_curso) REFERENCES llx_posgrado_curso (rowid);
ALTER TABLE llx_posgrado_nota ADD CONSTRAINT fk_posgrado_nota_periodo FOREIGN KEY (fk_periodo) REFERENCES llx_posgrado_periodo (rowid);
