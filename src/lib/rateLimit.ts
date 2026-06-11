import { supabase } from "@/integrations/supabase/client";

/**
 * Server-side rate limit guard.
 * Returns true if the action is allowed, false if the limit was hit.
 * Fails open on network errors so legitimate users are never locked out by infrastructure issues.
 */
export async function checkRateLimit(
  key: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("check_rate_limit" as any, {
      _key: key,
      _max: max,
      _window_seconds: windowSeconds,
    });
    if (error) return true;
    return data !== false;
  } catch {
    return true;
  }
}
