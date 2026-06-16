"use client";

import { useEffect, useRef, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  pulsePhase: number;
  connections: number[];
  isHovered: boolean;
  targetRadius: number;
}

export default function BackgroundScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initNodes();
    };

    // Neural Network Colors - Blue/Purple theme like your image
    const colors = [
      { main: "rgba(147, 197, 253, 0.9)", glow: "rgba(59, 130, 246, 0.4)" },   // Blue
      { main: "rgba(196, 181, 253, 0.8)", glow: "rgba(139, 92, 246, 0.3)" },   // Purple
      { main: "rgba(165, 243, 252, 0.7)", glow: "rgba(6, 182, 212, 0.3)" },    // Cyan
      { main: "rgba(255, 255, 255, 0.6)", glow: "rgba(255, 255, 255, 0.2)" }, // White
    ];

    const initNodes = () => {
      const nodeCount = Math.min(100, Math.floor((width * height) / 12000));
      nodesRef.current = [];

      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const colorSet = colors[Math.floor(Math.random() * colors.length)];
        
        nodesRef.current.push({
          x, y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
          color: colorSet.main,
          glowColor: colorSet.glow,
          pulsePhase: Math.random() * Math.PI * 2,
          connections: [],
          isHovered: false,
          targetRadius: Math.random() * 1.5 + 0.5,
        });
      }
    };

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const nodes = nodesRef.current;
      const time = Date.now() / 1000;

      // Update nodes
      nodes.forEach((node, i) => {
        // Neural floating movement
        node.x += node.vx + Math.sin(time + node.pulsePhase) * 0.1;
        node.y += node.vy + Math.cos(time + node.pulsePhase) * 0.1;
        node.pulsePhase += 0.01;

        // Boundary wrap
        if (node.x < -50) node.x = width + 50;
        if (node.x > width + 50) node.x = -50;
        if (node.y < -50) node.y = height + 50;
        if (node.y > height + 50) node.y = -50;

        // Hover attraction - NEURAL NETWORK EFFECT
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const hoverRadius = 250;

          if (dist < hoverRadius) {
            // Strong attraction to mouse
            const force = (1 - dist / hoverRadius) * 0.08;
            node.x += dx * force;
            node.y += dy * force;
            node.isHovered = true;
            node.targetRadius = 3 + (1 - dist / hoverRadius) * 4;
          } else {
            node.isHovered = false;
            node.targetRadius = node.radius;
            
            // Gentle return to base position
            const returnForce = 0.002;
            node.x += (node.baseX - node.x) * returnForce;
            node.y += (node.baseY - node.y) * returnForce;
          }
        } else {
          node.isHovered = false;
          node.targetRadius = node.radius;
          
          // Return to base
          const returnForce = 0.002;
          node.x += (node.baseX - node.x) * returnForce;
          node.y += (node.baseY - node.y) * returnForce;
        }

        // Smooth radius transition
        const currentRadius = node.radius + (node.targetRadius - node.radius) * 0.1;
        node.radius = currentRadius;
      });

      // Draw connections - NEURAL NETWORK LINES
      nodes.forEach((node, i) => {
        nodes.forEach((other, j) => {
          if (i >= j) return;

          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connection distance
          let maxDist = 180;
          let opacity = 0;

          // If mouse is active, increase connection range near mouse
          if (mouse.active) {
            const mouseDist1 = Math.sqrt((mouse.x - node.x) ** 2 + (mouse.y - node.y) ** 2);
            const mouseDist2 = Math.sqrt((mouse.x - other.x) ** 2 + (mouse.y - other.y) ** 2);
            
            if (mouseDist1 < 250 || mouseDist2 < 250) {
              maxDist = 300;
              opacity = (1 - dist / maxDist) * 0.5;
            }
          }

          if (dist < maxDist) {
            opacity = opacity || (1 - dist / maxDist) * 0.25;

            // Gradient line
            const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
            gradient.addColorStop(0, node.color.replace(/[\d.]+\)$/, `${opacity * 0.8})`));
            gradient.addColorStop(0.5, `rgba(147, 197, 253, ${opacity * 0.5})`);
            gradient.addColorStop(1, other.color.replace(/[\d.]+\)$/, `${opacity * 0.8})`));

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = node.isHovered || other.isHovered ? 1.5 : 0.5;
            ctx.stroke();

            // Data pulse on active connections
            if (node.isHovered || other.isHovered) {
              const pulsePos = (time * 2 + i * 0.3) % 1;
              const pulseX = node.x + dx * pulsePos;
              const pulseY = node.y + dy * pulsePos;
              
              ctx.beginPath();
              ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
              ctx.fill();
            }
          }
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(node.pulsePhase) * 0.3 + 1;
        const glowSize = node.radius * pulse * 6;

        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowSize
        );
        glowGradient.addColorStop(0, node.glowColor);
        glowGradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = node.isHovered ? "rgba(255, 255, 255, 1)" : node.color;
        ctx.fill();

        // Ring for hovered nodes
        if (node.isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * pulse * 2, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Mouse target indicator
      if (mouse.active) {
        // Target ring
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 20 + Math.sin(time * 3) * 5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(147, 197, 253, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();

        // Connection radius indicator
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 250, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(147, 197, 253, 0.08)";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        background: "linear-gradient(180deg, #02040a 0%, #0a0e27 50%, #02040a 100%)",
        pointerEvents: "auto", // Enable mouse interaction
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          cursor: "crosshair",
        }}
      />

      {/* Ambient glow overlays */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          animation: "float 10s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "25%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          animation: "float 12s ease-in-out infinite reverse",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(2, 4, 10, 0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}