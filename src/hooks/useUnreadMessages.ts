import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { toast } from "sonner";

/**
 * Returns the unread message count for the current user.
 * - Regular user: messages addressed to them (sent by admin) that are unread.
 * - Admin: messages from any user (sender_is_admin=false) that are unread.
 * Also shows a toast notification when a new inbound message arrives.
 */
export function useUnreadMessages() {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    if (!user) return setCount(0);
    let q = (supabase as any)
      .from("messages")
      .select("id", { count: "exact", head: true })
      .is("read_at", null);
    if (isAdmin) {
      q = q.eq("sender_is_admin", false);
    } else {
      q = q.eq("user_id", user.id).eq("sender_is_admin", true);
    }
    const { count: c } = await q;
    setCount(c ?? 0);
  };

  useEffect(() => {
    fetchCount();
  }, [user?.id, isAdmin]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`unread-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row: any = payload.new;
          const inboundForMe = isAdmin
            ? row.sender_is_admin === false && row.sender_id !== user.id
            : row.user_id === user.id && row.sender_is_admin === true;
          if (inboundForMe) {
            fetchCount();
            // Only notify if user isn't already on the messages page
            if (!window.location.pathname.startsWith("/messaggi") && !window.location.pathname.startsWith("/admin")) {
              toast.message("Nuovo messaggio", { description: row.body.slice(0, 120) });
            }
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        () => fetchCount(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, isAdmin]);

  return count;
}
