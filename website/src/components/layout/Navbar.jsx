"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter,usePathname } from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { Menu, X, MapPin, ChevronDown, ArrowRight, Sun, Moon, User, LogIn } from "lucide-react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const { user } = useAuth();
  const navItems = [
    { title: "Home", href: "/" },
    { title: "Services", href: "/services" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    ...(user ? [{ title: "Profile", href: "/profile" }] : []),
  ];  

  const handleBookService = () => {
    router.push("/booking");
  };

  // Scroll Progress hook for the top yellow line
  const { scrollYProgress } = useScroll();

  // Scroll Handler for Glassmorphism Background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 1. SCROLL PROGRESS LINE (Top edge) */}
      <motion.div
        className="fixed top-0 left-0 z-[60] h-[3px] bg-yellow-400 origin-left"
        style={{ scaleX: scrollYProgress, width: "100%" }}
      />

      {/* HEADER WRAPPER */}
      <header
        className={`fixed top-0 inset-x-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-[#030712]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm"
            : "bg-transparent"
        }`}
      >
        {/* ENTIRE NAVBAR WAVE ANIMATION (Glassy Shimmer Effect) */}
        {scrolled && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
              animate={{ x: ["-150%", "300%"] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 3 }}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent skew-x-12"
            />
          </div>
        )}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 w-full">
            
            {/* LOGO SECTION */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="https://res.cloudinary.com/dmsgeia9g/image/upload/v1782974140/logo_e536po.png"
                  alt="FixitFirst"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="block">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none mb-1">
                  FixitFirst
                </h1>
                <p className="text-[9px] sm:text-[11px] font-bold text-yellow-500 uppercase tracking-widest leading-none">
                  Premium
                </p>
              </div>
            </Link>

            {/* DESKTOP LINKS */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group relative py-2 text-[15px] font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  {item.title}
                  
                  {/* Active Indicator */}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover Underline */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
            </nav>

            {/* DESKTOP RIGHT ACTIONS */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5"
              >
                <Moon size={18} className="block dark:hidden" />
                <Sun size={18} className="hidden dark:block text-yellow-400" />
              </button>

              <button className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5 text-sm font-medium">
                <MapPin size={16} className="text-yellow-500" />
                <span>Bramhapur</span>
                <ChevronDown size={14} className="opacity-50 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5 text-sm font-bold"
                >
                  <User size={16} className="text-yellow-500" />
                  <span>{user.name ? user.name.split(" ")[0] : "Account"}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5 text-sm font-bold"
                >
                  <LogIn size={16} className="text-yellow-500" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* BOOK SERVICE BUTTON */}
              <button
                onClick={handleBookService}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-yellow-400 px-6 py-2.5 font-bold text-white dark:text-slate-900 shadow-md transition-transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-slate-900">
                  Book Service
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-yellow-400 -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0 z-0" />
              </button>
            </div>

            {/* MOBILE MENU BUTTONS */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300"
              >
                <Moon size={18} className="block dark:hidden" />
                <Sun size={18} className="hidden dark:block text-yellow-400" />
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-900 dark:text-white focus:outline-none"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/98 dark:bg-[#030712]/98 backdrop-blur-3xl md:hidden pt-24 pb-6 px-6 flex flex-col h-[100dvh]"
          >
            <div className="flex-1 overflow-y-auto flex flex-col gap-8">
              <button className="flex items-center justify-between w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-900 dark:text-white font-medium">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-yellow-500" />
                  <span>Bramhapur</span>
                </div>
                <ChevronDown size={20} className="opacity-50" />
              </button>

              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl text-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-yellow-500 transition-colors"
                  >
                    {item.title}
                    <ArrowRight size={20} className="opacity-50" />
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="pt-6 mt-auto">
              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-slate-900 dark:bg-yellow-400 text-white dark:text-[#030712] font-black text-lg transition-transform active:scale-95 shadow-xl"
              >
                Book Expert Now
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}