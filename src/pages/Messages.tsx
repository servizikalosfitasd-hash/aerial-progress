import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { MessagesThread } from "@/components/MessagesThread";
import { PushNotificationsToggle } from "@/components/PushNotificationsToggle";


export default function Messages() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="h-4 w-4" /> Home</Link>
          </Button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <MessageCircle className="h-4 w-4 text-primary" /> Messaggi
          </div>
        </div>
      </header>
      <main className="container max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Chat con il tuo coach</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PushNotificationsToggle />
            <MessagesThread userId={user.id} isAdminView={false} />

          </CardContent>
        </Card>
      </main>
    </div>
  );
}
