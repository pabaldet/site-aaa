-- Renommage type_pilote → type_membre
ALTER TABLE profils RENAME COLUMN type_pilote TO type_membre;

-- Ajout du champ remise sur les cotisations
ALTER TABLE cotisations ADD COLUMN IF NOT EXISTS remise TEXT DEFAULT NULL;
-- Valeurs possibles : 'premiere_annee', 'parrainage', NULL (plein tarif)

-- Ajout du parrain (membre qui a parrainé)
ALTER TABLE profils ADD COLUMN IF NOT EXISTS parrain_id UUID REFERENCES profils(id) ON DELETE SET NULL;
