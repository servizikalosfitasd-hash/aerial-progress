import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export type Message = {
  id: string;
  user_id: string;
  sender_id: string;
  sender_is_admin: boolean;
  body: string;
  read_at: string | null;
  created_at: string;
};

interface Props {
  /** Thread owner (the regular user the conversation belongs to). */
  userId: string;
  /** True if current viewer is the admin. */
  isAdminView: boolean;
  className?: string;
}

export function MessagesThread({ userId, isAdminView, className }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error) toast.error(error.message);
    setMessages((data as Message[]) ?? []);
    setLoading(false);
  };

  // Mark inbound messages as read
  const markRead = async () => {
    if (!user) return;
    const unread = messages.filter(
      (m) => !m.read_at && m.sender_is_admin !== isAdminView,
    );
    if (unread.length === 0) return;
    await (supabase as any)
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .in(
        "id",
        unread.map((m) => m.id),
      );
  };

  useEffect(() => {
    load();
  }, [userId]);

  useEffect(() => {
    const channel = supabase
      .channel(`messages-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `user_id=eq.${userId}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    markRead();
  }, [messages.length]);

  const send = async () => {
    if (!user || !body.trim()) return;
    setSending(true);
    const payload = {
      user_id: userId,
      sender_id: user.id,
      sender_is_admin: isAdminView,
      body: body.trim(),
    };
    const { error } = await (supabase as any).from("messages").insert(payload);
    setSending(false);
    if (error) return toast.error(error.message);
    // Notifica push all'atleta quando scrive l'admin
    if (isAdminView) {
      supabase.functions
        .invoke("send-message-push", {
          body: { userId, body: payload.body },
        })
        .catch(() => {});
    }
    setBody("");

  };

  return (
    <div className={`flex flex-col h-[60vh] border border-border/50 rounded-lg bg-card ${className ?? ""}`}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Nessun messaggio. Inizia la conversazione!
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_is_admin === isAdminView;
            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap break-words ${
                    mine
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  <div>{m.body}</div>
                  <div className={`text-[10px] mt-1 opacity-70 ${mine ? "text-right" : ""}`}>
                    {new Date(m.created_at).toLocaleString("it-IT", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {mine && m.read_at && " · letto"}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="border-t border-border/50 p-3 flex items-end gap-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Scrivi un messaggio…"
          rows={2}
          className="resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <Button onClick={send} disabled={sending || !body.trim()} size="icon">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
