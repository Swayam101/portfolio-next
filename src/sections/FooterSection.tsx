import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { scrollToSection } from "../utils/scrollToSection";
import { SOCIAL_LINKS } from "../constants/socialLinks";
import C from "../constants/colors";

function useMagnetic(strength = 0.38) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      gsap.to(el, { x, y, duration: 0.35, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);
  return ref;
}

function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const ref = useMagnetic(0.45) as React.RefObject<HTMLAnchorElement>;
  const [hov, setHov] = useState(false);
  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        border: `1.5px solid ${hov ? C.pacificBlue : C.freshSky + "44"}`,
        background: hov ? C.pacificBlue : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hov ? C.yaleBlue : C.freshSky,
        transition: "all 0.25s ease",
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      {children}
    </a>
  );
}

interface NavLink {
  label: string;
  targetId: string;
}

interface FooterCTAProps {
  email?: string;
  name?: string;
  year?: number;
  navLinks?: NavLink[];
}

export default function FooterCTA({
  email = "swayamprajapat21@gmail.com",
  name = "Swayam Prajapat",
  year = new Date().getFullYear(),
  navLinks = [
    { label: "Home",    targetId: "" },
    { label: "About",   targetId: "about" },
    { label: "Work",    targetId: "projects" },
    { label: "Contact", targetId: "contact" },
  ],
}: FooterCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const footRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      [line1Ref, line2Ref].forEach((r, i) => {
        if (!r.current) return;
        gsap.from(r.current, {
          yPercent: 110,
          opacity: 0,
          duration: 1,
          delay: i * 0.13,
          ease: "power3.out",
          scrollTrigger: { trigger: r.current, start: "top 85%" },
        });
      });
      gsap.from([subRef.current, socialsRef.current], {
        y: 22,
        opacity: 0,
        duration: 0.8,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: { trigger: subRef.current, start: "top 85%" },
      });
      gsap.from(footRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          end: "bottom bottom",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .cta-email { position: relative; text-decoration: none; }
        .cta-email::after {
          content: '';
          position: absolute;
          left: 0; bottom: -4px;
          width: 100%; height: 2px;
          background: linear-gradient(90deg, #62b6cb, #5fa8d3);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .cta-email:hover::after { transform: scaleX(1); }
      `}</style>

      <section
        id="footer-cta"
        ref={sectionRef}
        style={{
          background: C.yaleBlue,
          width: "100%",
          position: "relative",
          overflow: "hidden",
          paddingTop: "7rem",
          paddingBottom: "2rem",
        }}
      >
        {/* Dot grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(${C.pacificBlue}20 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />

        {/* Glow blob */}
        <div style={{
          position: "absolute",
          top: "10%", left: "50%",
          transform: "translateX(-50%)",
          width: "70vw", height: "50vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${C.pacificBlue}14 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />

        {/* Center content */}
        <div style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "0 2.5rem",
          position: "relative",
          textAlign: "center",
        }}>

          {/* Eyebrow */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.65rem",
            marginBottom: "1.5rem",
          }}>
            <div style={{ width: "1.5rem", height: "1.5px", background: C.pacificBlue }} />
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.3em",
              color: C.pacificBlue,
            }}>Get In Touch</span>
            <div style={{ width: "1.5rem", height: "1.5px", background: C.pacificBlue }} />
          </div>

          {/* Heading line 1 - clipped reveal */}
          <div style={{ overflow: "hidden" }}>
            <div ref={line1Ref} style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3.8rem, 11vw, 8.5rem)",
              letterSpacing: "0.05em",
              lineHeight: 0.95,
              color: C.frozenWater,
              margin: 0,
            }}>
              LET&apos;S BUILD
            </div>
          </div>

          {/* Heading line 2 - stroked outline style */}
          <div style={{ overflow: "hidden", marginBottom: "2.5rem" }}>
            <div ref={line2Ref} style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3.8rem, 11vw, 8.5rem)",
              letterSpacing: "0.05em",
              lineHeight: 0.95,
              color: "transparent",
              WebkitTextStroke: `2px ${C.pacificBlue}`,
              margin: 0,
            }}>
              SOMETHING
            </div>
          </div>

          {/* Sub copy */}
          <div ref={subRef} style={{ marginBottom: "2.25rem" }}>
            <p style={{
              fontFamily: "'Lora', serif",
              fontStyle: "italic",
              fontSize: "0.95rem",
              color: `${C.freshSky}bb`,
              marginBottom: "1.1rem",
            }}>
              Open for freelance & full-time opportunities.
            </p>
            <a
              href={`mailto:${email}`}
              className="cta-email"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
                letterSpacing: "0.12em",
                color: C.paleSky,
              }}
            >
              {email.toUpperCase()}
            </a>
          </div>

          {/* Social icons */}
          <div ref={socialsRef} style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.85rem",
            marginBottom: "6rem",
          }}>
            {SOCIAL_LINKS.map(({ href, label, icon }) => (  
              <SocialBtn key={label} href={href} label={label}>
                {icon === "github" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                )}
                  {icon === "linkedin" && (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                  {icon === "x" && (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  {icon === "telegram" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  )}
                  {icon === "email" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  )}
              </SocialBtn>
            ))}
            
          </div>
        </div>

        {/* ── Footer bar ── */}
        <div
          ref={footRef}
          style={{
            borderTop: `1.5px solid ${C.pacificBlue}33`,
            padding: "1.4rem 2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            width: "100%",
            minHeight: "3.5rem",
          }}
        >
          <span style={{
            fontFamily: "'Lora', serif",
            fontSize: "0.78rem",
            fontStyle: "italic",
            color: `${C.freshSky}77`,
          }}>
            © {year} {name}
          </span>

          {/* Nav links */}
          <nav aria-label="Footer navigation" style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
            {navLinks.map((link, i) => (
              <span key={link.label} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                {i > 0 && (
                  <span style={{
                    width: "3px", height: "3px", borderRadius: "50%",
                    background: `${C.pacificBlue}55`,
                    display: "inline-block",
                    margin: "0 0.25rem",
                  }} />
                )}
                <a
                  href={link.targetId ? `#${link.targetId}` : "#hero"}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.targetId); }}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "0.72rem",
                    letterSpacing: "0.18em",
                    color: `${C.freshSky}88`,
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.frozenWater; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = `${C.freshSky}88`; }}
                >
                  {link.label}
                </a>
              </span>
            ))}
          </nav>

          <span style={{
            fontFamily: "'Lora', serif",
            fontSize: "0.78rem",
            fontStyle: "italic",
            color: `${C.freshSky}55`,
          }}>
            built with care.
          </span>
        </div>
      </section>
    </>
  );
}