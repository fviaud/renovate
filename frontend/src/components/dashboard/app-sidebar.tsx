import Link from "next/link"
import {
  BarChart3Icon,
  LayoutDashboardIcon,
  PackageIcon,
  RefreshCwIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Seul le tableau de bord existe pour l'instant : les autres entrées sont des emplacements.
const mainNav = [
  { title: "Tableau de bord", href: "/dashboard", icon: LayoutDashboardIcon, active: true },
  { title: "Commandes", href: "#", icon: ShoppingCartIcon, badge: "4" },
  { title: "Clients", href: "#", icon: UsersIcon },
  { title: "Produits", href: "#", icon: PackageIcon },
  { title: "Statistiques", href: "#", icon: BarChart3Icon },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <RefreshCwIcon />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">Renovate</span>
                  <span className="truncate text-xs">Boutique de démo</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.active} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Paramètres">
                  <Link href="#">
                    <SettingsIcon />
                    <span>Paramètres</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Marie Lambert">
              <Avatar className="rounded-lg">
                <AvatarFallback className="rounded-lg">ML</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-medium">Marie Lambert</span>
                <span className="truncate text-xs text-muted-foreground">marie@example.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
