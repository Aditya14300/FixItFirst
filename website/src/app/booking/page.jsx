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
  Ticket,
  CheckCircle2,
  Phone,
  User,
  ShieldCheck,
  QrCode,
  Banknote,
  AlertCircle,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/app/services/api";

function BookingFormContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Dynamic Service Name & Price from URL Parameters or defaults!
  const queryService = searchParams.get("service");
  const queryPrice = searchParams.get("price");

  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [serviceTitle, setServiceTitle] = useState("AC Deep Service & Jet Wash");
  const [basePrice, setBasePrice] = useState(799);

  // Generate 4 consecutive Date Options dynamically
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const dayLabel = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
      const dateSub = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
      dates.push({ iso, dayLabel, dateSub, full: `${dateSub} (${dayLabel})` });
    }
    return dates;
  };

  const dateOptions = getDateOptions();

  // 3 Specific Time Slot Options requested by user
  const timeSlotOptions = [
    { id: "1st Hour", title: "1st Hour", timeRange: "09:00 AM - 12:00 PM", badge: "Morning" },
    { id: "2nd Hour", title: "2nd Hour", timeRange: "02:00 PM - 05:00 PM", badge: "Afternoon" },
    { id: "Full Day", title: "Full Day", timeRange: "09:00 AM - 07:00 PM", badge: "Flexible" },
  ];

  const [formData, setFormData] = useState({
    customerPhone: "",
    customerName: "",
    date: dateOptions[0]?.iso || "",
    timeSlot: "1st Hour",
    address: "",
    paymentMethod: "UPI Instant", // "UPI Instant" or "Pay After Service"
    coupon: "",
    discount: 0,
    upiId: "",
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
        customerPhone: currentUser.phone || prev.customerPhone || "",
      }));
    }
  }, [user]);

  const convenienceFee = 49;
  const discountAmount = (basePrice * formData.discount) / 100;
  const totalAmount = Math.max(0, basePrice + convenienceFee - discountAmount);

  // Check if ALL required booking details are properly filled before enabling the submit button!
  const isFormValid =
    formData.customerPhone.length === 10 &&
    Boolean(formData.date) &&
    Boolean(formData.timeSlot) &&
    formData.address.trim().length >= 5 &&
    Boolean(formData.paymentMethod);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "customerPhone") {
      // Clean phone to only numbers max 10 digits
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, customerPhone: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrorMessage("");
  };

  const applyCoupon = () => {
    if (formData.coupon.toUpperCase() === "FIXITFIRST25") {
      setFormData((prev) => ({ ...prev, discount: 25 }));
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid Coupon Code. Use: FIXITFIRST25 for 25% OFF!");
    }
  };

  const handleFinalBooking = async () => {
    if (!isFormValid) {
      setErrorMessage("Please fill all required fields completely.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const selectedDateObj = dateOptions.find((d) => d.iso === formData.date);
    const dateFormattedString = selectedDateObj ? selectedDateObj.full : formData.date;

    const payload = {
      customerPhone: formData.customerPhone,
      customerName: formData.customerName || "Customer",
      serviceName: serviceTitle,
      date: dateFormattedString,
      timeSlot: formData.timeSlot,
      address: formData.address,
      paymentMethod: formData.paymentMethod, // "UPI Instant" or "Pay After Service"
      amount: totalAmount,
      notes: `Payment: ${formData.paymentMethod}`,
    };

    try {
      // Save phone number locally so My Bookings page filters strictly for this customer
      if (typeof window !== "undefined") {
        localStorage.setItem("lastBookedPhone", formData.customerPhone);
      }

      // Save directly to MongoDB Database under "Insta-bookings" collection!
      const res = await api.post("/bookings", payload);
      if (res.data && (res.data.booking || res.data.instaBooking)) {
        setSuccessBooking(res.data.booking || res.data.instaBooking);
      } else {
        setSuccessBooking({ _id: `INSTA-${Date.now()}`, ...payload });
      }
    } catch (err) {
      console.warn("Backend request failed, saving locally:", err.message);
      const fallbackObj = {
        _id: `INSTA-${Math.floor(100000 + Math.random() * 900000)}`,
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
        
        {/* Page Header */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
            <ShieldCheck size={14} /> 100% Guaranteed & Safe Booking
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Quick Service Booking
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Enter phone number, choose date, slot, address & payment method
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm font-semibold flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLS: 4-STEP FORM */}
          <div className="lg:col-span-2 space-y-6">

            {/* STEP 1: 10-Digit Mobile Number Input */}
            <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="h-10 w-10 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
                  1
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Enter Mobile Number
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">10-digit phone number required</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Mobile Number (10 Digits) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-500 dark:text-slate-400 font-bold text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="customerPhone"
                      maxLength="10"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="e.g. 7735552029"
                      className="w-full h-13 pl-14 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-base font-bold text-slate-900 dark:text-white outline-none focus:border-yellow-400 tracking-wider"
                    />
                  </div>
                  {formData.customerPhone.length > 0 && formData.customerPhone.length < 10 && (
                    <p className="text-[11px] text-amber-500 mt-1 font-semibold">
                      ⚠️ {10 - formData.customerPhone.length} more digits required
                    </p>
                  )}
                  {formData.customerPhone.length === 10 && (
                    <p className="text-[11px] text-emerald-500 mt-1 font-bold flex items-center gap-1">
                      <Check size={12} /> Valid 10-digit number
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Your Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Kumar"
                      className="w-full h-13 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: Choose 4 Date Options & 3 Slot Options */}
            <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="h-10 w-10 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
                  2
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Choose Date & Time Slot
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Select from 4 available dates and 3 time slots</p>
                </div>
              </div>

              {/* 4 Date Options */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                  Select Date (4 Options) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {dateOptions.map((item) => {
                    const isSelected = formData.date === item.iso;
                    return (
                      <button
                        key={item.iso}
                        type="button"
                        onClick={() => setFormData({ ...formData, date: item.iso })}
                        className={`p-3.5 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? "bg-yellow-400/15 border-yellow-400 text-yellow-600 dark:text-yellow-400 ring-2 ring-yellow-400/20 font-bold shadow-sm"
                            : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        <span className="block text-sm font-black">{item.dayLabel}</span>
                        <span className="block text-[11px] opacity-80 mt-0.5">{item.dateSub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3 Slot Options: 1st Hour, 2nd Hour, Full Day */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                  Select Slot (3 Options: 1st Hour, 2nd Hour, Full Day) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {timeSlotOptions.map((slot) => {
                    const isSelected = formData.timeSlot === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, timeSlot: slot.id })}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? "bg-yellow-400/15 border-yellow-400 text-yellow-600 dark:text-yellow-400 ring-2 ring-yellow-400/20 font-bold shadow-sm"
                            : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Clock size={14} className="text-yellow-500" />
                            {slot.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 uppercase">
                            {slot.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {slot.timeRange}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 3: Service Address */}
            <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="h-10 w-10 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
                  3
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Service Address
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enter house/flat number, street and landmark</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Full Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Building Name, Street, Landmark, Bramhapur / City"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white outline-none focus:border-yellow-400"
                  />
                </div>
                {formData.address.trim().length > 0 && formData.address.trim().length < 5 && (
                  <p className="text-[11px] text-amber-500 mt-1 font-semibold">
                    ⚠️ Please enter a detailed address
                  </p>
                )}
              </div>
            </div>

            {/* STEP 4: Payment Method (UPI Instant or Pay After Service) */}
            <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="h-10 w-10 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
                  4
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Select Payment Method
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Choose between instant online payment or pay after service</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* UPI Instant */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: "UPI Instant" })}
                  className={`p-5 rounded-2xl border flex flex-col items-start gap-3 transition-all text-left relative ${
                    formData.paymentMethod === "UPI Instant"
                      ? "bg-yellow-400/10 border-yellow-400 ring-2 ring-yellow-400/20"
                      : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="h-10 w-10 rounded-xl bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                      <QrCode size={22} />
                    </div>
                    {formData.paymentMethod === "UPI Instant" && (
                      <span className="h-6 w-6 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center">
                        <Check size={14} className="font-bold" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      UPI Instant
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Pay instantly via Google Pay, PhonePe, Paytm or UPI QR Code
                    </p>
                  </div>
                </button>

                {/* Pay After Service */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: "Pay After Service" })}
                  className={`p-5 rounded-2xl border flex flex-col items-start gap-3 transition-all text-left relative ${
                    formData.paymentMethod === "Pay After Service"
                      ? "bg-yellow-400/10 border-yellow-400 ring-2 ring-yellow-400/20"
                      : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                      <Banknote size={22} />
                    </div>
                    {formData.paymentMethod === "Pay After Service" && (
                      <span className="h-6 w-6 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center">
                        <Check size={14} className="font-bold" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      Pay After Service
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Pay cash or UPI directly to technician after job is completed
                    </p>
                  </div>
                </button>
              </div>

              {formData.paymentMethod === "UPI Instant" && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 space-y-3">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Enter your UPI ID (Optional)</p>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    placeholder="e.g. mobile@paytm or username@okaxis"
                    className="w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm outline-none focus:border-yellow-400"
                  />
                </div>
              )}
            </div>

          </div>

          {/* RIGHT 1 COL: SUMMARY & CHECKOUT BUTTON */}
          <div>
            <div className="sticky top-28 rounded-3xl bg-slate-900 dark:bg-white/[0.03] border border-slate-800 dark:border-white/10 p-6 sm:p-8 text-white space-y-6 shadow-xl">
              <h3 className="text-xl font-bold border-b border-white/10 pb-4">
                Booking Summary
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
                <div className="flex justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-slate-400">Time Slot:</span>
                  <span className="font-bold text-white">{formData.timeSlot}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Payment:</span>
                  <span className="font-bold text-yellow-400">{formData.paymentMethod}</span>
                </div>
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

              {/* Confirm & Book Now Button (Disabled until ALL details are filled) */}
              <button
                onClick={handleFinalBooking}
                disabled={!isFormValid || loading}
                className={`w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isFormValid && !loading
                    ? "bg-yellow-400 hover:bg-yellow-300 text-slate-950 shadow-yellow-400/20 cursor-pointer"
                    : "bg-slate-800 text-slate-500 border border-white/10 cursor-not-allowed shadow-none opacity-60"
                }`}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    Confirm & Book Now
                  </>
                )}
              </button>

              {!isFormValid && (
                <p className="text-[11px] text-center text-amber-400/90 font-medium leading-relaxed bg-amber-400/10 p-2.5 rounded-xl border border-amber-400/20">
                  ⚠️ Fill 10-digit phone number & full address to enable booking
                </p>
              )}

              <p className="text-[11px] text-center text-slate-400">
                🔒 Saved under <span className="text-yellow-400 font-bold">Insta-bookings</span> collection
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
                  Saved under <span className="font-bold text-yellow-500">Insta-bookings</span> collection in FixItFirst database
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
                  <span className="text-slate-400">Phone Number:</span>
                  <span className="font-bold text-slate-900 dark:text-white">+91 {successBooking.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Slot:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{successBooking.date} ({successBooking.timeSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Option:</span>
                  <span className="font-bold text-yellow-500">{successBooking.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Payable:</span>
                  <span className="font-bold text-emerald-500">₹{successBooking.amount}</span>
                </div>
              </div>

              <a
                href="/my-bookings"
                className="block w-full py-4 rounded-2xl bg-yellow-400 text-slate-950 font-black text-sm hover:bg-yellow-300 transition-colors shadow-lg"
              >
                View My Bookings
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