"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Wrench,
  Snowflake,
  AirVent,
  Wind,
  Sparkles,
  Hammer,
  Paintbrush,
  Tv,
  Lightbulb,
  WashingMachine,
  Cctv,
  Refrigerator,
  Droplets,
  Flame,
  Fan,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Shield,
  Wifi,
  X,
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";
import { getCategories } from "@/app/services/categoryService";
import { getServices } from "@/app/services/serviceService";

const iconComponentMap = {
  ac: AirVent,
  aircondition: AirVent,
  airconditioner: AirVent,
  electrician: Lightbulb,
  electrical: Lightbulb,
  lightbulb: Lightbulb,
  lighting: Lightbulb,
  zap: Lightbulb,
  washingmachine: WashingMachine,
  washing: WashingMachine,
  laundry: WashingMachine,
  cctv: Cctv,
  security: Cctv,
  camera: Cctv,
  refrigerator: Refrigerator,
  fridge: Refrigerator,
  waterpurifier: Droplets,
  purifier: Droplets,
  water: Droplets,
  chimney: Flame,
  kitchenchimney: Flame,
  exhaust: Fan,
  wrench: Wrench,
  snowflake: Snowflake,
  wind: Wind,
  flame: Flame,
  droplets: Droplets,
  shield: Shield,
  wifi: Wifi,
  sparkles: Sparkles,
  hammer: Hammer,
  paintbrush: Paintbrush,
  tv: Tv,
};

const categoryStylePresets = [
  { color: "text-amber-500", bgColor: "bg-amber-500/10", hoverBorder: "group-hover:border-amber-500/50" },
  { color: "text-blue-500", bgColor: "bg-blue-500/10", hoverBorder: "group-hover:border-blue-500/50" },
  { color: "text-cyan-500", bgColor: "bg-cyan-500/10", hoverBorder: "group-hover:border-cyan-500/50" },
  { color: "text-emerald-500", bgColor: "bg-emerald-500/10", hoverBorder: "group-hover:border-emerald-500/50" },
  { color: "text-orange-500", bgColor: "bg-orange-500/10", hoverBorder: "group-hover:border-orange-500/50" },
  { color: "text-purple-500", bgColor: "bg-purple-500/10", hoverBorder: "group-hover:border-purple-500/50" },
];

const fallbackCategories = [
  { _id: "cat-1", name: "AC Repair", icon: "ac", description: "AC Service, Installation & Gas Refill" },
  { _id: "cat-2", name: "Electrical & Lighting", icon: "lightbulb", description: "Wiring, Switchboard, Light Fittings & Repairs" },
  { _id: "cat-3", name: "Washing Machine", icon: "washingmachine", description: "Washing Machine Repair & Installation" },
  { _id: "cat-4", name: "Refrigerator Repair", icon: "refrigerator", description: "Fridge Service, Cooling Repair & Gas Charging" },
  { _id: "cat-5", name: "Water Purifier (RO)", icon: "waterpurifier", description: "RO Filter Replacement, Service & Repair" },
  { _id: "cat-6", name: "Kitchen Chimney", icon: "chimney", description: "Chimney Cleaning, Repair & Installation" },
  { _id: "cat-7", name: "CCTV & Security", icon: "cctv", description: "CCTV Camera Setup, Installation & Maintenance" },
  { _id: "cat-8", name: "Plumbing", icon: "wrench", description: "Pipe Leakage, Tap Fitting & Drainage" },
  { _id: "cat-9", name: "Cleaning", icon: "sparkles", description: "Full Home Deep Cleaning & Sanitization" },
  { _id: "cat-10", name: "Carpentry", icon: "hammer", description: "Furniture Repair & Custom Woodwork" },
  { _id: "cat-11", name: "Painting", icon: "paintbrush", description: "Home Painting & Waterproofing" },
];

const AC_ICON_URL = "https://res.cloudinary.com/dmsgeia9g/image/upload/v1788029846/Untitled_design_9_cx7odb.png";

const getCategoryCustomImage = (cat) => {
  const nameOrIcon = (typeof cat === "string" ? cat : (cat?.icon || cat?.name || "")).toLowerCase();
  if (nameOrIcon.includes("ac") || nameOrIcon.includes("air") || nameOrIcon.includes("condition")) {
    return AC_ICON_URL;
  }
  return null;
};

export default function Categories() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [allServices, setAllServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    async function loadDbData() {
      try {
        const [catRes, srvRes] = await Promise.all([
          getCategories(),
          getServices(),
        ]);

        if (catRes && catRes.success && Array.isArray(catRes.categories) && catRes.categories.length > 0) {
          setCategories(catRes.categories);
        } else {
          setCategories(fallbackCategories);
        }

        if (srvRes && srvRes.success && Array.isArray(srvRes.services)) {
          setAllServices(srvRes.services);
        }
      } catch (err) {
        console.error("Error fetching data from database:", err);
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    }
    loadDbData();
  }, []);

  const getCategoryIcon = (cat) => {
    const iconKey = (cat.icon || cat.name || "").toLowerCase();
    if (iconKey.includes("refrig") || iconKey.includes("fridge")) return Refrigerator;
    if (iconKey.includes("water") || iconKey.includes("purifi") || iconKey.includes("ro ")) return Droplets;
    if (iconKey.includes("chimney") || iconKey.includes("exhaust")) return Flame;
    if (iconKey.includes("wash") || iconKey.includes("laundry")) return WashingMachine;
    if (iconKey.includes("cctv") || iconKey.includes("camera") || iconKey.includes("security")) return Cctv;
    if (iconKey.includes("electric") || iconKey.includes("light") || iconKey.includes("bulb") || iconKey.includes("zap") || iconKey.includes("wiring")) return Lightbulb;
    if (iconKey.includes("ac") || iconKey.includes("air") || iconKey.includes("condition") || iconKey.includes("snow") || iconKey.includes("cool")) return AirVent;
    if (iconKey.includes("wrench") || iconKey.includes("plumb")) return Wrench;
    if (iconKey.includes("droplet") || iconKey.includes("geyser")) return Droplets;
    if (iconKey.includes("shield")) return Shield;
    if (iconKey.includes("wifi") || iconKey.includes("router")) return Wifi;
    if (iconKey.includes("clean") || iconKey.includes("sparkle")) return Sparkles;
    if (iconKey.includes("hammer") || iconKey.includes("carpent")) return Hammer;
    if (iconKey.includes("paint")) return Paintbrush;
    if (iconKey.includes("tv") || iconKey.includes("appliance")) return Tv;
    return iconComponentMap[iconKey] || Lightbulb;
  };

  // Get child services for selected category
  const getChildServices = (category) => {
    if (!category) return [];
    return allServices.filter((srv) => {
      const matchCatObj = srv.category?._id === category._id || srv.category === category._id;
      const matchCatName =
        srv.category?.name?.toLowerCase() === category.name?.toLowerCase() ||
        srv.categoryName?.toLowerCase() === category.name?.toLowerCase();
      return matchCatObj || matchCatName;
    });
  };

  const childServices = getChildServices(selectedCategory);

  return (
    <section className="relative w-full bg-slate-50 dark:bg-[#030712] py-16 lg:py-24 overflow-hidden transition-colors duration-300">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Layers size={14} /> Categories
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white md:text-4xl lg:text-5xl tracking-tight">
              What service do you <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">
                need today?
              </span>
            </h2>
          </motion.div>

          {/* Desktop Left/Right Controls & View All Button */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 shrink-0"
          >
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <button
                onClick={() => scroll("left")}
                className="p-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-yellow-400 hover:text-slate-950 dark:hover:bg-yellow-400 dark:hover:text-slate-950 transition-all shadow-sm active:scale-95"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-yellow-400 hover:text-slate-950 dark:hover:bg-yellow-400 dark:hover:text-slate-950 transition-all shadow-sm active:scale-95"
                aria-label="Scroll Right"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <Link
              href="/services"
              className="group flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 font-semibold text-slate-900 dark:text-white transition-all hover:border-yellow-400 dark:hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-400/10 text-sm"
            >
              View All Services
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 text-yellow-500" />
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Database Parent Categories - INLINE & SCROLLABLE FOR DESKTOP & MOBILE */}
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {[1, 2, 3, 4, 5, 6, 7].map((idx) => (
              <div key={idx} className="flex-shrink-0 w-32 sm:w-40 md:w-48 aspect-square rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth hide-scrollbar px-1 -mx-2 sm:mx-0"
          >
            {categories.map((cat, index) => {
              const customImg = getCategoryCustomImage(cat);
              const IconComp = getCategoryIcon(cat);
              const preset = categoryStylePresets[index % categoryStylePresets.length];

              return (
                <Link
                  key={cat._id || index}
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  title={cat.name}
                  className="flex-shrink-0 w-32 sm:w-40 md:w-48 aspect-square snap-start group cursor-pointer outline-none"
                >
                  <div className={`relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl dark:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-md overflow-hidden ${preset.hoverBorder}`}>
                    
                    {/* Centered Icon/Image fitting 1:1 Card */}
                    <div className="w-full h-full flex items-center justify-center p-1 sm:p-2">
                      {customImg ? (
                        <img
                          src={customImg}
                          alt={cat.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
                        />
                      ) : (
                        <IconComp size={48} className={`${preset.color} transition-transform duration-300 group-hover:scale-110 sm:w-16 sm:h-16 md:w-20 md:h-20`} />
                      )}
                    </div>

                    {/* Subtle Category Name Label on Hover */}
                    <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-xl bg-slate-900/80 dark:bg-white/90 text-white dark:text-slate-950 text-[11px] font-black text-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                      {cat.name}
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CHILD SERVICES POPUP MODAL */}
        <AnimatePresence>
          {selectedCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col"
              >
                {/* Modal Header */}
                <div className="relative p-6 sm:p-8 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-500 font-bold">
                      {(() => {
                        const Icon = getCategoryIcon(selectedCategory);
                        return <Icon size={24} />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {selectedCategory.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Available Child Services from Database ({childServices.length})
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="p-2.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body - Child Services Grid */}
                <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-4 hide-scrollbar">
                  {childServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {childServices.map((service) => (
                        <div
                          key={service._id || service.name}
                          className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-yellow-400/50 transition-all shadow-sm hover:shadow-md"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                                {service.name}
                              </h4>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                              {service.description}
                            </p>

                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
                              <div className="flex items-center gap-1">
                                <Clock size={14} className="text-yellow-500" />
                                <span>{service.duration || 45} mins</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                <span>Verified Tech</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-black text-slate-900 dark:text-white">
                                  ₹{service.discountPrice || service.price}
                                </span>
                                {service.discountPrice && service.discountPrice < service.price && (
                                  <span className="text-xs text-slate-400 line-through">
                                    ₹{service.price}
                                  </span>
                                )}
                              </div>
                            </div>

                            <Link
                              href={`/booking?service=${encodeURIComponent(service.name)}&price=${service.discountPrice || service.price}`}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 text-slate-900 font-bold text-xs shadow-md hover:bg-yellow-500 transition-all"
                            >
                              Book Now
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Layers size={40} className="text-slate-400 mb-3" />
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">Full Services Coming Soon</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">
                        You can view all available services in our main catalog or contact support.
                      </p>
                      <Link
                        href={`/services?category=${encodeURIComponent(selectedCategory.name)}`}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white/10 text-white text-xs font-bold"
                      >
                        Explore Category Page
                      </Link>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    FixItFirst Verified Quality Guarantee
                  </span>
                  <Link
                    href={`/services?category=${encodeURIComponent(selectedCategory.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:underline"
                  >
                    View All in {selectedCategory.name}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}