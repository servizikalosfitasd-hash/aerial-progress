
-- Delete a user entirely (auth row + all their data)
CREATE OR REPLACE FUNCTION public.admin_delete_user(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  IF _user_id = auth.uid() THEN
    RAISE EXCEPTION 'cannot delete yourself';
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _user_id;
  DELETE FROM public.user_app_state WHERE user_id = _user_id;
  DELETE FROM public.workout_sessions WHERE user_id = _user_id;
  DELETE FROM public.user_workouts WHERE user_id = _user_id;
  DELETE FROM public.user_skills WHERE user_id = _user_id;
  DELETE FROM public.custom_exercises WHERE target_user_id = _user_id;
  DELETE FROM public.profiles WHERE id = _user_id;
  DELETE FROM auth.users WHERE id = _user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_delete_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;

-- Grant or revoke a role for a user
CREATE OR REPLACE FUNCTION public.admin_set_role(_user_id uuid, _role app_role, _grant boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  IF _grant THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, _role)
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    IF _role = 'admin' AND _user_id = auth.uid() THEN
      RAISE EXCEPTION 'cannot remove your own admin role';
    END IF;
    DELETE FROM public.user_roles WHERE user_id = _user_id AND role = _role;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_role(uuid, app_role, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_role(uuid, app_role, boolean) TO authenticated;

-- Update profile fields
CREATE OR REPLACE FUNCTION public.admin_update_profile(
  _user_id uuid,
  _nickname text,
  _first_name text,
  _last_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  UPDATE public.profiles
     SET nickname = _nickname,
         first_name = _first_name,
         last_name = _last_name,
         updated_at = now()
   WHERE id = _user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_profile(uuid, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_profile(uuid, text, text, text) TO authenticated;

-- Reset user's training data
CREATE OR REPLACE FUNCTION public.admin_reset_user_data(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  DELETE FROM public.workout_sessions WHERE user_id = _user_id;
  DELETE FROM public.user_workouts WHERE user_id = _user_id;
  DELETE FROM public.user_skills WHERE user_id = _user_id;
  DELETE FROM public.user_app_state WHERE user_id = _user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_reset_user_data(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_reset_user_data(uuid) TO authenticated;

-- Overview of a user (auth fields + counts + admin flag)
CREATE OR REPLACE FUNCTION public.admin_get_user_overview(_user_id uuid)
RETURNS TABLE(
  email text,
  email_confirmed_at timestamptz,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  is_admin boolean,
  sessions_count bigint,
  skills_count bigint,
  custom_exercises_count bigint
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.email::text,
    u.email_confirmed_at,
    u.created_at,
    u.last_sign_in_at,
    public.has_role(_user_id, 'admin') AS is_admin,
    (SELECT count(*) FROM public.workout_sessions WHERE user_id = _user_id) AS sessions_count,
    (SELECT count(*) FROM public.user_skills WHERE user_id = _user_id AND progression_index >= 0) AS skills_count,
    (SELECT count(*) FROM public.custom_exercises WHERE target_user_id = _user_id) AS custom_exercises_count
  FROM auth.users u
  WHERE u.id = _user_id
    AND public.has_role(auth.uid(), 'admin');
$$;

REVOKE ALL ON FUNCTION public.admin_get_user_overview(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_user_overview(uuid) TO authenticated;
