"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface AlternatingSlideInProps {
  children: React.ReactNode[] | React.ReactNode;
  /** How far off-screen each item starts, px. Default: 100 */
  distance?: number;
  /** Stagger between items, seconds. Default: 0.1 */
  stagger?: number;
  /** Duration per item, seconds. Default: 0.65 */
  duration?: number;
  /** ScrollTrigger start. Default: "top 75%" */
  start?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AlternatingSlideIn({
  children,
  distance = 100,
  stagger = 0.1,
  duration = 0.65,
  start = "top 75%",
  className = "",
  style,
}: AlternatingSlideInProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!wrap || items.length === 0) return;

    items.forEach((item, i) => {
      gsap.set(item, {
        x: i % 2 === 0 ? -distance : distance,
        opacity: 0,
      });
    });

    const tl = gsap.timeline({ paused: true });

    items.forEach((item, i) => {
      tl.to(
        item,
        {
          x: 0,
          opacity: 1,
          duration,
          ease: "power3.out",
        },
        i * stagger
      );
    });

    const st = ScrollTrigger.create({
      trigger: wrap,
      start,
      once: true,
      onEnter: () => tl.play(),
    });

    const checkAndPlay = () => {
      ScrollTrigger.refresh();
      const rect = wrap.getBoundingClientRect();
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
      items.forEach((item) => gsap.set(item, { clearProps: "all" }));
    };
  }, [distance, stagger, duration, start]);

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div ref={wrapRef} className={className} style={style}>
      {childArray.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            itemsRef.current[i] = el;
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
