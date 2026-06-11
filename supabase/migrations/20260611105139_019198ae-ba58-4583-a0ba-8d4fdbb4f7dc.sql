
-- ============================================================
-- 1) ADMIN AUDIT LOG
-- ============================================================
CREATE TABLE public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_user_id uuid,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX admin_audit_log_created_at_idx ON public.admin_audit_log(created_at DESC);
CREATE INDEX admin_audit_log_target_idx ON public.admin_audit_log(target_user_id);

GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read audit log"
  ON public.admin_audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
-- No INSERT/UPDATE/DELETE policy: writes happen only via SECURITY DEFINER functions.

-- ============================================================
-- 2) RATE LIMITING
-- ============================================================
CREATE TABLE public.rate_limit_events (
  id bigserial PRIMARY KEY,
  key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rate_limit_events_key_time_idx ON public.rate_limit_events(key, created_at DESC);

-- No client grants: clients access only via check_rate_limit RPC.
GRANT ALL ON public.rate_limit_events TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.rate_limit_events_id_seq TO service_role;

ALTER TABLE public.rate_limit_events ENABLE ROW LEVEL SECURITY;
-- No policies = no direct API access. SECURITY DEFINER function below bypasses RLS.

CREATE OR REPLACE FUNCTION public.check_rate_limit(_key text, _max int, _window_seconds int)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _count int;
BEGIN
  IF _key IS NULL OR length(_key) = 0 OR length(_key) > 256 THEN
    RETURN false;
  END IF;
  -- Opportunistic cleanup of stale rows (older than 1 day).
  DELETE FROM public.rate_limit_events WHERE created_at < now() - interval '1 day';
  SELECT count(*) INTO _count
    FROM public.rate_limit_events
   WHERE key = _key
     AND created_at > now() - make_interval(secs => _window_seconds);
  IF _count >= _max THEN
    RETURN false;
  END IF;
  INSERT INTO public.rate_limit_events(key) VALUES (_key);
  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, int, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, int, int) TO anon, authenticated;

-- ============================================================
-- 3) ADMIN FUNCTIONS — add audit logging
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_delete_user(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _email text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  IF _user_id = auth.uid() THEN
    RAISE EXCEPTION 'cannot delete yourself';
  END IF;

  SELECT email::text INTO _email FROM auth.users WHERE id = _user_id;

  DELETE FROM public.user_roles WHERE user_id = _user_id;
  DELETE FROM public.user_app_state WHERE user_id = _user_id;
  DELETE FROM public.workout_sessions WHERE user_id = _user_id;
  DELETE FROM public.user_workouts WHERE user_id = _user_id;
  DELETE FROM public.user_skills WHERE user_id = _user_id;
  DELETE FROM public.custom_exercises WHERE target_user_id = _user_id;
  DELETE FROM public.messages WHERE user_id = _user_id;
  DELETE FROM public.profiles WHERE id = _user_id;
  DELETE FROM auth.users WHERE id = _user_id;

  INSERT INTO public.admin_audit_log(actor_id, action, target_user_id, details)
  VALUES (auth.uid(), 'delete_user', _user_id, jsonb_build_object('email', _email));
END;
$$;

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

  INSERT INTO public.admin_audit_log(actor_id, action, target_user_id, details)
  VALUES (
    auth.uid(),
    CASE WHEN _grant THEN 'grant_role' ELSE 'revoke_role' END,
    _user_id,
    jsonb_build_object('role', _role::text)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_profile(
  _user_id uuid, _nickname text, _first_name text, _last_name text
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

  INSERT INTO public.admin_audit_log(actor_id, action, target_user_id, details)
  VALUES (auth.uid(), 'update_profile', _user_id,
          jsonb_build_object('nickname', _nickname, 'first_name', _first_name, 'last_name', _last_name));
END;
$$;

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

  INSERT INTO public.admin_audit_log(actor_id, action, target_user_id, details)
  VALUES (auth.uid(), 'reset_user_data', _user_id, NULL);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_delete_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_set_role(uuid, app_role, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_role(uuid, app_role, boolean) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_update_profile(uuid, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_profile(uuid, text, text, text) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_reset_user_data(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_reset_user_data(uuid) TO authenticated;

-- ============================================================
-- 4) SECURITY REPORT (RLS status per table)
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_security_report()
RETURNS TABLE(table_name text, rls_enabled boolean, policy_count int)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  RETURN QUERY
  SELECT c.relname::text,
         c.relrowsecurity,
         (SELECT count(*)::int FROM pg_policies p
            WHERE p.schemaname = 'public' AND p.tablename = c.relname)
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname = 'public' AND c.relkind = 'r'
   ORDER BY c.relname;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_security_report() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_security_report() TO authenticated;

-- ============================================================
-- 5) AUDIT LOG READER (joined with email/nickname for UI)
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_list_audit_log(_limit int DEFAULT 100)
RETURNS TABLE(
  id uuid, created_at timestamptz, action text,
  actor_id uuid, actor_email text,
  target_user_id uuid, target_email text, target_nickname text,
  details jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT l.id, l.created_at, l.action,
         l.actor_id, ua.email::text,
         l.target_user_id, ut.email::text, pt.nickname,
         l.details
    FROM public.admin_audit_log l
    LEFT JOIN auth.users ua ON ua.id = l.actor_id
    LEFT JOIN auth.users ut ON ut.id = l.target_user_id
    LEFT JOIN public.profiles pt ON pt.id = l.target_user_id
   WHERE public.has_role(auth.uid(), 'admin')
   ORDER BY l.created_at DESC
   LIMIT GREATEST(1, LEAST(_limit, 500));
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_audit_log(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_audit_log(int) TO authenticated;
