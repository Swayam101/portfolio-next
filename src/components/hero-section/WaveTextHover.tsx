"use client";

import { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";

interface WaveTextHoverProps {
  text: string;
  /** Delay before initial wave on load, ms. Default: 5100 (after rocket ~5s) */
  loadDelay?: number;
  /** How high each char lifts, px. Default: 12 */
  lift?: number;
  /** Duration of each char's up/down, seconds. Default: 0.2 */
  duration?: number;
  /** Stagger between chars, seconds. Default: 0.03 */
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function WaveTextHover({
  text,
  loadDelay = 3500,
  lift = 12,
  duration = 0.2,
  stagger = 0.03,
  className = "",
  style,
}: WaveTextHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const playWave = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = container.querySelectorAll<HTMLSpanElement>(".wt-char");
    if (chars.length === 0) return;

    // Kill any running animation
    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline();

    tl.to(chars, {
      y: -lift,
      ease: "power3.inOut",
      duration,
      stagger,
    }).to(
      chars,
      {
        y: 0,
        ease: "power3.inOut",
        duration,
        stagger,
      },
      `-=${duration * 0.6}`
    );

    tlRef.current = tl;
  }, [lift, duration, stagger]);

  useEffect(() => {
    const t = setTimeout(playWave, loadDelay);
    return () => clearTimeout(t);
  }, [playWave, loadDelay]);

  return (
    <span
      ref={containerRef}
      onMouseEnter={playWave}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: "default",
        ...style,
      }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="wt-char"
          style={{
            display: "inline-block",
            whiteSpace: "pre",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
