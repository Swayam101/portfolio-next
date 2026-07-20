"use client";

import { useMemo, useState, useCallback } from "react";
import { load as yamlLoad } from "js-yaml";
import type { AdminImage } from "../types";

interface Props {
  yaml: string;
  onYamlChange: (v: string) => void;
}

export function extractImages(raw: string): AdminImage[] {
  let data: Record<string, unknown>;
  try {
    data = yamlLoad(raw) as Record<string, unknown>;
  } catch {
    return [];
  }
  if (!data || typeof data !== "object") return [];

  const sections = (data.SECTIONS ?? []) as Record<string, unknown>[];
  const images: AdminImage[] = [];
  let fig = 0;

  for (const item of sections) {
    const sec = (item as Record<string, unknown>).SECTION as Record<string, unknown>;
    if (!sec) continue;
    const secNum = (sec.NUM as string) ?? "?";
    const secTitle = (sec.TITLE as string) ?? "";
    const components = (sec.COMPONENTS ?? []) as Record<string, unknown>[];

    for (const comp of components) {
      let img: Record<string, unknown> | null = null;

      if (typeof comp === "object" && comp !== null) {
        const c = comp as Record<string, unknown>;
        if (typeof c.type === "string" && c.type.toUpperCase() === "IMAGE") {
          img = c;
        } else {
          const key = Object.keys(c).find((k) => k.toUpperCase() === "IMAGE");
          if (key) img = (c[key] ?? {}) as Record<string, unknown>;
        }
      }

      if (!img) continue;
      fig++;

      images.push({
        figureNum: fig,
        sectionNum: secNum,
        sectionTitle: secTitle,
        TITLE: ((img.CAPTION ?? img.TITLE) as string) ?? "",
        DESCRIPTION: (img.DESCRIPTION as string) ?? "",
        ASPECT: ((img.ASPECT as string) ?? "wide") as AdminImage["ASPECT"],
        PLACEMENT: ((img.PLACEMENT as string) ?? "end_of_section") as AdminImage["PLACEMENT"],
        SRC: (img.SRC as string) ?? "",
      });
    }
  }

  return images;
}

function replaceSrcInYaml(yaml: string, oldTitle: string, newSrc: string): string {
  const lines = yaml.split("\n");
  let inTargetComponent = false;
  let foundTitle = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes("IMAGE:") && !line.trim().startsWith("-")) {
      inTargetComponent = false;
      foundTitle = false;
    }

    if (line.includes("- IMAGE:") || line.includes("type: \"IMAGE\"") || line.includes("type: 'IMAGE'")) {
      inTargetComponent = true;
      foundTitle = false;
    }

    if (inTargetComponent && (line.includes("TITLE:") || line.includes("CAPTION:")) && line.includes(oldTitle)) {
      foundTitle = true;
    }

    if (foundTitle && line.trim().startsWith("SRC:")) {
      const indent = line.match(/^(\s*)/)?.[1] ?? "";
      lines[i] = `${indent}SRC: "${newSrc}"`;
      return lines.join("\n");
    }
  }

  return yaml;
}

function ImageCard({
  image,
  onSrcChange,
}: {
  image: AdminImage;
  onSrcChange: (newSrc: string) => void;
}) {
  const [inputValue, setInputValue] = useState(image.SRC);
  const [uploading, setUploading] = useState(false);
  const hasRealUrl = image.SRC && !image.SRC.includes("placeholder");
  const hasInputValue = inputValue && !inputValue.includes("placeholder");

  const handleBlur = useCallback(() => {
    if (inputValue !== image.SRC) {
      onSrcChange(inputValue);
    }
  }, [inputValue, image.SRC, onSrcChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (inputValue !== image.SRC) {
          onSrcChange(inputValue);
        }
        (e.target as HTMLInputElement).blur();
      }
    },
    [inputValue, image.SRC, onSrcChange]
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/blog/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setInputValue(data.url);
      onSrcChange(data.url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        background: "#111f2a",
        border: "1px solid rgba(91,191,191,0.1)",
        borderRadius: 6,
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(91,191,191,0.25)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(91,191,191,0.1)";
      }}
    >
      <div style={{ display: "flex", gap: 0 }}>
        {/* Thumbnail */}
        <div
          style={{
            width: 160,
            minHeight: 120,
            flexShrink: 0,
            background: hasRealUrl ? "transparent" : "#0d1b24",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid rgba(91,191,191,0.08)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {hasRealUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.SRC}
              alt={image.TITLE}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                inset: 0,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "rgba(91,191,191,0.08)",
                  border: "1px dashed rgba(91,191,191,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                  fontSize: 18,
                  color: "#4a6a7a",
                }}
              >
                🖼
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: "#4a6a7a", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                No image set
              </div>
            </div>
          )}
          {/* Figure badge */}
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              padding: "2px 8px",
              background: "rgba(13,27,36,0.85)",
              borderRadius: 3,
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.1em",
              color: "#5bbfbf",
              backdropFilter: "blur(4px)",
            }}
          >
            Fig. {image.figureNum}
          </div>
        </div>

        {/* Details */}
        <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          {/* Caption label + title */}
          <div>
            <span style={{
              fontSize: 9, fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase",
              color: "#5bbfbf", display: "block", marginBottom: 4,
            }}>
              Caption
            </span>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#d4f0f0", lineHeight: 1.3, wordBreak: "break-word" }}>
              {image.TITLE || <span style={{ color: "#cb6666", fontStyle: "italic" }}>(no caption set)</span>}
            </div>
          </div>

          {/* Description */}
          {image.DESCRIPTION && (
            <div>
              <span style={{
                fontSize: 9, fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase",
                color: "#5bbfbf", display: "block", marginBottom: 4,
              }}>
                Description
              </span>
              <div style={{ fontSize: 13, color: "#b8dede", lineHeight: 1.4, wordBreak: "break-word" }}>
                {image.DESCRIPTION}
              </div>
            </div>
          )}

          {/* Badges row */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span
              style={{
                padding: "2px 7px",
                borderRadius: 3,
                background: "rgba(91,191,191,0.08)",
                border: "1px solid rgba(91,191,191,0.15)",
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#8aaab8",
              }}
            >
              {image.ASPECT}
            </span>
            <span
              style={{
                padding: "2px 7px",
                borderRadius: 3,
                background: "rgba(91,191,191,0.08)",
                border: "1px solid rgba(91,191,191,0.15)",
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#8aaab8",
              }}
            >
              {image.PLACEMENT.replace("_", " ")}
            </span>
            <span
              style={{
                padding: "2px 7px",
                borderRadius: 3,
                background: "rgba(91,191,191,0.08)",
                border: "1px solid rgba(91,191,191,0.15)",
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.08em",
                color: "#5bbfbf",
              }}
            >
              § {image.sectionNum} — {image.sectionTitle}
            </span>
          </div>

          {/* SRC input */}
          <div style={{ marginTop: "auto" }}>
            <label
              style={{
                display: "block",
                fontSize: 9,
                fontFamily: "monospace",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8aaab8",
                marginBottom: 4,
              }}
            >
              Image URL
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com/image.jpg"
                style={{
                  flex: 1,
                  padding: "7px 10px",
                  background: "#0d1b24",
                  border: `1px solid ${hasInputValue ? "rgba(91,191,191,0.3)" : "rgba(91,191,191,0.12)"}`,
                  borderRadius: 3,
                  color: hasInputValue ? "#d4f0f0" : "#4a6a7a",
                  fontSize: 12,
                  fontFamily: "monospace",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(91,191,191,0.5)";
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.borderColor = hasInputValue
                    ? "rgba(91,191,191,0.3)"
                    : "rgba(91,191,191,0.12)";
                }}
              />
              <label style={{
                padding: "7px 12px", background: "rgba(91,191,191,0.1)",
                border: "1px solid rgba(91,191,191,0.2)", borderRadius: 3,
                color: "#5bbfbf", fontSize: 11, fontFamily: "monospace", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", minWidth: 80
              }}>
                {uploading ? "..." : "Upload"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ImageManager({ yaml, onYamlChange }: Props) {
  const images = useMemo(() => extractImages(yaml), [yaml]);

  const handleSrcChange = useCallback(
    (figureNum: number, newSrc: string) => {
      const image = images.find((img) => img.figureNum === figureNum);
      if (!image) return;
      const updated = replaceSrcInYaml(yaml, image.TITLE, newSrc);
      if (updated !== yaml) {
        onYamlChange(updated);
      }
    },
    [yaml, onYamlChange, images]
  );

  if (images.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#4a6a7a" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: "rgba(91,191,191,0.06)",
            border: "1px dashed rgba(91,191,191,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: 24,
          }}
        >
          🖼
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: "0.12em", color: "#6a8a9a", marginBottom: 8 }}>
          NO IMAGES FOUND
        </div>
        <div style={{ fontSize: 12, fontFamily: "monospace", lineHeight: 1.6, maxWidth: 360, margin: "0 auto" }}>
          Add images using the Quick Insert toolbar in the YAML Editor tab.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "4px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 12, fontFamily: "monospace", color: "#8aaab8" }}>
          {images.length} image{images.length !== 1 ? "s" : ""} in this post
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(() => {
            const placed = images.filter((img) => img.SRC && !img.SRC.includes("placeholder")).length;
            const remaining = images.length - placed;
            return (
              <>
                <span style={{ fontSize: 10, fontFamily: "monospace", color: "#5bbfbf" }}>
                  {placed} placed
                </span>
                {remaining > 0 && (
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: "#cb6666" }}>
                    {remaining} placeholder{remaining !== 1 ? "s" : ""}
                  </span>
                )}
              </>
            );
          })()}
        </div>
      </div>
      {images.map((img) => (
        <ImageCard key={img.figureNum} image={img} onSrcChange={(src) => handleSrcChange(img.figureNum, src)} />
      ))}
    </div>
  );
}
