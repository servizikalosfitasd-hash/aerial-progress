import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react";

type Row = { table_name: string; rls_enabled: boolean; policy_count: number };

// Tables that intentionally have no policies (locked from API by design).
const LOCKED_BY_DESIGN = new Set(["rate_limit_events"]);

export function AdminSecurityReportPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.rpc("admin_security_report" as any);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const issues = rows.filter(
    (r) => !r.rls_enabled || (r.policy_count === 0 && !LOCKED_BY_DESIGN.has(r.table_name)),
  );

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> Report sicurezza tabelle
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                issues.length === 0 ? "text-primary" : "text-destructive"
              }`}
            >
              {issues.length === 0 ? (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Isolamento RLS attivo su tutte le tabelle
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  {issues.length} tabella/e da rivedere
                </>
              )}
            </div>
            <div className="divide-y divide-border">
              {rows.map((r) => {
                const lockedByDesign = LOCKED_BY_DESIGN.has(r.table_name);
                const safe = r.rls_enabled && (r.policy_count > 0 || lockedByDesign);
                return (
                  <div key={r.table_name} className="py-2 flex items-center justify-between text-sm">
                    <span className="font-mono text-xs">{r.table_name}</span>
                    <div className="flex items-center gap-2">
                      {r.rls_enabled ? (
                        <Badge variant="secondary" className="text-[10px]">RLS on</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px]">RLS off</Badge>
                      )}
                      <Badge
                        variant={r.policy_count > 0 ? "secondary" : lockedByDesign ? "outline" : "destructive"}
                        className="text-[10px]"
                      >
                        {r.policy_count} polic{r.policy_count === 1 ? "y" : "ies"}
                        {lockedByDesign && r.policy_count === 0 ? " · locked" : ""}
                      </Badge>
                      {safe ? (
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ShieldAlert className="h-3.5 w-3.5 text-destructive" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground pt-2">
              Ogni utente autenticato può leggere/scrivere solo i propri dati grazie alle policy basate su
              <code className="mx-1 px-1 rounded bg-muted">auth.uid()</code>. Le tabelle marcate
              <em> locked</em> sono accessibili solo via funzioni server (SECURITY DEFINER).
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
