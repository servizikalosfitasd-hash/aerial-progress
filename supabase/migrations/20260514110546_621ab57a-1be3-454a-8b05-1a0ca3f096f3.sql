CREATE TABLE public.user_app_state (
  user_id uuid NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
);

ALTER TABLE public.user_app_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "uas_select_own" ON public.user_app_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "uas_insert_own" ON public.user_app_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "uas_update_own" ON public.user_app_state FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "uas_delete_own" ON public.user_app_state FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER uas_set_updated_at
BEFORE UPDATE ON public.user_app_state
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();