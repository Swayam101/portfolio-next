"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import REASONS from "../data/reasons-to-work";
import MarqueeStrip from "../components/ui/MaqueeStrip";
import C from "../constants/colors";
import ReasonCard from "../components/ui/ReasonCard";
import { PathRocketAnimation } from "../components/why-work-with-me/PathRocketAnimation";


export default function WhyWorkWithMe() {
  const headingRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,600;1,400&display=swap');
      `}</style>

      <section
        ref={sectionRef}
        className="w-full relative overflow-hidden bg-[var(--frozen-water)] py-24 md:py-32"
      >
        <PathRocketAnimation sectionRef={sectionRef} />

       <div className=" mb-24">
       <MarqueeStrip />
       </div>

        <div className="relative z-10 px-6 sm:px-44 flex flex-col md:flex-row md:items-start items-center justify-center">
          <div ref={headingRef} style={{ marginBottom: "1rem" }}>
            <h2 className="tracking-[0.04em] leading-[0.92] text-[var(--yale-blue)]" 
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
              Why <span className="text-[var(--fresh-sky)]">Work </span>With <span className="text-[var(--yale-blue)]">Me</span>
            </h2>

          </div>

         

          {/* Cards grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
            marginTop: "0.5rem",
          }}>
            {REASONS.map((r, i) => (
              <ReasonCard
                key={r.num}
                reason={r}
                index={i}
                isEven={i % 2 === 0}
              />
            ))}
          </div>

          {/* Bottom gradient rule */}
          <div style={{
            marginTop: "4rem",
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${C.pacificBlue}88, transparent)`,
            borderRadius: "2px",
          }} />
        </div>
      </section>
    </>
  );
}