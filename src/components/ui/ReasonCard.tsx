import { useState, useRef, useEffect, memo } from "react";
import type REASONS from "../../data/reasons-to-work";
import C from "../../constants/colors";
import AnimatedCounter from "./AnimatedCounter";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Reason = (typeof REASONS)[number];

interface CardProps {
  reason: Reason;
  index: number;
  isEven: boolean;
}

const ReasonCard = memo(function ReasonCard({ reason, index, isEven }: CardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
  
    useEffect(() => {
      const el = cardRef.current;
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        onEnter: () => setVisible(true),
      });
      return () => st.kill();
    }, []);
  
    return (
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: hovered ? C.paleSky : C.yaleBlue08,
          border: `1.5px solid ${hovered ? C.pacificBlue : C.pacificBlue + "44"}`,
          borderRadius: "3px",
          padding: "2rem 1.75rem 1.75rem",
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) rotate(0deg)"
            : `translateY(32px) rotate(${isEven ? 1.5 : -1.5}deg)`,
          transition: `opacity 0.65s ease ${index * 0.1}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s, background 0.3s ease, border-color 0.3s ease`,
          cursor: "default",
          overflow: "hidden",
        }}
      >
        {/* Corner fold */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "0",
          height: "0",
          borderStyle: "solid",
          borderWidth: `0 ${hovered ? "28px" : "20px"} ${hovered ? "28px" : "20px"} 0`,
          borderColor: `transparent ${hovered ? C.pacificBlue : C.pacificBlue + "66"} transparent transparent`,
          transition: "border-width 0.3s ease, border-color 0.3s ease",
        }} />
  
        {/* Giant background number */}
        <div style={{
          position: "absolute",
          bottom: "-0.75rem",
          right: "1rem",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "6rem",
          lineHeight: 1,
          color: `${C.pacificBlue}18`,
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: "-0.02em",
          transition: "color 0.3s ease",
        }}>
          {reason.num}
        </div>
  
        {/* Icon */}
        <div style={{
          fontFamily: "monospace",
          fontSize: "1.3rem",
          color: C.pacificBlue,
          marginBottom: "0.9rem",
          lineHeight: 1,
        }}>
          {reason.icon}
        </div>
  
        {/* Animated index number */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "0.72rem",
          letterSpacing: "0.2em",
          color: C.freshSky,
          marginBottom: "0.45rem",
        }}>
          <AnimatedCounter target={parseInt(reason.num)} trigger={visible} />
          {" / "}05
        </div>
  
        {/* Title */}
        <h3 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "2rem",
          letterSpacing: "0.05em",
          lineHeight: 1.1,
          color: C.yaleBlue,
          margin: "0 0 0.75rem",
          transition: "color 0.2s ease",
        }}>
          {reason.title}
        </h3>
  
        {/* Body */}
        <p
          className="sn-pro"
         style={{
          fontSize: "1rem",
          lineHeight: 1.72,
          color: `${C.yaleBlue}bb`,
          margin: 0,
          position: "relative",
          zIndex: 1,
        }}>
          {reason.body}
        </p>
  
        {/* Bottom accent line — draws in on hover */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          width: hovered ? "100%" : "0%",
          background: `linear-gradient(90deg, ${C.yaleBlue}, ${C.pacificBlue}, ${C.freshSky})`,
          transition: "width 0.5s cubic-bezier(0.22,1,0.36,1)",
        }} />
      </div>
    );
});

export default ReasonCard;