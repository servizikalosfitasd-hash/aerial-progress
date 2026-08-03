import { Link, useLocation } from "react-router-dom";
import { Bell, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { toast } from "sonner";

const PUSH_DISMISS_KEY = "kalos_push_prompt_dismissed";

/**
 * Banner in cima all'app:
 * 1. avvisa dei messaggi non letti dal coach;
 * 2. propone di attivare le notifiche push (una sola volta, richiudibile).
 */
export function UnreadMessagesBanner() {
  const { pathname } = useLocation();
  const unread = useUnreadMessages();
  const { isAdmin } = useIsAdmin();
  const { supported, status, subscribed, busy, subscribe, iosNeedsInstall } =
    usePushNotifications();
  const [pushDismissed, setPushDismissed] = useState(
    () => localStorage.getItem(PUSH_DISMISS_KEY) === "1",
  );

  useEffect(() => {
    if (subscribed) setPushDismissed(true);
  }, [subscribed]);

  const onMessagesPage = pathname.startsWith("/messaggi") || pathname.startsWith("/admin");

  const showUnread = unread > 0 && !onMessagesPage;
  const showPushPrompt =
    !showUnread &&
    supported &&
    !subscribed &&
    status !== "denied" &&
    !pushDismissed &&
    !iosNeedsInstall;

  if (!showUnread && !showPushPrompt) return null;

  if (showUnread) {
    return (
      <div className="sticky top-0 z-40 bg-primary text-primary-foreground">
        <div className="container max-w-4xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium flex-1 min-w-0 truncate">
            {isAdmin
              ? unread === 1
                ? "Hai 1 nuovo messaggio dagli atleti"
                : `Hai ${unread} nuovi messaggi dagli atleti`
              : unread === 1
                ? "Hai 1 nuovo messaggio dal coach"
                : `Hai ${unread} nuovi messaggi dal coach`}
          </span>
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="h-7 px-3 text-xs shrink-0"
          >
            <Link to={isAdmin ? "/admin" : "/messaggi"}>Leggi</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-40 bg-muted/80 backdrop-blur-md border-b border-border">
      <div className="container max-w-4xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <Bell className="h-4 w-4 shrink-0 text-primary" />
        <span className="text-sm flex-1 min-w-0">
          Attiva le notifiche per non perdere i messaggi del coach.
        </span>
        <Button
          size="sm"
          className="h-7 px-3 text-xs shrink-0"
          disabled={busy}
          onClick={async () => {
            const res = await subscribe();
            if (res.ok) toast.success("Notifiche attivate");
            else if (res.error) toast.error(res.error);
          }}
        >
          Attiva
        </Button>
        <button
          aria-label="Chiudi"
          className="shrink-0 opacity-60 hover:opacity-100"
          onClick={() => {
            localStorage.setItem(PUSH_DISMISS_KEY, "1");
            setPushDismissed(true);
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default UnreadMessagesBanner;
