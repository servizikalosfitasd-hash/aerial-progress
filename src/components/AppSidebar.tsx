import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Trophy,
  Crown,
  Dumbbell,
  Activity,
  ClipboardList,
  StretchHorizontal,
  Footprints,
  Sparkles,
  LogOut,
  MessageCircle,
} from "lucide-react";
import kalosLogo from "@/assets/kalos-logo.jpeg";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Massimali", url: "/records", icon: Trophy },
  { title: "Classifica", url: "/classifica", icon: Crown },
  { title: "Circuiti", url: "/circuits", icon: Dumbbell },
  { title: "Stability", url: "/stability", icon: Activity },
  { title: "Stretching", url: "/stretching", icon: StretchHorizontal },
  { title: "Gambe", url: "/legs", icon: Footprints },
  { title: "Scheda Allenamento", url: "/scheda", icon: ClipboardList },
];

export function AppSidebar() {
  const { setOpenMobile } = useSidebar();
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();

  const openLeadModal = () => {
    setOpenMobile(false);
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  };

  const openWhatsAppFab = () => {
    setOpenMobile(false);
    window.dispatchEvent(new CustomEvent("show-whatsapp-fab"));
  };

  const handleSignOut = async () => {
    setOpenMobile(false);
    await signOut();
    window.location.href = "/auth";
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent className="bg-background">
        <div className="px-4 pt-5 pb-4 border-b border-border/50 flex items-center gap-3">
          <div className="h-10 w-16 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
            <img src={kalosLogo} alt="Kalos Fit" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-sm leading-none">Kalos Fit App</p>
            <p className="text-[9px] text-muted-foreground tracking-widest uppercase mt-1">
              LA NOSTRA APP PER TE
            </p>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/80">
            {""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink
                        to={item.url}
                        onClick={() => setOpenMobile(false)}
                        className={`flex items-center gap-3 ${
                          active ? "text-primary" : ""
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/80">
            COACHING & SERVIZI
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={openLeadModal}>
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">Richiesta servizi personalizzati</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={openWhatsAppFab}>
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-medium">Assistenza clienti</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="px-3 pb-2 text-[10px] tracking-widest uppercase text-muted-foreground/70 truncate">
                    {user.email}
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Esci</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
