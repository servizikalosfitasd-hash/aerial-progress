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
  ShieldCheck,
  Lock,
} from "lucide-react";
import kalosLogo from "@/assets/kalos-logo.jpeg";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useSectionAccess, SECTION_BY_PATH } from "@/hooks/useSectionAccess";
import { Badge } from "@/components/ui/badge";
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
  const { isAdmin } = useIsAdmin();
  const unread = useUnreadMessages();
  const { isAllowed } = useSectionAccess();

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
    <Sidebar collapsible="icon" className="border-border">
      <SidebarContent className="bg-card">
        <div className="px-4 pt-5 pb-4 border-b border-border/50 flex items-center gap-3">
          <div className="h-10 w-16 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
            <img src={kalosLogo} alt="Kalos Fit" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-2xl leading-none text-primary">Kalos Fit</p>
            <p className="text-[9px] text-muted-foreground tracking-widest uppercase mt-1">
              LA NOSTRA APP PER TE
            </p>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/80">
            ALLENAMENTO
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                const section = SECTION_BY_PATH[item.url];
                const locked = section ? !isAllowed(section) : false;
                if (locked) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        disabled
                        className="opacity-50 cursor-not-allowed"
                        title="Sezione bloccata: rinnova l'abbonamento"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium flex-1">{item.title}</span>
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/messaggi"}>
                  <NavLink
                    to="/messaggi"
                    onClick={() => setOpenMobile(false)}
                    className={`flex items-center gap-3 ${pathname === "/messaggi" ? "text-primary" : ""}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-medium flex-1">Messaggi</span>
                    {unread > 0 && (
                      <Badge className="h-5 px-1.5 text-[10px]">{unread}</Badge>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                    <NavLink
                      to="/admin"
                      onClick={() => setOpenMobile(false)}
                      className={`flex items-center gap-3 ${pathname === "/admin" ? "text-primary" : ""}`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span className="font-medium flex-1">Admin</span>
                      {unread > 0 && (
                        <Badge className="h-5 px-1.5 text-[10px]">{unread}</Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase text-muted-foreground/80">
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
