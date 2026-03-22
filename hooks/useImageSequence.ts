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
    let loadedCount = 0;

    // Allocate all 160 items so ScrollyCanvas indexing functions properly without out-of-bounds mapping
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      imgs.push(new window.Image());
    }
    setImages(imgs);

    // Eagerly pre-load exclusively the first 10 sequence frames to aggressively prevent Vercel 
    // concurrent networking from randomly starving the initial frame of priority bandwidth.
    const INITIAL_FRAMES = 10;
    for (let i = 1; i <= INITIAL_FRAMES; i++) {
      const img = imgs[i - 1];
      img.onload = img.onerror = () => {
        loadedCount++;
        setProgress(loadedCount / INITIAL_FRAMES);

        if (loadedCount === INITIAL_FRAMES) {
          setLoaded(true);
        }
      };
      
      // Bind URL only AFTER handlers are strictly hooked
      img.src = getFramePath(i);
    }
  }, []);

  // Background stream remaining 150 consecutive sequence animation frames 
  // gracefully ONLY after primary threshold unlocks and UI loading barrier is fully lifted!
  useEffect(() => {
    if (loaded && images.length === TOTAL_FRAMES) {
      for (let i = 11; i <= TOTAL_FRAMES; i++) {
        // Automatically buffers securely into client CPU background cache via network idle-lane 
        images[i - 1].src = getFramePath(i);
      }
    }
  }, [loaded, images]);

  return { images, loaded, progress, totalFrames: TOTAL_FRAMES };
}
