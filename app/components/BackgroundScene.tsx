"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  pulsePhase: number;
  // Randomness offset per node so each moves differently
  driftSeed: number;
}

export default function BackgroundScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>(0);
  const dimsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      dimsRef.current = { width: w, height: h };
      canvas.width = w;
      canvas.height = h;
      initNodes();
    };

    const palette = [
      { node: "rgba(147, 197, 253, 0.85)", glow: "rgba(59, 130, 246, 0.25)" },
      { node: "rgba(196, 181, 253, 0.75)", glow: "rgba(139, 92, 246, 0.2)" },
      { node: "rgba(165, 243, 252, 0.65)", glow: "rgba(6, 182, 212, 0.2)" },
    ];

    const initNodes = () => {
      const { width, height } = dimsRef.current;
      const count = Math.min(70, Math.floor((width * height) / 18000));
      const nodes: Node[] = [];

      for (let i = 0; i < count; i++) {
        const c = palette[Math.floor(Math.random() * palette.length)];
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.2 + 0.6,
          color: c.node,
          glowColor: c.glow,
          pulsePhase: Math.random() * Math.PI * 2,
          driftSeed: Math.random() * 1000,
        });
      }

      nodesRef.current = nodes;
    };

    const animate = () => {
      const { width, height } = dimsRef.current;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const time = Date.now() / 1000;

      ctx.clearRect(0, 0, width, height);

      // ─── Update nodes — random movement ───
      for (const node of nodes) {
        // Random drift — each node has its own unique wandering pattern
        node.vx += Math.sin(time * 0.3 + node.driftSeed) * 0.012;
        node.vy += Math.cos(time * 0.4 + node.driftSeed * 1.3) * 0.012;

        // Occasional random jolts for more natural random movement
        node.vx += Math.sin(time * 0.7 + node.driftSeed * 2.1) * 0.006;
        node.vy += Math.cos(time * 0.9 + node.driftSeed * 1.7) * 0.006;

        // Damping
        node.vx *= 0.97;
        node.vy *= 0.97;

        // Clamp speed so nodes don't fly off too fast
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 1.2) {
          node.vx = (node.vx / speed) * 1.2;
          node.vy = (node.vy / speed) * 1.2;
        }

        // Apply
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.008;

        // Bounce off walls so nodes stay on screen
        if (node.x < 0) { node.x = 0; node.vx *= -0.8; }
        if (node.x > width) { node.x = width; node.vx *= -0.8; }
        if (node.y < 0) { node.y = 0; node.vy *= -0.8; }
        if (node.y > height) { node.y = height; node.vy *= -0.8; }

        // Subtle mouse repulsion
        if (mouse.active) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && dist > 0) {
            const influence = (1 - dist / 200) * 0.04;
            node.vx += (dx / dist) * influence;
            node.vy += (dy / dist) * influence;
          }
        }
      }

      // ─── Draw dynamic connections (close nodes connect in real time) ───
      const connectionDistance = 160; // max distance for a connection

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > connectionDistance) continue;

          // Check mouse proximity to this connection
          let mouseInfluence = 0;
          if (mouse.active) {
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const mDist = Math.sqrt((mouse.x - midX) ** 2 + (mouse.y - midY) ** 2);
            if (mDist < 180) {
              mouseInfluence = (1 - mDist / 180) * 0.6;
            }
          }

          const baseAlpha = Math.max(0, 1 - dist / connectionDistance) * 0.25;
          const alpha = Math.min(baseAlpha + mouseInfluence, 0.55);
          const lineWidth = 0.5 + mouseInfluence * 1.5;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      }

      // ─── Draw nodes ───
      for (const node of nodes) {
        const pulse = Math.sin(node.pulsePhase) * 0.25 + 1;
        const r = node.radius * pulse;

        // Check if node is near mouse
        let nodeGlow = 1;
        if (mouse.active) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            nodeGlow = 1 + (1 - dist / 120) * 1.5;
          }
        }

        // Glow
        const glowSize = r * 4 * nodeGlow;
        const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
        g.addColorStop(0, node.glowColor);
        g.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * nodeGlow, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      }

      // ─── Mouse glow ───
      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        g.addColorStop(0, "rgba(59, 130, 246, 0.04)");
        g.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // ─── Mouse events directly on canvas ───
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999, active: false };
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    resize();
    animate();

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 h-full w-full" style={{ background: "linear-gradient(180deg, #02040a 0%, #0a0e27 50%, #02040a 100%)" }}>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ cursor: "default" }}
      />
    </div>
  );
}