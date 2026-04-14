"use client";

import React, {
  useRef,
  useState,
  useLayoutEffect,
  MouseEvent,
  ReactNode,
} from "react";

type CommonProps = {
  children: ReactNode;
  cellSize?: number;
  cellColor?: string;
  rippleColor?: string;
  hoverRadius?: number;
  waveSpeed?: number;
  className?: string;
};

type GridButtonProps = CommonProps &
  (
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
    | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  );

type Ripple = { id: number; cx: number; cy: number };

export default function GridButton({
  children,
  cellSize = 14,
  cellColor = "rgba(103, 232, 249, 0.12)",
  rippleColor = "rgba(103, 232, 249, 0.65)",
  hoverRadius = 65,
  waveSpeed = 1.1,
  className = "",
  ...rest
}: GridButtonProps) {
  const buttonRef = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  useLayoutEffect(() => {
    const el = buttonRef.current;
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

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = nextId.current++;
    setRipples((prev) => [...prev, { id, cx: x, cy: y }]);

    const maxDist = Math.hypot(
      Math.max(x, rect.width - x),
      Math.max(y, rect.height - y)
    );
    const lifetime = maxDist / waveSpeed + 650;

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, lifetime);

    (rest.onClick as ((e: MouseEvent<HTMLElement>) => void) | undefined)?.(e);
  };

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const cells: Array<{
    key: string;
    left: number;
    top: number;
    w: number;
    h: number;
    cx: number;
    cy: number;
  }> = [];

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

  const isLink = "href" in rest && rest.href !== undefined;
  const Element = (isLink ? "a" : "button") as React.ElementType;

  return (
    <Element
      ref={buttonRef as React.Ref<HTMLAnchorElement & HTMLButtonElement>}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHover(null)}
      className={`
        relative overflow-hidden isolate inline-flex items-center justify-center
        px-8 py-4 rounded-2xl font-semibold text-base tracking-wide
        bg-slate-900/90 border border-cyan-400/70 text-cyan-300
        hover:shadow-cyan-400/30

        ${className}
      `}
      {...rest}
    >
      {/* Grid overlay - now sits behind the border */}
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {cells.map((cell) => {
          let opacity = 0;
          if (hover) {
            const d = Math.hypot(cell.cx - hover.x, cell.cy - hover.y);
            if (d < hoverRadius) {
              opacity = Math.max(opacity, (1 - d / hoverRadius) * 0.6);
            }
          }

          const rippleLayers = ripples.map((rp) => {
            const d = Math.hypot(cell.cx - rp.cx, cell.cy - rp.cy);
            const delay = d / waveSpeed;
            return (
              <span
                key={rp.id}
                className="grid-cell-flash absolute inset-0"
                style={{
                  background: rippleColor,
                  animationDelay: `${delay}ms`,
                }}
              />
            );
          });

          return (
            <span
              key={cell.key}
              className="absolute pointer-events-none"
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
                  transition: "opacity 100ms ease-out",
                }}
              />
              {rippleLayers}
            </span>
          );
        })}
      </span>

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes gridCellFlash {
          0% { opacity: 0; }
          12% { opacity: 0.85; }
          55% { opacity: 0.25; }
          100% { opacity: 0; }
        }
        .grid-cell-flash {
          opacity: 0;
          animation: gridCellFlash 520ms ease-out forwards;
        }
      `}</style>
    </Element>
  );
}