"use client";

import Navbar from "../../components/layout/Navbar"; // Apna path verify kar lena
import Footer from "../../components/layout/Footer"; // Apna path verify kar lena
import { motion } from "framer-motion";
import { Target, ShieldCheck, Zap, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const values = [
    {
      icon: ShieldCheck,
      title: "Trust & Safety First",
      desc: "Every professional is rigorously background-checked and verified. Your safety is our absolute priority.",
    },
    {
      icon: Target,
      title: "Unmatched Quality",
      desc: "We don't compromise on the quality of work. Our 30-day service guarantee ensures you are always satisfied.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Time is money. Our smart routing algorithm ensures a technician reaches your doorstep in record time.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "500+", label: "Verified Pros" },
    { value: "4.9/5", label: "Average Rating" },
    { value: "24/7", label: "Customer Support" },
  ];

  return (
    <main className="w-full min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-yellow-400/10 dark:bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-1.5 mb-6"
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-400">
              Our Story
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]"
          >
            Redefining Home <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
              Services in India
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            FixitFirst was born from a simple idea: finding a reliable, skilled, and trustworthy technician shouldn&#39;t be a struggle. We are here to bring transparency and professionalism to your doorstep.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-slate-200 dark:divide-white/10">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <h3 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            {/* Left: Image / Visual Composition */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="relative aspect-square rounded-[3rem] bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 overflow-hidden shadow-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Users size={80} className="mx-auto text-slate-300 dark:text-white/10 mb-6" />
                  <h3 className="text-2xl font-black text-slate-400 dark:text-slate-600">Building a Community<br/>of Professionals</h3>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-8 -right-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-3xl shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <ShieldCheck className="text-green-500" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">100% Secure</p>
                    <p className="text-sm text-slate-500">Platform Guarantee</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Core Values */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="w-full lg:w-1/2"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-3xl md:text-4xl font-black mb-10 text-slate-900 dark:text-white tracking-tight"
              >
                Our Core <span className="text-yellow-500">Values</span>
              </motion.h2>

              <div className="flex flex-col gap-8">
                {values.map((val, index) => {
                  const Icon = val.icon;
                  return (
                    <motion.div key={index} variants={itemVariants} className="flex gap-6 group">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-yellow-400/10 group-hover:border-yellow-400/30">
                        <Icon className="text-slate-700 dark:text-slate-300 group-hover:text-yellow-500 transition-colors" size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          {val.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {val.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 dark:bg-yellow-400 text-white dark:text-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Join the FixitFirst Family
          </h2>
          <p className="text-slate-300 dark:text-slate-800 mb-10 text-lg max-w-2xl mx-auto">
            Whether you need a quick fix or a major repair, our professionals are just a click away.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-yellow-400 dark:bg-slate-900 font-bold text-slate-900 dark:text-white hover:scale-105 active:scale-95 transition-transform shadow-xl"
          >
            Explore Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}