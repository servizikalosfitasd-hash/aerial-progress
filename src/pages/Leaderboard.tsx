import { useEffect, useState } from "react";
import { Crown, Trophy, Medal, Zap, Dumbbell, AlertCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HamburgerButton } from "@/components/HamburgerButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNickname } from "@/hooks/useNickname";
import { toast } from "sonner";

type Row = { nickname: string; kg: number | null; reps: number | null; updated_at: string };

type ExerciseKey = "pull" | "push" | "squat" | "stacco";

const EXERCISES: Record<ExerciseKey, { label: string; skill: string; group: string; idx: number; mode: "both" | "kg" }> = {
  pull: { label: "PULL UP", skill: "pull", group: "main", idx: 6, mode: "both" },
  push: { label: "PUSH UP", skill: "push", group: "main", idx: 1, mode: "both" },
  squat: { label: "SQUAT", skill: "legs", group: "weights", idx: 1, mode: "kg" },
  stacco: { label: "STACCO", skill: "legs", group: "weights", idx: 5, mode: "kg" },
};

function useLeaderboard(skill: string, group: string, idx: number) {
  const qc = useQueryClient();
  const queryKey = ["leaderboard", skill, group, idx];

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<Row[]> => {
      const { data, error } = await supabase.rpc("leaderboard" as any, {
        _skill: skill,
        _group: group,
        _idx: idx,
      });
      if (error) throw error;
      return (data as Row[]) ?? [];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`lb-${skill}-${group}-${idx}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_workouts" },
        (payload) => {
          const row = (payload.new ?? payload.old) as any;
          if (
            row?.skill_id === skill &&
            row?.group_id === group &&
            row?.progression_index === idx
          ) {
            qc.invalidateQueries({ queryKey });
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skill, group, idx]);

  return query;
}

const Leaderboard = () => {
  const { nickname, loading: nickLoading, save } = useNickname();
  const [nickInput, setNickInput] = useState("");
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    const res = await save(nickInput);
    setSaving(false);
    if (res.ok) {
      toast.success("Nickname impostato");
      setNickInput("");
    } else {
      toast.error(res.error ?? "Errore");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <HamburgerButton />
          <LanguageSwitcher />
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-5xl mx-auto px-6 py-10 sm:py-14 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-5">
            <Crown className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">
              Kalos Games
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[0.95] mb-3 text-foreground">
            Classifica
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Confronta i tuoi record con la community. Aggiornata in tempo reale dalle schede degli utenti.
          </p>
        </div>
      </section>

      {!nickLoading && !nickname && (
        <section className="container max-w-5xl mx-auto px-6 pt-6">
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5 shadow-[0_0_30px_-10px_hsl(var(--primary)/0.5)]">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-bold text-base mb-1">Imposta il tuo nickname</p>
                <p className="text-sm text-muted-foreground">
                  Senza nickname non comparirai in classifica. 3–20 caratteri (lettere, numeri, . _ -).
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                value={nickInput}
                onChange={(e) => setNickInput(e.target.value)}
                placeholder="es. iron_athlete"
                maxLength={20}
                className="bg-background/80 border-border"
              />
              <Button onClick={onSave} disabled={saving || nickInput.trim().length < 3}>
                Salva
              </Button>
            </div>
          </div>
        </section>
      )}

      {nickname && (
        <section className="container max-w-5xl mx-auto px-6 pt-6">
          <div className="text-xs tracking-widest uppercase text-muted-foreground">
            Gareggi come <span className="text-primary font-bold">{nickname}</span>
          </div>
        </section>
      )}

      <section className="container max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue="pull" className="w-full">
          <TabsList className="grid grid-cols-4 w-full bg-secondary/40 border border-border">
            {(Object.keys(EXERCISES) as ExerciseKey[]).map((k) => (
              <TabsTrigger
                key={k}
                value={k}
                className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-[inset_0_-2px_0_0_hsl(var(--primary))] font-bold tracking-wider text-xs sm:text-sm"
              >
                {EXERCISES[k].label}
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(EXERCISES) as ExerciseKey[]).map((k) => (
            <TabsContent key={k} value={k} className="mt-6">
              <ExerciseBoards ex={EXERCISES[k]} />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
};

const ExerciseBoards = ({ ex }: { ex: typeof EXERCISES[ExerciseKey] }) => {
  const { data, isLoading } = useLeaderboard(ex.skill, ex.group, ex.idx);
  const rows = data ?? [];

  if (ex.mode === "kg") {
    const sorted = [...rows]
      .filter((r) => r.kg != null && Number(r.kg) > 0)
      .sort((a, b) => {
        const dk = Number(b.kg) - Number(a.kg);
        if (dk !== 0) return dk;
        return (b.reps ?? 0) - (a.reps ?? 0);
      });
    return (
      <Board
        title="Top KG"
        icon={<Dumbbell className="h-4 w-4" />}
        rows={sorted}
        column="kg"
        loading={isLoading}
      />
    );
  }

  const power = [...rows]
    .filter((r) => r.kg != null && Number(r.kg) > 0)
    .sort((a, b) => {
      const dk = Number(b.kg) - Number(a.kg);
      if (dk !== 0) return dk;
      return (b.reps ?? 0) - (a.reps ?? 0);
    });
  const endurance = [...rows]
    .filter((r) => (r.kg == null || Number(r.kg) === 0) && r.reps != null && r.reps > 0)
    .sort((a, b) => (b.reps ?? 0) - (a.reps ?? 0));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Board
        title="Power"
        subtitle="Carico massimo (con zavorra)"
        icon={<Dumbbell className="h-4 w-4" />}
        rows={power}
        column="kg"
        loading={isLoading}
      />
      <Board
        title="Endurance"
        subtitle="Ripetizioni a corpo libero"
        icon={<Zap className="h-4 w-4" />}
        rows={endurance}
        column="reps"
        loading={isLoading}
      />
    </div>
  );
};

const Board = ({
  title,
  subtitle,
  icon,
  rows,
  column,
  loading,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  rows: Row[];
  column: "kg" | "reps";
  loading: boolean;
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 bg-secondary/30">
        <div className="flex items-center gap-2 text-primary">
          {icon}
          <p className="font-display font-bold text-sm tracking-wider uppercase">{title}</p>
        </div>
        {subtitle && (
          <span className="text-[10px] tracking-widest uppercase text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
      {loading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Caricamento…</div>
      ) : rows.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          Nessun record ancora. Sii il primo!
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-12 text-[10px] tracking-widest uppercase">#</TableHead>
              <TableHead className="text-[10px] tracking-widest uppercase">Nickname</TableHead>
              <TableHead className="text-right text-[10px] tracking-widest uppercase">
                {column === "kg" ? "KG" : "Reps"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <RankRow key={`${r.nickname}-${i}`} rank={i + 1} row={r} column={column} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

const RankRow = ({ rank, row, column }: { rank: number; row: Row; column: "kg" | "reps" }) => {
  const isPodium = rank <= 3;
  const podiumColor =
    rank === 1
      ? "text-yellow-400"
      : rank === 2
        ? "text-slate-300"
        : rank === 3
          ? "text-amber-600"
          : "";

  return (
    <TableRow
      className={`border-border ${
        isPodium
          ? "bg-primary/[0.04] hover:bg-primary/10 shadow-[inset_3px_0_0_0_hsl(var(--primary))]"
          : ""
      }`}
    >
      <TableCell className="font-bold">
        {isPodium ? (
          <span className={`inline-flex items-center gap-1 ${podiumColor}`}>
            <Medal className="h-4 w-4" />
            <span>{rank}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">{rank}</span>
        )}
      </TableCell>
      <TableCell
        className={`font-semibold ${
          rank === 1 ? "text-yellow-400" : isPodium ? "text-primary" : "text-foreground"
        }`}
      >
        {row.nickname}
      </TableCell>
      <TableCell className="text-right font-bold tabular-nums">
        {column === "kg" ? (
          <span className="text-primary">{Number(row.kg)} kg</span>
        ) : (
          <span className="text-primary">{row.reps}</span>
        )}
      </TableCell>
    </TableRow>
  );
};

export default Leaderboard;
