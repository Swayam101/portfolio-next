export const S = {
  input: {
    width: "100%",
    padding: "9px 14px",
    background: "#0d1b24",
    border: "1px solid rgba(91,191,191,0.18)",
    borderRadius: 4,
    color: "#d4f0f0",
    fontSize: 14,
    fontFamily: "monospace",
    outline: "none",
  } as React.CSSProperties,

  label: {
    display: "block",
    fontSize: 10,
    fontFamily: "monospace",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#8aaab8",
    marginBottom: 6,
  } as React.CSSProperties,

  btn: {
    padding: "9px 18px",
    background: "rgba(91,191,191,0.12)",
    border: "1px solid rgba(91,191,191,0.3)",
    borderRadius: 4,
    color: "#5bbfbf",
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 13,
    letterSpacing: "0.1em",
    cursor: "pointer" as const,
  } as React.CSSProperties,

  btnPrimary: {
    padding: "9px 22px",
    background: "#5bbfbf",
    border: "none",
    borderRadius: 4,
    color: "#0d1b24",
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 14,
    letterSpacing: "0.12em",
    cursor: "pointer" as const,
  } as React.CSSProperties,

  sectionTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 28,
    letterSpacing: "0.08em",
    color: "#d4f0f0",
    margin: 0,
  } as React.CSSProperties,

  muted: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#4a6a7a",
    marginTop: 4,
  } as React.CSSProperties,
} as const;
