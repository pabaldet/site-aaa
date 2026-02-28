-- Table des profils membres (liée aux utilisateurs Supabase Auth)
CREATE TABLE profils (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  prenom        TEXT NOT NULL,
  nom           TEXT NOT NULL,
  telephone     TEXT,
  adresse       TEXT,
  date_naissance DATE,
  type_pilote   TEXT,
  role          TEXT NOT NULL DEFAULT 'membre',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Table des cotisations
CREATE TABLE cotisations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membre_id      UUID NOT NULL REFERENCES profils(id) ON DELETE CASCADE,
  annee          INTEGER NOT NULL,
  montant        NUMERIC(8,2),
  statut         TEXT NOT NULL DEFAULT 'en attente',
  date_paiement  DATE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(membre_id, annee)
);

-- Sécurité : Row Level Security
ALTER TABLE profils    ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotisations ENABLE ROW LEVEL SECURITY;

-- Un membre peut lire et modifier son propre profil
CREATE POLICY "Membre : voir son profil"
  ON profils FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Membre : modifier son profil"
  ON profils FOR UPDATE USING (auth.uid() = id);

-- Un admin peut tout voir et modifier
CREATE POLICY "Admin : tout voir (profils)"
  ON profils FOR ALL USING (
    EXISTS (SELECT 1 FROM profils WHERE id = auth.uid() AND role = 'admin')
  );

-- Un membre peut voir ses propres cotisations
CREATE POLICY "Membre : voir ses cotisations"
  ON cotisations FOR SELECT USING (membre_id = auth.uid());

-- Un admin peut tout gérer sur les cotisations
CREATE POLICY "Admin : tout gérer (cotisations)"
  ON cotisations FOR ALL USING (
    EXISTS (SELECT 1 FROM profils WHERE id = auth.uid() AND role = 'admin')
  );

-- Permettre l'insertion du profil à la création du compte
CREATE POLICY "Insertion profil à l'inscription"
  ON profils FOR INSERT WITH CHECK (auth.uid() = id);
