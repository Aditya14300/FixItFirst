"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar"; // Apna path verify kar lena
import Footer from "@/components/layout/Footer"; // Apna path verify kar lena
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Clock, Zap, Wrench, Snowflake, Sparkles, PaintRoller, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

// Mock Data for Services
const allServices = [
  { id: 1, title: "AC Gas Refill & Service", category: "AC Repair", price: "₹1,499", rating: 4.9, reviews: 320, time: "45 Min", icon: Snowflake, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { id: 2, title: "Ceiling Fan Repair", category: "Electrician", price: "₹299", rating: 4.8, reviews: 156, time: "30 Min", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: 3, title: "Bathroom Deep Clean", category: "Cleaning", price: "₹899", rating: 4.9, reviews: 412, time: "2 Hrs", icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 4, title: "Washbasin Pipe Fix", category: "Plumbing", price: "₹199", rating: 4.7, reviews: 89, time: "30 Min", icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 5, title: "Full Home Painting", category: "Painting", price: "Custom", rating: 5.0, reviews: 45, time: "3-5 Days", icon: PaintRoller, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: 6, title: "Switchboard Replacement", category: "Electrician", price: "₹149", rating: 4.8, reviews: 210, time: "20 Min", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: 7, title: "Sofa Dry Cleaning", category: "Cleaning", price: "₹599", rating: 4.9, reviews: 275, time: "1 Hr", icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 8, title: "Water Heater Installation", category: "Plumbing", price: "₹499", rating: 4.8, reviews: 134, time: "45 Min", icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10" },
];

const categories = ["All", "Electrician", "Plumbing", "AC Repair", "Cleaning", "Painting"];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering Logic
  const filteredServices = allServices.filter((service) => {
    const matchesCategory = activeCategory === "All" || service.category === activeCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="w-full min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {/* Hero & Search Section */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 overflow-hidden border-b border-slate-200 dark:border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-400/10 dark:bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6"
          >
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">Services</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            From quick fixes to complete home transformations, we have the right professional for every job.
          </motion.p>

          {/* Large Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-2xl relative"
          >
            <div className="relative flex items-center w-full h-16 rounded-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-lg px-6 overflow-hidden transition-all focus-within:border-yellow-400 focus-within:ring-4 focus-within:ring-yellow-400/10">
              <Search className="text-slate-400 shrink-0" size={24} />
              <input
                type="text"
                placeholder="Search for 'AC Repair', 'Cleaning'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent px-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-lg"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Content Area */}
      <section className="py-12 lg:py-20 flex-grow">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Categories Horizontal Scroll */}
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-6 mb-8 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap lg:justify-center">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                  activeCategory === cat
                    ? "bg-yellow-400 border-yellow-400 text-slate-900 shadow-md shadow-yellow-400/20"
                    : "bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-yellow-400/50 hover:bg-yellow-50 dark:hover:bg-yellow-400/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services Grid with Layout Animation */}
          <motion.div layout className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      key={service.id}
                      className="group relative flex flex-col rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-yellow-400/30 overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.bg}`}>
                          <Icon size={24} className={service.color} />
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-100 dark:border-white/5">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{service.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                        {service.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
                        <span className="flex items-center gap-1"><Clock size={14} /> {service.time}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span>{service.reviews} reviews</span>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Starts at</span>
                          <span className="text-lg font-black text-slate-900 dark:text-white">{service.price}</span>
                        </div>
                        
                        <Link 
                          href={`/book/${service.id}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white transition-all group-hover:bg-yellow-400 group-hover:text-slate-900"
                        >
                          <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                /* Empty State */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 flex flex-col items-center justify-center text-center"
                >
                  <div className="h-24 w-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Search size={40} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No services found</h3>
                  <p className="text-slate-500 mb-6 max-w-md">
                    We couldn&#39;t find any service matching &#34;{searchQuery}&#34;. Try searching for something else or browse our categories.
                  </p>
                  <button 
                    onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                    className="px-6 py-3 rounded-full bg-yellow-400 text-slate-900 font-bold hover:bg-yellow-300 transition-colors"
                  >
                    View All Services
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* Trust Banner at bottom */}
      <section className="bg-yellow-400 dark:bg-yellow-500 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-900">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-white/30 flex items-center justify-center">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black">100% Satisfaction Guarantee</h3>
              <p className="font-medium">Verified experts, transparent pricing, and 30-day warranty.</p>
            </div>
          </div>
          <Link href="/contact" className="px-8 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors whitespace-nowrap">
            Contact Support
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}