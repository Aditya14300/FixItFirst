"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aarav Sharma",
    location: "Bhubaneswar",
    text: "Booked an electrician for full home wiring. The guy was super professional, arrived on time, and cleaned up everything after the job. Best service ever!",
    rating: 5,
    initials: "AS",
    color: "bg-blue-500",
  },
  {
    name: "Priya Mohanty",
    location: "Cuttack",
    text: "I was struggling with a leaking AC for days. Booked FixitFirst, and the technician fixed it within 40 minutes. Transparent pricing and no extra hidden charges.",
    rating: 5,
    initials: "PM",
    color: "bg-emerald-500",
  },
  {
    name: "Rohan Dash",
    location: "Bhubaneswar",
    text: "The 30-day warranty is real! I had a minor issue with the plumbing work after 2 weeks, and they sent someone to fix it for free the very next day. Highly trusted.",
    rating: 5,
    initials: "RD",
    color: "bg-amber-500",
  },
];

export default function Testimonials() {
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
    <section className="bg-slate-50 dark:bg-[#030712] py-20 lg:py-28 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">Customers Say</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base">
            Don&apos;t just take our word for it. Read what our thousands of satisfied customers have to say about their experience.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:gap-8 lg:grid-cols-3"
        >
          {testimonials.map((review, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden"
            >
              {/* Background Quote Icon (Watermark) */}
              <Quote className="absolute -top-4 -right-4 h-32 w-32 rotate-12 text-slate-100 dark:text-white/[0.03] pointer-events-none transition-transform duration-300 group-hover:scale-110" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-8 grow">
                  &#34;{review.text}&#34;
                </p>

                {/* Customer Profile */}
                <div className="flex items-center gap-4 mt-auto">
                  {/* Colored Initials Avatar (No external image dependency) */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${review.color} text-white font-bold text-lg shadow-md`}>
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {review.name}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {review.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}