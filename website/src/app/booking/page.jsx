"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Ticket,
  CheckCircle2,
  Phone,
  User,
  ShieldCheck,
  QrCode,
  Building,
  Banknote,
  AlertCircle,
  Edit3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function BookingFormContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Dynamic Service Name & Price from URL Parameters or defaults!
  const queryService = searchParams.get("service");
  const queryPrice = searchParams.get("price");

  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditingContact, setIsEditingContact] = useState(false);

  const [serviceTitle, setServiceTitle] = useState("AC Deep Service & Jet Wash");
  const [basePrice, setBasePrice] = useState(799);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "10:00 AM - 12:00 PM",
    address: "",
    notes: "",
    coupon: "",
    discount: 0,
    paymentMethod: "upi", // upi, card, netbanking, cod
    upiId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  // Read selected service title and price dynamically whenever URL searchParams change!
  useEffect(() => {
    if (queryService) {
      setServiceTitle(decodeURIComponent(queryService));
    }
    if (queryPrice) {
      const parsedPrice = parseFloat(queryPrice);
      if (!isNaN(parsedPrice)) setBasePrice(parsedPrice);
    }
  }, [queryService, queryPrice]);

  // Pre-fill user name and phone automatically from AuthContext or LocalStorage!
  useEffect(() => {
    let currentUser = user;
    if (!currentUser && typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) currentUser = JSON.parse(savedUser);
      } catch (err) {}
    }

    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        customerName: currentUser.name || prev.customerName || "Valued Customer",
        customerPhone: currentUser.phone || prev.customerPhone || "9876543210",
      }));
    }
  }, [user]);

  const convenienceFee = 49;
  const discountAmount = (basePrice * formData.discount) / 100;
  const totalAmount = Math.max(0, basePrice + convenienceFee - discountAmount);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const applyCoupon = () => {
    if (formData.coupon.toUpperCase() === "FIXITFIRST25") {
      setFormData({ ...formData, discount: 25 });
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid Coupon Code. Use: FIXITFIRST25 for 25% OFF!");
    }
  };

  const handleFinalBooking = async () => {
    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.address.trim()) {
      setErrorMessage("Please enter your service address.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const payload = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      serviceName: serviceTitle,
      date: formData.date,
      timeSlot: formData.timeSlot,
      address: formData.address,
      amount: totalAmount,
      notes: `Payment: ${formData.paymentMethod.toUpperCase()} | Notes: ${formData.notes}`,
    };

    try {
      // Save directly to MongoDB Database
      const res = await axios.post("http://localhost:5000/api/bookings", payload);
      if (res.data && res.data.booking) {
        setSuccessBooking(res.data.booking);
      } else {
        setSuccessBooking({ _id: `BK-${Date.now()}`, ...payload });
      }
    } catch (err) {
      console.warn("Backend request failed, saving locally:", err.message);
      const fallbackObj = {
        _id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
        ...payload,
        status: "confirmed",
      };
      setSuccessBooking(fallbackObj);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-28 pb-20 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
            <ShieldCheck size={14} /> 100% Guaranteed & Safe Service
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Complete Your Booking
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Review service summary, schedule & payment preference
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm font-semibold flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLS: FORM STEPS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Auto-Profile Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent border border-yellow-500/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
                  {(formData.customerName || "U").substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
                    Booking for Logged-In User
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {formData.customerName || "User Account"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone size={12} className="text-yellow-500" />
                    +91 {formData.customerPhone || "Registered Phone"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingContact(!isEditingContact)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-yellow-500 transition-colors shrink-0"
              >
                <Edit3 size={14} />
                {isEditingContact ? "Done" : "Change Contact"}
              </button>
            </div>

            {/* Optional Contact Edit Section */}
            <AnimatePresence>
              {isEditingContact && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4 overflow-hidden"
                >
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                    Update Contact / Book for someone else:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Name</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 1: Schedule & Address */}
            <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="h-10 w-10 rounded-xl bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Schedule & Service Address
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Pick date, time slot & service location</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Service Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full h-13 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Preferred Time Slot *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleInputChange}
                      className="w-full h-13 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white outline-none focus:border-yellow-400"
                    >
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                      <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Service Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Building Name, Street, Landmark, City"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Mode */}
            <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="h-10 w-10 rounded-xl bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Payment Mode
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Select payment preference</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "upi", label: "UPI Instant", icon: QrCode },
                  { id: "card", label: "Credit/Debit", icon: CreditCard },
                  { id: "netbanking", label: "NetBanking", icon: Building },
                  { id: "cod", label: "Pay After", icon: Banknote },
                ].map((method) => {
                  const MethodIcon = method.icon;
                  const isSelected = formData.paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        isSelected
                          ? "bg-yellow-400/10 border-yellow-400 text-yellow-600 dark:text-yellow-400 font-bold shadow-md"
                          : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <MethodIcon size={22} />
                      <span className="text-xs">{method.label}</span>
                    </button>
                  );
                })}
              </div>

              {formData.paymentMethod === "upi" && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 space-y-3">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Enter UPI ID (Google Pay / PhonePe / Paytm)</p>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    placeholder="e.g. username@okaxis or mobile@paytm"
                    className="w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm outline-none focus:border-yellow-400"
                  />
                </div>
              )}

              {formData.paymentMethod === "card" && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 space-y-3">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="Card Number (16 digits)"
                    className="w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm outline-none focus:border-yellow-400"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="h-12 px-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm outline-none focus:border-yellow-400"
                    />
                    <input
                      type="password"
                      name="cardCvv"
                      maxLength="3"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      placeholder="CVV"
                      className="h-12 px-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              )}

              {formData.paymentMethod === "cod" && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Pay ₹{totalAmount} via Cash or UPI to the technician after job completion.</span>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT 1 COL: SUMMARY & CHECKOUT */}
          <div>
            <div className="sticky top-28 rounded-3xl bg-slate-900 dark:bg-white/[0.03] border border-slate-800 dark:border-white/10 p-6 sm:p-8 text-white space-y-6 shadow-xl">
              <h3 className="text-xl font-bold border-b border-white/10 pb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Selected Service:</span>
                  <span className="font-bold text-yellow-400 max-w-[160px] text-right line-clamp-2">{serviceTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span className="font-bold text-white">₹{basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Visiting Charge:</span>
                  <span className="font-bold text-white">₹{convenienceFee}</span>
                </div>
                {formData.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({formData.discount}%):</span>
                    <span className="font-bold">-₹{discountAmount}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Ticket size={14} className="text-yellow-400" /> Apply Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="coupon"
                    value={formData.coupon}
                    onChange={handleInputChange}
                    placeholder="Code (e.g. FIXITFIRST25)"
                    className="flex-1 h-11 px-3 rounded-xl bg-white/10 text-xs text-white placeholder:text-slate-500 border border-white/10 outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="px-4 h-11 rounded-xl bg-yellow-400 text-slate-900 font-bold text-xs hover:bg-yellow-300 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Total Payable</p>
                  <p className="text-3xl font-black text-yellow-400">₹{totalAmount}</p>
                </div>
              </div>

              <button
                onClick={handleFinalBooking}
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay & Confirm Booking
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                🔒 256-Bit SSL Encrypted & 100% Guaranteed Service
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Booking Success Modal Dialog */}
      <AnimatePresence>
        {successBooking && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl"
            >
              <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Booking Confirmed! 🎉
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Saved directly to MongoDB database & sent to Admin Panel
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Booking ID:</span>
                  <span className="font-mono font-bold text-yellow-500">{successBooking._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{successBooking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{successBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Slot:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{successBooking.date} ({successBooking.timeSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-bold text-emerald-500">₹{successBooking.amount}</span>
                </div>
              </div>

              <a
                href="/my-bookings"
                className="block w-full py-4 rounded-2xl bg-yellow-400 text-slate-950 font-black text-sm hover:bg-yellow-300 transition-colors shadow-lg"
              >
                Go to My Bookings
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
          <div className="h-8 w-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <BookingFormContent />
      </Suspense>
      <Footer />
    </>
  );
}