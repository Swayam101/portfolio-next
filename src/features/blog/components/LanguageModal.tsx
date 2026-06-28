"use client";

import React, { useEffect, useRef } from "react";

interface Language {
    code: "en" | "hi" | "hinglish";
    label: string;
    sublabel: string;
    script: string;
}

const ALL_LANGUAGES: Language[] = [
    { code: "en", label: "English", sublabel: "Original", script: "A" },
    { code: "hi", label: "हिंदी", sublabel: "Hindi", script: "अ" },
    { code: "hinglish", label: "Hinglish", sublabel: "Roman Hindi", script: "Aa" },
];

interface Props {
    open: boolean;
    current: "en" | "hi" | "hinglish";
    hasHindi: boolean;
    hasHinglish: boolean;
    onSelect: (lang: "en" | "hi" | "hinglish") => void;
    onClose: () => void;
}

export function LanguageModal({ open, current, hasHindi, hasHinglish, onSelect, onClose }: Props) {
    const overlayRef = useRef<HTMLDivElement>(null);

    const available = ALL_LANGUAGES.filter(l => {
        if (l.code === "en") return true;
        if (l.code === "hi") return hasHindi;
        if (l.code === "hinglish") return hasHinglish;
        return false;
    });

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    // Trap scroll
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    if (!open) return null;

    return (
        <div
            ref={overlayRef}
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                background: "rgba(10, 20, 28, 0.82)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                animation: "fadeIn 0.18s ease",
            }}
        >
            <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(18px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        .lang-card:hover .lang-script { transform: scale(1.12); }
        .lang-card:focus-visible { outline: 2px solid #5bbfbf; outline-offset: 3px; }
      `}</style>

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Choose reading language"
                style={{
                    background: "#0e1f2a",
                    border: "1px solid rgba(91,191,191,0.22)",
                    borderRadius: "20px",
                    padding: "2.5rem 2rem 2rem",
                    maxWidth: "440px",
                    width: "100%",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(91,191,191,0.08) inset",
                    animation: "slideUp 0.22s cubic-bezier(0.34,1.2,0.64,1)",
                    position: "relative",
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        background: "rgba(91,191,191,0.08)",
                        border: "1px solid rgba(91,191,191,0.15)",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#4a8a8a",
                        cursor: "pointer",
                        fontSize: "14px",
                        lineHeight: 1,
                        transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(91,191,191,0.18)";
                        (e.currentTarget as HTMLButtonElement).style.color = "#8dd9d9";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(91,191,191,0.08)";
                        (e.currentTarget as HTMLButtonElement).style.color = "#4a8a8a";
                    }}
                >
                    ✕
                </button>

                {/* Header */}
                <div style={{ marginBottom: "1.75rem", textAlign: "center" }}>
                    <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 40% 40%, #1a4a5a, #0a1f2a)",
                        border: "1px solid rgba(91,191,191,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem",
                        fontSize: "20px",
                    }}>
                        🌐
                    </div>
                    <p style={{
                        fontFamily: "'Source Serif 4', Georgia, serif",
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#d4f0f0",
                        margin: "0 0 0.35rem",
                        letterSpacing: "-0.01em",
                    }}>
                        Choose your language
                    </p>
                    <p style={{
                        fontFamily: "monospace",
                        fontSize: "11px",
                        color: "#3a6a7a",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        margin: 0,
                    }}>
                        You can switch anytime while reading
                    </p>
                </div>

                {/* Language cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                    {available.map(lang => {
                        const isActive = current === lang.code;
                        return (
                            <button
                                key={lang.code}
                                className="lang-card"
                                onClick={() => { onSelect(lang.code); onClose(); }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    padding: "0.9rem 1.1rem",
                                    borderRadius: "12px",
                                    background: isActive
                                        ? "rgba(91,191,191,0.12)"
                                        : "rgba(255,255,255,0.03)",
                                    border: isActive
                                        ? "1px solid rgba(91,191,191,0.35)"
                                        : "1px solid rgba(255,255,255,0.06)",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    transition: "background 0.15s, border-color 0.15s, transform 0.12s",
                                    width: "100%",
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(91,191,191,0.07)";
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(91,191,191,0.2)";
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.06)";
                                    }
                                }}
                            >
                                {/* Script badge */}
                                <div
                                    className="lang-script"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "10px",
                                        background: isActive
                                            ? "rgba(91,191,191,0.18)"
                                            : "rgba(255,255,255,0.05)",
                                        border: `1px solid ${isActive ? "rgba(91,191,191,0.3)" : "rgba(255,255,255,0.08)"}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: lang.code === "hi" ? "18px" : "15px",
                                        fontWeight: 700,
                                        color: isActive ? "#5bbfbf" : "#3a6a7a",
                                        flexShrink: 0,
                                        transition: "transform 0.15s",
                                        fontFamily: lang.code === "hi" ? "serif" : "monospace",
                                    }}
                                >
                                    {lang.script}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: "15px",
                                        fontWeight: 600,
                                        color: isActive ? "#8dd9d9" : "#b8dede",
                                        fontFamily: lang.code === "hi" ? "'Noto Sans Devanagari', serif" : "'Source Serif 4', Georgia, serif",
                                        marginBottom: "2px",
                                    }}>
                                        {lang.label}
                                    </div>
                                    <div style={{
                                        fontSize: "11px",
                                        color: isActive ? "#4a9a9a" : "#2a5a6a",
                                        fontFamily: "monospace",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                    }}>
                                        {lang.sublabel}
                                    </div>
                                </div>

                                {/* Active indicator */}
                                {isActive && (
                                    <div style={{
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        background: "#5bbfbf",
                                        boxShadow: "0 0 6px rgba(91,191,191,0.6)",
                                        flexShrink: 0,
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}