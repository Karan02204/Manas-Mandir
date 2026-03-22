"use client";

import { useState, useEffect, useRef } from "react";

const TOTAL_FRAMES = 160;

function getFramePath(index: number): string {
  const n = String(index).padStart(3, "0");
  return `/sequence/frame_${n}.png`;
}

export interface UseImageSequenceResult {
  images: HTMLImageElement[];
  loaded: boolean;
  progress: number; // 0–1
  totalFrames: number;
}

export function useImageSequence(): UseImageSequenceResult {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const loadedCount = useRef(0);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    loadedCount.current = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();

      // We still map them all to be fetched, but the browser will gracefully queue them natively.
      img.src = getFramePath(i);

      img.onload = img.onerror = () => {
        loadedCount.current++;
        
        // MASSIVE VERCEL DEPLOYMENT OPTIMIZATION: 
        // Stop forcing React to uselessly re-render the massive DOM 155 times in 
        // the background by locking the state updates entirely after the 5th frame!
        if (loadedCount.current <= 5) {
          setProgress(loadedCount.current / 5); // Scale progress artificially to 100% by frame 5
          if (loadedCount.current === 5) {
            setLoaded(true);
          }
        }
      };

      imgs.push(img);
    }

    setImages(imgs);
  }, []);

  return { images, loaded, progress, totalFrames: TOTAL_FRAMES };
}
