"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Camera, Edit2 } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  // Fallback data agar user object abhi load nahi hua hai
  const userData = user || {
    name: "Aditya Kumar Kothia",
    email: "aditya@example.com",
    phone: "+91 9876543210",
    avatar: "https://ui-avatars.com/api/?name=Aditya+Kumar&background=facc15&color=0f1525&size=128",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/90 dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-lg"
    >
      
      {/* Profile Header (Avatar & Basic Info) */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-10 border-b border-slate-200 dark:border-white/10">
        
        {/* Avatar with Edit Button */}
        <div className="relative group shrink-0">
          <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-slate-50 dark:border-[#0f1525] shadow-lg relative bg-slate-200 dark:bg-slate-800">
            <Image
              src={userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || "User")}&background=facc15&color=0f1525&size=128`}
              alt={userData.name || "User"}
              fill
              className="object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-yellow-400 rounded-full text-slate-900 border-2 border-white dark:border-[#0f1525] shadow-md hover:scale-105 transition-transform outline-none">
            <Camera size={16} />
          </button>
        </div>

        {/* User Details */}
        <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {userData.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {userData.email}
          </p>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {userData.phone}
          </p>
          
          <button className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-yellow-600 dark:text-yellow-400 hover:underline outline-none">
            <Edit2 size={14} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="pt-10">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 max-w-2xl">
          
          {/* Field: Full Name */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Full Name
            </span>
            <span className="text-base font-semibold text-slate-900 dark:text-white">
              {userData.name}
            </span>
          </div>

          {/* Field: Email Address */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Email Address
            </span>
            <span className="text-base font-semibold text-slate-900 dark:text-white">
              {userData.email}
            </span>
          </div>

          {/* Field: Phone Number */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Phone Number
            </span>
            <span className="text-base font-semibold text-slate-900 dark:text-white">
              {userData.phone}
            </span>
          </div>

        </div>
      </div>

    </motion.div>
  );
}