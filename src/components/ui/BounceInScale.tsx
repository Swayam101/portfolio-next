"use client";

import { useEffect, useRef, type ElementType, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface BounceInScaleProps {
  children: React.ReactNode;
  as?: ElementType;
  /** Total duration in seconds. Default: 1.1 */
  duration?: number;
  /** Delay after scroll trigger fires, seconds. Default: 0 */
  delay?: number;
  /** ScrollTrigger start string. Default: "top 80%" */
  start?: string;
  className?: string;
  style?: CSSProperties;
}

export default function BounceInScale({
  children,
  as: Tag = "div",
  duration = 1.1,
  delay = 0,
  start = "top 80%",
  className = "",
  style,
}: BounceInScaleProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const d = duration;

    gsap.set(el, { scale: 7, opacity: 0 });

    const tl = gsap.timeline({ delay, paused: true });

    tl.to(el, { scale: 1, opacity: 1, duration: d * 0.5, ease: "power2.out" })
      .to(el, { scale: 1.12, duration: d * 0.2, ease: "power2.in" })
      .to(el, { scale: 1, duration: d * 0.3, ease: "power2.out" });

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => tl.play(),
    });

    const checkAndPlay = () => {
      ScrollTrigger.refresh();
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        tl.play();
      }
    };
    checkAndPlay();
    window.addEventListener("load", checkAndPlay);

    return () => {
      window.removeEventListener("load", checkAndPlay);
      st.kill();
      tl.kill();
      gsap.set(el, { clearProps: "all" });
    };
  }, [duration, delay, start]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      className={className}
      style={{ display: "inline-block", ...style }}
    >
      {children}
    </Tag>
  );
}
