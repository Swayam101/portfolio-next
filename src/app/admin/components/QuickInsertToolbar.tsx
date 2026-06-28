"use client";

interface Props {
  onInsert: (text: string) => void;
}

const SECTION_TEMPLATE = `
  - SECTION:
      NUM: "II"
      TITLE: "Section Title"
      DROP_CAP: false
      CONTENT: |
        Write your paragraphs here.

        Separate paragraphs with blank lines.
      COMPONENTS: []`;

const CALLOUT_GOLD = `
        - CALLOUT:
            STYLE: "gold"
            TEXT: "Your callout text here."`;

const CALLOUT_RED = `
        - CALLOUT:
            STYLE: "red"
            TEXT: "Your callout text here."`;

const PULL_QUOTE = `
        - PULL_QUOTE:
            TEXT: "Your pull quote here."`;

const IMAGE = `
        - IMAGE:
            TITLE: "Image caption"
            DESCRIPTION: "Short description"
            ASPECT: "wide"
            PLACEMENT: "end_of_section"
            SRC: "https://example.com/placeholder-image-1.jpg"`;

const STAT_STRIP = `
        - STAT_STRIP:
            STATS:
              - NUM: "73%"
                LABEL: "Description of stat"
              - NUM: "10x"
                LABEL: "Another stat"`;

const GRID = `
        - GRID:
            ITEMS:
              - NUM: "01"
                LABEL: "Category"
                TITLE: "Card Title"
                BODY: "Card body text."`;

const SIDEBAR_ENTRY = `
  - NUM: "II"
    TITLE: "New Section"`;

const BUTTON_BASE: React.CSSProperties = {
  padding: "5px 10px",
  background: "rgba(91,191,191,0.08)",
  border: "1px solid rgba(91,191,191,0.2)",
  borderRadius: 3,
  color: "#8aaab8",
  fontSize: 10,
  fontFamily: "monospace",
  letterSpacing: "0.08em",
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
  transition: "all 0.15s",
};

const GROUP_LABEL: React.CSSProperties = {
  fontSize: 9,
  fontFamily: "monospace",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "#4a6a7a",
  marginRight: 4,
  alignSelf: "center",
};

export function QuickInsertToolbar({ onInsert }: Props) {
  const items = [
    { label: "+ Section", value: SECTION_TEMPLATE, group: "Structure" },
    { label: "+ Sidebar TOC", value: SIDEBAR_ENTRY, group: "Structure" },
    { label: "Callout", value: CALLOUT_GOLD, group: "Components" },
    { label: "Callout (red)", value: CALLOUT_RED, group: "Components" },
    { label: "Pull Quote", value: PULL_QUOTE, group: "Components" },
    { label: "Image", value: IMAGE, group: "Components" },
    { label: "Stats", value: STAT_STRIP, group: "Components" },
    { label: "Grid", value: GRID, group: "Components" },
  ];

  let lastGroup = "";

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
      {items.map((item) => {
        const showGroup = item.group !== lastGroup;
        lastGroup = item.group;
        return (
          <span key={item.label} style={{ display: "contents" }}>
            {showGroup && <span style={GROUP_LABEL}>{item.group}</span>}
            <button
              onClick={() => onInsert(item.value)}
              style={BUTTON_BASE}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(91,191,191,0.18)";
                e.currentTarget.style.color = "#5bbfbf";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(91,191,191,0.08)";
                e.currentTarget.style.color = "#8aaab8";
              }}
            >
              {item.label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
