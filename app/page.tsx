"use client";

import { useRef, useEffect, useCallback } from "react";
import { useScroll, motion, useTransform, useMotionValueEvent } from "framer-motion";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import SceneOverlay from "@/components/SceneOverlay";
import TempleSection from "@/components/TempleSection";
import Particles from "@/components/Particles";
import LoadingScreen from "@/components/LoadingScreen";
import { useImageSequence } from "@/hooks/useImageSequence";

function getSceneNumber(p: number) {
  if (p < 0.05) return 1;
  if (p < 0.40) return 2;
  if (p < 0.60) return 3;
  if (p < 0.70) return 4;
  if (p < 0.85) return 5;
  return 6;
}

export default function Home() {
  const { loaded, progress: loadProgress, totalFrames, images } = useImageSequence();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll of the 700vh container
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <main className="bg-[#0A0603] min-h-screen text-[#E8D5B0] font-garamond selection:bg-[#D4A843]/30 selection:text-[#F0C96B]">
      
      <LoadingScreen progress={loadProgress} loaded={loaded} />

      {/* Scrollytelling Section */}
      <div ref={containerRef} className="relative w-full" style={{ height: "700vh" }}>
        
        {/* Sticky Viewport */}
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          
          <Particles scrollYProgress={scrollYProgress} />
          
          <ScrollyCanvas 
            scrollYProgress={scrollYProgress} 
            images={images}
            loaded={loaded}
            totalFrames={totalFrames}
          />
          
          {/* Black cinematic vignete overlay over the frames */}
          <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none mix-blend-multiply" />
          <div className="absolute inset-0 z-[2] bg-black/30 pointer-events-none" />

          <SceneOverlay scrollYProgress={scrollYProgress} />
          
        </div>
      </div>

      {/* Static Footer Section */}
      <TempleSection />

    </main>
  );
}
