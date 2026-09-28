import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { HamburgerButton } from "./HamburgerButton";
import { UnreadMessagesBanner } from "./UnreadMessagesBanner";


export default function AppLayout() {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full overflow-x-hidden">
        <AppSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <UnreadMessagesBanner />
          <div className="fixed top-2 left-2 z-50 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background/90 backdrop-blur-md md:top-3 md:left-3">
            <HamburgerButton />
          </div>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
