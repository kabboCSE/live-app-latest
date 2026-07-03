"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Tv, Radio, Users } from "lucide-react";
import { Channel } from "../../hooks/useIPTVPlaylists";

interface ChannelStatsProps {
  selectedChannel: Channel | null;
  playerStatus: "idle" | "loading" | "playing" | "error";
  totalChannels: number;
}

export function ChannelStats({
  selectedChannel,
  playerStatus,
  totalChannels,
}: ChannelStatsProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full">
      {/* Channel Info Card */}
      {selectedChannel ? (
        <motion.div
          key={selectedChannel.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card-hover p-3 sm:p-5 rounded-2xl flex items-center gap-3 sm:gap-4 ${
            playerStatus === "loading" ? "animate-pulse" : ""
          }`}
        >
          {selectedChannel.logo ? (
            <Image
              src={selectedChannel.logo}
              alt={selectedChannel.name}
              width={48}
              height={48}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = "none";
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl bg-white/[0.03] p-1 border border-white/[0.06] flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center font-bold text-sm sm:text-base text-emerald-400 border border-emerald-500/15 flex-shrink-0">
              {getInitials(selectedChannel.name)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-bold truncate text-white">
              {selectedChannel.name}
            </h2>
            <span className="inline-block mt-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/15">
              {selectedChannel.group}
            </span>
          </div>
          {playerStatus === "playing" && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex-shrink-0">
              <span className="live-dot" />
              LIVE
            </span>
          )}
        </motion.div>
      ) : (
        <div className="glass-card-hover p-3 sm:p-5 rounded-2xl flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center flex-shrink-0">
            <Radio size={20} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-400">
              Select a Channel
            </h2>
            <p className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 mt-0.5">
              Choose from the list below
            </p>
          </div>
        </div>
      )}

      {/* Channel Counter Card */}
      <div className="glass-card-hover p-3 sm:p-5 rounded-2xl flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 border border-emerald-500/15 flex items-center justify-center flex-shrink-0">
          <Tv size={20} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-zinc-500">
            Total Channels
          </p>
          <h3 className="text-lg sm:text-xl font-black gradient-text mt-0.5">
            {totalChannels.toLocaleString()}
          </h3>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-zinc-500 bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/[0.06]">
          <Users size={12} />
          <span>Live TV</span>
        </div>
      </div>

      {/* Developer Info Card */}
      <div className="glass-card-hover p-3 sm:p-5 rounded-2xl flex items-center gap-3 sm:gap-4">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-amber-500/20 shadow-md flex-shrink-0 bg-amber-500/10 flex items-center justify-center">
          <span className="text-lg sm:text-xl font-black gradient-text-accent">
            SK
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-white truncate">
            Md. Shahriar Kabbo
          </h3>
          <p className="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5">
            For support, contact via{" "}
            <a
              href="https://t.me/Kabbo512"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
            >
              Telegram
            </a>{" "}
            ·{" "}
            <a
              href="https://github.com/Shahriar-Kabbo/iptv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
