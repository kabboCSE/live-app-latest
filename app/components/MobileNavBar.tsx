"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Trophy, Radio } from "lucide-react";

export default function MobileNavBar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "World Cup", href: "/fixtures", icon: Trophy },
    { label: "Channels", href: "/", icon: Radio },
    { label: "About", href: "/about", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative mx-3 mb-3 bg-[#0d0d22]/95 backdrop-blur-2xl border border-white/[0.07] rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.06)] px-2 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+8px)]">
        {/* Glowing top accent line */}
        <div className="absolute -top-px left-6 right-6 h-[1px] bg-linear-to-r from-transparent via-emerald-500/30 to-transparent" />
        
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-emerald-300"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <div className={`relative transition-all duration-300 ${
                  isActive ? "scale-110" : ""
                }`}>
                  <Icon size={20} className={isActive ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : ""} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                  )}
                </div>
                <span className={`text-[9px] font-bold tracking-wider uppercase ${
                  isActive ? "text-emerald-300" : ""
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}