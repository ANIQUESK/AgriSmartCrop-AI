import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sprout, LayoutDashboard, Microscope, BarChart3, TrendingUp,
  CloudSun, Bug, ChevronLeft, ChevronRight, LogOut, User, Bell, Menu, X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Overview", badge: null },
  { path: "/dashboard/crop-recommendation", icon: Sprout, label: "Crop Advisor", badge: "AI" },
  { path: "/dashboard/disease-detection", icon: Microscope, label: "Disease Detection", badge: "AI" },
  { path: "/dashboard/yield-prediction", icon: BarChart3, label: "Yield Prediction", badge: "ML" },
  { path: "/dashboard/market-prices", icon: TrendingUp, label: "Market Forecast", badge: null },
  { path: "/dashboard/weather", icon: CloudSun, label: "Weather Intel", badge: null },
  { path: "/dashboard/pest-advisory", icon: Bug, label: "Pest Advisory", badge: null },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const initials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || "F";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 p-4 border-b border-sidebar-border", collapsed && "justify-center px-2")}>
        <div className="w-9 h-9 bg-sidebar-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sprout className="w-5 h-5 text-sidebar-primary" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-display font-bold text-sidebar-foreground text-base leading-tight">SmartCrop AI</div>
            <div className="text-sidebar-foreground/50 text-xs">AgriTech Platform</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                collapsed && "justify-center px-2",
                active
                  ? "bg-sidebar-accent text-sidebar-primary border-r-2 border-sidebar-primary font-semibold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", active && "text-sidebar-primary")} />
              {!collapsed && (
                <>
                  <span className="text-sm flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-sidebar-primary/40 text-sidebar-primary bg-sidebar-primary/10">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className={cn("p-3 border-t border-sidebar-border", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-3 p-2 rounded-lg", collapsed && "justify-center")}>
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-sidebar-primary/20 text-sidebar-primary text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sidebar-foreground text-xs font-semibold truncate">
                {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Farmer"}
              </div>
              <div className="text-sidebar-foreground/50 text-[10px] truncate">{user?.email}</div>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="w-7 h-7 text-sidebar-foreground/50 hover:text-danger hover:bg-danger/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
        {collapsed && (
          <button onClick={signOut} className="w-full flex justify-center mt-1 text-sidebar-foreground/50 hover:text-danger transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-sidebar">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-sidebar transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-1/2 -right-3 z-10 w-6 h-6 bg-sidebar rounded-full border border-sidebar-border flex items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground shadow-md hidden lg:flex"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-3.5 bg-card border-b border-border shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground leading-tight">
                {navItems.find(i => location.pathname === i.path || (i.path !== "/dashboard" && location.pathname.startsWith(i.path)))?.label || "Dashboard"}
              </h1>
              <p className="text-muted-foreground text-xs hidden sm:block">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
