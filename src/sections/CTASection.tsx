import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "../utils/scrollToSection";
import { trackMixpanel } from "@/lib/mixpanel";

const CTASection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const puppetRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const puppet = puppetRef.current;
    const heading = headingRef.current;
    const content = contentRef.current;

    if (!section || !puppet) return;

    // Puppet animation
    const puppetTl = gsap.timeline({ paused: true });
    puppetTl.eventCallback("onComplete", () => { puppetTl.pause(0); });

    const puppetSt = ScrollTrigger.create({
      trigger: section,
      start: "center 55%",
      onEnter: () => puppetTl.restart(),
    });

    puppetTl.fromTo(
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

    // Content animations
    if (heading && content) {
      gsap.fromTo(
        heading,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        content.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        }
      );
    }

    return () => {
      puppetSt.kill();
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      className="relative bg-[var(--yale-blue)] text-center min-h-[650px] px-6 sm:px-0 py-12 sm:py-24 overflow-hidden"
    >
      {/* Sparkles decoration */}
      <div className="absolute top-20 left-1/4 text-[var(--pacific-blue)] text-2xl opacity-40 select-none">✦</div>
      <div className="absolute top-1/3 right-1/4 text-[var(--pale-sky)] text-xl opacity-30 select-none">✦</div>
      <div className="absolute bottom-32 left-1/3 text-[var(--pacific-blue)] text-2xl opacity-40 select-none">✦</div>

      <div className="relative z-10 w-full max-w-3xl mx-auto py-20 flex flex-col gap-4">
        {/* Heading */}
        <h2 
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--pale-sky)] mb-2"
        >
          Got a project? Let&apos;s talk.
        </h2>

        {/* Content */}
        <div ref={contentRef} className="flex flex-col gap-6">
          <p 
            className="text-xl sm:text-2xl text-white leading-relaxed sn-pro font-medium max-w-2xl mx-auto"
          >
            I turn ambitious ideas into digital products that actually work.
          </p>

          <p 
            className="text-base sm:text-lg text-[var(--frozen-water)]/80 leading-relaxed sn-pro max-w-2xl mx-auto"
          >
            Strategy first. Clean code always. Zero fluff. I think like a partner, build like an engineer, and ship products that grow with you.
          </p>

          {/* CTA Button */}
          <div className="mt-4">
            <a
              href="#contact-form"
              onClick={(e) => { 
                e.preventDefault(); 
                scrollToSection("contact-form");
                
                // GA4
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'generate_lead', {
                    cta_text: 'Hit Me Up',
                    cta_location: 'cta_section',
                  });
                }

                // Mixpanel
                trackMixpanel('Generate Lead', {
                  source: 'cta',
                  cta_text: 'Hit Me Up',
                  cta_location: 'cta_section',
                });
              }}
              className="inline-block text-xl sm:text-2xl font-black tracking-wide rounded-xl px-8 py-4
                bg-[var(--pale-sky)]
                text-[var(--yale-blue)]
                border-b-[6px] border-r-[4px] border-[var(--pacific-blue)]
                shadow-[2px_2px_0px_var(--pacific-blue)]
                active:border-b-[2px] active:border-r-[2px] 
                active:shadow-[1px_1px_0px_var(--pacific-blue)]
                active:translate-x-[3px] active:translate-y-[3px]
                transition-all duration-75 cursor-pointer select-none
                hover:brightness-105 hover:scale-105 no-underline"
              style={{ textShadow: '1px 2px 0px rgba(var(--yale-blue-rgb), 0.2)' }}
            >
              Hit Me Up ↗
            </a>
          </div>
        </div>
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
            alt="Contact Swayam for freelance full-stack development"
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
