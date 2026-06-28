"use client";

import { SCHEMA_PROMPT } from "../constants";
import { S } from "../styles";

interface Props {
  input: string;
  onInputChange: (v: string) => void;
  onCopy: () => void;
  onUseInEditor: () => void;
}

export function GeneratorView({ input, onInputChange, onCopy, onUseInEditor }: Props) {
  const combined = `${SCHEMA_PROMPT}\n\n---\n\nBLOG CONTENT:\n\n${input}`;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={S.sectionTitle}>Generate Prompt</h1>
          <div style={S.muted}>Paste your content → combines with schema prompt → copy to use with any AI</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onUseInEditor} disabled={!input.trim()} style={{ ...S.btn, cursor: input.trim() ? "pointer" : "default", opacity: input.trim() ? 1 : 0.4 }}>
            OPEN IN EDITOR
          </button>
          <button onClick={onCopy} disabled={!input.trim()} style={{
            ...S.btnPrimary,
            background: input.trim() ? "#5bbfbf" : "rgba(91,191,191,0.15)",
            color: input.trim() ? "#0d1b24" : "#8aaab8",
            cursor: input.trim() ? "pointer" : "default",
          }}>
            COPY COMBINED
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, height: "calc(100vh - 200px)" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8aaab8", marginBottom: 8 }}>Your Content</div>
          <textarea
            value={input} onChange={(e) => onInputChange(e.target.value)}
            placeholder={`Paste your blog content here.\n\nThis can be:\n• A rough draft\n• Bullet-point outline\n• Stream-of-consciousness notes\n• A finished article\n\nIt will be combined with the YAML schema prompt on the right.`}
            style={{ flex: 1, padding: "16px 18px", background: "#0a151d", border: "1px solid rgba(91,191,191,0.12)", borderRadius: 4, color: "#d4f0f0", fontSize: 14, fontFamily: "'SN Pro', sans-serif", lineHeight: 1.7, resize: "none", outline: "none" }}
          />
          <div style={{ fontSize: 10, fontFamily: "monospace", color: "#4a6a7a", marginTop: 6, textAlign: "right" }}>{input.length} chars</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8aaab8", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            <span>Combined Prompt + Content</span>
            <span style={{ color: "#4a6a7a" }}>{combined.length} chars</span>
          </div>
          <textarea value={combined} readOnly
            style={{ flex: 1, padding: "16px 18px", background: "#0a151d", border: "1px solid rgba(91,191,191,0.12)", borderRadius: 4, color: "#d4f0f0", fontSize: 13, fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace", lineHeight: 1.7, resize: "none", outline: "none" }}
          />
          <div style={{ fontSize: 10, fontFamily: "monospace", color: "#4a6a7a", marginTop: 6 }}>
            Copy this and paste into any AI (ChatGPT, Claude, etc.) to get structured YAML
          </div>
        </div>
      </div>
    </>
  );
}
