import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export default function AppLayout() {
  const { pathname } = useLocation();
  // On the home page the hamburger lives inside the page header, so hide the floating one.
  const showFloating = !["/", "/records"].includes(pathname);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full overflow-x-hidden">
        <AppSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          {showFloating && (
            <div className="fixed top-3 left-3 z-50">
              <SidebarTrigger
                aria-label="Apri menù"
                className="h-10 w-10 rounded-xl bg-background/80 backdrop-blur-md border border-border shadow-elevated text-foreground hover:bg-primary/10 hover:text-primary transition"
              >
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
            </div>
          )}

          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
