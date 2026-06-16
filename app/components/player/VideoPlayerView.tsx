"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCw,
  RefreshCw,
  ShieldAlert,
  PictureInPicture,
  ChevronsLeft,
  ChevronsRight,
  Radio,
  Signal
} from "lucide-react";

interface VideoPlayerViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  playerContainerRef: React.RefObject<HTMLDivElement | null>;
  playerStatus: "idle" | "loading" | "playing" | "error";
  playerError: string | null;
  isBuffering: boolean;
  isPaused: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  isPip: boolean;
  showControls: boolean;
  activeSeekIndicator: { side: "left" | "right"; visible: boolean };
  isPipSupported: boolean;
  handlePlayPause: () => void;
  handleMuteUnmute: () => void;
  handleVolumeChangeSlider: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFullscreen: () => void;
  handlePip: () => void;
  handlePlayerClick: (e: React.MouseEvent) => void;
  handlePlayerDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleReload: () => void;
  handleMouseMove: () => void;
}

function getFriendlyErrorMessage(rawError: string): { title: string; desc: string } {
  const lower = rawError.toLowerCase();

  if (lower.includes("not supported in ios/ipad os") || lower.includes("ios/ipad os")) {
    return {
      title: "Not Supported on iOS/iPadOS",
      desc: "DASH (.mpd) streams are not supported on iOS/iPadOS due to platform limitations. Please choose an HLS (.m3u8) channel instead.",
    };
  }
  if (lower.includes("404") || lower.includes("not found")) {
    return {
      title: "Channel Offline (404)",
      desc: "The streaming source is offline or dead. Please select another channel or report this to the developer.",
    };
  }
  if (lower.includes("403") || lower.includes("forbidden") || lower.includes("not authorized")) {
    return {
      title: "Access Forbidden (403)",
      desc: "This stream is geo-blocked, restricted, or requires authorization.",
    };
  }
  if (lower.includes("6020") || lower.includes("drm") || lower.includes("eme")) {
    return {
      title: "DRM / Encryption Error",
      desc: "This is an encrypted channel that requires DRM decryption keys. Try HTTPS or localhost.",
    };
  }
  if (lower.includes("timeout") || lower.includes("timed out")) {
    return {
      title: "Connection Timed Out",
      desc: "The streaming server is taking too long to respond. Try reconnecting.",
    };
  }
  if (lower.includes("cors") || lower.includes("cross-origin")) {
    return {
      title: "CORS Blocked",
      desc: "The broadcaster has blocked cross-origin web player access.",
    };
  }
  if (lower.includes("format") || lower.includes("unsupported") || lower.includes("manifest")) {
    return {
      title: "Unsupported Stream Format",
      desc: "The browser could not parse this stream format. Please try another channel.",
    };
  }

  return {
    title: "Stream Unavailable",
    desc: "This live TV link might be offline or blocked. Try another channel.",
  };
}

export function VideoPlayerView({
  videoRef,
  playerContainerRef,
  playerStatus,
  playerError,
  isBuffering,
  isPaused,
  isMuted,
  volume,
  isFullscreen,
  isPip,
  showControls,
  activeSeekIndicator,
  isPipSupported,
  handlePlayPause,
  handleMuteUnmute,
  handleVolumeChangeSlider,
  handleFullscreen,
  handlePip,
  handlePlayerClick,
  handlePlayerDoubleClick,
  handleReload,
  handleMouseMove,
}: VideoPlayerViewProps) {
  return (
    <div
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onClick={handlePlayerClick}
      onDoubleClick={handlePlayerDoubleClick}
      className={`bg-black group transition-all duration-200 ${
        isFullscreen
          ? "relative w-full h-full bg-black"
          : "relative aspect-video max-h-[75vh] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-white/[0.06] shadow-[0_0_60px_rgba(16,185,129,0.06)] w-full"
      } ${showControls ? "cursor-default" : "cursor-none"}`}
      style={!isFullscreen ? { maxWidth: "calc(75vh * 16 / 9)" } : undefined}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-contain bg-black cursor-pointer"
      />

      {/* Top-right glow accent for playing state */}
      {playerStatus === "playing" && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none" />
      )}

      {/* Tap to Unmute */}
      {playerStatus === "playing" && isMuted && (
        <div
          className="absolute top-4 right-4 z-30 pointer-events-auto cursor-pointer"
          onClick={(e) => { e.stopPropagation(); handleMuteUnmute(); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/10 shadow-lg backdrop-blur-md"
          >
            <VolumeX size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold tracking-wider">TAP TO UNMUTE</span>
          </motion.div>
        </div>
      )}

      {/* Center Play Button */}
      {playerStatus === "playing" && isPaused && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
          <motion.button
            key="play-btn"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
            className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-emerald-500/90 to-teal-500/90 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-white/10 pointer-events-auto cursor-pointer"
          >
            <Play size={28} className="fill-white translate-x-0.5 md:w-8 md:h-8" />
          </motion.button>
        </div>
      )}

      {/* Seek indicators */}
      <AnimatePresence>
        {activeSeekIndicator.visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-y-0 w-1/3 flex items-center justify-center pointer-events-none z-30 bg-white/5 ${
              activeSeekIndicator.side === "left" ? "left-0 rounded-r-full" : "right-0 rounded-l-full"
            }`}
          >
            {activeSeekIndicator.side === "left" ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-1 text-white bg-black/60 px-4 py-3 rounded-full backdrop-blur-md border border-white/10"
              >
                <ChevronsLeft className="h-6 w-6 text-emerald-400 animate-pulse" />
                <span className="text-xs font-black tracking-widest">-10s</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-1 text-white bg-black/60 px-4 py-3 rounded-full backdrop-blur-md border border-white/10"
              >
                <ChevronsRight className="h-6 w-6 text-emerald-400 animate-pulse" />
                <span className="text-xs font-black tracking-widest">+10s</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading / Buffering Overlay */}
      {(playerStatus === "loading" || (isBuffering && !isPaused)) && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-4 z-10">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 animate-spin" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-wider text-emerald-400 animate-pulse-glow">
            {playerStatus === "loading" ? "CONNECTING TO STREAM..." : "BUFFERING..."}
          </span>
        </div>
      )}

      {/* Error Overlay */}
      {playerStatus === "error" && (() => {
        const { title, desc } = getFriendlyErrorMessage(playerError || "");
        return (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-3.5 z-10 px-6 text-center">
            <ShieldAlert className="text-rose-400 animate-pulse-glow" size={36} />
            <span className="text-base font-bold text-white tracking-tight">{title}</span>
            {playerError && (
              <span className="text-[10px] sm:text-xs text-rose-400/80 font-mono bg-rose-500/10 border border-rose-500/10 px-3 py-1.5 rounded-xl max-w-md break-words select-all">
                {playerError}
              </span>
            )}
            <span className="text-xs text-zinc-500 max-w-md leading-relaxed font-medium">{desc}</span>
            <div className="flex gap-2.5 mt-2 flex-wrap justify-center">
              <button
                onClick={handleReload}
                className="btn-outline flex items-center gap-2 px-4 py-2 text-xs rounded-xl"
              >
                <RefreshCw size={12} />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* Idle Overlay */}
      {playerStatus === "idle" && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-4 z-10">
          <Radio size={36} className="text-zinc-600" />
          <span className="text-sm text-zinc-400 font-medium">Select a channel to start watching</span>
        </div>
      )}

      {/* Custom Controls */}
      {playerStatus === "playing" && (
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between transition-all duration-300 z-20 ${
            showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          {/* Left: Play/Pause + Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              {isPaused ? <Play size={18} className="fill-white" /> : <Pause size={18} className="fill-white" />}
            </button>
            <div className="flex items-center gap-1.5 group/volume">
              <button
                onClick={handleMuteUnmute}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChangeSlider}
                className="w-16 sm:w-20 h-1 rounded-lg appearance-none cursor-pointer outline-none transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-400 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.15) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.15) 100%)`,
                }}
              />
            </div>
          </div>

          {/* Center: LIVE Badge */}
          <div className="flex items-center gap-1.5 bg-rose-600/90 text-white font-bold text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-lg border border-rose-500/30 shadow-[0_0_15px_rgba(225,29,72,0.2)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            LIVE
          </div>

          {/* Right: PiP + Reload + Fullscreen */}
          <div className="flex items-center gap-1">
            {isPipSupported && (
              <button
                onClick={handlePip}
                className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${isPip ? "text-emerald-400 bg-white/10" : "text-white"}`}
                title="Picture in Picture"
              >
                <PictureInPicture size={18} />
              </button>
            )}
            <button
              onClick={handleReload}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
              title="Reload Stream"
            >
              <RotateCw size={18} />
            </button>
            <button
              onClick={handleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}