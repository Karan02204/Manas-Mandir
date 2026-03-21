# Hanuman Temple Scrollytelling — Implementation Plan

> Modified from original Scrollytelling Portfolio Implementation Plan

---

## Goal

A cinematic, devotional scrollytelling website for a Hanuman temple. As the user scrolls, a **pre-rendered image sequence** (your Whisk/CGI frames + animation export) plays back on a full-screen canvas — revealing Hanuman ji from behind, rotating around to his face, zooming in, and finally entering the temple within his chest.

---

## Image Sequence Setup

> [!IMPORTANT]
> Export your Whisk animation as individual frames (PNG/WebP). Place them in:
> ```
> public/sequence/frame_001.webp
> public/sequence/frame_002.webp
> ...
> public/sequence/frame_120.webp
> ```
> Aim for **120–200 frames** total for smooth playback. Name them zero-padded.

---

## Scroll Scenes Mapping

| Scene | Scroll % | Frames | What Happens |
|-------|----------|--------|--------------|
| **1. Opening** | 0–5% | 1–5 | Site fades in, Hanuman ji from behind, silence |
| **2. Camera Arc** | 5–40% | 5–60 | Camera orbits around him, text fades in: *"जय श्री राम"* |
| **3. Face Reveal** | 40–60% | 60–90 | Front view, eyes closed, text: *"The Eternal Devotee"* |
| **4. Eyes Open** | 60–70% | 90–105 | He opens his eyes, subtle glow effect |
| **5. Chest Opening** | 70–85% | 105–140 | Chest parts, golden light bursts |
| **6. Temple Entry** | 85–100% | 140–200 | Camera enters chest, temple world revealed, CTA appears |

---

## Project Structure

```
hanuman-temple/
├── app/
│   ├── page.tsx              ← Main entry, composes all sections
│   ├── layout.tsx            ← Font imports, metadata, dark bg
│   └── globals.css           ← Base reset, custom scrollbar, grain overlay
├── components/
│   ├── ScrollyCanvas.tsx     ← [CORE] Canvas + scroll-linked frame playback
│   ├── SceneOverlay.tsx      ← [NEW] Replaces generic Overlay
│   ├── TempleSection.tsx     ← [NEW] Replaces Projects — temple info + CTA
│   └── Particles.tsx         ← [NEW] Floating diya/particle effect
├── hooks/
│   └── useImageSequence.ts   ← [NEW] Preload + frame index logic
├── public/
│   └── sequence/             ← Your CGI frames here
└── tailwind.config.ts
```

---

## Component Details

### `hooks/useImageSequence.ts` — New

```ts
// Preloads all frames into an Image[] array
// Returns { images, loaded, progress }
// Uses Promise.all for parallel loading
// Shows loading progress bar until 100%
```

---

### `components/ScrollyCanvas.tsx` — Core, Modified

```tsx
"use client";
import { useScroll, useTransform } from "framer-motion";
import { useImageSequence } from "@/hooks/useImageSequence";

// - 700vh tall scroll container (more scroll = smoother scrubbing)
// - Sticky canvas fills 100vh
// - useScroll tracks scrollYProgress (0 to 1)
// - frameIndex = Math.floor(scrollProgress * totalFrames)
// - Draws current frame to canvas on every scroll tick
// - canvas uses object-fit: cover behavior via drawImage calculations
// - On Scene 4 (eyes open): triggers a CSS golden radial glow overlay
// - On Scene 5 (chest opening): adds a white flash overlay at peak
```

---

### `components/SceneOverlay.tsx` — New, replaces Overlay.tsx

```tsx
// 5 text scenes, each tied to a scroll range
// Uses useTransform to fade in/out at exact scroll thresholds
// Scene texts:
//   [0.00–0.08]  → "" (silence, let the image speak)
//   [0.08–0.38]  → "जय श्री राम" (Sanskrit, large, centered, fading gold)
//   [0.40–0.58]  → "The Eternal Devotee" + "His love for Ram knows no bounds"
//   [0.60–0.70]  → "Feel his presence." (minimal, centered)
//   [0.85–1.00]  → Temple name + "Visit Us" CTA button

// Font: "Cinzel" for English, "Tiro Devanagari Sanskrit" for Sanskrit text
// Color: warm gold (#D4A843) on dark background
// Each scene uses motion.div with opacity spring animations
```

---

### `components/TempleSection.tsx` — New, replaces Projects.tsx

```tsx
// Appears AFTER the scroll sequence ends (below the 700vh container)
// Sections:
//   - Temple info (name, established, location)
//   - Aarti timings table
//   - Photo gallery grid (3 cols, glassmorphism cards)
//   - Directions / Google Maps embed
//   - Footer with "Jai Bajrangbali" and Om symbol
// Same gold + dark aesthetic
```

---

### `components/Particles.tsx` — New

```tsx
// Floating golden particle dots (simulating diya sparks / marigold petals)
// Canvas-based, 30–50 particles
// Subtle, slow upward drift
// Opacity tied to scroll — most visible during Scene 3 and 4
// Pure CSS animation alternative if performance is a concern
```

---

## `app/globals.css` — Modified

```css
/* Base */
:root {
  --gold: #D4A843;
  --gold-light: #F0C96B;
  --dark: #0A0603;
  --text: #E8D5B0;
}

html { scroll-behavior: smooth; }
body { background: var(--dark); color: var(--text); }

/* Hide default scrollbar, style custom */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

/* Grain texture overlay on body */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/noise.png'); /* subtle grain */
  opacity: 0.04;
  pointer-events: none;
  z-index: 999;
}
```

---

## `app/layout.tsx` — Modified

```tsx
// Fonts to import from Google Fonts:
// - "Cinzel" — for English headings (Roman, regal)
// - "Tiro Devanagari Sanskrit" — for Hindi/Sanskrit text
// - "EB Garamond" — for body copy

// Metadata:
// title: "Shri Hanuman Mandir"
// description: "A divine journey through devotion"
// themeColor: "#0A0603"
```

---

## `app/page.tsx` — Modified

```tsx
export default function Page() {
  return (
    <main>
      <LoadingScreen />        {/* Shows frame preload progress */}
      <div className="relative">
        <ScrollyCanvas />      {/* 700vh scroll container + sticky canvas */}
        <SceneOverlay />       {/* Absolutely positioned over canvas */}
        <Particles />          {/* Floating golden particles */}
      </div>
      <TempleSection />        {/* Static content below */}
    </main>
  );
}
```

---

## Performance Considerations

- **WebP frames** — smaller than PNG, faster decode
- **Preload all frames** before allowing scroll (show a loading bar)
- **`requestAnimationFrame` throttle** — only redraw when frameIndex actually changes
- **`will-change: transform`** on canvas for GPU compositing
- **Lazy load** `TempleSection` with `next/dynamic`

---

## Design Aesthetic

| Property | Value |
|----------|-------|
| Background | Near-black warm `#0A0603` |
| Primary accent | Gold `#D4A843` |
| Text | Warm parchment `#E8D5B0` |
| Heading font | Cinzel (regal, Roman temple feel) |
| Sanskrit font | Tiro Devanagari Sanskrit |
| Body font | EB Garamond |
| Texture | Subtle grain overlay |
| Scrollbar | Thin gold line |

---

## Whisk Prompts Reference

### Frame 1 — Opening (Back View)
> 3D CGI render of Hanuman ji seen from behind, highly detailed muscular back, golden jeweled mukut crown, saffron dhoti with golden border, sacred thread across back, tail curling upward, subsurface scattering on skin, palms joined, head bowed in a praying posture, close shot, photorealistic 3D rendering, Unreal Engine 5 quality, dramatic cinematic lighting, dark moody background with subtle temple silhouette in mist, octane render, 8k

### Frame 2 — Camera Arc (Three-Quarter Back)
> 3D CGI render of Hanuman ji seen from a slight three-quarter back angle, camera slowly circling around him, palms still joined in prayer, head slightly bowed, golden jeweled mukut visible from the side, muscular saffron-orange body with subsurface scattering, sacred thread visible, saffron dhoti, close cinematic shot, dramatic moody lighting, dark atmospheric background, temple silhouette faintly visible in mist, Unreal Engine 5, octane render, 8k

### Frame 3 — Full Face Reveal (Close Frontal)
> 3D CGI render of Hanuman ji in a close frontal shot, eyes closed in deep meditation, palms joined in anjali mudra, head slightly bowed, serene and powerful divine expression, golden jeweled mukut with intricate detailing, muscular saffron-orange skin with photorealistic subsurface scattering, sacred yagnopavita thread, golden ornaments, volumetric god rays from above, dark moody atmospheric background, Unreal Engine 5, octane render, 8k

### Frame 4 — Chest Opening
> 3D CGI close shot of Hanuman ji parting his chest open with both hands, transitioning from prayer pose, blinding golden light violently bursting from within his chest, volumetric god rays, chest muscles and skin parting dramatically, intense expression of divine devotion and bliss, golden jeweled mukut, saffron-orange photorealistic skin with SSS, dark dramatic background, cinematic depth of field, Unreal Engine 5, octane render, 8k

### Frame 5 — Temple World Reveal
> 3D CGI cinematic render, POV camera moving through Hanuman ji's open glowing chest into a breathtaking world within — an ancient intricately carved Hindu temple with tall shikhara towers glowing in golden sunrise light, surrounded by lush green hills, lotus ponds, gentle waterfalls, floating marigold petals, divine golden mist, god rays piercing through clouds, birds in flight, warm ethereal atmosphere, hyperrealistic environment detail, Unreal Engine 5, octane render, 8k

### Animation / Video Prompt (for Whisk video generation)
> Cinematic 3D CGI animation, camera slowly orbits 180 degrees around Hanuman ji starting from behind, smooth arc rotation, subject remains still in prayer pose with palms joined and head bowed, camera simultaneously dollies inward gradually closing in from full body to a tight shoulder-up framing, as the camera completes its arc and reaches the front the subject is now fully facing the camera, close cinematic framing from shoulders upward, golden jeweled mukut, sacred thread, gold ornaments, then in a slow dramatic moment Hanuman ji gently lifts his head and opens his eyes revealing calm powerful divine eyes, hold on face, warm volumetric god rays from above, photorealistic 3D render, Unreal Engine 5 quality, subsurface scattering on skin, octane render, smooth cinematic motion, 24fps, dark moody atmospheric background, 8k

---

## Animation Motion Beats

| Beat | Scroll % | Camera | Subject |
|------|----------|--------|---------|
| Opening | 0–5% | Wide, behind | Still, palms joined, head bowed |
| Arc begins | 5–40% | Orbiting from back + slow push in | Still in prayer |
| Face reveal | 40–60% | Reached front, tight shoulder-up | Head slightly bowed |
| Eyes open | 60–70% | Holds still | Slowly lifts head, opens eyes |
| Chest opens | 70–85% | Slight push in | Chest parts, golden light bursts |
| Temple entry | 85–100% | Flies into chest | Full temple world revealed |

---

## Next Steps

1. Generate all frames using Whisk with the prompts above
2. Export animation as image sequence (WebP, zero-padded filenames)
3. Place frames in `public/sequence/`
4. Run `npx create-next-app@latest hanuman-temple` with TypeScript + Tailwind
5. Install dependencies: `framer-motion`, `clsx`
6. Build components in order: `useImageSequence` → `ScrollyCanvas` → `SceneOverlay` → `Particles` → `TempleSection`
7. Test scroll scrubbing performance on mobile and desktop
