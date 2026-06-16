"use client";

import React from "react";
import Image from "next/image";
import { Search, X, ChevronsRight, Radio, Sparkles } from "lucide-react";
import { Channel } from "../../hooks/useIPTVPlaylists";

interface ChannelListViewProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  visibleChannels: Channel[];
  filteredChannelsCount: number;
  loading: boolean;
  selectedChannel: Channel | null;
  handleChannelSelect: (chan: Channel) => void;
  displayCount: number;
  setDisplayCount: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
}

export function ChannelListView({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  visibleChannels,
  filteredChannelsCount,
  loading,
  selectedChannel,
  handleChannelSelect,
  displayCount,
  setDisplayCount,
  hasMore,
}: ChannelListViewProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Search & Filters */}
      <div className="space-y-3 sm:space-y-4 pb-4 border-b border-white/[0.06]">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-white/[0.03] border border-white/[0.07] focus-within:border-emerald-500/30 rounded-xl sm:rounded-2xl p-1 transition-all duration-300">
            <Search className="text-zinc-500 ml-2.5 sm:ml-3" size={15} />
            <input
              type="text"
              placeholder="Search live channels..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(80);
              }}
              className="flex-1 bg-transparent border-none outline-none py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm text-white placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setDisplayCount(80);
                }}
                className="p-1 mr-1.5 sm:mr-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setDisplayCount(80);
              }}
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap border transition-all duration-300 active:scale-95 flex-shrink-0 ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:border-white/10 hover:bg-white/[0.04]"
              }`}
            >
              {cat === "All" ? (
                <span className="flex items-center gap-1.5">
                  <Sparkles size={11} />
                  {cat}
                </span>
              ) : (
                cat
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Channel Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto pt-3 sm:pt-4 pr-1 custom-scrollbar">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="animate-shimmer h-14 sm:h-16 rounded-xl sm:rounded-2xl border border-white/[0.04]" />
            ))}
          </div>
        ) : filteredChannelsCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Radio size={32} className="text-zinc-600" />
            <p className="text-zinc-500 text-sm font-medium">No channels found matching your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {visibleChannels.map((chan, index) => {
                const isSelected = selectedChannel?.id === chan.id;
                return (
                  <button
                    key={chan.id}
                    onClick={() => handleChannelSelect(chan)}
                    style={{ animationDelay: `${(index % 20) * 30}ms` }}
                    className={`w-full flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 active:scale-[0.98] animate-fade-slide ${
                      isSelected
                        ? "bg-gradient-to-r from-emerald-500/12 to-teal-500/8 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-emerald-500/15 hover:shadow-[0_0_15px_rgba(16,185,129,0.03)]"
                    }`}
                  >
                    {chan.logo ? (
                      <Image
                        src={chan.logo}
                        alt={chan.name}
                        width={36}
                        height={36}
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                        className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg sm:rounded-xl bg-white/[0.03] p-0.5 border border-white/[0.06] flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.08] flex items-center justify-center font-bold text-[10px] border border-white/[0.06] text-zinc-500 flex-shrink-0">
                        {getInitials(chan.name)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500 truncate">
                        {chan.group}
                      </p>
                      <p className={`text-xs sm:text-sm font-bold truncate mt-0.5 ${
                        isSelected ? "text-emerald-300" : "text-gray-200"
                      }`}>
                        {chan.name}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pt-5 pb-2">
                <button
                  onClick={() => setDisplayCount((prev) => prev + 80)}
                  className="btn-outline flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm"
                >
                  <ChevronsRight size={14} />
                  <span>Load More ({filteredChannelsCount - displayCount} left)</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}