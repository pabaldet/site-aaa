-- Suppression des politiques admin problématiques
DROP POLICY IF EXISTS "Admin : tout voir (profils)" ON profils;
DROP POLICY IF EXISTS "Admin : tout gérer (cotisations)" ON cotisations;

-- Fonction SECURITY DEFINER : s'exécute avec les droits postgres, contourne la récursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profils WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Recréation des politiques admin en utilisant la fonction
CREATE POLICY "Admin : tout voir (profils)"
  ON profils FOR ALL USING (is_admin());

CREATE POLICY "Admin : tout gérer (cotisations)"
  ON cotisations FOR ALL USING (is_admin());
