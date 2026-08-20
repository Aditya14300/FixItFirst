"use client";

import Navbar from "@/components/layout/Navbar"; // Path check kar lena
import Footer from "@/components/layout/Footer"; // Path check kar lena
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Yahan aap API call laga sakte hain baad mein
    console.log("Form Submitted:", formData);
    alert("Message sent successfully! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      desc: "Mon-Sat from 8am to 8pm.",
      value: "+91 99999 99999",
      link: "tel:+919999999999",
    },
    {
      icon: Mail,
      title: "Chat with us",
      desc: "Our friendly team is here to help.",
      value: "support@fixitfirst.com",
      link: "mailto:support@fixitfirst.com",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      desc: "Come say hello at our office HQ.",
      value: "Bhubaneswar, Odisha, India",
      link: "#",
    },
  ];

  return (
    <main className="w-full min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-400/10 dark:bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-1.5 mb-6"
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-400">
              Get In Touch
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6"
          >
            Let&#39;s have a <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">Conversation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            Have a question about our services? Need help with a booking? Our team is ready to assist you right away.
          </motion.p>
        </div>
      </section>

      {/* Contact Content Section */}
      <section className="relative py-12 lg:py-20 mb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* LEFT SIDE: Contact Methods */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full lg:w-5/12 flex flex-col gap-6"
            >
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.a
                    key={index}
                    href={method.link}
                    variants={itemVariants}
                    className="group flex items-start gap-5 p-6 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] shadow-sm hover:shadow-xl dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 group-hover:bg-yellow-400/10 group-hover:border-yellow-400/20 transition-colors duration-300">
                      <Icon className="text-slate-700 dark:text-slate-300 group-hover:text-yellow-500 transition-colors duration-300" size={26} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        {method.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {method.desc}
                      </p>
                      <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                        {method.value}
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>

            {/* RIGHT SIDE: Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full lg:w-7/12"
            >
              <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 shadow-2xl">
                
                {/* Form Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/20">
                    <MessageSquare size={18} className="text-yellow-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send us a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                      className="h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us more about your inquiry..."
                      rows="5"
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group mt-2 inline-flex items-center justify-center gap-2 h-14 w-full rounded-2xl bg-yellow-400 text-slate-900 font-bold text-lg hover:bg-yellow-300 transition-all hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] active:scale-[0.98]"
                  >
                    Send Message
                    <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </form>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}