"use client";

import { useState } from "react";

interface Props {
  onLogin: (apiKey: string) => void;
}

export function LoginScreen({ onLogin }: Props) {
  const [key, setKey] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1b24",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'SN Pro', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          padding: "2.5rem 2rem",
          background: "#1a2e3b",
          border: "1px solid rgba(91,191,191,0.2)",
          borderRadius: 8,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.6rem",
              letterSpacing: "0.14em",
              color: "#5bbfbf",
              marginBottom: 6,
            }}
          >
            ADMIN
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#6a8a9a",
              fontFamily: "monospace",
              letterSpacing: "0.08em",
            }}
          >
            Blog Management Panel
          </div>
        </div>

        <label
          style={{
            display: "block",
            fontSize: 10,
            fontFamily: "monospace",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8aaab8",
            marginBottom: 8,
          }}
        >
          API Key
        </label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && key.trim() && onLogin(key)}
          placeholder="Enter your API key"
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "#0d1b24",
            border: "1px solid rgba(91,191,191,0.25)",
            borderRadius: 4,
            color: "#d4f0f0",
            fontSize: 14,
            fontFamily: "monospace",
            outline: "none",
            marginBottom: 16,
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={() => key.trim() && onLogin(key)}
          style={{
            width: "100%",
            padding: "11px 0",
            background: "#5bbfbf",
            border: "none",
            borderRadius: 4,
            color: "#0d1b24",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 15,
            letterSpacing: "0.16em",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          ENTER
        </button>
      </div>
    </div>
  );
}
