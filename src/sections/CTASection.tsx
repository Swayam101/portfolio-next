import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BounceInScale from "../components/ui/BounceInScale";
import { scrollToSection } from "../utils/scrollToSection";

const CTASection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const puppetRef = useRef<HTMLDivElement>(null);

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

    tl.fromTo(
      puppet,
      { x: "-120%", rotation: 4, opacity: 0 },
      {
        x: "0%",
        rotation: -2,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.2)",
      }
    )
      .to(puppet, { rotation: 1.5, duration: 0.15, yoyo: true, repeat: 1 })
      .to(puppet, {
        x: "-130%",
        rotation: -4,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.1)",
      });

    return () => st.kill();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      className="relative bg-[var(--yale-blue)] text-center min-h-[650px] px-6 sm:px-0 py-12 sm:py-24"
    >
      <div className="z-10 w-full max-w-3xl mx-auto py-20 flex flex-col sm:gap-4 gap-2">
        <BounceInScale as="h2" start="top 75%" duration={1} delay={0} className="text-5xl font-bold text-[var(--pale-sky)] mb-4">
          Got a project? Let&apos;s talk.
        </BounceInScale>
        <BounceInScale as="p" start="top 75%" duration={1} delay={0.15} style={{ fontWeight: 500 }} className="text-2xl text-[white] leading-[42px] sn-pro">
          I turn ambitious ideas into digital products that pull their weight.
        </BounceInScale>
        <BounceInScale as="p" start="top 75%" duration={0.9} delay={0.3} style={{ fontWeight: 100 }} className="text-xl text-[var(--pacific-blue)] text-justify sn-pro pt-8 mb-10">
        As a freelance developer, I don’t just “build websites.” I craft fast, scalable, conversion-driven experiences that are designed to grow with you. Strategy first. Clean code always. Zero fluff.
        If you want someone who thinks like a partner, builds like an engineer, and sweats the small stuff so your product feels big — we’ll get along.
        </BounceInScale>

        <BounceInScale as="div" start="top 75%" duration={0.9} delay={0.45}>
          <a
            href="#contact-form"
            onClick={(e) => { e.preventDefault(); scrollToSection("contact-form"); }}
            className="text-2xl font-black tracking-wide rounded-xl px-6 py-4
              bg-[var(--pale-sky)]
              text-[var(--yale-blue)]
              border-b-[6px] border-r-[4px] border-[var(--pacific-blue)]
              shadow-[2px_2px_0px_var(--pacific-blue)]
              active:border-b-[2px] active:border-r-[2px] 
              active:shadow-[1px_1px_0px_var(--pacific-blue)]
              active:translate-x-[3px] active:translate-y-[3px]
              transition-all duration-75 cursor-pointer select-none
              hover:brightness-105 no-underline inline-block"
            style={{ textShadow: '1px 2px 0px rgba(var(--yale-blue-rgb), 0.2)' }}
          >
            Hit Me Up
          </a>
        </BounceInScale>

      </div>

      {/* Katputli puppet: cta scene with wooden stick — enters from left, leaves */}
      <div
        ref={puppetRef}
        className="absolute left-[6%] top-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={{
          transformOrigin: "left center",
          width: "clamp(280px, 38vw, 480px)",
        }}
      >
        <div className="relative flex items-center">
          <div
            className="absolute right-full top-1/2 -translate-y-1/2 w-48 h-7 rounded-full"
            style={{
              background: "linear-gradient(180deg, #5c4033 0%, #3d2817 30%, #2d1f12 50%, #3d2817 70%, #5c4033 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)",
            }}
          />
          <Image
            src="/cta.webp"
            alt="Contact Swayam for freelance full-stack development — get in touch call-to-action"
            width={480}
            height={480}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default CTASection;