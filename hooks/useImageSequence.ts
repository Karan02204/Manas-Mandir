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
      img.src = getFramePath(i);

      img.onload = img.onerror = () => {
        loadedCount.current++;
        setProgress(loadedCount.current / TOTAL_FRAMES);
        if (loadedCount.current === TOTAL_FRAMES) {
          setLoaded(true);
        }
      };

      imgs.push(img);
    }

    setImages(imgs);
  }, []);

  return { images, loaded, progress, totalFrames: TOTAL_FRAMES };
}
