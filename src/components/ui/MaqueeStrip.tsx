const C = {
  pacificBlue: "#62b6cb",
  yaleBlue: "#1b4965",
  frozenWater: "#bee9e8",
};

export default function MarqueeStrip() {
    const text = "WHY WORK WITH ME  ·  WHY WORK WITH ME  ·  WHY WORK WITH ME  ·  ";
    return (
      <div style={{
        overflow: "hidden",
        borderTop: `1.5px solid ${C.pacificBlue}55`,
        borderBottom: `1.5px solid ${C.pacificBlue}55`,
        padding: "0.6rem 0",
        background: C.yaleBlue,
        marginBottom: "5rem",
        position: "relative",
      }}>
        <div style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "marquee 18s linear infinite",
        }}>
          {[0, 1].map((k) => (
            <span key={k} style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1rem",
              letterSpacing: "0.25em",
              color: C.frozenWater,
              paddingRight: "2rem",
            }}>
              {text}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    );
  }