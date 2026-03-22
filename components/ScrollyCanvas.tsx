"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface ScrollyCanvasProps {
  scrollYProgress: MotionValue<number>;
  images: HTMLImageElement[];
  loaded: boolean;
  totalFrames: number;
}

export default function ScrollyCanvas({ scrollYProgress, images, loaded, totalFrames }: ScrollyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastFrameRef = useRef<number>(-1);
  const rafRef = useRef<number>(0);

  // Draw cover-fit image onto canvas
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;

    if (!iw || !ih) return;

    // Object-fit: cover
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  // Resize canvas to window
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Redraw current frame on resize
    if (lastFrameRef.current >= 0 && images[lastFrameRef.current]) {
      drawFrame(images[lastFrameRef.current]);
    }
  }, [images, drawFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Initial draw
  useEffect(() => {
    if (loaded && images.length > 0 && lastFrameRef.current === -1) {
      drawFrame(images[0]);
      lastFrameRef.current = 0;
    }
  }, [loaded, images, drawFrame]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!loaded || images.length === 0) return;
    cancelAnimationFrame(rafRef.current);
    
    rafRef.current = requestAnimationFrame(() => {
      // Complete video precisely at 80% scroll. Remaining 20% scroll holds the last frame solid for CTA.
      let frameIndex = Math.floor((latest / 0.8) * totalFrames);
      frameIndex = Math.max(0, Math.min(frameIndex, totalFrames - 1));
      
      if (frameIndex !== lastFrameRef.current) {
        lastFrameRef.current = frameIndex;
        if (images[frameIndex]) {
          drawFrame(images[frameIndex]);
        }
      }
    });
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        willChange: "transform",
        zIndex: 1,
      }}
    />
  );
}
