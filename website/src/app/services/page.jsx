"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight, ChevronRight, Settings, AirVent, Zap, Wrench, Sparkles, Hammer, Paintbrush, Tv, Layers, Snowflake } from "lucide-react";
import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer"; 
import { getCategories } from "@/app/services/categoryService";
import { getServices } from "@/app/services/serviceService";

const getCategoryIcon = (categoryName) => {
  const catLower = (categoryName || "").toLowerCase();
  if (catLower.includes("ac") || catLower.includes("air") || catLower.includes("condition") || catLower.includes("snow")) return AirVent;
  if (catLower.includes("electric") || catLower.includes("zap")) return Zap;
  if (catLower.includes("plumb") || catLower.includes("wrench")) return Wrench;
  if (catLower.includes("clean") || catLower.includes("sparkle")) return Sparkles;
  if (catLower.includes("carpent") || catLower.includes("hammer")) return Hammer;
  if (catLower.includes("paint")) return Paintbrush;
  if (catLower.includes("tv") || catLower.includes("appliance")) return Tv;
  if (catLower.includes("all")) return Layers;
  return Settings;
};

function ServicesContent() {
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get("category");
  const querySearch = searchParams.get("search");

  const [categories, setCategories] = useState(["All Categories"]);
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catRes, srvRes] = await Promise.all([
          getCategories(),
          getServices(),
        ]);

        if (catRes && catRes.success && Array.isArray(catRes.categories)) {
          const catNames = ["All Categories", ...catRes.categories.map((c) => c.name)];
          setCategories(catNames);
        }

        if (srvRes && srvRes.success && Array.isArray(srvRes.services)) {
          setServices(srvRes.services);
        }
      } catch (err) {
        console.error("Error loading services data from database:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (queryCategory) {
      setActiveCategory(decodeURIComponent(queryCategory));
    }
    if (querySearch) {
      setSearchTerm(decodeURIComponent(querySearch));
    }
  }, [queryCategory, querySearch]);

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      activeCategory === "All Categories" ||
      service.category?.name?.toLowerCase() === activeCategory.toLowerCase() ||
      service.categoryName?.toLowerCase() === activeCategory.toLowerCase() ||
      (typeof service.category === "string" && service.category.toLowerCase() === activeCategory.toLowerCase());

    const matchesSearch =
      !searchTerm ||
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-32 pb-20 transition-colors duration-300">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Title */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">All Services</h1>
            <div className="flex items-center gap-2 mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-slate-900 dark:text-white">Services</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT SIDEBAR: Categories */}
            <div className="w-full lg:w-64 shrink-0">
              <div className="sticky top-24 lg:top-28 z-20 bg-slate-50/90 dark:bg-[#030712]/90 backdrop-blur-md lg:bg-transparent py-2 lg:py-0">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Categories</h3>
                  <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 lg:hidden">
                    Swipe horizontal →
                  </span>
                </div>
                
                <div className="flex lg:flex-col gap-2.5 overflow-x-auto pb-3 lg:pb-0 hide-scrollbar snap-x snap-mandatory">
                  {categories.map((category) => {
                    const IconComp = getCategoryIcon(category);
                    const isActive = activeCategory === category;

                    return (
                      <button
                        key={category}
                        onClick={() => {
                          setActiveCategory(category);
                          setSearchTerm("");
                        }}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap snap-start transition-all duration-300 border shrink-0 ${
                          isActive
                            ? "bg-yellow-400 text-slate-950 border-yellow-400 shadow-md shadow-yellow-400/20"
                            : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-yellow-400/50"
                        }`}
                      >
                        <IconComp size={18} className={isActive ? "text-slate-950" : "text-yellow-500"} />
                        <span>{category}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Services Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-72 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredServices.map((service) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        key={service._id || service.name}
                        className="group flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300"
                      >
                        {/* Card Image */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <Image
                            src={service.image || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500"}
                            alt={service.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Card Content */}
                        <div className="flex flex-col flex-1 p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                              {service.name}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                            {service.description}
                          </p>
                          
                          {/* Price & Rating */}
                          <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
                            <div>
                              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Starts From</p>
                              <p className="text-xl font-black text-slate-900 dark:text-white">
                                ₹{service.discountPrice || service.price}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-md">
                              <Star size={14} className="fill-yellow-500 text-yellow-500" />
                              <span className="text-sm font-bold text-slate-900 dark:text-white">4.8</span>
                            </div>
                          </div>

                          {/* Action Button: Dynamic Booking Link */}
                          <Link 
                            href={`/booking?service=${encodeURIComponent(service.name)}&price=${service.discountPrice || service.price}`}
                            className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-bold text-sm transition-all group-hover:bg-yellow-400 group-hover:text-slate-900"
                          >
                            Book Now
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Empty State Fallback */}
              {!loading && filteredServices.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Settings className="text-slate-300 dark:text-slate-700 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">No services found</h3>
                  <p className="text-slate-500 mt-2">We are currently updating our services in this category.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white font-bold">Loading...</div>}>
      <ServicesContent />
    </Suspense>
  );
}