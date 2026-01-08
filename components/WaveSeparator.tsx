"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
  color?: string;
  height?: number;     
  samples?: number;
  waveOffset?: number;          
};

/**
 * WaveSeparator
 * - The wave is drawn **centered** on the bottom edge of the parent container.
 * - Half of the wave is inside the parent, half spills into the next section.
 * - No extra margin/padding → perfect seam.
 */
export default function WaveSeparator({
  className = "",
  color = "#0ea5e9",
  height = 80,
  samples = 64,
  waveOffset = 20,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [width, setWidth] = useState<number>(0);

  const ampRef = useRef(0);
  const targetAmpRef = useRef(0);
  const phaseRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (!svgRef.current) return;
      setWidth(svgRef.current.clientWidth || window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let lastScroll = 0;
    const onScroll = () => {
      lastScroll = Date.now();
      targetAmpRef.current = 1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = () => {
      const now = Date.now();
      if (now - lastScroll > 300) targetAmpRef.current = 0;

      ampRef.current += (targetAmpRef.current - ampRef.current) * 0.06;
      phaseRef.current += 0.02 + ampRef.current * 0.01;

      renderPath();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, samples, waveOffset]);

  function renderPath() {
    if (!pathRef.current || width <= 0) return;

    const h = height;
    const half = h / 2;                    
    const amp = ampRef.current;
    const base = Math.max(12, h * 0.28);
    const amplitude = base * amp;
    const freq = 18.0;

    const topPts: [number, number][] = [];
    const bottomPts: [number, number][] = [];

    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const x = t * width;

      const waveY =
          Math.sin((t * freq - phaseRef.current) * Math.PI * 2) * amplitude * 1.0 +
          Math.sin((t * freq * 1.7 - phaseRef.current * 0.6) * Math.PI * 2) *
            (amplitude * 0.55) +
          Math.sin((t * freq * 0.7 - phaseRef.current * 1.3) * Math.PI * 2) *
            (amplitude * 0.5);

      topPts.push([x, half - waveY]);

      bottomPts.push([x, half + waveY + waveOffset]);
    }

    const d: string[] = [];

    // ---- top (L→R) ----
    if (topPts.length) {
      d.push(`M ${topPts[0][0].toFixed(2)} ${topPts[0][1].toFixed(2)}`);
      for (let i = 1; i < topPts.length - 1; i++) {
        const [x0, y0] = topPts[i];
        const [x1, y1] = topPts[i + 1];
        const cx = ((x0 + x1) / 2).toFixed(2);
        const cy = ((y0 + y1) / 2).toFixed(2);
        d.push(`Q ${x0.toFixed(2)} ${y0.toFixed(2)} ${cx} ${cy}`);
      }
      const last = topPts[topPts.length - 1];
      d.push(`T ${last[0].toFixed(2)} ${last[1].toFixed(2)}`);
    }

    // ---- bottom (R→L) ----
    if (bottomPts.length) {
      for (let i = bottomPts.length - 1; i > 0; i--) {
        const [x0, y0] = bottomPts[i];
        const [x1, y1] = bottomPts[i - 1];
        const cx = ((x0 + x1) / 2).toFixed(2);
        const cy = ((y0 + y1) / 2).toFixed(2);
        d.push(`L ${x0.toFixed(2)} ${y0.toFixed(2)}`);
        if (i > 1) d.push(`Q ${x0.toFixed(2)} ${y0.toFixed(2)} ${cx} ${cy}`);
      }
      d.push(`L ${bottomPts[0][0].toFixed(2)} ${bottomPts[0][1].toFixed(2)} Z`);
    }

    pathRef.current.setAttribute("d", d.join(" "));
  }

  return (
    <div
      className={`relative w-full ${className}`}
      style={{
        height,                    
        margin: 0,
        padding: 0,
        lineHeight: 0,
        fontSize: 0,
        "--wave-color": color,
      } as React.CSSProperties}
    >
      {/* The SVG is positioned so its centre line sits on the container’s bottom edge */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width || 100} ${height}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" x2="1">
            <stop offset="0%"   style={{ stopColor: "var(--wave-color)", stopOpacity: 0.18 }} />
            <stop offset="30%"  style={{ stopColor: "var(--wave-color)", stopOpacity: 0.12 }} />
            <stop offset="48%"  style={{ stopColor: "var(--wave-color)", stopOpacity: 0.08 }} />
            <stop offset="60%"  style={{ stopColor: "var(--wave-color)", stopOpacity: 0.08 }} />
            <stop offset="100%" style={{ stopColor: "var(--wave-color)", stopOpacity: 0.02 }} />
          </linearGradient>
        </defs>
        <path ref={pathRef} fill="url(#waveGrad)" opacity="0.95" />
      </svg>
    </div>
  );
}