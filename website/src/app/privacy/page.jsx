"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Lock, Eye, CheckCircle, Mail, Phone } from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 2026";

  const sections = [
    {
      id: "intro",
      title: "1. Introduction & Overview",
      content:
        "At FixItFirst, we are committed to protecting your privacy and safeguarding your personal information. This Privacy Policy explains how we collect, use, disclose, and store your information when you use our website, mobile application, and home services.",
    },
    {
      id: "collection",
      title: "2. Information We Collect",
      content:
        "We collect personal information that you provide to us directly when creating an account or booking a service, including your name, mobile phone number, service address, email address, and payment preferences. We also collect basic technical data like device identifiers and app analytics to improve service speed.",
    },
    {
      id: "usage",
      title: "3. How We Use Your Information",
      content:
        "Your information is strictly used to process and fulfill your service bookings, dispatch verified technicians to your address, provide instant booking status updates, send invoices, and handle customer support inquiries.",
    },
    {
      id: "sharing",
      title: "4. Information Sharing & Third Parties",
      content:
        "FixItFirst does NOT sell or rent your personal data to third parties. We share only necessary service information (such as your service address and contact phone number) with assigned technicians solely for service execution.",
    },
    {
      id: "security",
      title: "5. Data Protection & Security",
      content:
        "We implement enterprise-grade security protocols, SSL encryption, and secure cloud database infrastructure to protect your personal information against unauthorized access, loss, or alteration.",
    },
    {
      id: "rights",
      title: "6. Your Rights & Choices",
      content:
        "You have full control over your data. You may access, edit, or request complete deletion of your profile and booking history at any time by navigating to your account settings or contacting support.",
    },
    {
      id: "contact",
      title: "7. Privacy Enquiries",
      content:
        "If you have any questions or concerns regarding our privacy practices, please contact our Data Protection Officer at thefixitfirst@gmail.com or call +91 77355 52029.",
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
              <Shield size={14} /> Privacy & Security
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Privacy Policy</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
              Last updated: <span className="text-yellow-500 font-bold">{lastUpdated}</span>
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-400/10 text-yellow-500 flex items-center justify-center font-bold">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Encryption</h4>
                <p className="text-sm font-black text-slate-900 dark:text-white">256-Bit SSL Encrypted</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">No Data Selling</h4>
                <p className="text-sm font-black text-slate-900 dark:text-white">100% Data Protection</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                <Eye size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Transparency</h4>
                <p className="text-sm font-black text-slate-900 dark:text-white">Full User Control</p>
              </div>
            </div>
          </div>

          {/* Privacy Sections */}
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

          {/* Contact Support Banner */}
          <div className="mt-12 p-8 rounded-3xl bg-slate-900 dark:bg-white/[0.04] text-white border border-slate-800 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl font-black">Need assistance with your privacy data?</h3>
              <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                Our support team is available 24/7 to assist with data requests.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="mailto:thefixitfirst@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-yellow-400 text-slate-950 text-xs font-bold shadow-md hover:bg-yellow-300 transition-colors"
              >
                <Mail size={16} /> Privacy Contact
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
