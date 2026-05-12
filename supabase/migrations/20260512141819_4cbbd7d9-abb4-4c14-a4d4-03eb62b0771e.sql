
-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'given_name', split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), ' ', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NEW.raw_user_meta_data->>'family_name', NULLIF(split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), ' ', 2), ''))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- user_workouts
CREATE TABLE public.user_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  progression_index INT NOT NULL,
  exercise_name TEXT NOT NULL,
  sets INT,
  reps INT,
  seconds INT,
  recovery INT,
  load_type TEXT,
  load_kg NUMERIC,
  load_band TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, skill_id, group_id, progression_index)
);
ALTER TABLE public.user_workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "uw_select_own" ON public.user_workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "uw_insert_own" ON public.user_workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "uw_update_own" ON public.user_workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "uw_delete_own" ON public.user_workouts FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER uw_set_updated_at BEFORE UPDATE ON public.user_workouts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX uw_user_skill_idx ON public.user_workouts (user_id, skill_id);

-- user_skills
CREATE TABLE public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  progression_index INT NOT NULL DEFAULT -1,
  done JSONB NOT NULL DEFAULT '[]'::jsonb,
  max_seconds INT,
  max_reps INT,
  max_kg NUMERIC,
  max_note TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, skill_id, group_id)
);
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "us_select_own" ON public.user_skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "us_insert_own" ON public.user_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "us_update_own" ON public.user_skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "us_delete_own" ON public.user_skills FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER us_set_updated_at BEFORE UPDATE ON public.user_skills
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX us_user_skill_idx ON public.user_skills (user_id, skill_id);
