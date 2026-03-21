"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  progress: number;
  loaded: boolean;
}

export default function LoadingScreen({ progress, loaded }: LoadingScreenProps) {
  const percent = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeOut" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0603]"
        >
          {/* Subtle glowing ring behind */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-[#D4A843] opacity-5 blur-[100px] rounded-full" />
          </div>

          <p className="font-devanagari text-4xl text-[#D4A843] mb-12 drop-shadow-[0_0_15px_rgba(212,168,67,0.5)]">
            ॐ
          </p>

          <div className="w-64 max-w-[80vw]">
            <div className="h-[2px] w-full loading-bar-track relative">
              <motion.div
                className="absolute top-0 left-0 h-full loading-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="font-cinzel text-sm tracking-[0.4em] uppercase text-[#E8D5B0] opacity-80">
              Entering the sanctuary
            </p>
            <p className="font-garamond text-xs text-[#D4A843] opacity-60">
              {percent}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
