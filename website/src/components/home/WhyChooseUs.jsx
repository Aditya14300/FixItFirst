"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, BadgeDollarSign, Wrench, Headset, Star } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    description: "Every technician goes through a strict background check and skill assessment.",
  },
  {
    icon: BadgeDollarSign,
    title: "Transparent Pricing",
    description: "No hidden charges. You get upfront pricing before the work even begins.",
  },
  {
    icon: Wrench,
    title: "30-Day Guarantee",
    description: "If something isn't right, we will fix it again for free within 30 days.",
  },
  {
    icon: Headset,
    title: "24/7 Priority Support",
    description: "Our dedicated support team is always ready to help you out, anytime.",
  },
];

export default function WhyChooseUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <section className="bg-white dark:bg-[#0a0f1c] py-20 lg:py-28 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* LEFT SIDE: Content & Features */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-1/2"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]"
            >
              Why Choose <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">
                FixitFirst
              </span>
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="mt-6 text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg"
            >
              We don&apos;t just fix things; we bring peace of mind. Experience the most reliable, safe, and professional home services in your city.
            </motion.p>

            <div className="mt-10 lg:mt-12 flex flex-col gap-8">
              {reasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <motion.div key={index} variants={itemVariants} className="flex items-start gap-5 group">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 transition-colors duration-300 group-hover:bg-yellow-400/10 group-hover:border-yellow-400/20">
                      <Icon className="text-slate-700 dark:text-slate-300 transition-colors duration-300 group-hover:text-yellow-500" size={26} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {reason.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT SIDE: Image Composition */}
          <motion.div 
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative flex justify-center"
          >
            {/* Background Decor Shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full blur-[80px] pointer-events-none z-0" />
            
            <div className="relative z-10 w-full max-w-md">
              <div className="relative aspect-[4/5] rounded-[2.5rem] bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl">
                {/* User's existing Technician Image */}
                <Image
                  src="https://res.cloudinary.com/dmsgeia9g/image/upload/v1783021596/Remove_background_project_-_03_July_2026_at_01.01.48_pnqnhr.png"
                  alt="FixitFirst Professional Technician"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-bottom pt-10"
                />
                
                {/* Gradient Overlay for blending */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-transparent to-transparent dark:from-[#0a0f1c] dark:via-transparent dark:to-transparent opacity-60" />
              </div>

              {/* Floating Trust Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -left-6 md:-left-12 bottom-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-5 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/20">
                    <Star className="fill-yellow-500 text-yellow-500" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">4.9/5</p>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Top Rated
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Experience Card */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute -right-4 md:-right-8 top-16 rounded-2xl bg-slate-900 dark:bg-white border border-slate-800 dark:border-white p-4 shadow-2xl"
              >
                <div className="text-center">
                  <p className="text-2xl font-black text-white dark:text-slate-900">10K+</p>
                  <p className="text-[10px] font-bold text-yellow-400 dark:text-yellow-600 uppercase tracking-widest mt-0.5">
                    Jobs Done
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}