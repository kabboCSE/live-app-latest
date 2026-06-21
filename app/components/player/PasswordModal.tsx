"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, X, Eye, EyeOff, ShieldCheck, Send } from "lucide-react";
import { FaTelegram } from "react-icons/fa6";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UNIVERSAL_PASSWORD = "adminKabbo12@";
const STORAGE_KEY = "iptv_universal_unlocked";

export function isUniversalUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function lockUniversal(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function PasswordModal({ isOpen, onClose, onSuccess }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = password.trim();

    if (!trimmed) {
      setError("Please enter a password.");
      return;
    }

    if (trimmed === UNIVERSAL_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setError("");
      setPassword("");
      setAttempts(0);
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(
        newAttempts >= 3
          ? `Incorrect password. ${3 - Math.min(newAttempts, 3)} attempts remaining.`
          : "Incorrect password. Try again."
      );
      setPassword("");
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-[#0f0f2a] to-[#070714] shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-violet-500/5 blur-[80px] pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white transition-all cursor-pointer z-10"
            >
              <X size={16} />
            </button>

            <div className="relative z-10 space-y-5">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 border border-primary/25 text-primary shadow-lg shadow-primary/10">
                  <Lock size={28} />
                </div>
              </div>

              {/* Title & Description */}
              <div className="text-center space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Playlist Locked
                </h2>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                  This playlist is password protected. Enter the password to access the <strong className="text-white">Universal</strong> channel list.
                </p>
              </div>

              {/* Contact line */}
              <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#26A5E4]/5 border border-[#26A5E4]/20">
                <FaTelegram size={14} className="text-[#26A5E4]" />
                <span className="text-xs text-zinc-400 font-medium">
                  Need password? Contact{" "}
                  <a
                    href="https://t.me/Kabbo512"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#26A5E4] font-bold hover:underline"
                  >
                    Kabbo on Telegram
                  </a>
                </span>
              </div>

              {/* Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Enter password..."
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 text-white text-sm font-medium placeholder:text-zinc-600 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-rose-400 pl-1 pt-1"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-primary/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={16} />
                    Unlock
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}