import FloatingAgriChatbot from "@/components/FloatingAgriChatbot";
import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sprout,
  LayoutDashboard,
  Microscope,
  BarChart3,
  TrendingUp,
  CloudSun,
  Bug,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Bell,
  Menu,
  Settings
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";

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

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, signOut } = useAuth();
  const location = useLocation();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const initials = user?.email?.[0]?.toUpperCase() || "F";

  /* Smooth scroll */

  useEffect(() => {

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true
    });

    let rafId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => cancelAnimationFrame(rafId);

  }, []);

  /* Sidebar animation */

  useEffect(() => {

    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: .6, ease: "power3.out" }
      );
    }

  }, []);

  /* Close dropdowns */

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (notifRef.current && !notifRef.current.contains(event.target as Node))
        setNotifOpen(false);

      if (profileRef.current && !profileRef.current.contains(event.target as Node))
        setProfileOpen(false);

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  /* Magnetic hover */

  const magnetic = (e: any) => {

    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;

  };

  const resetMagnetic = (e: any) => {
    e.currentTarget.style.transform = "translate(0px,0px)";
  };

  const SidebarContent = () => (

    <div className="flex flex-col h-full">

      {/* Logo */}

      <div className={cn(
        "flex items-center gap-3 p-4 border-b border-[#5C3A21]/40",
        collapsed && "justify-center px-2"
      )}>

        <div className="w-9 h-9 bg-[#B7410E] rounded-xl flex items-center justify-center">

          <Sprout className="text-white w-5 h-5"/>

        </div>

        {!collapsed && (
          <div>
            <div className="font-bold text-white">SmartCrop AI</div>
            <div className="text-xs text-gray-400">Agri Intelligence</div>
          </div>
        )}

      </div>

      {/* Navigation */}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">

        {navItems.map((item, i) => {

          const active =
            location.pathname === item.path ||
            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));

          return (

            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * .05 }}
            >

              <NavLink
                to={item.path}
                onMouseMove={magnetic}
                onMouseLeave={resetMagnetic}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-[#B7410E] text-white shadow-lg"
                    : "text-gray-300 hover:bg-[#5C3A21] hover:text-white"
                )}
              >

                <item.icon className="w-5 h-5"/>

                {!collapsed && (
                  <>
                    <span className="text-sm flex-1">{item.label}</span>

                    {item.badge && (
                      <Badge className="text-[10px] border-[#6B8E23] text-[#6B8E23] bg-[#6B8E23]/10">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}

              </NavLink>

            </motion.div>

          );

        })}

      </nav>

      {/* User */}

      <div className="p-3 border-t border-[#5C3A21]/40">

        <div className="flex items-center gap-3">

          <Avatar className="w-8 h-8">

            <AvatarFallback className="bg-[#B7410E]/30 text-[#B7410E] font-bold">
              {initials}
            </AvatarFallback>

          </Avatar>

          {!collapsed && (
            <div className="flex-1 text-sm text-gray-300 truncate">
              {user?.email}
            </div>
          )}

        </div>

      </div>

    </div>

  );

  return (

    <div className="flex min-h-screen bg-[#DBCEA5] text-[#2E2E2E]">

      {/* Sidebar */}

      <aside
        ref={sidebarRef}
        className={cn(
          "hidden lg:flex flex-col bg-[#2E2E2E] transition-all duration-300 relative",
          collapsed ? "w-16" : "w-64"
        )}
      >

        <SidebarContent/>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-1/2 -right-3 w-6 h-6 bg-[#2E2E2E] border border-[#5C3A21] rounded-full flex items-center justify-center text-gray-300 shadow"
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3"/>
            : <ChevronLeft className="w-3 h-3"/>}
        </button>

      </aside>

      {/* Main */}

      <div className="flex flex-col flex-1 min-h-screen">

        {/* Navbar */}

        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: .4 }}
          className="relative flex items-center justify-between px-6 py-3
          bg-[#F4E6C8] border-b border-[#5C3A21]/25 shadow-sm"
        >

          <h1 className="font-bold text-lg">
            {navItems.find(i =>
              location.pathname === i.path ||
              (i.path !== "/dashboard" && location.pathname.startsWith(i.path))
            )?.label || "Dashboard"}
          </h1>

          {/* Icons */}

          <div className="flex items-center gap-2">

            {/* Notifications */}

            <div ref={notifRef} className="relative">

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                }}
                className="hover:text-[#B7410E]"
              >
                <Bell className="w-5 h-5"/>
              </Button>

              <AnimatePresence>

                {notifOpen && (

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-72 bg-[#F4E6C8] border border-[#5C3A21]/20 rounded-xl shadow-xl p-3 z-50"
                  >

                    <div className="font-semibold mb-2">Notifications</div>

                    <div className="space-y-2 text-sm">

                      <div className="p-2 rounded-lg hover:bg-[#DBCEA5]/70">
                        🌧️ Rain expected tomorrow
                      </div>

                      <div className="p-2 rounded-lg hover:bg-[#DBCEA5]/70">
                        🌱 New crop recommendation available
                      </div>

                      <div className="p-2 rounded-lg hover:bg-[#DBCEA5]/70">
                        🐛 Pest alert nearby
                      </div>

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

            {/* Profile */}

            <div ref={profileRef} className="relative">

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                }}
                className="hover:text-[#B7410E]"
              >
                <User className="w-5 h-5"/>
              </Button>

              <AnimatePresence>

                {profileOpen && (

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-[#F4E6C8] border border-[#5C3A21]/20 rounded-xl shadow-xl p-2 z-50"
                  >

                    <div className="px-3 py-2 text-sm font-semibold border-b border-[#5C3A21]/20">
                      {user?.email}
                    </div>

                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-[#DBCEA5]/70 rounded-lg flex items-center gap-2">
                      <User className="w-4 h-4"/> Profile
                    </button>

                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-[#DBCEA5]/70 rounded-lg flex items-center gap-2">
                      <Settings className="w-4 h-4"/> Settings
                    </button>

                    <button
                      onClick={signOut}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#DBCEA5]/70 rounded-lg flex items-center gap-2 text-[#B7410E]"
                    >
                      <LogOut className="w-4 h-4"/> Logout
                    </button>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          </div>

        </motion.header>

        {/* Page */}

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>

    </div>

  );

};

export default DashboardLayout;