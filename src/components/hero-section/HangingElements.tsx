import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useHydrationSafeMediaQuery } from "../../hooks/useHydrationSafeMediaQuery";

const HANGER_CONFIG = [
  { left: "5%", src: "/asteroid.webp", alt: "Asteroid illustration — Swayam developer portfolio", stringLength: 100, delay: 0 },
  { left: "30%", src: "/computer.webp", alt: "Computer and coding — full-stack development", stringLength: 120, delay: 0.3 },
  { left: "60%", src: "/planet.webp", alt: "Planet illustration — web development portfolio", stringLength: 140, delay: 0.6 },
  { left: "85%", src: "/satellite.webp", alt: "Satellite — tech and software projects", stringLength: 80, delay: 0.45 },
] as const;

const HangingElements = () => {

  const hangerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const elementRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useHydrationSafeMediaQuery({ maxWidth: 767 })

  useEffect(() => {
    const hangers = hangerRefs.current.filter(Boolean) as HTMLDivElement[];
    const elements = elementRefs.current.filter(Boolean) as HTMLDivElement[];

    if (hangers.length === 0 || elements.length === 0) return;

    hangers.forEach((h, i) => {
      const el = elements[i];
      const config = HANGER_CONFIG[i];
      if (!el || !config) return;

      const sLen = config.stringLength;
      const startY = -(sLen + 120);

      gsap.set(h, { y: startY });

      gsap.to(h, {
        y: 0,
        duration: 1.4,
        delay: config.delay,
        ease: "bounce.out",
      });

      gsap.to(h, {
        rotation: gsap.utils.random(-8, 8),
        duration: 1.2,
        delay: config.delay + 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 0.1,
      });

      gsap.to(el, {
        rotation: gsap.utils.random(-6, 6),
        duration: gsap.utils.random(1.8, 2.8),
        delay: config.delay + 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(el, {
        scale: gsap.utils.random(0.93, 0.97),
        duration: gsap.utils.random(2, 3),
        delay: config.delay + 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {HANGER_CONFIG.map((config, i) => {
        const hangerEl = (
          <div
            ref={(el) => { hangerRefs.current[i] = el; }}
            className="flex flex-col items-center origin-top"
          >
          <div
            className="w-[1.5px] rounded-sm shrink-0 origin-top"
            style={{
              height: isMobile ? config.stringLength - 80 : config.stringLength,
              background:
                "linear-gradient(to bottom, rgba(var(--yale-blue-rgb), 0.45), rgba(var(--yale-blue-rgb), 0.12))",
            }}
          />
          <div
            ref={(el) => { elementRefs.current[i] = el; }}
            className="shrink-0 origin-center relative w-24 h-24 sm:w-48 sm:h-48"
            style={{
              filter: "drop-shadow(0 0 12px rgba(var(--yale-blue-rgb), 0.25))",
            }}
          >
            <Image
              src={config.src}
              alt={config.alt}
              fill
              sizes="(max-width: 768px) 96px, 192px"
              className="object-contain"
            />
          </div>
          </div>
        );
        return (
          <div key={config.src} className="absolute top-0" style={{ left: config.left }}>
            {hangerEl}
          </div>
        );
      })}
    </div>
  );
};

export default HangingElements;
