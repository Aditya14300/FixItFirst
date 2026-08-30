"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Home, Grid, CalendarCheck, User } from "lucide-react";
import { motion } from "framer-motion";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "Services",
      href: "/services",
      icon: Grid,
      isActive: pathname.startsWith("/services"),
    },
    {
      name: "My Bookings",
      href: "/my-bookings",
      icon: CalendarCheck,
      isActive: pathname.startsWith("/my-bookings") || pathname.startsWith("/profile/bookings"),
    },
    {
      name: "Profile",
      href: user ? "/profile" : "/login",
      icon: User,
      isActive: pathname.startsWith("/profile") || (pathname.startsWith("/login") && !pathname.includes("redirect")),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92vw] max-w-md z-50">
      <nav className="relative bg-slate-950/90 dark:bg-[#0b0f19]/95 backdrop-blur-xl border border-white/15 dark:border-white/10 p-2 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-300 ${
                active
                  ? "bg-yellow-400 text-slate-950 font-black shadow-md scale-105"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon size={18} className={active ? "text-slate-950" : "text-slate-400"} />
              
              {active ? (
                <span className="text-xs font-black tracking-tight">{item.name}</span>
              ) : (
                <span className="text-[10px] font-semibold hidden sm:inline-block">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
