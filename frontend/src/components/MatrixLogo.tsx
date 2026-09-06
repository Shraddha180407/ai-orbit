"use client";

import React, { useEffect, useRef } from "react";

// Classic 5x7 font (from first image reference)
const FONT: Record<string, number[][]> = {
  A: [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  I: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1]],
  O: [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  R: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
  B: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
  T: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  " ": [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
};

const FONT_ROWS = 7;

// Build flat boolean map: textMap[row][col] = on/off
function buildTextMap(text: string): boolean[][] {
  const glyphs = [...text].map(ch => FONT[ch] ?? FONT[" "]);
  const map: boolean[][] = Array.from({ length: FONT_ROWS }, () => []);
  glyphs.forEach((g, gi) => {
    const w = g[0].length;
    for (let r = 0; r < FONT_ROWS; r++) {
      for (let c = 0; c < w; c++) map[r].push(g[r][c] === 1);
      if (gi < glyphs.length - 1) { map[r].push(false); map[r].push(false); } // 2-col gap
    }
  });
  return map;
}

export function MatrixLogo() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d", { alpha: false })!;
    let raf: number;

    // Grid state
    let W = 0, H = 0, step = 0, rad = 0;
    let gC = 0, gR = 0;
    let isLogo: Uint8Array; // 1 = letter dot, 0 = off dot
    let sparkB: Float32Array; // sparkle brightness 0-1
    let sparkD: Float32Array; // sparkle decay rate
    let sparkSubIdx: Uint8Array; // 0-3 random sub-dot for sparkles
    let logoIndices: number[] = [];

    function init() {
      W = section.offsetWidth;
      H = section.offsetHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      // Always render full text
      const text   = "AIORBIT";
      const tMap   = buildTextMap(text);
      const tCols  = tMap[0].length;

      // Calculate step (pixel size) based on available height and width
      const pad = W < 600 ? 2 : 4;
      const stepW = Math.floor(W / (tCols + pad));
      const stepH = Math.floor(H / (FONT_ROWS + 2));
      step = Math.max(Math.min(stepW, stepH), 4); // allow down-scaling for mobile
      rad  = step * 0.35; // Circular dot size

      gC = Math.floor(W / step);
      gR = Math.floor(H / step);
      const len = gC * gR;
      isLogo = new Uint8Array(len);
      sparkB = new Float32Array(len);
      sparkD = new Float32Array(len);
      sparkSubIdx = new Uint8Array(len);

      // Center text in grid
      const offC = Math.round((gC - tCols) / 2);
      const offR = Math.round((gR - FONT_ROWS) / 2);

      logoIndices = [];
      for (let r = 0; r < FONT_ROWS; r++) {
        for (let c = 0; c < tCols; c++) {
          if (tMap[r][c]) {
            const gr = offR + r, gc = offC + c;
            if (gr >= 0 && gr < gR && gc >= 0 && gc < gC) {
              const idx = gr * gC + gc;
              isLogo[idx] = 1;
              logoIndices.push(idx);
            }
          }
        }
      }
    }

    // ── Sparkle ───────────────────────────────────────────────────────────────
    let lastSpark = 0;
    function tickSparkles(now: number) {
      if (now - lastSpark < 55) return;
      lastSpark = now;
      if (logoIndices.length === 0) return;
      const n = Math.max(1, Math.round(logoIndices.length * 0.015));
      for (let i = 0; i < n; i++) {
        const idx = logoIndices[Math.floor(Math.random() * logoIndices.length)];
        if (sparkB[idx] === 0) {
          sparkB[idx] = 0.6 + Math.random() * 0.4;
          sparkD[idx] = 0.006 + Math.random() * 0.006; // 1-2 second fade
          sparkSubIdx[idx] = Math.floor(Math.random() * 4);
        }
      }
    }

    // ── Draw ─────────────────────────────────────────────────────────────────
    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      tickSparkles(now);

      // Background
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      // ── Pass 1: off dots (removed to keep background pure black) ────────────


      // ── Pass 2: logo dots — bright gray with soft glow ───────────────────
      ctx.shadowColor = "rgba(220,220,220,0.55)";
      ctx.shadowBlur  = rad * 2;
      ctx.fillStyle   = "rgba(190,190,190,0.95)";
      
      const q = step / 4;
      const rS = step * 0.17; // Small dot radius
      
      ctx.beginPath();
      for (let r = 0; r < gR; r++) {
        for (let c = 0; c < gC; c++) {
          const i = r * gC + c;
          if (isLogo[i]) {
            const cx = c * step + step / 2;
            const cy = r * step + step / 2;
            ctx.moveTo(cx - q + rS, cy - q); ctx.arc(cx - q, cy - q, rS, 0, Math.PI * 2);
            ctx.moveTo(cx + q + rS, cy - q); ctx.arc(cx + q, cy - q, rS, 0, Math.PI * 2);
            ctx.moveTo(cx - q + rS, cy + q); ctx.arc(cx - q, cy + q, rS, 0, Math.PI * 2);
            ctx.moveTo(cx + q + rS, cy + q); ctx.arc(cx + q, cy + q, rS, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();

      // ── Pass 3: sparkle dots — bright red-orange with strong bloom ───────
      ctx.shadowColor = "rgba(255,70,30,0.9)";
      ctx.shadowBlur  = rad * 3.5;
      for (let r = 0; r < gR; r++) {
        for (let c = 0; c < gC; c++) {
          const i = r * gC + c;
          if (sparkB[i] > 0) {
            const b = sparkB[i];
            ctx.fillStyle = `rgba(255,70,30,${b.toFixed(2)})`;
            const cx = c * step + step / 2;
            const cy = r * step + step / 2;
            
            const subIdx = sparkSubIdx[i];
            let sx = cx, sy = cy;
            if (subIdx === 0) { sx = cx - q; sy = cy - q; }
            else if (subIdx === 1) { sx = cx + q; sy = cy - q; }
            else if (subIdx === 2) { sx = cx - q; sy = cy + q; }
            else { sx = cx + q; sy = cy + q; }

            ctx.beginPath();
            ctx.arc(sx, sy, rS, 0, Math.PI * 2);
            ctx.fill();
            
            sparkB[i] -= sparkD[i];
            if (sparkB[i] < 0) { sparkB[i] = 0; sparkD[i] = 0; }
          }
        }
      }
      ctx.shadowBlur = 0;
    }

    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", init); };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="AI Orbit LED display"
      className="w-full bg-black border-b border-[#1C1C1F] overflow-hidden"
      style={{ height: "clamp(160px, 24vw, 340px)" }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </section>
  );
}
