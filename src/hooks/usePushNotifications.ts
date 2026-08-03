import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type PushStatus = "unsupported" | "default" | "granted" | "denied";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

const isSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

/** iOS supporta le push solo quando l'app è installata nella schermata Home. */
export const isIosStandaloneRequired = () => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const standalone =
    (window.navigator as any).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches;
  return iOS && !standalone;
};

export function usePushNotifications() {
  const { user } = useAuth();
  const [status, setStatus] = useState<PushStatus>(() =>
    isSupported() ? (Notification.permission as PushStatus) : "unsupported",
  );
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isSupported()) return;
    setStatus(Notification.permission as PushStatus);
    navigator.serviceWorker
      .getRegistration("/push-sw.js")
      .then((reg) => reg?.pushManager.getSubscription())
      .then((sub) => setSubscribed(!!sub))
      .catch(() => setSubscribed(false));
  }, [user?.id]);

  const subscribe = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    if (!isSupported()) return { ok: false, error: "Notifiche non supportate su questo browser" };
    if (!user) return { ok: false, error: "Devi essere loggato" };
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      setStatus(permission as PushStatus);
      if (permission !== "granted") {
        return { ok: false, error: "Permesso negato" };
      }

      const reg = await navigator.serviceWorker.register("/push-sw.js");
      await navigator.serviceWorker.ready;

      const { data, error } = await supabase.functions.invoke("push-public-key");
      if (error || !data?.publicKey) {
        return { ok: false, error: "Chiave push non disponibile" };
      }

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(data.publicKey),
        });
      }

      const raw = sub.toJSON() as { endpoint?: string; keys?: { p256dh: string; auth: string } };
      if (!raw.endpoint || !raw.keys) return { ok: false, error: "Iscrizione non valida" };

      const { error: dbError } = await (supabase as any)
        .from("push_subscriptions")
        .upsert(
          {
            user_id: user.id,
            endpoint: raw.endpoint,
            p256dh: raw.keys.p256dh,
            auth: raw.keys.auth,
            user_agent: navigator.userAgent.slice(0, 300),
          },
          { onConflict: "endpoint" },
        );
      if (dbError) return { ok: false, error: dbError.message };

      setSubscribed(true);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Errore imprevisto" };
    } finally {
      setBusy(false);
    }
  }, [user?.id]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported()) return;
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/push-sw.js");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await (supabase as any)
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", sub.endpoint);
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } finally {
      setBusy(false);
    }
  }, []);

  return {
    supported: isSupported(),
    status,
    subscribed,
    busy,
    subscribe,
    unsubscribe,
    iosNeedsInstall: isIosStandaloneRequired(),
  };
}
