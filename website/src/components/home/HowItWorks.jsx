"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, Home, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Search,
    title: "Choose a Service",
    description: "Browse our wide range of home services and select the one you need.",
  },
  {
    icon: CalendarCheck,
    title: "Book Instantly",
    description: "Pick your preferred date and time in just a few clicks.",
  },
  {
    icon: Home,
    title: "Relax at Home",
    description: "Our verified professional arrives at your doorstep on time.",
  },
  {
    icon: CheckCircle,
    title: "Service Done",
    description: "Enjoy a perfect job well done with our 30-day service guarantee.",
  },
];

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <section className="bg-slate-50 dark:bg-[#030712] py-20 lg:py-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">Works</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Booking a service is simple and takes less than a minute.
          </p>
        </motion.div>

        {/* 4-Column Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group relative rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 md:p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden"
              >
                {/* Icon */}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="text-yellow-500" size={28} />
                </div>

                {/* Text Content */}
                <h3 className="relative z-10 mt-8 text-xl font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="relative z-10 mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>

                {/* Watermark Number (01, 02, 03, 04) */}
                <span className="absolute right-5 top-5 text-6xl font-black text-slate-100 dark:text-white/5 pointer-events-none select-none transition-colors duration-300 group-hover:text-yellow-50 dark:group-hover:text-yellow-400/5">
                  0{index + 1}
                </span>
                
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <Link
            href="/book-service"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-yellow-400 px-8 py-4 font-bold text-white dark:text-slate-900 shadow-lg shadow-yellow-400/20 transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-900 transition-colors duration-300">
              Book your service Now
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            {/* Smooth Fill Animation on Hover */}
            <div className="absolute inset-0 bg-yellow-400 -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0 z-0" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}