import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toast } from "sonner";

/** Pannello per attivare/disattivare le notifiche push sul dispositivo. */
export function PushNotificationsToggle() {
  const { supported, status, subscribed, busy, subscribe, unsubscribe, iosNeedsInstall } =
    usePushNotifications();

  if (!supported) {
    return (
      <p className="text-xs text-muted-foreground">
        Questo browser non supporta le notifiche push.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 p-3 space-y-2">
      <div className="flex items-center gap-3">
        {subscribed ? (
          <Bell className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <BellOff className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Notifiche sul telefono</p>
          <p className="text-xs text-muted-foreground">
            {status === "denied"
              ? "Notifiche bloccate: riattivale dalle impostazioni del browser."
              : subscribed
                ? "Attive su questo dispositivo."
                : "Ricevi un avviso quando il coach ti scrive."}
          </p>
        </div>
        {status !== "denied" && (
          <Button
            size="sm"
            variant={subscribed ? "outline" : "default"}
            disabled={busy}
            onClick={async () => {
              if (subscribed) {
                await unsubscribe();
                toast.message("Notifiche disattivate");
                return;
              }
              const res = await subscribe();
              if (res.ok) toast.success("Notifiche attivate");
              else if (res.error) toast.error(res.error);
            }}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : subscribed ? (
              "Disattiva"
            ) : (
              "Attiva"
            )}
          </Button>
        )}
      </div>
      {iosNeedsInstall && (
        <p className="text-xs text-muted-foreground">
          Su iPhone le notifiche funzionano solo dopo aver aggiunto l'app alla schermata
          Home (Condividi → Aggiungi a Home).
        </p>
      )}
    </div>
  );
}

export default PushNotificationsToggle;
