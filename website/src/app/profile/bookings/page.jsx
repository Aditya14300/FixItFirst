"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Dummy Booking Data
const mockBookings = [
  {
    id: "BKG-001",
    title: "AC Repair Service",
    datetime: "24 May 2026, 10:00 AM",
    status: "Confirmed",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "BKG-002",
    title: "Washing Machine Repair",
    datetime: "20 May 2026, 02:00 PM",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "BKG-003",
    title: "Refrigerator Service",
    datetime: "18 May 2026, 11:00 AM",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "BKG-004",
    title: "Electrical Service",
    datetime: "15 May 2026, 04:00 PM",
    status: "Cancelled",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&auto=format&fit=crop",
  }
];

export default function MyBookingsPage() {

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
      case "Completed":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20";
      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/90 dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-8 shadow-lg"
    >
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-6 sm:mb-8">
        My Bookings
      </h1>

      <div className="flex flex-col gap-4">
        {mockBookings.map((booking, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={booking.id}
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-[#0f1525] border border-slate-200 dark:border-white/5 rounded-2xl hover:border-yellow-400/50 dark:hover:border-yellow-400/50 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative h-20 w-24 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
                <Image 
                  src={booking.image}
                  alt={booking.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {booking.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  {booking.datetime}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-200 dark:border-white/5 sm:border-t-0">
              
              <div className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border ${getStatusBadge(booking.status)}`}>
                {booking.status}
              </div>

              <Link 
                href={`/profile/bookings/${booking.id}`} 
                className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                View Details
              </Link>
              
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}