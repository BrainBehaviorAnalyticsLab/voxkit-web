"use client";

import React, {
  useRef,
  useState,
  useLayoutEffect,
  MouseEvent,
  ReactNode,
} from "react";

type GridBackgroundProps = {
  children?: ReactNode;
  cellSize?: number;
  cellColor?: string;
  rippleColor?: string;
  hoverRadius?: number;
  waveSpeed?: number;
  className?: string;
};

type Ripple = { id: number; cx: number; cy: number };

export default function GridBackground({
  children,
  cellSize = 32,
  cellColor = "rgba(255, 255, 255, 0.06)",
  rippleColor = "rgba(103, 232, 249, 0.55)",
  hoverRadius = 120,
  waveSpeed = 0.9,
  className = "",
}: GridBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cols = Math.max(1, Math.ceil(size.w / cellSize));
  const rows = Math.max(1, Math.ceil(size.h / cellSize));
  const cellW = size.w / cols;
  const cellH = size.h / rows;

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = nextId.current++;
    setRipples((r) => [...r, { id, cx: x, cy: y }]);
    const maxDist = Math.hypot(
      Math.max(x, rect.width - x),
      Math.max(y, rect.height - y)
    );
    const lifetime = maxDist / waveSpeed + 400;
    setTimeout(() => {
      setRipples((r) => r.filter((rp) => rp.id !== id));
    }, lifetime);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const cells: { key: string; left: number; top: number; w: number; h: number; cx: number; cy: number }[] = [];
  if (size.w > 0 && size.h > 0) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const left = c * cellW;
        const top = r * cellH;
        cells.push({
          key: `${r}-${c}`,
          left,
          top,
          w: cellW,
          h: cellH,
          cx: left + cellW / 2,
          cy: top + cellH / 2,
        });
      }
    }
  }

  return (
    <div
      ref={ref}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHover(null)}
      className={`relative overflow-hidden ${className}`}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0">
        {cells.map((cell) => {
          let opacity = 0;
          if (hover) {
            const d = Math.hypot(cell.cx - hover.x, cell.cy - hover.y);
            if (d < hoverRadius) {
              opacity = Math.max(opacity, (1 - d / hoverRadius) * 0.55);
            }
          }
          const rippleDelays = ripples.map((rp) => {
            const d = Math.hypot(cell.cx - rp.cx, cell.cy - rp.cy);
            return { id: rp.id, delay: d / waveSpeed };
          });
          return (
            <span
              key={cell.key}
              className="absolute"
              style={{
                left: cell.left,
                top: cell.top,
                width: cell.w,
                height: cell.h,
                boxShadow: `inset 0 0 0 1px ${cellColor}`,
              }}
            >
              <span
                className="absolute inset-0"
                style={{
                  background: rippleColor,
                  opacity,
                  transition: "opacity 120ms ease-out",
                }}
              />
              {rippleDelays.map((rd) => (
                <span
                  key={rd.id}
                  className="absolute inset-0 grid-cell-flash"
                  style={{
                    background: rippleColor,
                    animationDelay: `${rd.delay}ms`,
                  }}
                />
              ))}
            </span>
          );
        })}
      </span>

      {children}

      <style jsx>{`
        @keyframes gridCellFlash {
          0% { opacity: 0; }
          15% { opacity: 0.9; }
          60% { opacity: 0.3; }
          100% { opacity: 0; }
        }
        :global(.grid-cell-flash) {
          opacity: 0;
          animation: gridCellFlash 500ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}
