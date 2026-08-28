"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, RefreshCw, Phone, Search } from "lucide-react";
import api from "@/app/services/api";
import toast from "react-hot-toast";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [filter, setFilter] = useState("all"); // all, active, completed, cancelled
  const [phoneInput, setPhoneInput] = useState("");
  const [activePhone, setActivePhone] = useState("");

  const fetchUserBookings = useCallback(async () => {
    setLoading(true);
    let currentUserPhone = activePhone || user?.phone;

    if (!currentUserPhone && typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.phone) currentUserPhone = parsed.phone;
        }
        if (!currentUserPhone) {
          currentUserPhone = localStorage.getItem("lastBookedPhone") || "";
        }
      } catch (err) {}
    }

    if (!currentUserPhone) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setActivePhone(currentUserPhone);

    try {
      // Fetch ONLY bookings belonging strictly to this customer's phone number!
      const res = await api.get(`/bookings?phone=${encodeURIComponent(currentUserPhone)}`);
      if (res.data && res.data.bookings) {
        setBookings(res.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.warn("Failed to fetch bookings:", err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user, activePhone]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  const handlePhoneSearch = (e) => {
    e.preventDefault();
    const cleanPhone = phoneInput.replace(/\D/g, "").slice(0, 10);
    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("lastBookedPhone", cleanPhone);
    }
    setActivePhone(cleanPhone);
  };

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
                {activePhone ? (
                  <span className="flex items-center gap-1">
                    Showing bookings for <span className="font-bold text-yellow-500">+91 {activePhone}</span>
                  </span>
                ) : (
                  "Manage your scheduled repairs & order history"
                )}
              </p>
            </div>
            
            {activePhone && (
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
            )}
          </div>

          {/* Search Phone Banner if no activePhone or to switch phone */}
          {!activePhone && !loading && (
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-center space-y-6 shadow-sm mb-8">
              <div className="h-16 w-16 bg-yellow-400/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto border border-yellow-400/20">
                <Phone size={28} />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Find Your Bookings
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter your 10-digit mobile number used during booking to view your scheduled services.
                </p>
              </div>

              <form onSubmit={handlePhoneSearch} className="max-w-md mx-auto flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength="10"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Enter 10-digit number"
                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-yellow-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 h-12 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shadow-md shrink-0"
                >
                  <Search size={16} />
                  View Bookings
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="h-8 w-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500">Fetching your personal bookings...</p>
            </div>
          ) : activePhone && filteredBookings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-center space-y-4 shadow-sm">
              <AlertCircle size={48} className="mx-auto text-slate-400" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Bookings Found</h3>
              <p className="text-xs text-slate-500">
                No bookings found for <span className="font-bold text-yellow-500">+91 {activePhone}</span>.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActivePhone("")}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
                >
                  Change Phone Number
                </button>
                <a
                  href="/booking"
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 text-slate-950 font-bold text-xs hover:bg-yellow-300 transition-colors shadow-md"
                >
                  Book Service Now
                </a>
              </div>
            </div>
          ) : activePhone && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2 text-xs text-slate-500">
                <span>Total Bookings: <b>{filteredBookings.length}</b></span>
                <button
                  onClick={() => setActivePhone("")}
                  className="text-yellow-500 font-bold hover:underline"
                >
                  Change Number (+91 {activePhone})
                </button>
              </div>

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
                        {booking.address}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Amount</p>
                      <p className="text-2xl font-black text-yellow-500">₹{booking.amount}</p>
                    </div>

                    {booking.status !== "cancelled" && booking.status !== "completed" && (
                      <button
                        onClick={() => handleCancelBooking(booking.bookingId || booking._id)}
                        disabled={cancellingId === (booking.bookingId || booking._id)}
                        className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {cancellingId === (booking.bookingId || booking._id) ? "Cancelling..." : "Cancel Booking"}
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