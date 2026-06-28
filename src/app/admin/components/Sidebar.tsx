"use client";

import type { View } from "../types";

interface Props {
  view: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: "dashboard" as View, label: "Posts", icon: "◻" },
  { id: "generate" as View, label: "Generate", icon: "⚡" },
  { id: "editor" as View, label: "Editor", icon: "✎" },
  { id: "series" as View, label: "Series", icon: "▤" },
];

export function Sidebar({ view, onNavigate, onLogout }: Props) {
  return (
    <aside
      style={{
        width: 240,
        background: "#111f2a",
        borderRight: "1px solid rgba(91,191,191,0.12)",
        padding: "24px 0",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <div style={{ padding: "0 20px", marginBottom: 32 }}>
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 20,
            letterSpacing: "0.14em",
            color: "#5bbfbf",
          }}
        >
          SWAYAM
        </div>
        <div
          style={{
            fontSize: 10,
            fontFamily: "monospace",
            letterSpacing: "0.12em",
            color: "#4a6a7a",
            marginTop: 2,
          }}
        >
          ADMIN PANEL
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "10px 20px",
              background: view === item.id ? "rgba(91,191,191,0.1)" : "transparent",
              border: "none",
              borderLeft:
                view === item.id ? "2px solid #5bbfbf" : "2px solid transparent",
              color: view === item.id ? "#5bbfbf" : "#6a8a9a",
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.15s",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(91,191,191,0.1)" }}>
        <a
          href="/blog"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            fontSize: 11,
            fontFamily: "monospace",
            letterSpacing: "0.1em",
            color: "#4a6a7a",
            textDecoration: "none",
            marginBottom: 8,
          }}
        >
          View Blog →
        </a>
        <button
          onClick={onLogout}
          style={{
            display: "block",
            fontSize: 11,
            fontFamily: "monospace",
            letterSpacing: "0.1em",
            color: "#cb6666",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
