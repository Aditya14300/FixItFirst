"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { getCategories } from "@/app/services/categoryService";

const categoryStylePresets = [
  { hoverBorder: "group-hover:border-amber-500/50" },
  { hoverBorder: "group-hover:border-blue-500/50" },
  { hoverBorder: "group-hover:border-cyan-500/50" },
  { hoverBorder: "group-hover:border-emerald-500/50" },
  { hoverBorder: "group-hover:border-orange-500/50" },
  { hoverBorder: "group-hover:border-purple-500/50" },
];

const fallbackCategories = [
  { _id: "cat-1", name: "AC Repair", icon: "ac" },
  { _id: "cat-2", name: "Electrical & Lighting", icon: "lightbulb" },
  { _id: "cat-3", name: "Washing Machine", icon: "washingmachine" },
  { _id: "cat-4", name: "Refrigerator Repair", icon: "refrigerator" },
  { _id: "cat-5", name: "Water Purifier (RO)", icon: "waterpurifier" },
  { _id: "cat-6", name: "Kitchen Chimney", icon: "chimney" },
  { _id: "cat-7", name: "CCTV & Security", icon: "cctv" },
  { _id: "cat-8", name: "Plumbing", icon: "wrench" },
  { _id: "cat-9", name: "Cleaning", icon: "sparkles" },
  { _id: "cat-10", name: "Carpentry", icon: "hammer" },
  { _id: "cat-11", name: "Painting", icon: "paintbrush" },
];

const defaultCategoryBgImages = {
  ac: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
  electrician: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
  washingmachine: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800",
  refrigerator: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800",
  waterpurifier: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800",
  chimney: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800",
  cctv: "https://res.cloudinary.com/dmsgeia9g/image/upload/v1788031878/3_hsecwy.png",
  wrench: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800",
  sparkles: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
  hammer: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800",
  paintbrush: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800",
};

const sortCategoriesWithCustomOrder = (catList) => {
  if (!Array.isArray(catList) || catList.length === 0) return catList;

  const normalCats = [];
  let applianceCat = null;
  let otherCat = null;

  catList.forEach((cat) => {
    const name = (typeof cat === "string" ? cat : cat?.name || "").toLowerCase();
    if (name.includes("other")) {
      otherCat = cat;
    } else if (name.includes("appliance")) {
      applianceCat = cat;
    } else {
      normalCats.push(cat);
    }
  });

  const result = [...normalCats];
  if (applianceCat) result.push(applianceCat);
  if (otherCat) result.push(otherCat);

  return result;
};

const getCategoryBgImage = (cat) => {
  if (cat?.image && cat.image.trim() !== "") return cat.image;
  if (cat?.img && cat.img.trim() !== "") return cat.img;

  const iconKey = (cat?.icon || cat?.name || "").toLowerCase();
  if (iconKey.includes("ac") || iconKey.includes("air") || iconKey.includes("condition")) return defaultCategoryBgImages.ac;
  if (iconKey.includes("electric") || iconKey.includes("light") || iconKey.includes("bulb")) return defaultCategoryBgImages.electrician;
  if (iconKey.includes("wash") || iconKey.includes("laundry")) return defaultCategoryBgImages.washingmachine;
  if (iconKey.includes("refrig") || iconKey.includes("fridge")) return defaultCategoryBgImages.refrigerator;
  if (iconKey.includes("water") || iconKey.includes("purifi") || iconKey.includes("ro ")) return defaultCategoryBgImages.waterpurifier;
  if (iconKey.includes("chimney") || iconKey.includes("exhaust")) return defaultCategoryBgImages.chimney;
  if (iconKey.includes("cctv") || iconKey.includes("camera") || iconKey.includes("security")) return defaultCategoryBgImages.cctv;
  if (iconKey.includes("plumb") || iconKey.includes("wrench")) return defaultCategoryBgImages.wrench;
  if (iconKey.includes("clean") || iconKey.includes("sparkle")) return defaultCategoryBgImages.sparkles;
  if (iconKey.includes("carpent") || iconKey.includes("hammer")) return defaultCategoryBgImages.hammer;
  if (iconKey.includes("paint")) return defaultCategoryBgImages.paintbrush;
  return defaultCategoryBgImages.ac;
};

export default function Categories() {
  const [categories, setCategories] = useState(sortCategoriesWithCustomOrder(fallbackCategories));
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
        const catRes = await getCategories();
        if (catRes && catRes.success && Array.isArray(catRes.categories) && catRes.categories.length > 0) {
          setCategories(sortCategoriesWithCustomOrder(catRes.categories));
        } else {
          setCategories(sortCategoriesWithCustomOrder(fallbackCategories));
        }
      } catch (err) {
        console.error("Error fetching categories from database:", err);
        setCategories(sortCategoriesWithCustomOrder(fallbackCategories));
      } finally {
        setLoading(false);
      }
    }
    loadDbData();
  }, []);

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

        {/* Dynamic Database Parent Categories - INLINE & SCROLLABLE 1:1 FULL BACKGROUND CARDS */}
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {[1, 2, 3, 4, 5, 6, 7].map((idx) => (
              <div key={idx} className="flex-shrink-0 w-36 sm:w-44 md:w-52 aspect-square rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth hide-scrollbar px-1 -mx-2 sm:mx-0"
          >
            {categories.map((cat, index) => {
              const bgImg = getCategoryBgImage(cat);
              const preset = categoryStylePresets[index % categoryStylePresets.length];

              return (
                <Link
                  key={cat._id || index}
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  title={cat.name}
                  className="flex-shrink-0 w-36 sm:w-44 md:w-52 aspect-square snap-start group cursor-pointer outline-none"
                >
                  <div className={`relative w-full h-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-md transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl dark:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] ${preset.hoverBorder}`}>

                    {/* Full 1:1 Background Image (Fetched dynamically from DB) */}
                    <img
                      src={bgImg}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Dark Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/10 transition-opacity duration-300 group-hover:from-slate-950/95" />

                    {/* Category Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-center z-10">
                      <h3 className="text-xs sm:text-sm md:text-base font-black text-white drop-shadow-md line-clamp-1 group-hover:text-yellow-400 transition-colors">
                        {cat.name}
                      </h3>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}