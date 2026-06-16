"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, User, HelpCircle, Sparkles } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/fixtures", label: "World Cup", icon: Trophy, highlight: true, desktopOnly: true },
    { href: "/about", label: "About", icon: User, desktopOnly: true },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <header className="sticky top-3 z-50 w-full px-3 sm:px-6 mt-3">
      <div className="max-w-7xl mx-auto bg-[#0d0d22]/90 backdrop-blur-2xl border border-white/[0.07] rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.06)]">
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
          {/* Logo & Brand */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-emerald-500/30 group-hover:border-emerald-400/60 shadow-lg shadow-emerald-500/15 bg-emerald-500/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                <Sparkles size={18} className="text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="hidden sm:flex text-lg sm:text-xl font-black tracking-tight">
                  <span className="text-white">Neo</span>
                  <span className="gradient-text">Stream</span>
                </span>
                <span className="sm:hidden text-base font-black tracking-tight">
                  <span className="text-white">Neo</span>
                  <span className="gradient-text">Stream</span>
                </span>
                <div className="hidden sm:flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-emerald-400/70">
                    Live TV
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            {navLinks.map(({ href, label, icon: Icon, highlight, desktopOnly }) => (
              <Link
                key={href}
                href={href}
                className={`${desktopOnly ? "hidden sm:flex" : "flex"} items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl border transition-all duration-300 active:scale-95 ${
                  pathname === href
                    ? highlight
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-white/[0.07] hover:border-emerald-500/20 bg-white/[0.02] hover:bg-emerald-500/[0.05] text-gray-400 hover:text-emerald-300"
                }`}
              >
                <Icon size={14} className={pathname === href ? "animate-pulse-glow" : ""} />
                <span className="text-[11px] sm:text-xs font-bold tracking-wide">{label}</span>
              </Link>
            ))}
          </motion.nav>
        </div>
      </div>
    </header>
  );
}