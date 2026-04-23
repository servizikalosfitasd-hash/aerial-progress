import { Globe } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { LANGS, type Lang } from "@/i18n/dictionary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LanguageSwitcher = () => {
  const { lang, setLang } = useI18n();
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/60 border border-border text-sm font-medium hover:bg-secondary transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4 text-primary" />
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline uppercase tracking-wider text-xs">{current.code}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
            className={`gap-2 cursor-pointer ${l.code === lang ? "text-primary font-semibold" : ""}`}
          >
            <span className="text-base">{l.flag}</span>
            <span>{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
