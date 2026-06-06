import { useState, useRef, useEffect } from "react";
import CHANNELS from "./channels.json";

// Channel data lives in channels.json — edit that file to add/remove channels.
// No need to touch this file for channel management.
const ALL_CHANNELS = [...CHANNELS.sports, ...CHANNELS.news, ...CHANNELS.bangla];

// ─── Animated Background — canvas blobs, truly moving ────────────────────────
function AnimatedBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const BLOBS = [
      { rx: 0.15, ry: 0.1, r: 320, vx: 0.18, vy: 0.22, color: [139, 92, 246] },
      { rx: 0.8, ry: 0.2, r: 280, vx: -0.15, vy: 0.19, color: [99, 179, 237] },
      { rx: 0.2, ry: 0.75, r: 260, vx: 0.2, vy: -0.17, color: [249, 168, 212] },
      {
        rx: 0.7,
        ry: 0.8,
        r: 220,
        vx: -0.22,
        vy: -0.14,
        color: [110, 231, 183],
      },
      { rx: 0.5, ry: 0.45, r: 190, vx: 0.12, vy: 0.25, color: [253, 211, 77] },
      {
        rx: 0.88,
        ry: 0.55,
        r: 200,
        vx: -0.17,
        vy: 0.2,
        color: [147, 197, 253],
      },
    ];

    let W, H, blobs, raf;

    const init = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      blobs = BLOBS.map((b) => ({ ...b, ax: b.rx * W, ay: b.ry * H }));
    };
    init();
    window.addEventListener("resize", init);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      blobs.forEach((b) => {
        b.ax += b.vx;
        b.ay += b.vy;
        if (b.ax < b.r * 0.2 || b.ax > W - b.r * 0.2) b.vx *= -1;
        if (b.ay < b.r * 0.2 || b.ay > H - b.r * 0.2) b.vy *= -1;
        const g = ctx.createRadialGradient(b.ax, b.ay, 0, b.ax, b.ay, b.r);
        const [r, gv, bv] = b.color;
        g.addColorStop(0, `rgba(${r},${gv},${bv},0.60)`);
        g.addColorStop(1, `rgba(${r},${gv},${bv},0)`);
        ctx.beginPath();
        ctx.arc(b.ax, b.ay, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-white" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: "blur(60px)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "rgba(255,255,255,0.30)" }}
      />
    </div>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 gap-4 rounded-2xl">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" stroke="#ffffff22" strokeWidth="3" />
        <circle
          cx="22"
          cy="22"
          r="18"
          stroke="white"
          strokeWidth="3"
          strokeDasharray="55 58"
          strokeLinecap="round"
          style={{
            transformOrigin: "center",
            animation: "sp 0.85s linear infinite",
          }}
        />
        <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
      </svg>
      <span className="text-white/50 text-xs tracking-widest uppercase font-medium">
        লোড হচ্ছে…
      </span>
    </div>
  );
}

// ─── Server Buttons ───────────────────────────────────────────────────────────
function ServerButtons({ streams, activeIdx, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2.5">
      {streams.map((s, i) => {
        const active = i === activeIdx;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all duration-200
              ${active ? "bg-gray-900 text-white border-gray-900 shadow-sm" : "bg-white/70 text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"}`}
          >
            {active && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            )}
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Circular Icon Button ─────────────────────────────────────────────────────
function CircleBtn({ onClick, disabled, title, children, size = "md" }) {
  const sz = size === "lg" ? "w-12 h-12 text-xl" : "w-9 h-9 text-sm";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${sz} rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0
        bg-white/20 backdrop-blur-sm border border-white/30 text-white
        hover:bg-white/35 hover:scale-110 active:scale-95
        disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100`}
    >
      {children}
    </button>
  );
}

// ─── Player ───────────────────────────────────────────────────────────────────
function Player({
  channel,
  streamIdx,
  onStreamChange,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef(null);

  const activeStream = channel.streams[streamIdx];

  useEffect(() => {
    if (!videoRef.current || !activeStream) return;
    let alive = true;
    const load = () => {
      setLoading(true);
      setError(null);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      videoRef.current.src = "";
      const url = activeStream.url;
      if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = url;
        videoRef.current.load();
        if (alive) setLoading(false);
      } else if (window.Hls) {
        const hls = new window.Hls({
          debug: false,
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          if (!alive) return;
          setLoading(false);
          videoRef.current
            ?.play()
            .then(() => {
              if (alive) {
                setIsPlaying(true);
                videoRef.current.volume = volume;
              }
            })
            .catch(() => {});
        });
        hls.on(window.Hls.Events.ERROR, (_, d) => {
          if (d.fatal && alive) {
            setError("Stream unavailable");
            setLoading(false);
          }
        });
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
      } else {
        if (alive) {
          setError("HLS not supported");
          setLoading(false);
        }
      }
    };
    if (!window.Hls) {
      const ex = document.querySelector("script[data-hls]");
      if (!ex) {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js";
        s.setAttribute("data-hls", "1");
        s.onload = load;
        document.head.appendChild(s);
      } else ex.addEventListener("load", load, { once: true });
    } else load();
    return () => {
      alive = false;
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [channel.id, streamIdx]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const revealControls = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  return (
    // Outer card — white/glass frame like the screenshot
    <div className="mx-auto max-w-4xl px-4 md:px-8 py-6">
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/80 bg-white/70 backdrop-blur-xl">
        {/* Title bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white/80">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{channel.logo}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm leading-none">
                  {channel.name}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wider">
                Live Player
              </p>
            </div>
          </div>
          <ServerButtons
            streams={channel.streams}
            activeIdx={streamIdx}
            onSelect={onStreamChange}
          />
        </div>

        {/* Video area */}
        <div
          className="relative bg-black"
          style={{ aspectRatio: "16/9" }}
          onMouseMove={revealControls}
          onTouchStart={revealControls}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            autoPlay
            crossOrigin="anonymous"
            onPlay={() => {
              setIsPlaying(true);
              setLoading(false);
            }}
            onPause={() => setIsPlaying(false)}
            onWaiting={() => setLoading(true)}
            onCanPlay={() => setLoading(false)}
          />

          {loading && !error && <Spinner />}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/85 z-20 rounded-none">
              <div className="text-center">
                <p className="text-white/50 text-sm mb-4">{error}</p>
                <button
                  onClick={() => onStreamChange(streamIdx)}
                  className="px-5 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition border border-white/20"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Controls overlay */}
          <div
            className={`absolute inset-0 z-20 flex flex-col justify-between transition-opacity duration-300 ${showControls || !isPlaying ? "opacity-100" : "opacity-0"}`}
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.7) 100%)",
            }}
          >
            {/* spacer top */}
            <div />

            {/* Bottom controls */}
            {/* Bottom controls */}
            <div className="flex items-center gap-2 md:gap-3 px-3 md:px-5 pb-4 md:pb-5 flex-wrap justify-center md:justify-start">
              {/* Prev — circular */}
              <CircleBtn
                onClick={onPrev}
                disabled={!hasPrev}
                title="Previous channel"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                </svg>
              </CircleBtn>

              {/* Play/Pause — larger circle */}
              <CircleBtn
                onClick={togglePlay}
                size="lg"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 19h4V5H6zm8-14v14h4V5z" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </CircleBtn>

              {/* Next — circular */}
              <CircleBtn
                onClick={onNext}
                disabled={!hasNext}
                title="Next channel"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
                </svg>
              </CircleBtn>

              {/* Volume — hidden on small mobile, shown on md+ */}
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="white"
                  opacity="0.6"
                >
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (videoRef.current) videoRef.current.volume = v;
                  }}
                  className="w-16 md:w-20 cursor-pointer"
                  style={{ accentColor: "white" }}
                />
                <span className="text-white/50 text-xs w-6">
                  {Math.round(volume * 100)}%
                </span>
              </div>

              {/* Right side — LIVE indicator and fullscreen */}
              <div className="ml-auto flex items-center gap-2 md:gap-3">
                <span className="flex items-center gap-1 text-[9px] md:text-[11px] text-white/60 font-medium whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                  LIVE
                </span>
                <CircleBtn
                  onClick={() => videoRef.current?.requestFullscreen?.()}
                  title="Fullscreen"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </CircleBtn>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom info bar */}
        <div className="flex items-center gap-6 px-5 py-3 bg-gray-50/80 border-t border-gray-100 text-[11px] text-gray-400 uppercase tracking-widest font-medium">
          <span>
            Type <span className="text-gray-700 font-semibold">HLS/M3U8</span>
          </span>
          <span>
            Status <span className="text-emerald-600 font-semibold">Live</span>
          </span>
          <span>
            Protocol <span className="text-gray-700 font-semibold">HTTPS</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Channel Card — glassmorphism ─────────────────────────────────────────────
function ChannelCard({ channel, isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`relative w-full aspect-square rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden group
        ${
          isSelected
            ? "ring-2 ring-indigo-400/80 shadow-xl shadow-indigo-200/50 scale-[1.06]"
            : "hover:scale-[1.05] hover:shadow-xl hover:shadow-black/10"
        }`}
      style={{
        background: "rgba(255,255,255,0.35)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: isSelected
          ? "1.5px solid rgba(129,140,248,0.6)"
          : "1px solid rgba(255,255,255,0.65)",
        boxShadow: isSelected
          ? "0 8px 32px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.8)"
          : "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      {/* subtle inner shine */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.05) 60%)",
        }}
      />

      {/* hover shimmer */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.0) 70%)",
        }}
      />

      {/* content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-3">
        <div className="text-4xl mb-3 drop-shadow-sm">{channel.logo}</div>
        <p className="text-gray-700 font-semibold text-xs leading-snug text-center line-clamp-3">
          {channel.name}
        </p>
      </div>

      {/* selected dot */}
      {isSelected && (
        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-sm" />
      )}
    </div>
  );
}

// ─── Category Section ─────────────────────────────────────────────────────────
function CategorySection({
  title,
  icon,
  channels: list,
  selectedId,
  onSelect,
}) {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-2xl font-bold text-gray-700 tracking-tight">
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {list.map((ch) => (
            <ChannelCard
              key={ch.id}
              channel={ch}
              isSelected={selectedId === ch.id}
              onSelect={() => onSelect(ch)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function LiveTVApp() {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [streamIdx, setStreamIdx] = useState(0);
  const playerRef = useRef(null);

  const currentIdx = selectedChannel
    ? ALL_CHANNELS.findIndex((ch) => ch.id === selectedChannel.id)
    : -1;

  const handleSelectChannel = (ch) => {
    setSelectedChannel(ch);
    setStreamIdx(0);
    setTimeout(
      () =>
        playerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      50,
    );
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBg />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📺</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">
                Kabbo Streamer Pro
              </h1>
              <p className="text-[11px] text-gray-400 tracking-widest uppercase mt-0.5">
                Live Television
              </p>
            </div>
          </div>
          {selectedChannel && (
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Now Playing
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {selectedChannel.name}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Player */}
      {selectedChannel && (
        <div ref={playerRef}>
          <Player
            channel={selectedChannel}
            streamIdx={streamIdx}
            onStreamChange={setStreamIdx}
            onPrev={() =>
              currentIdx > 0 &&
              handleSelectChannel(ALL_CHANNELS[currentIdx - 1])
            }
            onNext={() =>
              currentIdx < ALL_CHANNELS.length - 1 &&
              handleSelectChannel(ALL_CHANNELS[currentIdx + 1])
            }
            hasPrev={currentIdx > 0}
            hasNext={currentIdx < ALL_CHANNELS.length - 1}
          />
        </div>
      )}

      <CategorySection
        title="Sports Channels"
        icon="🏟️"
        channels={CHANNELS.sports}
        selectedId={selectedChannel?.id}
        onSelect={handleSelectChannel}
      />
      <CategorySection
        title="Live News & Info"
        icon="📰"
        channels={CHANNELS.news}
        selectedId={selectedChannel?.id}
        onSelect={handleSelectChannel}
      />
      <CategorySection
        title="Bangla Entertainment"
        icon="🎬"
        channels={CHANNELS.bangla}
        selectedId={selectedChannel?.id}
        onSelect={handleSelectChannel}
      />
      <CategorySection
        title="Extra"
        icon="🎬"
        channels={CHANNELS.bangla}
        selectedId={selectedChannel?.id}
        onSelect={handleSelectChannel}
      />
      {/* 
      <footer className="relative bg-white/40 backdrop-blur-md border-t border-white/60 text-gray-400 py-8 text-center text-xs tracking-widest uppercase">
        &copy; 2024 StreamPro · Premium Live Television
      </footer> */}
      <footer className="relative bg-white/40 backdrop-blur-md border-t border-white/60 py-10 text-center">
        <p className="text-gray-400 text-xs tracking-widest uppercase">
          &copy; 2024 StreamPro · Premium Live Television
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-gray-400 text-xs tracking-widest uppercase">
            Developed by
          </p>

          {/* Circular photo — click opens Facebook */}
          <a
            href="https://www.facebook.com/shahriar.kabbo.98"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 group"
          >
            <div
              className="relative w-16 h-16 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-110"
              style={{
                background: "rgba(255,255,255,0.3)",
                backdropFilter: "blur(10px)",
                boxShadow:
                  "0 4px 20px rgba(99,102,241,0.20), 0 0 0 3px rgba(255,255,255,0.6)",
              }}
            >
              <img
                src="https://i.ibb.co.com/04vzP6z/logo.png"
                alt="Shahriar Kabbo"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-gray-700 font-semibold text-sm tracking-wide group-hover:text-indigo-500 transition-colors duration-200">
              Shahriar Kabbo
            </p>
          </a>
        </div>
      </footer>
    </div>
  );
}
