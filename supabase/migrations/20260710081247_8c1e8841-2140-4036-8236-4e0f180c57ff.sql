
-- Hardening: revoke EXECUTE on all SECURITY DEFINER functions from PUBLIC.
-- Anon retains EXECUTE only on check_rate_limit (needed pre-login on Auth page).
-- Authenticated retains EXECUTE only where required: has_role (RLS policies),
-- leaderboard (public read of workout leaderboard), and admin_* RPCs which all
-- perform an internal has_role(auth.uid(),'admin') check.

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.leaderboard(text, text, integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_list_users() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_list_message_threads() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_list_audit_log(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_delete_user(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_get_user_overview(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_reset_user_data(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_update_profile(uuid, text, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_set_role(uuid, app_role, boolean) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_security_report() FROM PUBLIC, anon;

-- Trigger-only functions: no client should ever execute these directly.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- check_rate_limit MUST remain executable by anon (used on the login/signup
-- page before an auth session exists). Revoke only from PUBLIC as belt-and-braces.
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) TO anon, authenticated;
