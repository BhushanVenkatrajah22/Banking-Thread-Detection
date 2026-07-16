'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Lock, Mail, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('anjali.gupta@securemind.bank');
  const [password, setPassword] = useState('••••••••••••');
  const [step, setStep] = useState<1 | 2>(1); // 1: Credentials, 2: OTP 2FA
  const [otpCodes, setOtpCodes] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API authorization check
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newCodes = [...otpCodes];
    newCodes[index] = value;
    setOtpCodes(newCodes);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpCodes[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpCodes.join('');
    if (otp.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1200);
  };

  const autofillOtp = () => {
    setOtpCodes(['1', '2', '3', '4', '5', '6']);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      {/* Premium Outer Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-[#E2E8F0] shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Branding Side (Dark Navy #0F172A) */}
        <div className="md:w-1/2 bg-[#0F172A] p-10 flex flex-col justify-between text-white relative">
          {/* Subtle background grids */}
          <div className="absolute inset-0 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
          
          <div className="z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">SecureMind AI</span>
            </div>
            <div className="mt-2 text-xs font-semibold tracking-widest text-[#2563EB] uppercase">
              Predict. Prevent. Protect.
            </div>
          </div>

          <div className="my-10 z-10">
            <h2 className="text-2xl font-bold text-slate-100 leading-tight">
              Predictive Employee Behavior Intelligence Platform
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Continuous Digital Twin matching analyzes behavioral drift in real-time, securing bank endpoints from insider threat indicators before they happen.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Zero-Trust Twin Mapping</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Off-hours Database Traversal Alerts</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Explainable Threat Predictions</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 z-10 flex items-center justify-between">
            <span>Authorized Bank Personnel Only</span>
            <span>v2.6.4</span>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white relative">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              // Step 1: Username & Password
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#0F172A]">Portal Access</h3>
                  <p className="text-xs text-slate-500">Sign in with your enterprise credentials</p>
                </div>

                {error && (
                  <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg flex items-center gap-2 text-xs text-[#EF4444]">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#0F172A]">Enterprise Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#1E293B] rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#2563EB] transition-colors"
                        placeholder="email@securemind.bank"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-[#0F172A]">Password</label>
                      <span className="text-[11px] text-[#2563EB] hover:underline cursor-pointer">Forgot password?</span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#1E293B] rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#2563EB] transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="remember"
                      defaultChecked
                      className="rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-xs text-slate-500 font-medium cursor-pointer">
                      Remember this workstation for 12 hours
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2563EB] text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                    ) : (
                      <>
                        <span>Authenticate User</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              // Step 2: 2-Factor OTP
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#2563EB]" />
                    <span>Secure Dual-Factor</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    A code was dispatched to your registered security key device.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg flex items-center gap-2 text-xs text-[#EF4444]">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="flex justify-between gap-2.5">
                    {otpCodes.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        className="w-12 h-12 bg-[#F8FAFC] border border-[#E2E8F0] text-center text-lg font-bold text-[#0F172A] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={autofillOtp}
                      className="text-[#2563EB] hover:underline font-semibold cursor-pointer"
                    >
                      Autofill Code (123456)
                    </button>
                    <span className="text-slate-400">Resend code in 45s</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 bg-white border border-[#E2E8F0] text-slate-700 py-3 rounded-lg font-semibold text-sm hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 bg-[#2563EB] text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                      ) : (
                        <span>Verify and Enter</span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
