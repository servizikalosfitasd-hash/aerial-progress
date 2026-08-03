import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Lock, Unlock, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { SectionKey, SECTION_LABELS, isExpired } from "@/hooks/useSectionAccess";

const SECTIONS: SectionKey[] = ["scheda", "legs", "stretching", "stability", "circuits"];

type Flags = Record<SectionKey, boolean>;

const allFlags = (v: boolean): Flags => ({
  scheda: v,
  legs: v,
  stretching: v,
  stability: v,
  circuits: v,
});

const toInputDate = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");

export function UserAccessPanel({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [flags, setFlags] = useState<Flags>(allFlags(true));

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("user_access")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) {
      setExpiresAt(toInputDate(data.expires_at));
      setFlags({
        scheda: data.scheda_enabled,
        legs: data.legs_enabled,
        stretching: data.stretching_enabled,
        stability: data.stability_enabled,
        circuits: data.circuits_enabled,
      });
    } else {
      setExpiresAt("");
      setFlags(allFlags(true));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const save = async (next?: { expiresAt?: string; flags?: Flags }) => {
    const exp = next?.expiresAt ?? expiresAt;
    const f = next?.flags ?? flags;
    setSaving(true);
    const { error } = await (supabase as any).rpc("admin_set_user_access", {
      _user_id: userId,
      _expires_at: exp ? new Date(`${exp}T23:59:59`).toISOString() : null,
      _scheda: f.scheda,
      _legs: f.legs,
      _stretching: f.stretching,
      _stability: f.stability,
      _circuits: f.circuits,
    });
    setSaving(false);
    if (error) return toast.error("Errore: " + error.message);
    toast.success("Accessi aggiornati");
    load();
  };

  const addMonths = (m: number) => {
    const base = expiresAt && !isExpired(new Date(`${expiresAt}T23:59:59`).toISOString())
      ? new Date(`${expiresAt}T23:59:59`)
      : new Date();
    base.setMonth(base.getMonth() + m);
    const v = base.toISOString().slice(0, 10);
    setExpiresAt(v);
    save({ expiresAt: v });
  };

  const setAll = (v: boolean) => {
    const f = allFlags(v);
    setFlags(f);
    save({ flags: f });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const expIso = expiresAt ? new Date(`${expiresAt}T23:59:59`).toISOString() : null;
  const expired = isExpired(expIso);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" /> Scadenza abbonamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Attivo fino al</Label>
            <Input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {expiresAt ? (
              expired ? (
                <Badge variant="destructive">Scaduto</Badge>
              ) : (
                <Badge variant="default">Attivo</Badge>
              )
            ) : (
              <Badge variant="outline">Nessuna scadenza</Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {expiresAt
                ? `Le sezioni si bloccano dopo il ${new Date(`${expiresAt}T23:59:59`).toLocaleDateString("it-IT")}`
                : "Accesso illimitato nel tempo"}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => addMonths(1)}>+1 mese</Button>
            <Button size="sm" variant="outline" onClick={() => addMonths(3)}>+3 mesi</Button>
            <Button size="sm" variant="outline" onClick={() => addMonths(12)}>+12 mesi</Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setExpiresAt("");
                save({ expiresAt: "" });
              }}
            >
              Rimuovi scadenza
            </Button>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => save()} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salva
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" /> Sezioni accessibili
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SECTIONS.map((s) => (
            <div key={s} className="flex items-center justify-between gap-3">
              <div className="text-sm">
                {SECTION_LABELS[s]}
                {expired && flags[s] && (
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    bloccata da scadenza
                  </span>
                )}
              </div>
              <Switch
                checked={flags[s]}
                onCheckedChange={(v) => {
                  const f = { ...flags, [s]: v };
                  setFlags(f);
                  save({ flags: f });
                }}
              />
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={() => setAll(false)}>
              <Lock className="h-4 w-4" /> Blocca tutto
            </Button>
            <Button size="sm" variant="outline" onClick={() => setAll(true)}>
              <Unlock className="h-4 w-4" /> Sblocca tutto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
