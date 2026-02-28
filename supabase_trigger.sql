-- Fonction déclenchée automatiquement à chaque nouvel utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profils (id, email, prenom, nom, telephone, adresse, date_naissance, type_pilote, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'prenom', ''),
    COALESCE(NEW.raw_user_meta_data->>'nom', ''),
    COALESCE(NEW.raw_user_meta_data->>'telephone', NULL),
    COALESCE(NEW.raw_user_meta_data->>'adresse', NULL),
    NULLIF(NEW.raw_user_meta_data->>'date_naissance', '')::DATE,
    COALESCE(NEW.raw_user_meta_data->>'type_pilote', NULL),
    'membre'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur la table auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
