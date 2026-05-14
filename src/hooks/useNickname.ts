import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useNickname() {
  const { user } = useAuth();
  const [nickname, setNickname] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNickname(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", user.id)
        .maybeSingle();
      if (!cancelled) {
        setNickname((data?.nickname as string | null) ?? null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const save = useCallback(
    async (value: string): Promise<{ ok: boolean; error?: string }> => {
      if (!user) return { ok: false, error: "Non autenticato" };
      const v = value.trim();
      if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(v)) {
        return { ok: false, error: "3–20 caratteri: lettere, numeri, . _ -" };
      }
      const { error } = await supabase
        .from("profiles")
        .update({ nickname: v })
        .eq("id", user.id);
      if (error) {
        if (error.code === "23505") return { ok: false, error: "Nickname già in uso" };
        return { ok: false, error: error.message };
      }
      setNickname(v);
      return { ok: true };
    },
    [user],
  );

  return { nickname, loading, save };
}
