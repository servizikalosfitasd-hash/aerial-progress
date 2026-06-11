
-- Lock down SECURITY DEFINER functions: revoke from PUBLIC/anon, grant only to authenticated where needed.
-- Each admin_* function already self-checks public.has_role(auth.uid(),'admin') internally.

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.leaderboard(text, text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.leaderboard(text, text, integer) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_list_users() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_list_message_threads() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_message_threads() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_delete_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_get_user_overview(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_user_overview(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_reset_user_data(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_reset_user_data(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_update_profile(uuid, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_profile(uuid, text, text, text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_set_role(uuid, app_role, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_role(uuid, app_role, boolean) TO authenticated;

-- Trigger-only functions: no callers should execute directly
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
