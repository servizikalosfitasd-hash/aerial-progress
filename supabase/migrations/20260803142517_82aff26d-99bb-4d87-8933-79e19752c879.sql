CREATE TABLE public.user_access (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at timestamptz,
  scheda_enabled boolean NOT NULL DEFAULT true,
  legs_enabled boolean NOT NULL DEFAULT true,
  stretching_enabled boolean NOT NULL DEFAULT true,
  stability_enabled boolean NOT NULL DEFAULT true,
  circuits_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_access TO authenticated;
GRANT ALL ON public.user_access TO service_role;

ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ua_select_own_or_admin" ON public.user_access
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "ua_admin_insert" ON public.user_access
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "ua_admin_update" ON public.user_access
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "ua_admin_delete" ON public.user_access
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER user_access_set_updated_at
  BEFORE UPDATE ON public.user_access
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.admin_set_user_access(
  _user_id uuid,
  _expires_at timestamptz,
  _scheda boolean,
  _legs boolean,
  _stretching boolean,
  _stability boolean,
  _circuits boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  INSERT INTO public.user_access (user_id, expires_at, scheda_enabled, legs_enabled, stretching_enabled, stability_enabled, circuits_enabled)
  VALUES (_user_id, _expires_at, _scheda, _legs, _stretching, _stability, _circuits)
  ON CONFLICT (user_id) DO UPDATE
    SET expires_at = EXCLUDED.expires_at,
        scheda_enabled = EXCLUDED.scheda_enabled,
        legs_enabled = EXCLUDED.legs_enabled,
        stretching_enabled = EXCLUDED.stretching_enabled,
        stability_enabled = EXCLUDED.stability_enabled,
        circuits_enabled = EXCLUDED.circuits_enabled,
        updated_at = now();

  INSERT INTO public.admin_audit_log(actor_id, action, target_user_id, details)
  VALUES (auth.uid(), 'set_user_access', _user_id,
    jsonb_build_object(
      'expires_at', _expires_at,
      'scheda', _scheda,
      'legs', _legs,
      'stretching', _stretching,
      'stability', _stability,
      'circuits', _circuits
    ));
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_user_access(uuid, timestamptz, boolean, boolean, boolean, boolean, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_user_access(uuid, timestamptz, boolean, boolean, boolean, boolean, boolean) TO authenticated;