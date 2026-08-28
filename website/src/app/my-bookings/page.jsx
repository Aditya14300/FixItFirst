"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, RefreshCw, XCircle, Ban } from "lucide-react";
import api from "@/app/services/api";
import toast from "react-hot-toast";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [filter, setFilter] = useState("all"); // all, active, completed, cancelled

  const fetchUserBookings = useCallback(async () => {
    setLoading(true);
    let currentUserPhone = user?.phone;

    if (!currentUserPhone && typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          currentUserPhone = parsed.phone;
        }
      } catch (err) {}
    }

    try {
      // Fetch ONLY bookings belonging to this logged in customer's phone number!
      const url = currentUserPhone
        ? `/bookings?phone=${currentUserPhone}`
        : "/bookings";

      const res = await api.get(url);
      if (res.data && res.data.bookings) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.warn("Failed to fetch bookings:", err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  const handleCancelBooking = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      // Call MongoDB cancel endpoint
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully!");
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      console.error("Cancel booking error:", err);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "active") return b.status === "pending" || b.status === "confirmed";
    if (filter === "completed") return b.status === "completed";
    if (filter === "cancelled") return b.status === "cancelled";
    return true;
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-28 pb-20 px-4 sm:px-6 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                My Bookings
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage your scheduled repairs & order history
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Filter Pills */}
              <div className="flex bg-slate-200 dark:bg-slate-900 p-1 rounded-xl text-xs font-bold">
                {["all", "active", "completed", "cancelled"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                      filter === f
                        ? "bg-yellow-400 text-slate-950 shadow"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchUserBookings}
                className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-yellow-500 transition-colors shadow-sm"
                title="Refresh Bookings"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="h-8 w-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500">Fetching your personal bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-center space-y-4 shadow-sm">
              <AlertCircle size={48} className="mx-auto text-slate-400" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Bookings Found</h3>
              <p className="text-xs text-slate-500">You don't have any bookings matching this filter.</p>
              <a
                href="/booking"
                className="inline-block px-6 py-3 rounded-2xl bg-yellow-400 text-slate-950 font-bold text-xs hover:bg-yellow-300 transition-colors shadow-md"
              >
                Book Service Now
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:border-slate-300 dark:hover:border-white/20"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-yellow-500">
                        {booking._id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === "confirmed"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : booking.status === "completed"
                          ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20"
                          : booking.status === "cancelled"
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : "bg-yellow-400/10 text-yellow-500 border border-yellow-400/20"
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {booking.serviceName}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-yellow-500" />
                        {booking.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-yellow-500" />
                        {booking.timeSlot}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-yellow-500" />
                        <span className="line-clamp-1 max-w-xs">{booking.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/10 shrink-0 gap-3">
                    <div>
                      <p className="text-[10px] text-slate-400 sm:text-right">Total Amount</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        ₹{booking.amount}
                      </p>
                    </div>

                    {/* Cancel Booking Action */}
                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="px-3.5 py-1.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {cancellingId === booking._id ? (
                          <div className="h-3.5 w-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Ban size={14} />
                        )}
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}