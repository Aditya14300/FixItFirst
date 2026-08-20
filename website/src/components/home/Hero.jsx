"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, ShieldCheck, Star, Clock3, CheckCircle } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/services");
    }
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-[#030712] pt-28 lg:pt-32 transition-colors duration-300">
      
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-[-100px] top-[-50px] h-[300px] w-[400px] rounded-full bg-yellow-400/20 dark:bg-yellow-400/10 blur-[140px]" />
        <div className="absolute right-[-100px] bottom-[-100px] h-[350px] w-[350px] rounded-full bg-cyan-500/20 dark:bg-cyan-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[75vh] max-w-7xl grid-cols-1 lg:grid-cols-2 lg:gap-x-8 px-6 lg:px-8">
        
        {/* 1. TOP-LEFT: TEXT & SEARCH */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-1 lg:col-start-1 lg:row-start-1 flex flex-col items-start text-left pt-6 pb-4 lg:pt-4 lg:pb-8"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 dark:border-yellow-400/20 bg-yellow-400/10 dark:bg-yellow-400/5 px-4 py-1.5 backdrop-blur-xl">
            <Star size={14} className="fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400" />
            <span className="text-[11px] font-bold tracking-wider text-yellow-600 dark:text-yellow-300 uppercase">
              Trusted by 1000+ Customers
            </span>
          </motion.div>

          <motion.h1 variants={item} className="mt-6 text-4xl font-black leading-[1.15] text-slate-900 dark:text-white md:text-5xl lg:text-[54px] transition-colors">
            Professional <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-yellow-500 to-amber-600 dark:from-yellow-300 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent">
              Home Services
            </span>{" "}
            <br className="hidden lg:block" />
            At Your Doorstep
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base transition-colors">
            Book trusted and verified professionals for electrical,
            plumbing, AC repair, carpentry, painting, cleaning,
            and more — delivered right at your doorstep.
          </motion.p>

          <motion.div variants={item} className="mt-8 w-full max-w-xl">
            <form onSubmit={handleSearchSubmit} className="flex w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-1.5 backdrop-blur-2xl shadow-xl dark:shadow-2xl transition-colors">
              <div className="flex flex-1 items-center gap-3 px-4">
                <Search size={18} className="text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any service (e.g. AC Repair, Plumbing)..."
                  className="h-12 w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                />
              </div>
              <motion.button type="submit" className="group flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-2 font-bold text-slate-900 shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-500 dark:hover:bg-yellow-300">
                Book <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* 2. MIDDLE (Mobile) / RIGHT (Desktop): IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          /* Aapka exact translation code yahan add kiya hai: lg:-translate-y-12 lg:translate-x-10 */
          className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 relative flex w-full h-[320px] md:h-[450px] lg:h-auto items-end justify-center z-20 lg:-translate-y-12 lg:translate-x-10"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-yellow-400/20 dark:bg-yellow-400/10 blur-[80px]" />

          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative z-10 flex items-end justify-center h-full w-[260px] md:w-[350px] lg:h-[550px] lg:w-[450px]"
          >
            <AnimatePresence mode="wait">
              {!isHovered ? (
                <motion.div key="normal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex items-end justify-center">
                  <Image src="https://res.cloudinary.com/dmsgeia9g/image/upload/v1783021596/Remove_background_project_-_03_July_2026_at_01.01.48_pnqnhr.png" alt="Technician" fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,.15)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,.5)]" />
                </motion.div>
              ) : (
                <motion.div key="hover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex items-end justify-center">
                  <Image src="https://res.cloudinary.com/dmsgeia9g/image/upload/v1783099805/copy_of_untitled_-_03_july_2026_at_225100_nnvclh.png" alt="Technician Pointing" fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,.15)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,.5)]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* FLOATING TAG 1 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -left-6 top-1/4 hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 px-4 py-3 backdrop-blur-xl lg:block shadow-2xl z-20"
            >
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Happy Customers</p>
              <h3 className="text-xl font-black text-yellow-500 dark:text-yellow-400">10K+</h3>
            </motion.div>

            {/* FLOATING TAG 2 */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -right-2 bottom-1/3 hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 px-4 py-3 backdrop-blur-xl lg:block shadow-2xl z-20"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500 dark:text-green-400" />
                <span className="text-xs font-black text-slate-900 dark:text-white">100% Verified</span>
              </div>
              <p className="mt-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">Background Checked</p>
            </motion.div>
          </div>

          {/* SMART FIX: Yeh Fade ab sirf Image ke container mein hai. Cards ke upar nahi aayega! */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 lg:h-32 bg-gradient-to-t from-slate-50 dark:from-[#030712] to-transparent z-30" />
        </motion.div>

        {/* 3. BOTTOM: 4 CARDS (MOBILE FIXED) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          /* Mobile par bhi full clear dikhenge kyuki fade inke upar nahi hai */
          className="order-3 lg:col-start-1 lg:row-start-2 grid grid-cols-4 gap-1.5 sm:gap-4 w-full max-w-xl pb-12 lg:pb-16 mt-2 lg:mt-0 lg:self-end relative z-50"
        >
          {[
            { icon: ShieldCheck, val: "500+", desc: "Verified" },
            { icon: Clock3, val: "30 Min", desc: "Arrival" },
            { icon: Star, val: "4.9/5", desc: "Rating" },
            { icon: CheckCircle, val: "100%", desc: "Warranty" },
          ].map((feat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-white/5 bg-white/90 dark:bg-white/[0.04] p-1.5 sm:p-4 backdrop-blur-xl text-center shadow-lg transition-colors">
              <div className="mb-1.5 flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-yellow-400/15">
                <feat.icon className="text-yellow-600 dark:text-yellow-400" size={14} />
              </div>
              <h3 className="text-[10px] sm:text-base font-bold text-slate-900 dark:text-white leading-tight whitespace-nowrap">{feat.val}</h3>
              <p className="mt-0.5 text-[8px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 leading-none">{feat.desc}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}