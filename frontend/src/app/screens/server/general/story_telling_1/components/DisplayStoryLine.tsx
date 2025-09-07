"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './DisplayStoryLine.module.css';
import type { StoryLine } from '../../models/StoryLineModels';
import Label from '@/components/general/Label';

export interface DisplayStoryLineProps {
  storyLine: StoryLine;
}

const ANIM_MS = 700;
const SHIFT_PCT = 0.05;          // ±5% random offset relative to cloud size
const SIZE_JITTER = 0.18;        // ±18% random size variation for puffs
const MIN_PUFFS = 6;
const MAX_PUFFS = 22;
const SPACING = 1.20;            // spacing factor around perimeter
const R_BASE_OF_HEIGHT = 0.45;   // base puff radius relative to cloud height
const R_CLAMP_MIN = 18;          // px
const R_CLAMP_MAX = 56;          // px

/* Deterministic RNG so same text gets same shape (until size changes) */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function lcg(seed: number): number { return (Math.imul(seed, 1664525) + 1013904223) >>> 0; }
function randUnit(seed: number): [number, number, number] {
  // three numbers in [0,1)
  const a = (seed = lcg(seed)) / 2 ** 32;
  const b = (seed = lcg(seed)) / 2 ** 32;
  const c = (seed = lcg(seed)) / 2 ** 32;
  return [a, b, c];
}
function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)); }

/* Ramanujan ellipse perimeter approximation */
function ellipsePerimeter(a: number, b: number): number {
  const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);
  return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
}

type Puff = {
  left: number; top: number; size: number; dx: number; dy: number;
};

const DisplayStoryLine: React.FC<DisplayStoryLineProps> = ({ storyLine }) => {
  const [fadeIn, setFadeIn] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const cloudRef = useRef<HTMLDivElement | null>(null);

  // Measure cloud size (text -> cloud size); re-measure on resize
  useLayoutEffect(() => {
    const measure = () => {
      const el = cloudRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setDims({ w: rect.width, h: rect.height });
    };
    measure();

    const ro = new ResizeObserver(measure);
    if (cloudRef.current) ro.observe(cloudRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Unified fade-in per line
  useEffect(() => {
    setFadeIn(true);
    const t = setTimeout(() => setFadeIn(false), ANIM_MS + 100);
    return () => clearTimeout(t);
  }, [storyLine]);

  // Generate all puffs from cloud dimensions + text seed
  const puffs: Puff[] = useMemo(() => {
    const { w, h } = dims;
    if (!w || !h) return [];

    // Body ellipse radii (approx main rounded body)
    const a = w / 2;
    const b = h / 2;

    // Base puff size from height, clamped to sensible pixel range
    const rBase = clamp(b * R_BASE_OF_HEIGHT, R_CLAMP_MIN, R_CLAMP_MAX);
    const dBase = 2 * rBase;

    // How many puffs? Use ellipse perimeter and spacing versus base diameter
    const perimeter = ellipsePerimeter(a, b);
    const nRaw = Math.round(perimeter / (dBase * SPACING));
    const n = clamp(nRaw, MIN_PUFFS, MAX_PUFFS) * 3;

    // Where to place puff centers? On an expanded ellipse so they "stick out"
    const expand = rBase * 0.35;  // push centers outside body a bit
    const ax = a + expand;
    const by = b + expand;

    // Random offsets amplitude (±5% of cloud size)
    const ampX = w * SHIFT_PCT;
    const ampY = h * SHIFT_PCT;

    const seed0 = hashString(storyLine.text ?? '');
    const arr: Puff[] = [];
    let seed = seed0;

    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2; // evenly spaced around ellipse

      // Ellipse param center
      const x = ax * Math.cos(t);
      const y = by * Math.sin(t);

      // size + offset jitter
      const [ru, rv, rw] = randUnit(seed);
      seed = lcg(seed);

      const dx = (ru * 2 - 1) * ampX;
      const dy = (rv * 2 - 1) * ampY;
      const size = dBase * (1 + (rw * 2 - 1) * SIZE_JITTER) * 2;

      arr.push({
        left: a + x + dx,
        top:  b + y + dy,
        size,
        dx, dy,
      });
    }

    return arr;
  }, [dims, storyLine]);

  return (
    <div
      ref={cloudRef}
      className={`${styles.cloud} ${fadeIn ? styles.fadeIn : ''}`}
      role="group"
      aria-label="Story bubble"
    >
      {/* Generated puffs (behind the body mask) */}
      {puffs.map((p, i) => (
        <span
          key={i}
          className={styles.puff}
          style={{
            left: `${p.left}px`,
            top: `${p.top}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          aria-hidden="true"
        />
      ))}

      <div className={styles.body}>
        <Label className={`${styles.text} ${fadeIn ? styles.fadeIn : ''}`}>
          {storyLine.text}
        </Label>
      </div>
    </div>
  );
};

export default DisplayStoryLine;
