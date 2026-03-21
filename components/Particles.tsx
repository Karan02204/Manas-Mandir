"use client";

import { useEffect, useRef } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export default function Particles({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const opacityMod = useRef(0);

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    particles.current = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedY: -(Math.random() * 0.5 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
    }));
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Particles most visible in Scene 3 (0.4-0.6) and Scene 4 (0.6-0.7)
    if (p > 0.3 && p < 1.0) {
      opacityMod.current = Math.min(1, Math.max(0, (p - 0.3) * 10));
    } else {
      opacityMod.current = 0;
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (opacityMod.current > 0.01) {
        time++;
        particles.current.forEach((p) => {
          // move
          p.y += p.speedY;
          p.x += p.speedX;

          // wrap around
          if (p.y + p.size < 0) p.y = canvas.height + p.size;
          if (p.x > canvas.width + p.size) p.x = -p.size;
          if (p.x < -p.size) p.x = canvas.width + p.size;

          // pulse opacity
          const currentOpacity =
            (p.opacity + Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.2) *
            opacityMod.current;

          // draw
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 168, 67, ${Math.max(0, currentOpacity)})`;
          ctx.fill();
          
          // Outer glow
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          glow.addColorStop(0, `rgba(212, 168, 67, ${Math.max(0, currentOpacity * 0.5)})`);
          glow.addColorStop(1, 'rgba(212, 168, 67, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      rafRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
      }}
    />
  );
}
