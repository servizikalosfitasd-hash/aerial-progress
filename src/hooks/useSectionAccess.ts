import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type SectionKey = "scheda" | "legs" | "stretching" | "stability" | "circuits";

export const SECTION_LABELS: Record<SectionKey, string> = {
  scheda: "Scheda Allenamento",
  legs: "Gambe",
  stretching: "Stretching",
  stability: "Stability",
  circuits: "Circuiti",
};

export const SECTION_BY_PATH: Record<string, SectionKey> = {
  "/scheda": "scheda",
  "/legs": "legs",
  "/stretching": "stretching",
  "/stability": "stability",
  "/circuits": "circuits",
};

export type UserAccessRow = {
  user_id: string;
  expires_at: string | null;
  scheda_enabled: boolean;
  legs_enabled: boolean;
  stretching_enabled: boolean;
  stability_enabled: boolean;
  circuits_enabled: boolean;
};

export function isExpired(expiresAt: string | null | undefined) {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}

export function useSectionAccess() {
  const { user } = useAuth();
  const [row, setRow] = useState<UserAccessRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!user) {
      setRow(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    (supabase as any)
      .from("user_access")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }: any) => {
        if (!active) return;
        setRow((data as UserAccessRow) ?? null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const expired = isExpired(row?.expires_at);

  const isAllowed = (section: SectionKey) => {
    if (!row) return true;
    const enabled = row[`${section}_enabled` as keyof UserAccessRow] as boolean;
    return enabled !== false && !expired;
  };

  return { loading, access: row, expired, expiresAt: row?.expires_at ?? null, isAllowed };
}
