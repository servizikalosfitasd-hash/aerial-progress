
CREATE TABLE public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_is_admin boolean not null default false,
  body text not null check (length(body) > 0 and length(body) <= 4000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

CREATE INDEX messages_user_created_idx ON public.messages(user_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "msg_select_own_or_admin" ON public.messages
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "msg_insert_user_own" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND sender_id = auth.uid() AND sender_is_admin = false);

CREATE POLICY "msg_insert_admin" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND sender_id = auth.uid() AND sender_is_admin = true);

CREATE POLICY "msg_update_read" ON public.messages
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "msg_delete_admin" ON public.messages
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

CREATE OR REPLACE FUNCTION public.admin_list_message_threads()
RETURNS TABLE(
  user_id uuid,
  email text,
  nickname text,
  first_name text,
  last_name text,
  last_message text,
  last_message_at timestamptz,
  last_sender_is_admin boolean,
  unread_from_user bigint
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM (
    SELECT
      u.id AS user_id,
      u.email::text AS email,
      p.nickname,
      p.first_name,
      p.last_name,
      (SELECT body FROM public.messages m WHERE m.user_id = u.id ORDER BY created_at DESC LIMIT 1) AS last_message,
      (SELECT created_at FROM public.messages m WHERE m.user_id = u.id ORDER BY created_at DESC LIMIT 1) AS last_message_at,
      (SELECT sender_is_admin FROM public.messages m WHERE m.user_id = u.id ORDER BY created_at DESC LIMIT 1) AS last_sender_is_admin,
      (SELECT count(*) FROM public.messages m WHERE m.user_id = u.id AND m.sender_is_admin = false AND m.read_at IS NULL) AS unread_from_user
    FROM auth.users u
    LEFT JOIN public.profiles p ON p.id = u.id
    WHERE public.has_role(auth.uid(), 'admin')
      AND EXISTS (SELECT 1 FROM public.messages m WHERE m.user_id = u.id)
  ) t
  ORDER BY t.last_message_at DESC NULLS LAST;
$$;
