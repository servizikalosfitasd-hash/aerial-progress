import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";

const STORAGE_KEY = "kalos-stability-v1";
type JointId = "cervical" | "shoulders" | "elbows" | "wrists" | "knees" | "hips" | "ankles" | "spine";
const JOINTS: JointId[] = ["cervical", "shoulders", "elbows", "wrists", "knees", "hips", "ankles", "spine"];
type Data = Record<string, string[]>;

const Stability = () => {
  const { t } = useI18n();
  const [data, setData] = useState<Data>({});
  const [active, setActive] = useState<JointId>("cervical");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setData(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ } }, [data]);

  const list = data[active] ?? [];
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    setData((d) => ({ ...d, [active]: [...(d[active] ?? []), v] }));
    setDraft("");
  };
  const remove = (i: number) =>
    setData((d) => ({ ...d, [active]: (d[active] ?? []).filter((_, idx) => idx !== i) }));

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" />
            {t.detail.back}
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <section className="bg-gradient-hero">
        <div className="container max-w-5xl mx-auto px-6 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase text-primary">{t.stability.eyebrow}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[0.95] mb-4">{t.stability.title}</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">{t.stability.subtitle}</p>
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-[260px_1fr] gap-6">
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {JOINTS.map((j) => (
            <button
              key={j}
              onClick={() => setActive(j)}
              className={`text-left rounded-2xl border p-4 transition flex-shrink-0 md:w-full ${
                active === j ? "bg-primary/10 border-primary text-primary" : "bg-gradient-card border-border hover:border-primary/40"
              }`}
            >
              <span className="font-display font-bold">{t.stability.joints[j]}</span>
              <span className="block text-xs text-muted-foreground mt-0.5">{(data[j]?.length ?? 0)} ex.</span>
            </button>
          ))}
        </div>

        <div className="rounded-3xl bg-gradient-card border border-border shadow-elevated p-5 sm:p-7">
          <h2 className="font-display text-2xl font-bold mb-5">{t.stability.joints[active]}</h2>

          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">{t.stability.empty}</p>
          ) : (
            <ul className="space-y-2 mb-5">
              {list.map((ex, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl bg-secondary/40 border border-border px-4 py-3">
                  <span className="h-7 w-7 rounded-lg bg-primary/15 border border-primary/30 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="flex-1 text-sm font-medium">{ex}</span>
                  <Button variant="ghost" size="icon" onClick={() => remove(i)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder={t.stability.addPlaceholder}
            />
            <Button onClick={add} className="gap-1.5">
              <Plus className="h-4 w-4" />
              {t.stability.add}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stability;
