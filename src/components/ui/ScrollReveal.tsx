"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollRevealProps {
  children: React.ReactNode;
  /** How far below to start from, px. Default: 40 */
  distance?: number;
  /** Animation duration, s. Default: 0.8 */
  duration?: number;
  /** Delay before bounce, s. Default: 0 */
  delay?: number;
  /** When to trigger. Default: "top 95%" (slightly delayed) */
  start?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollReveal({
  children,
  distance = 40,
  duration = 0.8,
  delay = 0,
  start = "top 95%",
  className,
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { y: distance, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      }
    );

    const checkAndPlay = () => {
      ScrollTrigger.refresh();
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        tween.play();
      }
    };
    checkAndPlay();
    window.addEventListener("load", checkAndPlay);

    return () => {
      window.removeEventListener("load", checkAndPlay);
      tween.scrollTrigger?.kill();
    };
  }, [distance, duration, delay, start]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
