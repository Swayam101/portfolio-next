"use client";

import React, { useState, useRef, useEffect } from "react";

const LANG_LABELS: Record<string, { short: string; long: string }> = {
    en: { short: "EN", long: "English" },
    hi: { short: "हि", long: "हिंदी" },
    hinglish: { short: "HG", long: "Hinglish" },
};

interface Props {
    current: "en" | "hi" | "hinglish";
    hasHindi: boolean;
    hasHinglish: boolean;
    onSelect: (lang: "en" | "hi" | "hinglish") => void;
    onOpenModal: () => void;
}

export function HeaderLangSwitcher({ current, hasHindi, hasHinglish, onSelect, onOpenModal }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const available = (["en", "hi", "hinglish"] as const).filter(code => {
        if (code === "en") return true;
        if (code === "hi") return hasHindi;
        if (code === "hinglish") return hasHinglish;
        return false;
    });

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const currentLabel = LANG_LABELS[current];

    return (
        <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
            <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        .hlang-item:hover { background: rgba(91,191,191,0.1) !important; color: #8dd9d9 !important; }
      `}</style>

            {/* Pill trigger */}
            <button
                onClick={() => setOpen(v => !v)}
                aria-label="Change reading language"
                aria-expanded={open}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 12px 5px 9px",
                    borderRadius: "999px",
                    background: open ? "rgba(91,191,191,0.16)" : "rgba(91,191,191,0.08)",
                    border: `1px solid ${open ? "rgba(91,191,191,0.4)" : "rgba(91,191,191,0.18)"}`,
                    cursor: "pointer",
                    transition: "background 0.15s, border-color 0.15s",
                    color: open ? "#8dd9d9" : "#5bbfbf",
                }}
                onMouseEnter={e => {
                    if (!open) {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(91,191,191,0.13)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(91,191,191,0.3)";
                    }
                }}
                onMouseLeave={e => {
                    if (!open) {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(91,191,191,0.08)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(91,191,191,0.18)";
                    }
                }}
            >
                {/* Globe icon */}
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M8 1c-2 2-3 4-3 7s1 5 3 7M8 1c2 2 3 4 3 7s-1 5-3 7" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M1 8h14" stroke="currentColor" strokeWidth="1.4" />
                </svg>

                <span style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    lineHeight: 1,
                }}>
                    {currentLabel.short}
                </span>

                {/* Chevron */}
                <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    style={{ flexShrink: 0, transition: "transform 0.18s", transform: open ? "rotate(180deg)" : "none" }}
                >
                    <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        background: "#0e1f2a",
                        border: "1px solid rgba(91,191,191,0.22)",
                        borderRadius: "12px",
                        padding: "6px",
                        minWidth: "148px",
                        boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
                        zIndex: 1000,
                        animation: "dropIn 0.16s cubic-bezier(0.34,1.2,0.64,1)",
                    }}
                >
                    {available.map(code => {
                        const isActive = current === code;
                        const meta = LANG_LABELS[code];
                        return (
                            <button
                                key={code}
                                className="hlang-item"
                                onClick={() => { onSelect(code); setOpen(false); }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    padding: "7px 10px",
                                    borderRadius: "7px",
                                    background: isActive ? "rgba(91,191,191,0.12)" : "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    color: isActive ? "#8dd9d9" : "#4a8a8a",
                                    fontFamily: code === "hi" ? "'Noto Sans Devanagari', serif" : "monospace",
                                    fontSize: "13px",
                                    fontWeight: isActive ? 700 : 500,
                                    letterSpacing: code === "hi" ? 0 : "0.06em",
                                    textAlign: "left",
                                    transition: "background 0.12s, color 0.12s",
                                }}
                            >
                                {meta.long}
                                {isActive && (
                                    <span style={{
                                        width: "6px",
                                        height: "6px",
                                        borderRadius: "50%",
                                        background: "#5bbfbf",
                                        boxShadow: "0 0 5px rgba(91,191,191,0.5)",
                                        display: "inline-block",
                                        flexShrink: 0,
                                    }} />
                                )}
                            </button>
                        );
                    })}

                    {/* Divider + open modal link */}
                    <div style={{
                        height: "1px",
                        background: "rgba(91,191,191,0.1)",
                        margin: "5px 4px",
                    }} />
                    <button
                        className="hlang-item"
                        onClick={() => { setOpen(false); onOpenModal(); }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: "7px",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#2a5a6a",
                            fontFamily: "monospace",
                            fontSize: "10px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            transition: "background 0.12s, color 0.12s",
                        }}
                    >
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 4v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Language guide
                    </button>
                </div>
            )}
        </div>
    );
}