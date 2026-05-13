import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { HamburgerButton } from "./HamburgerButton";

export default function AppLayout() {
  const { pathname } = useLocation();
  // On the home page the hamburger lives inside the page header, so hide the floating one.
  const showFloating = !["/", "/records", "/circuits", "/stability", "/stretching", "/legs", "/scheda"].includes(pathname);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full overflow-x-hidden">
        <AppSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          {showFloating && (
            <div className="fixed top-3 left-3 z-50 h-10 w-10 rounded-xl bg-background/80 backdrop-blur-md border border-border shadow-elevated flex items-center justify-center">
              <HamburgerButton />
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
