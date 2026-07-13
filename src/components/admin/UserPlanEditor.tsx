import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { skills } from "@/data/skills";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PlanNoteEditor } from "@/components/admin/PlanNoteEditor";

type UserSkillRow = {
  id: string;
  user_id: string;
  skill_id: string;
  group_id: string;
  progression_index: number;
};

type UserWorkoutRow = {
  id: string;
  user_id: string;
  skill_id: string;
  group_id: string;
  progression_index: number;
  exercise_name: string;
  sets: number | null;
  reps: number | null;
  seconds: number | null;
  recovery: number | null;
  load_kg: number | null;
  load_band: string | null;
  load_type: string | null;
};

export function UserPlanEditor({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [userSkills, setUserSkills] = useState<UserSkillRow[]>([]);
  const [workouts, setWorkouts] = useState<UserWorkoutRow[]>([]);

  const load = async () => {
    setLoading(true);
    const [{ data: us }, { data: uw }] = await Promise.all([
      (supabase as any).from("user_skills").select("*").eq("user_id", userId),
      (supabase as any).from("user_workouts").select("*").eq("user_id", userId),
    ]);
    setUserSkills((us as UserSkillRow[]) ?? []);
    setWorkouts((uw as UserWorkoutRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const skillIndex = useMemo(() => {
    const m = new Map<string, Map<string, UserSkillRow>>();
    for (const r of userSkills) {
      if (!m.has(r.skill_id)) m.set(r.skill_id, new Map());
      m.get(r.skill_id)!.set(r.group_id, r);
    }
    return m;
  }, [userSkills]);

  const workoutIndex = useMemo(() => {
    const m = new Map<string, UserWorkoutRow>();
    for (const r of workouts) {
      m.set(`${r.skill_id}|${r.group_id}|${r.progression_index}`, r);
    }
    return m;
  }, [workouts]);

  const setProgression = async (skillId: string, groupId: string, idx: number) => {
    const { error } = await (supabase as any)
      .from("user_skills")
      .upsert(
        { user_id: userId, skill_id: skillId, group_id: groupId, progression_index: idx },
        { onConflict: "user_id,skill_id,group_id" },
      );
    if (error) return toast.error("Errore: " + error.message);
    toast.success("Propedeutica aggiornata");
    load();
  };

  const removeFromPlan = async (skillId: string, groupId: string) => {
    if (!confirm("Rimuovere questa skill dalla scheda?")) return;
    const { error } = await (supabase as any)
      .from("user_skills")
      .delete()
      .eq("user_id", userId)
      .eq("skill_id", skillId)
      .eq("group_id", groupId);
    if (error) return toast.error("Errore: " + error.message);
    toast.success("Rimossa dalla scheda");
    load();
  };

  const saveWorkout = async (
    skillId: string,
    groupId: string,
    progressionIndex: number,
    exerciseName: string,
    patch: Partial<UserWorkoutRow>,
  ) => {
    const existing = workoutIndex.get(`${skillId}|${groupId}|${progressionIndex}`);
    const payload = {
      user_id: userId,
      skill_id: skillId,
      group_id: groupId,
      progression_index: progressionIndex,
      exercise_name: exerciseName,
      sets: patch.sets ?? existing?.sets ?? null,
      reps: patch.reps ?? existing?.reps ?? null,
      seconds: patch.seconds ?? existing?.seconds ?? null,
      recovery: patch.recovery ?? existing?.recovery ?? null,
      load_kg: patch.load_kg ?? existing?.load_kg ?? null,
      load_band: patch.load_band ?? existing?.load_band ?? null,
      load_type:
        (patch.load_kg ?? existing?.load_kg) != null
          ? "weight"
          : (patch.load_band ?? existing?.load_band)
            ? "band"
            : existing?.load_type ?? null,
    };
    const { error } = await (supabase as any)
      .from("user_workouts")
      .upsert(payload, {
        onConflict: "user_id,skill_id,group_id,progression_index",
      });
    if (error) return toast.error("Errore: " + error.message);
    toast.success("Parametri salvati");
    load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Riscaldamento & Stretching</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PlanNoteEditor
            userId={userId}
            section="warmup"
            label="Riscaldamento"
            placeholder="Es. 5' corda + mobilità spalle 2x10..."
          />
          <PlanNoteEditor
            userId={userId}
            section="stretching"
            label="Stretching"
            placeholder={'Es. Pancake 3x30" · Pike 3x30" · Bridge hold 30"...'}
          />

        </CardContent>
      </Card>

      {skills.map((skill) => {
        const groups = skillIndex.get(skill.id);
        const inPlan = groups && Array.from(groups.values()).some((g) => g.progression_index >= 0);

        return (
          <Card key={skill.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <CardTitle className="text-base flex items-center gap-2">
                  {skill.name.it}
                  {inPlan ? (
                    <Badge variant="default">In scheda</Badge>
                  ) : (
                    <Badge variant="outline">Non in scheda</Badge>
                  )}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {skill.groups.map((group) => {
                const row = groups?.get(group.id);
                const currentIdx = row?.progression_index ?? -1;
                const exName = currentIdx >= 0 ? group.progressions[currentIdx] : "";
                const w = currentIdx >= 0
                  ? workoutIndex.get(`${skill.id}|${group.id}|${currentIdx}`)
                  : undefined;

                return (
                  <div
                    key={group.id}
                    className="rounded-md border border-border/60 p-3 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="text-sm font-semibold">{group.label.it}</div>
                      {currentIdx >= 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromPlan(skill.id, group.id)}
                        >
                          <Trash2 className="h-4 w-4" /> Rimuovi
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Propedeutica corrente</Label>
                      <Select
                        value={currentIdx >= 0 ? String(currentIdx) : "none"}
                        onValueChange={(v) =>
                          setProgression(skill.id, group.id, v === "none" ? -1 : Number(v))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Nessuna" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nessuna (rimuovi)</SelectItem>
                          {group.progressions.map((p, i) => (
                            <SelectItem key={i} value={String(i)}>
                              {i + 1}. {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {currentIdx >= 0 && (
                      <WorkoutParams
                        key={`${skill.id}-${group.id}-${currentIdx}`}
                        initial={w}
                        onSave={(patch) =>
                          saveWorkout(skill.id, group.id, currentIdx, exName, patch)
                        }
                      />
                    )}
                  </div>
                );
              })}
              <div className="rounded-md border border-border/60 p-3">
                <PlanNoteEditor
                  userId={userId}
                  section="mobility"
                  skillId={skill.id}
                  label="Mobilità specifica"
                  placeholder="Es. CARs spalle 2x5 · Wall slides 3x8 · Scapular pulls 3x10..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function WorkoutParams({
  initial,
  onSave,
}: {
  initial?: UserWorkoutRow;
  onSave: (patch: Partial<UserWorkoutRow>) => void;
}) {
  const [sets, setSets] = useState(initial?.sets?.toString() ?? "");
  const [reps, setReps] = useState(initial?.reps?.toString() ?? "");
  const [seconds, setSeconds] = useState(initial?.seconds?.toString() ?? "");
  const [recovery, setRecovery] = useState(initial?.recovery?.toString() ?? "");
  const [kg, setKg] = useState(initial?.load_kg?.toString() ?? "");
  const [band, setBand] = useState(initial?.load_band ?? "");

  const num = (v: string) => (v === "" ? null : Number(v));

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div>
          <Label className="text-xs">Serie</Label>
          <Input type="number" inputMode="numeric" value={sets} onChange={(e) => setSets(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Reps</Label>
          <Input type="number" inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Sec</Label>
          <Input type="number" inputMode="numeric" value={seconds} onChange={(e) => setSeconds(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Recupero (s)</Label>
          <Input type="number" inputMode="numeric" value={recovery} onChange={(e) => setRecovery(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Kg</Label>
          <Input type="number" inputMode="decimal" step="0.5" value={kg} onChange={(e) => setKg(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Elastico</Label>
          <Input value={band} onChange={(e) => setBand(e.target.value)} placeholder="Es. Rosso" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() =>
            onSave({
              sets: num(sets),
              reps: num(reps),
              seconds: num(seconds),
              recovery: num(recovery),
              load_kg: num(kg),
              load_band: band.trim() || null,
            })
          }
        >
          <Save className="h-4 w-4" /> Salva
        </Button>
      </div>
    </div>
  );
}
