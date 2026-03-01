import { useEffect, useRef } from "react";
import { useHydrationSafeMediaQuery } from "../../hooks/useHydrationSafeMediaQuery";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PATH_D = "M -70,300 L 165,300 A 25 25 0 0 1 190 325 L 190,1000";

/**
 * Dotted path on left 30%: horizontal from left → rounded corner → vertical down.
 * Rocket follows path exactly using getPointAtLength.
 */
export function PathRocketAnimation({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<SVGImageElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const isMobile = useHydrationSafeMediaQuery({ maxWidth: 767 });

  const rocketW = isMobile ? 120 : 400;
  const rocketH = isMobile ? 80 : 400;

  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    const container = containerRef.current;
    const rocket = rocketRef.current;
    const path = pathRef.current;
    if (!section || !container || !rocket || !path) return;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = "5 5";
    gsap.set(path, { strokeDashoffset: pathLength });

    // Reveal dotted path on scroll (extended range for slower, smoother feel)
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        endTrigger: "#footer-cta",
        end: "top 50%",
        scrub: 1,
      },
    });

    // Rocket on path: use getPointAtLength for exact position
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        endTrigger: "#footer-cta",
        end: "top 50%",
        scrub: 2.5,
      },
    });

    const setRocketPosition = (scrollProgress: number) => {
      const progress = scrollProgress;
      const len = progress * pathLength;
      const pt = path.getPointAtLength(len);
      const ptAhead = path.getPointAtLength(Math.min(len + 2, pathLength));
      const angle = Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x);
      const deg = (angle * 180) / Math.PI;

      rocket.setAttribute("x", String(pt.x - rocketW / 2));
      rocket.setAttribute("y", String(pt.y - rocketH / 2));
      rocket.setAttribute("transform", `rotate(${deg} ${pt.x} ${pt.y})`);
    };

    tl.to({}, { duration: 1, ease: "none", onUpdate: function () { setRocketPosition(this.progress()); } });

    // Set initial position immediately (onUpdate may not fire until scroll)
    setRocketPosition(0);

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, [sectionRef, rocketW, rocketH, isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={containerRef}
      className="absolute left-0 top-0 w-[35%] min-w-[220px] max-w-[320px] h-full pointer-events-none z-20 overflow-visible"
      aria-hidden
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="-150 0 660 900"
        preserveAspectRatio="xMinYMin slice"
        style={{ overflow: "visible" }}
      >
        <path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="var(--pacific-blue)"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeLinecap="round"
          strokeDasharray="5 5"
        />
        <image
          ref={rocketRef}
          href="/isit2.webp"
          x={-70 - rocketW / 2}
          y={240 - rocketH / 2}
          width={rocketW}
          height={rocketH}
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    </div>
  );
}
