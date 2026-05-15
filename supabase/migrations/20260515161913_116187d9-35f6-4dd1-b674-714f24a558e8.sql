CREATE TABLE public.workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  skill_id text NOT NULL,
  year integer NOT NULL,
  iso_week integer NOT NULL,
  phase text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  entries jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_workout_sessions_user_year_week ON public.workout_sessions(user_id, year, iso_week);
CREATE INDEX idx_workout_sessions_user_skill ON public.workout_sessions(user_id, skill_id, completed_at DESC);

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY ws_select_own ON public.workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY ws_insert_own ON public.workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY ws_update_own ON public.workout_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY ws_delete_own ON public.workout_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER trg_ws_updated_at
BEFORE UPDATE ON public.workout_sessions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();