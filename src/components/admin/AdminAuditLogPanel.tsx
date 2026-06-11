import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, ScrollText } from "lucide-react";

type Entry = {
  id: string;
  created_at: string;
  action: string;
  actor_id: string | null;
  actor_email: string | null;
  target_user_id: string | null;
  target_email: string | null;
  target_nickname: string | null;
  details: Record<string, unknown> | null;
};

const ACTION_LABEL: Record<string, string> = {
  delete_user: "Eliminazione utente",
  grant_role: "Ruolo concesso",
  revoke_role: "Ruolo revocato",
  update_profile: "Profilo modificato",
  reset_user_data: "Reset dati allenamento",
};

const ACTION_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  delete_user: "destructive",
  grant_role: "default",
  revoke_role: "secondary",
  update_profile: "secondary",
  reset_user_data: "destructive",
};

export function AdminAuditLogPanel() {
  const [rows, setRows] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_audit_log" as any, { _limit: 100 });
    if (!error) setRows((data as Entry[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-primary" /> Registro azioni admin
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Nessuna azione registrata.
          </p>
        ) : (
          <div className="divide-y divide-border max-h-[480px] overflow-y-auto -mx-2">
            {rows.map((r) => (
              <div key={r.id} className="px-2 py-3 text-xs space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Badge variant={ACTION_VARIANT[r.action] ?? "secondary"} className="text-[10px]">
                    {ACTION_LABEL[r.action] ?? r.action}
                  </Badge>
                  <span className="text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("it-IT")}
                  </span>
                </div>
                <p>
                  <span className="text-muted-foreground">Admin:</span>{" "}
                  <span className="font-medium">{r.actor_email ?? r.actor_id ?? "—"}</span>
                </p>
                {r.target_user_id && (
                  <p>
                    <span className="text-muted-foreground">Utente:</span>{" "}
                    <span className="font-medium">
                      {r.target_nickname || r.target_email || r.target_user_id}
                    </span>
                  </p>
                )}
                {r.details && Object.keys(r.details).length > 0 && (
                  <pre className="text-[10px] text-muted-foreground bg-muted/50 rounded p-2 overflow-x-auto">
                    {JSON.stringify(r.details, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
