"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, ShieldCheck, Clock, ChevronRight, HelpCircle, Phone, Mail } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "August 2026";

  const sections = [
    {
      id: "agreement",
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using the FixItFirst platform, mobile applications, or web services, you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, please do not use our services.",
    },
    {
      id: "services",
      title: "2. Service Bookings & Technician Dispatch",
      content:
        "FixItFirst connects users with verified independent service professionals ('Technicians') for electrical, plumbing, AC repair, cleaning, carpentry, painting, and appliance services. While we thoroughly verify and background-check technicians, the actual service is delivered at your designated address upon your confirmation.",
    },
    {
      id: "pricing",
      title: "3. Pricing, Payments & Cancellation",
      content:
        "Service charges are clearly listed at the time of booking. A standard visiting/convenience fee may apply. Payments can be made online via UPI/cards or cash after service completion. You may cancel your booking without penalty before the technician has been dispatched to your location.",
    },
    {
      id: "warranty",
      title: "4. 30-Day FixItFirst Warranty",
      content:
        "We offer a 30-day warranty on eligible home services fulfilled through FixItFirst. If the same issue recurs within 30 days of service completion, our team will inspect and re-service at no additional charge, subject to verification.",
    },
    {
      id: "responsibilities",
      title: "5. User Responsibilities",
      content:
        "You agree to provide accurate location and contact details, ensure safe access for technicians at the scheduled time, and treat service personnel with respect. Unsafe working environments may result in booking cancellation.",
    },
    {
      id: "liability",
      title: "6. Limitation of Liability",
      content:
        "FixItFirst strives to maintain high quality standards. In no event shall FixItFirst be liable for indirect, incidental, or consequential damages resulting from third-party services beyond the direct cost of the booked service.",
    },
    {
      id: "contact",
      title: "7. Contact & Support",
      content:
        "If you have any questions, concerns, or grievances regarding these terms, please contact our support team at thefixitfirst@gmail.com or call +91 77355 52029.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-32 pb-20 text-slate-900 dark:text-white transition-colors duration-300">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
          {/* Breadcrumbs & Header */}
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider mb-4">
              <FileText size={14} /> Legal Documentation
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Terms & Conditions</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
              Last updated: <span className="text-yellow-500 font-bold">{lastUpdated}</span>
            </p>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-400/10 text-yellow-500 flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Guarantee</h4>
                <p className="text-sm font-black text-slate-900 dark:text-white">30-Day Warranty</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cancellation</h4>
                <p className="text-sm font-black text-slate-900 dark:text-white">Free Before Dispatch</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                <HelpCircle size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Support</h4>
                <p className="text-sm font-black text-slate-900 dark:text-white">24/7 Assistance</p>
              </div>
            </div>
          </div>

          {/* Main Terms Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 shadow-sm"
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  {section.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Contact Callout */}
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl font-black">Have questions about our Terms?</h3>
              <p className="text-xs sm:text-sm font-medium opacity-90 mt-1">
                Reach out to our legal and support team anytime.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="mailto:thefixitfirst@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-950 text-white text-xs font-bold shadow-md hover:bg-slate-800 transition-colors"
              >
                <Mail size={16} /> Email Support
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
