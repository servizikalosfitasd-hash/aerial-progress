-- Trigger per auto-creare profilo al signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger per aggiornare updated_at su profiles
CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Trigger per aggiornare updated_at su user_skills
CREATE OR REPLACE TRIGGER update_user_skills_updated_at
  BEFORE UPDATE ON public.user_skills
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Trigger per aggiornare updated_at su user_workouts
CREATE OR REPLACE TRIGGER update_user_workouts_updated_at
  BEFORE UPDATE ON public.user_workouts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();