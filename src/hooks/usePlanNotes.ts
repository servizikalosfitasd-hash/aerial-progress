import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PlanNoteSection = "warmup" | "stretching" | "mobility";

export function usePlanNotes(userId: string | undefined, section: PlanNoteSection, skillId?: string) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const key = skillId ?? "";

  const load = useCallback(async () => {
    if (!userId) {
      setContent("");
      setLoading(false);
      return;
    }
    setLoading(true);
    let q = (supabase as any)
      .from("user_plan_notes")
      .select("content")
      .eq("user_id", userId)
      .eq("section", section);
    q = section === "mobility" ? q.eq("skill_id", skillId ?? "") : q.is("skill_id", null);
    const { data } = await q.maybeSingle();
    setContent(data?.content ?? "");
    setLoading(false);
  }, [userId, section, key]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (newContent: string) => {
      if (!userId) return { error: new Error("no user") };
      const payload: any = {
        user_id: userId,
        section,
        skill_id: section === "mobility" ? skillId ?? null : null,
        content: newContent,
      };
      // Manual upsert on composite key (COALESCE index) — try update then insert.
      let query = (supabase as any)
        .from("user_plan_notes")
        .update({ content: newContent })
        .eq("user_id", userId)
        .eq("section", section);
      query = section === "mobility" ? query.eq("skill_id", skillId ?? "") : query.is("skill_id", null);
      const { data: updated, error: upErr } = await query.select("id");
      if (upErr) return { error: upErr };
      if (!updated || updated.length === 0) {
        const { error: insErr } = await (supabase as any).from("user_plan_notes").insert(payload);
        if (insErr) return { error: insErr };
      }
      setContent(newContent);
      return { error: null };
    },
    [userId, section, key],
  );

  return { content, setContent, save, loading, reload: load };
}
