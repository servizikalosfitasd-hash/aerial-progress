-- Add nickname to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nickname text;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_nickname_lower_unique ON public.profiles (lower(nickname));

-- Allow authenticated users to read nicknames of other users (only nickname is exposed via the function below; direct table access still restricted by existing RLS to own rows)

-- Leaderboard function
CREATE OR REPLACE FUNCTION public.leaderboard(_skill text, _group text, _idx int)
RETURNS TABLE(nickname text, kg numeric, reps int, updated_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.nickname,
         w.load_kg,
         w.reps,
         w.updated_at
  FROM public.user_workouts w
  JOIN public.profiles p ON p.id = w.user_id
  WHERE w.skill_id = _skill
    AND w.group_id = _group
    AND w.progression_index = _idx
    AND p.nickname IS NOT NULL
    AND (w.load_kg IS NOT NULL OR w.reps IS NOT NULL);
$$;

REVOKE ALL ON FUNCTION public.leaderboard(text, text, int) FROM public;
GRANT EXECUTE ON FUNCTION public.leaderboard(text, text, int) TO authenticated;

-- Enable realtime for user_workouts
ALTER TABLE public.user_workouts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_workouts;