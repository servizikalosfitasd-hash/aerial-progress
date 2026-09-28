import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { MessagesThread } from "@/components/MessagesThread";
import { Button } from "@/components/ui/button";

type Thread = {
  user_id: string;
  email: string;
  nickname: string | null;
  first_name: string | null;
  last_name: string | null;
  last_message: string | null;
  last_message_at: string | null;
  last_sender_is_admin: boolean | null;
  unread_from_user: number;
};

interface Props {
  selectedUserId: string;
  onSelectUser: (id: string) => void;
}

export function AdminMessagesPanel({ selectedUserId, onSelectUser }: Props) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.rpc("admin_list_message_threads" as any);
    setThreads((data as Thread[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("admin-threads")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const label = (t: Thread) =>
    t.nickname || [t.first_name, t.last_name].filter(Boolean).join(" ") || t.email;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-4">
      <Card className="md:max-h-[70vh] md:overflow-y-auto">
        <CardHeader className="pb-2 sticky top-0 bg-card z-10">
          <CardTitle className="text-sm">Conversazioni</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : threads.length === 0 ? (
            <p className="text-xs text-muted-foreground p-3">
              Nessuna conversazione ancora. Seleziona un utente sopra per iniziare a scrivere.
            </p>
          ) : (
            <ul className="space-y-1">
              {threads.map((t) => {
                const active = t.user_id === selectedUserId;
                return (
                  <li key={t.user_id}>
                    <Button variant="ghost"
                      onClick={() => onSelectUser(t.user_id)}
                      className={`w-full h-auto min-w-0 justify-start text-left rounded-md p-2 transition ${
                        active ? "bg-primary/10 border border-primary/40" : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm truncate">{label(t)}</span>
                        {t.unread_from_user > 0 && (
                          <Badge variant="default" className="h-5 px-1.5 text-[10px]">
                            {t.unread_from_user}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {t.last_sender_is_admin ? "Tu: " : ""}
                        {t.last_message}
                      </p>
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {selectedUserId ? "Chat con l'utente" : "Seleziona un utente"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedUserId ? (
            <MessagesThread userId={selectedUserId} isAdminView />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Scegli un utente dall'elenco a sinistra o dal selettore in cima.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
