import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "../components/ui/ScrollReveal";

const GRADIENT_START = `
  conic-gradient(
    from -45deg at bottom,
    transparent,
    rgba(27, 73, 101, 0) 1deg 89deg,
    var(--frozen-water) 90deg
  ) 50% / 80px 100%
`;
const GRADIENT_MID = `
  conic-gradient(
    from -45deg at bottom,
    transparent,
    rgba(27, 73, 101, 0.5) 1deg 89deg,
    var(--frozen-water) 90deg
  ) 50% / 80px 100%
`;
const GRADIENT_END = `
  conic-gradient(
    from -45deg at bottom,
    transparent,
    rgba(27, 73, 101, 1) 1deg 89deg,
    var(--frozen-water) 90deg
  ) 50% / 80px 100%
`;

const AboutMeSection: React.FC = () => {
  const topGradientRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const puppetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const topEl = topGradientRef.current;
    const overlay = overlayRef.current;
    if (!hero || !topEl || !overlay) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "center top", // Complete before AboutMeSection gradients are in view
        scrub: true,
      },
    });

    // Phase 1: Light tint (matches hero overlay phase 1)
    tl.fromTo(
      [topEl],
      { background: GRADIENT_START },
      { background: GRADIENT_MID, duration: 1, ease: "none" },
      0
    );

    // Phase 2: Darken to yale-blue (matches hero overlay phase 2)
    tl.to(
      [topEl],
      { background: GRADIENT_END, duration: 1.4, ease: "none" },
      ">"
    );

    return () => tl.scrollTrigger?.kill();
  }, []);

  // Katputli puppet: enter from right, leave — under 2s, triggered when section in view
  useEffect(() => {
    const section = sectionRef.current;
    const puppet = puppetRef.current;
    if (!section || !puppet) return;

    const tl = gsap.timeline({ paused: true });
    tl.eventCallback("onComplete", () => { tl.pause(0); });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "center 55%",
      onEnter: () => tl.restart(),
    });

    // Enter from right (0.5s) — slight bob, pivot at stick (right)
    tl.fromTo(
      puppet,
      { x: "120%", rotation: -4, opacity: 0 },
      {
        x: "0%",
        rotation: 2,
        opacity: 1,
        duration: 0.2,
        ease: "back.out(1.2)",
      }
    )
      // Brief hold + micro-bob (0.3s)
      .to(puppet, { rotation: -1.5, duration: 0.5, yoyo: true, repeat: 1 })
      // Leave to right (0.5s)
      .to(puppet, {
        x: "130%",
        rotation: 4,
        opacity: 0,
        duration: 0.2,
        ease: "back.in(1.1)",
      });

    return () => st.kill();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative sm:py-24 py-12 text-center overflow-hidden px-6 sm:px-0">
      <div
        ref={topGradientRef}
        className="absolute top-0 left-0 w-full h-10"
        style={{ background: GRADIENT_START }}
      />

      <div className="relative z-10 max-w-2xl mx-auto pt-24">
        <ScrollReveal distance={40} duration={0.8} start="top 80%">
          <h2 className="text-6xl font-bold text-[var(--yale-blue)] mb-4">
            About Me
          </h2>
        </ScrollReveal>
        <ScrollReveal distance={40} duration={0.8} delay={0.1} start="top 80%">
          <p style={{fontWeight: 600}} className="text-4xl text-[var(--pacific-blue)] leading-[42px] sn-pro ">
            I&apos;m <span className="text-[var(--yale-blue)]">Swayam</span> — I build software that works, and works fast.
          </p>
        </ScrollReveal>
        <ScrollReveal distance={40} duration={0.8} delay={0.2} start="top 80%">
          <p style={{fontWeight: 100}} className="sm:text-xl text-base text-[var(--yale-blue)] text-justify sn-pro py-8">
            Full-stack freelancer with 3 years of experience building web software that&apos;s clean, fast, and built to last. I&apos;ve worked across the full stack — from pixel-perfect frontends to rock-solid backends — and I know what it takes to turn a rough idea into a product people actually use. I don&apos;t just write code, I think about the problem first, ask the right questions, and make sure what gets built is exactly what needs to exist.
          </p>
        </ScrollReveal>
        <ScrollReveal distance={40} duration={0.8} delay={0.3} start="top 80%">
          <p style={{fontWeight: 100}} className="sm:text-xl text-base text-[var(--yale-blue)] text-justify sn-pro">
            My process is simple but the results aren&apos;t average. I cut the noise, skip the over-engineering, and ship with the kind of attention to craft most developers save for their own side projects. Whether it&apos;s a product starting from a blank file or an existing system that needs serious untangling, I bring the same focus and care every single time. Clean architecture, sharp execution, zero unnecessary back-and-forth.
          </p>
        </ScrollReveal>
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{ opacity: 0, backgroundColor: "transparent" }}
        />
      </div>

      {/* Katputli puppet: horizontal wooden stick on right + pointing character — enters from right, leaves */}
      <div
        ref={puppetRef}
        className="absolute right-[6%] top-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={{
          transformOrigin: "right center",
          width: "clamp(280px, 38vw, 480px)",
        }}
      >
        <div className="relative flex items-center">
          <Image
            src="/pointing.webp"
            alt="Katputli puppet character pointing at About Me section — Swayam full-stack developer"
            width={480}
            height={480}
            className="w-full h-auto object-contain"
          />
          {/* Wooden stick attached to right of character */}
          <div
            className="absolute left-full top-1/2 -translate-y-1/2 w-48 h-7 rounded-full"
            style={{
              background: "linear-gradient(180deg, #5c4033 0%, #3d2817 30%, #2d1f12 50%, #3d2817 70%, #5c4033 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;