"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  CalendarCheck, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronRight
} from "lucide-react";

const menuItems = [
  { id: "profile", label: "My Profile", icon: User, href: "/profile" },
  { id: "bookings", label: "My Bookings", icon: CalendarCheck, href: "/profile/bookings" },
  { id: "addresses", label: "My Addresses", icon: MapPin, href: "/profile/addresses" },
  { id: "payments", label: "Payment Methods", icon: CreditCard, href: "/profile/payments" },
  { id: "settings", label: "Settings", icon: Settings, href: "/profile/settings" },
];

export default function ProfileLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-28 pb-20 transition-colors duration-300">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900 dark:text-white capitalize">
              {pathname === "/profile" ? "My Profile" : pathname.split('/').pop().replace('-', ' ')}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* ================= SMART NAVIGATION (Sidebar on PC, Tabs on Mobile) ================= */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24 lg:top-28 bg-white/80 dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl lg:rounded-3xl p-2 lg:p-4 shadow-sm z-20">
              
              {/* Menu Container */}
              <nav className="flex lg:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center gap-2 lg:gap-3 px-4 py-3 rounded-xl lg:rounded-2xl font-semibold whitespace-nowrap transition-all duration-300 ${
                        isActive 
                          ? "bg-yellow-400/15 text-yellow-600 dark:text-yellow-400 border border-yellow-400/20" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-transparent"
                      }`}
                    >
                      <item.icon size={18} className={isActive ? "text-yellow-500 dark:text-yellow-400" : "opacity-70"} />
                      <span className="text-sm lg:text-base">{item.label}</span>
                    </Link>
                  );
                })}

                <div className="hidden lg:block h-px bg-slate-200 dark:bg-white/10 my-2 mx-4" />

                {/* Logout Button (Hidden in mobile tab bar, can be placed elsewhere or kept at end) */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 lg:gap-3 px-4 py-3 rounded-xl lg:rounded-2xl font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 w-full whitespace-nowrap"
                >
                  <LogOut size={18} />
                  <span className="text-sm lg:text-base">Logout</span>
                </button>
              </nav>

            </div>
          </div>

          {/* ================= DYNAMIC CONTENT AREA ================= */}
          <div className="flex-1 w-full">
            {children}
          </div>

        </div>
      </div>
    </main>
  );
}