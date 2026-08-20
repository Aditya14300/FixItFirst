"use client";

import toast from "react-hot-toast";
import { loginUser, registerUser, resetPasswordUser } from "@/app/services/authService";
import { useAuth } from "@/context/AuthContext";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, ArrowLeft, Star, ShieldCheck, Phone, Eye, EyeOff, KeyRound } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", 
    password: "",
  });

  const [resetData, setResetData] = useState({
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetChange = (e) => {
    setResetData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!resetData.phone || !resetData.newPassword || !resetData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (resetData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsResetting(true);

    try {
      const res = await resetPasswordUser({
        phone: resetData.phone,
        newPassword: resetData.newPassword,
      });

      toast.success(res.message || "Password reset successful!");
      
      // Prefill login phone number and switch back to login
      setFormData((prev) => ({ ...prev, phone: resetData.phone, password: "" }));
      setResetData({ phone: "", newPassword: "", confirmPassword: "" });
      setIsForgotPassword(false);
      setIsLogin(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (isLogin) {
        res = await loginUser({
          phone: formData.phone,
          password: formData.password,
        });

        localStorage.setItem("token", res.token);
        if (res.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
          setUser(res.user);
        }
        toast.success("Login Successful");
        const redirectUrl = searchParams.get("redirect") || "/";
        router.push(redirectUrl);
      } else {
        res = await registerUser(formData);
        toast.success("Account Created Successfully");
        setIsLogin(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-white dark:bg-[#030712] transition-colors duration-300">
      {/* LEFT SIDE: BRAND VISUAL */}
      <div className="relative hidden lg:flex w-1/2 bg-slate-900 overflow-hidden items-center justify-center p-12">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10 w-full max-w-lg flex flex-col gap-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-black tracking-tight text-white">
              Fixit<span className="text-yellow-400">First</span>
            </h1>
            <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mt-1">
              Premium Services
            </p>
          </Link>

          <div className="mt-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-black text-white leading-tight"
            >
              Your Home, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                Our Priority.
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-lg text-slate-400 leading-relaxed max-w-md"
            >
              Join thousands of satisfied customers who trust us for their daily home service needs. Fast, reliable, and always verified.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-6 mt-4"
          >
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl backdrop-blur-md">
              <ShieldCheck className="text-green-400" size={24} />
              <div>
                <p className="text-sm font-bold text-white">100% Secure</p>
                <p className="text-xs text-slate-400">Verified Pros</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl backdrop-blur-md">
              <Star className="text-yellow-400 fill-yellow-400" size={24} />
              <div>
                <p className="text-sm font-bold text-white">4.9/5 Rating</p>
                <p className="text-xs text-slate-400">10k+ Reviews</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE: AUTH / FORGOT PASSWORD FORM */}
      <div className="relative flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 lg:p-20 overflow-y-auto">
        <Link 
          href="/" 
          className="absolute top-6 left-6 lg:top-8 lg:left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-semibold hidden sm:inline">Back</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-md my-auto pt-16 lg:pt-0"
        >
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Fixit<span className="text-yellow-500">First</span>
            </h1>
          </div>

          <AnimatePresence mode="wait">
            {isForgotPassword ? (
              /* FORGOT PASSWORD FORM */
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-yellow-400/10 text-yellow-500 mb-4 border border-yellow-400/20">
                    <KeyRound size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    Reset Password
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Enter your registered phone number and set a new password for your account.
                  </p>
                </div>

                <form onSubmit={handleResetSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Registered Phone Number</label>
                    <div className="relative flex items-center h-14 w-full rounded-2xl bg-slate-50 dark:bg-[#0f1525] border border-slate-200 dark:border-white/5 px-4 focus-within:border-yellow-400 focus-within:bg-white dark:focus-within:bg-[#030712] focus-within:ring-4 focus-within:ring-yellow-400/10 transition-all">
                      <Phone size={18} className="text-slate-400 shrink-0" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={resetData.phone}
                        onChange={handleResetChange}
                        placeholder="98765 43210"
                        className="h-full w-full bg-transparent px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">New Password</label>
                    <div className="relative flex items-center h-14 w-full rounded-2xl bg-slate-50 dark:bg-[#0f1525] border border-slate-200 dark:border-white/5 px-4 focus-within:border-yellow-400 focus-within:bg-white dark:focus-within:bg-[#030712] focus-within:ring-4 focus-within:ring-yellow-400/10 transition-all">
                      <Lock size={18} className="text-slate-400 shrink-0" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        required
                        value={resetData.newPassword}
                        onChange={handleResetChange}
                        placeholder="At least 6 characters"
                        className="h-full w-full bg-transparent px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="p-1 text-slate-400 hover:text-yellow-500 transition-colors outline-none shrink-0"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                    <div className="relative flex items-center h-14 w-full rounded-2xl bg-slate-50 dark:bg-[#0f1525] border border-slate-200 dark:border-white/5 px-4 focus-within:border-yellow-400 focus-within:bg-white dark:focus-within:bg-[#030712] focus-within:ring-4 focus-within:ring-yellow-400/10 transition-all">
                      <Lock size={18} className="text-slate-400 shrink-0" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        value={resetData.confirmPassword}
                        onChange={handleResetChange}
                        placeholder="Re-enter new password"
                        className="h-full w-full bg-transparent px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isResetting}
                    className="group relative mt-4 inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-900 dark:bg-yellow-400 px-6 font-bold text-white dark:text-slate-900 transition-transform active:scale-[0.98] shadow-md hover:shadow-xl disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-900 transition-colors duration-300">
                      {isResetting ? "Resetting Password..." : "Update Password"}
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 w-[150%] bg-yellow-400 -translate-x-[110%] skew-x-12 transition-transform duration-500 ease-out group-hover:translate-x-[-10%] z-0" />
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <button 
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors outline-none"
                  >
                    <ArrowLeft size={16} />
                    Back to Sign In
                  </button>
                </div>
              </motion.div>
            ) : (
              /* LOGIN / REGISTER FORM */
              <motion.div
                key="login-register"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {isLogin ? "Enter your phone number to login." : "Sign up in less than 2 minutes."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <AnimatePresence mode="popLayout">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-5 overflow-hidden"
                      >
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                          <div className="relative flex items-center h-14 w-full rounded-2xl bg-slate-50 dark:bg-[#0f1525] border border-slate-200 dark:border-white/5 px-4 focus-within:border-yellow-400 focus-within:bg-white dark:focus-within:bg-[#030712] focus-within:ring-4 focus-within:ring-yellow-400/10 transition-all">
                            <User size={18} className="text-slate-400 shrink-0" />
                            <input
                              type="text"
                              name="name"
                              required={!isLogin}
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="John Doe"
                              className="h-full w-full bg-transparent px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                          <div className="relative flex items-center h-14 w-full rounded-2xl bg-slate-50 dark:bg-[#0f1525] border border-slate-200 dark:border-white/5 px-4 focus-within:border-yellow-400 focus-within:bg-white dark:focus-within:bg-[#030712] focus-within:ring-4 focus-within:ring-yellow-400/10 transition-all">
                            <Mail size={18} className="text-slate-400 shrink-0" />
                            <input
                              type="email"
                              name="email"
                              required={!isLogin}
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="john@example.com"
                              className="h-full w-full bg-transparent px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                    <div className="relative flex items-center h-14 w-full rounded-2xl bg-slate-50 dark:bg-[#0f1525] border border-slate-200 dark:border-white/5 px-4 focus-within:border-yellow-400 focus-within:bg-white dark:focus-within:bg-[#030712] focus-within:ring-4 focus-within:ring-yellow-400/10 transition-all">
                      <Phone size={18} className="text-slate-400 shrink-0" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="98765 43210"
                        className="h-full w-full bg-transparent px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                      {isLogin && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setResetData((prev) => ({ ...prev, phone: formData.phone }));
                            setIsForgotPassword(true);
                          }}
                          className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 hover:underline outline-none"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative flex items-center h-14 w-full rounded-2xl bg-slate-50 dark:bg-[#0f1525] border border-slate-200 dark:border-white/5 px-4 focus-within:border-yellow-400 focus-within:bg-white dark:focus-within:bg-[#030712] focus-within:ring-4 focus-within:ring-yellow-400/10 transition-all">
                      <Lock size={18} className="text-slate-400 shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="h-full w-full bg-transparent px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-slate-400 hover:text-yellow-500 transition-colors outline-none shrink-0"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group relative mt-4 inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-900 dark:bg-yellow-400 px-6 font-bold text-white dark:text-slate-900 transition-transform active:scale-[0.98] shadow-md hover:shadow-xl"
                  >
                    <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-900 transition-colors duration-300">
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 w-[150%] bg-yellow-400 -translate-x-[110%] skew-x-12 transition-transform duration-500 ease-out group-hover:translate-x-[-10%] z-0" />
                  </button>
                </form>

                <div className="relative flex items-center justify-center mt-8 mb-8">
                  <div className="absolute inset-x-0 h-px bg-slate-200 dark:bg-white/10" />
                  <span className="relative bg-white dark:bg-[#030712] px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Or continue with
                  </span>
                </div>

                <button type="button" className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-transparent font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  Google
                </button>

                <div className="mt-8 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline outline-none"
                  >
                    {isLogin ? "Sign up" : "Log in"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#030712] text-slate-900 dark:text-white font-bold">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}