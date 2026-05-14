import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * State synced with Supabase `user_app_state` table when logged in,
 * with localStorage fallback for guests. The same `storageKey` is used
 * for both the local cache and the remote `key` column, so existing
 * local data is automatically migrated on first save.
 */
export function useSyncedState<T>(storageKey: string, initial: T) {
  const { user } = useAuth();
  const [value, setValue] = useState<T>(() => readLocal(storageKey, initial));
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<number | undefined>(undefined);
  const skipNextSave = useRef(true);

  // Load from DB whenever auth changes
  useEffect(() => {
    let cancelled = false;
    skipNextSave.current = true;
    (async () => {
      if (!user) {
        setValue(readLocal(storageKey, initial));
        setHydrated(true);
        return;
      }
      const { data } = await supabase
        .from("user_app_state")
        .select("value")
        .eq("user_id", user.id)
        .eq("key", storageKey)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setValue(data.value as T);
      } else {
        // Migrate any pre-existing local value into the DB
        const local = readLocal<T | null>(storageKey, null as any);
        if (local != null) {
          await supabase.from("user_app_state").upsert({
            user_id: user.id,
            key: storageKey,
            value: local as any,
          });
          setValue(local);
        } else {
          setValue(initial);
        }
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, storageKey]);

  // Persist on change (local always; DB debounced when logged in)
  useEffect(() => {
    if (!hydrated) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* ignore */
    }
    if (!user) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      supabase
        .from("user_app_state")
        .upsert({ user_id: user.id, key: storageKey, value: value as any })
        .then(() => {});
    }, 400);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [value, hydrated, user, storageKey]);

  const setSyncedValue = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) =>
      typeof next === "function" ? (next as (p: T) => T)(prev) : next,
    );
  }, []);

  return [value, setSyncedValue, hydrated] as const;
}

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
