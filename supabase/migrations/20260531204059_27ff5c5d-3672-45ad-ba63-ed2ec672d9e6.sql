-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Auto-grant admin to the fixed super-admin email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'kalos.fit.asd@outlook.it' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Backfill if the admin user already exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE lower(email) = 'kalos.fit.asd@outlook.it'
ON CONFLICT (user_id, role) DO NOTHING;

-- Custom exercises (admin authored)
CREATE TABLE public.custom_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL,
  target_user_id uuid,             -- NULL = global
  is_global boolean NOT NULL DEFAULT false,
  skill_id text,                   -- optional: link to a skill
  category text,                   -- Dinamico | Isometria | Potenziamento | Zavorre | Elastici
  name text NOT NULL,
  description text,
  sets integer,
  reps integer,
  seconds integer,
  recovery integer,
  load_kg numeric,
  load_band text,
  notes text,
  video_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_exercises TO authenticated;
GRANT ALL ON public.custom_exercises TO service_role;

ALTER TABLE public.custom_exercises ENABLE ROW LEVEL SECURITY;

-- Users: can read exercises that are global or assigned to them
CREATE POLICY "Users read own or global exercises" ON public.custom_exercises
  FOR SELECT TO authenticated
  USING (is_global = true OR target_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Admin: full write
CREATE POLICY "Admins insert exercises" ON public.custom_exercises
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update exercises" ON public.custom_exercises
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete exercises" ON public.custom_exercises
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_custom_exercises_updated_at
  BEFORE UPDATE ON public.custom_exercises
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_custom_exercises_target ON public.custom_exercises(target_user_id);
CREATE INDEX idx_custom_exercises_global ON public.custom_exercises(is_global) WHERE is_global = true;

-- Allow admin to list users by email/nickname via a security-definer view function
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (id uuid, email text, nickname text, first_name text, last_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id, u.email::text, p.nickname, p.first_name, p.last_name
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY u.created_at DESC
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;
