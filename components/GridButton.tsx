"use client";

import React, {
  useRef,
  useState,
  useLayoutEffect,
  MouseEvent,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
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

type GridButtonProps =
  | (CommonProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  | (CommonProps & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>);

type Ripple = { id: number; cx: number; cy: number };

export default function GridButton({
  children,
  cellSize = 16,
  cellColor = "rgba(255, 255, 255, 0.08)",
  rippleColor = "rgba(255, 255, 255, 0.85)",
  hoverRadius = 48,
  waveSpeed = 0.9,
  className = "",
  onClick,
  ...rest
}: GridButtonProps) {
  const buttonRef = useRef<HTMLElement>(null);
  const href = (rest as { href?: string }).href;
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
    if (rect) {
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
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (onClick as any)?.(e);
  };

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // Build cell list only when dimensions change
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

  const sharedProps = {
    ref: buttonRef as React.Ref<HTMLElement>,
    onClick: handleClick,
    onMouseMove: handleMouseMove,
    onMouseLeave: () => setHover(null),
    className: `relative overflow-hidden isolate inline-block ${className}`,
    ...rest,
  };

  const Element = href ? "a" : "button";

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Element {...(sharedProps as any)}>
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {cells.map((cell) => {
          let opacity = 0;

          if (hover) {
            const d = Math.hypot(cell.cx - hover.x, cell.cy - hover.y);
            if (d < hoverRadius) {
              opacity = Math.max(opacity, (1 - d / hoverRadius) * 0.55);
            }
          }

          // Ripple wave: each cell glows briefly as the wavefront passes.
          // Using inline opacity is reactive; we rely on React re-renders driven
          // by hover moves. For smooth ripple without mouse motion we animate
          // via CSS by setting an animation-delay per cell.
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
              {/* Hover glow layer */}
              <span
                className="absolute inset-0"
                style={{
                  background: rippleColor,
                  opacity,
                  transition: "opacity 120ms ease-out",
                }}
              />
              {/* Ripple wave layers — one per active ripple */}
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

      <span className="relative">{children}</span>

      <style jsx>{`
        @keyframes gridCellFlash {
          0% {
            opacity: 0;
          }
          15% {
            opacity: 0.9;
          }
          60% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
          }
        }
        :global(.grid-cell-flash) {
          opacity: 0;
          animation: gridCellFlash 500ms ease-out forwards;
        }
      `}</style>
    </Element>
  );
}
