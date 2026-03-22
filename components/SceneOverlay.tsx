"use client";

import { motion, MotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { useState } from "react";

interface SceneOverlayProps {
  scrollYProgress: MotionValue<number>;
}

export default function SceneOverlay({ scrollYProgress }: SceneOverlayProps) {
  // Pure mathematical scroll mapping guarantees zero skips, zero overlaps, and fluid pacing
  const op2 = useTransform(scrollYProgress, [0.05, 0.15, 0.35, 0.45], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.05, 0.15, 0.35, 0.45], [20, 0, 0, -20]);

  const op3 = useTransform(scrollYProgress, [0.45, 0.55, 0.70, 0.80], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.45, 0.55, 0.70, 0.80], [20, 0, 0, -20]);

  // Trigger the final layout earlier at 80% (when the video locks) so the CTA sits comfortably on screen
  const op6 = useTransform(scrollYProgress, [0.82, 0.88, 1], [0, 1, 1]);
  const y6 = useTransform(scrollYProgress, [0.82, 0.88, 1], [20, 0, 0]);

  // Prevent invisible elements from eating clicks
  const [pointer6, setPointer6] = useState<"auto" | "none">("none");
  useMotionValueEvent(op6, "change", (v) => setPointer6(v > 0.1 ? "auto" : "none"));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Scene 2: जय श्री राम */}
      <motion.div
        style={{ 
          opacity: op2,
          y: y2,
          position: "absolute", 
          right: "4vw",
          textAlign: "center", 
          padding: "0 24px"
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-basgira)",
            fontSize: "clamp(3rem, 12vw, 9rem)",
            color: "#E8D5B0",
            textShadow: "0 4px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)",
            letterSpacing: "0.08em",
            lineHeight: 1,
            opacity: 0.9,
          }}
        >
          Jai <br /> Shri <br /> Ram
        </p>
      </motion.div>

      {/* Scene 3: The Eternal Devotee */}
      <motion.div
        style={{ 
          opacity: op3,
          y: y3,
          position: "absolute", 
          left: "4vw",
          textAlign: "left", 
          padding: "0 24px", 
          maxWidth: "500px"
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-basgira)",
            fontSize: "clamp(2.5rem, 8vw, 7rem)",
            color: "#E8D5B0",
            textShadow: "0 4px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)",
            letterSpacing: "0.08em",
            marginBottom: "1rem",
          }}
        >
          The Eternal Devotee
        </h2>
      </motion.div>

      {/* Scene 6: Temple Entry CTA */}
      <motion.div
        style={{
          opacity: op6,
          y: y6,
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          pointerEvents: pointer6
        }}
      >


        <h1
          style={{
            fontFamily: "var(--font-basgira)",
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            color: "#E8D5B0",
            letterSpacing: "0.15em",
            lineHeight: 1.1,
          }}
        >
          Shri Manas Mandir
        </h1>
        <a
          href="#temple-section"
          style={{
            display: "inline-block",
            padding: "0.9rem 2.5rem",
            border: "1px solid #D4A843",
            color: "#D4A843",
            fontFamily: "var(--font-cinzel)",
            fontSize: "0.9rem",
            letterSpacing: "0.25em",
            textDecoration: "none",
            background: "rgba(212,168,67,0.08)",
            backdropFilter: "blur(8px)",
            transition: "all 0.3s ease",
            cursor: pointer6 === "auto" ? "pointer" : "default",
          }}
        >
          Visit Us
        </a>
      </motion.div>
    </div>
  );
}
