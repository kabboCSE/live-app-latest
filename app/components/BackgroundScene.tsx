"use client";

import { useEffect, useRef, useCallback } from "react";

// ─── Configuration ─────────────────────────────────────────────────────────────
const CONFIG = {
  particleCount: 80,
  connectionDistance: 150,
  mouseRadius: 200,
  particleSpeed: 0.5,
  particleColor: "#e0f7fa",
  lineColor: "#e0f7fa",
  backgroundColor: "#0a0a1a",
} as const;

// Particle radius range
const MIN_RADIUS = 2;
const MAX_RADIUS = 4;

// ─── Utility ───────────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

// ─── Simple Spatial Grid (optimisation for >100 particles) ─────────────────────
class SpatialGrid {
  private cells: Map<number, number[]> = new Map();
  private cellSize: number;
  private w: number;
  private h: number;

  constructor(w: number, h: number, cellSize: number) {
    this.w = w;
    this.h = h;
    this.cellSize = cellSize;
  }

  clear() {
    this.cells.clear();
  }

  private key(cx: number, cy: number) {
    return cy * (Math.ceil(this.w / this.cellSize) + 1) + cx;
  }

  insert(idx: number, x: number, y: number) {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const k = this.key(cx, cy);
    let bucket = this.cells.get(k);
    if (!bucket) {
      bucket = [];
      this.cells.set(k, bucket);
    }
    bucket.push(idx);
  }

  query(x: number, y: number, radius: number, out: number[]) {
    const minCx = Math.max(0, Math.floor((x - radius) / this.cellSize));
    const maxCx = Math.min(Math.floor(this.w / this.cellSize), Math.floor((x + radius) / this.cellSize));
    const minCy = Math.max(0, Math.floor((y - radius) / this.cellSize));
    const maxCy = Math.min(Math.floor(this.h / this.cellSize), Math.floor((y + radius) / this.cellSize));

    for (let cy = minCy; cy <= maxCy; cy++) {
      for (let cx = minCx; cx <= maxCx; cx++) {
        const bucket = this.cells.get(this.key(cx, cy));
        if (bucket) {
          for (let i = 0; i < bucket.length; i++) {
            out.push(bucket[i]);
          }
        }
      }
    }
  }
}

// ─── Particle class ─────────────────────────────────────────────────────────────
interface ParticleState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number; // 0.4 – 1.0
}

function createParticle(w: number, h: number): ParticleState {
  const angle = Math.random() * Math.PI * 2;
  const speed = CONFIG.particleSpeed * (0.6 + Math.random() * 0.8);
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS),
    opacity: 0.4 + Math.random() * 0.6,
  };
}

// ─── React Component ────────────────────────────────────────────────────────────
export default function BackgroundScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ParticleState[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false, clicked: false, clickTime: 0 });
  const animRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0 });
  const configRef = useRef(CONFIG);

  const getCount = useCallback((w: number, h: number) => {
    const isMobile = w < 768;
    const base = isMobile ? 40 : configRef.current.particleCount;
    return Math.min(base, Math.max(20, Math.floor((w * h) / (isMobile ? 25000 : 18000))));
  }, []);

  useEffect(() => {
    // ─── Respect reduced motion ─────────────────────────────────────────
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ─── Resize handler ──────────────────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      dimsRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Re-initialise particles
      const count = getCount(w, h);
      const particles: ParticleState[] = [];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(w, h));
      }
      particlesRef.current = particles;
    };

    // ─── Animation ───────────────────────────────────────────────────────
    let useSpatial = false;

    const animate = () => {
      const { w, h } = dimsRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const cfg = configRef.current;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // ── Update particles ───────────────────────────────────────────────
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > w) {
          p.x = w;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > h) {
          p.y = h;
          p.vy *= -1;
        }

        // Mouse interaction — "magnet" attraction
        if (mouse.active) {
          const d = dist(p.x, p.y, mouse.x, mouse.y);
          if (d < cfg.mouseRadius && d > 0.5) {
            const strength = (1 - d / cfg.mouseRadius) * 0.02;
            p.vx += ((mouse.x - p.x) / d) * strength;
            p.vy += ((mouse.y - p.y) / d) * strength;
          }
        }

        // Click ripple push
        if (mouse.clicked) {
          const elapsed = Date.now() - mouse.clickTime;
          if (elapsed < 400) {
            const d = dist(p.x, p.y, mouse.x, mouse.y);
            if (d < 250 && d > 0.5) {
              const force = (1 - d / 250) * (1 - elapsed / 400) * 1.2;
              p.vx += ((p.x - mouse.x) / d) * force;
              p.vy += ((p.y - mouse.y) / d) * force;
            }
          } else {
            mouse.clicked = false;
          }
        }

        // Clamp speed
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpd = cfg.particleSpeed * 2.5;
        if (spd > maxSpd) {
          p.vx = (p.vx / spd) * maxSpd;
          p.vy = (p.vy / spd) * maxSpd;
        }
      }

      // ── Build spatial grid if needed ──────────────────────────────────
      useSpatial = particles.length > 100;
      const grid = useSpatial ? new SpatialGrid(w, h, cfg.connectionDistance) : null;
      if (grid) {
        grid.clear();
        for (let i = 0; i < particles.length; i++) {
          grid.insert(i, particles[i].x, particles[i].y);
        }
      }

      // ── Draw connections ──────────────────────────────────────────────
      const pairSet = new Set<string>();
      const connectionCounts = new Uint8Array(particles.length);

      const maybeDrawLine = (i: number, j: number) => {
        const a = particles[i];
        const b = particles[j];
        const d = dist(a.x, a.y, b.x, b.y);
        if (d >= cfg.connectionDistance) return;

        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (pairSet.has(key)) return;
        pairSet.add(key);

        // Limit connections per particle
        if (connectionCounts[i] >= 4 || connectionCounts[j] >= 4) return;
        connectionCounts[i]++;
        connectionCounts[j]++;

        const alpha = (1 - d / cfg.connectionDistance) * 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(224, 247, 250, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      };

      if (grid) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const neighbors: number[] = [];
          grid.query(p.x, p.y, cfg.connectionDistance, neighbors);
          for (let k = 0; k < neighbors.length; k++) {
            const j = neighbors[k];
            if (j <= i) continue;
            maybeDrawLine(i, j);
          }
        }
      } else {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            maybeDrawLine(i, j);
          }
        }
      }

      // ── Draw mouse connections ────────────────────────────────────────
      if (mouse.active) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const d = dist(p.x, p.y, mouse.x, mouse.y);
          if (d < cfg.mouseRadius) {
            const alpha = (1 - d / cfg.mouseRadius) * 0.4;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(224, 247, 250, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // ── Draw particles ────────────────────────────────────────────────
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 247, 250, ${p.opacity})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    // ─── Event handlers ──────────────────────────────────────────────────
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
      mouseRef.current.clicked = true;
      mouseRef.current.clickTime = Date.now();
    };

    // ─── Page Visibility — pause when tab hidden ────────────────────────
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    animate();

    return () => {
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(animRef.current);
    };
  }, [getCount]);

  return (
    <div
      className="fixed inset-0 z-0 h-full w-full"
      style={{
        background: `linear-gradient(145deg, #0a0a1a 0%, #111128 50%, #0a0a1a 100%)`,
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ display: "block", pointerEvents: "auto" }}
      />
    </div>
  );
}