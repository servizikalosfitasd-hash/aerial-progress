CREATE TABLE public.user_plan_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section text NOT NULL CHECK (section IN ('warmup','stretching','mobility')),
  skill_id text,
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_plan_notes_content_len CHECK (char_length(content) <= 4000),
  CONSTRAINT user_plan_notes_mobility_skill CHECK (
    (section = 'mobility' AND skill_id IS NOT NULL) OR
    (section <> 'mobility' AND skill_id IS NULL)
  )
);

CREATE UNIQUE INDEX user_plan_notes_unique
  ON public.user_plan_notes (user_id, section, COALESCE(skill_id, ''));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_plan_notes TO authenticated;
GRANT ALL ON public.user_plan_notes TO service_role;

ALTER TABLE public.user_plan_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own plan notes"
  ON public.user_plan_notes FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins insert plan notes"
  ON public.user_plan_notes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update plan notes"
  ON public.user_plan_notes FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete plan notes"
  ON public.user_plan_notes FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER user_plan_notes_set_updated_at
  BEFORE UPDATE ON public.user_plan_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();