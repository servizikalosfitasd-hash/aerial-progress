import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { MessagesThread } from "@/components/MessagesThread";
import { PushNotificationsToggle } from "@/components/PushNotificationsToggle";


export default function Messages() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="app-page">
      <header className="app-header">
        <div className="app-header-inner max-w-3xl pl-14 sm:pl-16">
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="h-4 w-4" /> Home</Link>
          </Button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <MessageCircle className="h-4 w-4 text-primary" /> Messaggi
          </div>
        </div>
      </header>
      <main className="container max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="app-heading mb-4">Messaggi</h1>
        <section className="space-y-4" aria-label="Chat con il tuo coach">
            <PushNotificationsToggle />
            <MessagesThread userId={user.id} isAdminView={false} />
        </section>
      </main>
    </div>
  );
}
