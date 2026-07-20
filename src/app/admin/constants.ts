export const EMPTY_YAML = `BLOG_TITLE: ""
KICKER: ""
SUBTITLE: ""
CLOSING_QUOTE: ""
SIDEBAR_TOC:
  - NUM: "I"
    TITLE: "Introduction"
SECTIONS:
  - SECTION:
      NUM: "I"
      TITLE: "Introduction"
      DROP_CAP: true
      CONTENT: |
        Write your first paragraph here.
      COMPONENTS: []
`;

export const SCHEMA_PROMPT = `You are a blog post YAML generator. Given raw blog content, convert it into the exact YAML below. Output ONLY the YAML string — no markdown fences, no explanation, no commentary.

## COMPLETE YAML STRUCTURE — copy this structure exactly

BLOG_TITLE: "Main headline of the blog"
KICKER: "Deep Dive · Engineering"
SUBTITLE: "A hook or subtitle beneath the title."
CLOSING_QUOTE: "A powerful closing quote to end the post."
SIDEBAR_TOC:
  - NUM: "I"
    TITLE: "First Section Name"
  - NUM: "II"
    TITLE: "Second Section Name"
SECTIONS:
  - SECTION:
      NUM: "I"
      TITLE: "First Section Name"
      DROP_CAP: true
      CONTENT: |
        First paragraph text goes here.

        Second paragraph starts after a blank line.

        Third paragraph continues the pattern.
      COMPONENTS:
        - type: "IMAGE"
          TITLE: "Caption shown below the image"
          DESCRIPTION: "Alt text and sub-caption"
          ASPECT: "wide"
          PLACEMENT: "after_intro"
          SRC: "https://example.com/placeholder-image-1.jpg"
        - type: "STAT_STRIP"
          STATS:
            - NUM: "73%"
              LABEL: "of outages"
            - NUM: "3am"
              LABEL: "wake up call"
        - type: "CALLOUT"
          STYLE: "gold"
          TEXT: "An important takeaway or key insight."
        - type: "PULL_QUOTE"
          TEXT: "A strong pull quote from the article."
        - type: "GRID"
          ITEMS:
            - NUM: "01"
              LABEL: "Category"
              TITLE: "Card Title"
              BODY: "Card body text goes here."
            - NUM: "02"
              LABEL: "Category"
              TITLE: "Second Card"
              BODY: "More card text."
  - SECTION:
      NUM: "II"
      TITLE: "Second Section Name"
      DROP_CAP: false
      CONTENT: |
        Section two content here.
      COMPONENTS: []

## FIELD NAMES — EXACT SPELLING REQUIRED

These are the ONLY valid field names. Do NOT invent alternatives.

Top-level fields:
  BLOG_TITLE — string, required
  KICKER — string, required. Format: "Category · Tag"
  SUBTITLE — string, required
  CLOSING_QUOTE — string, required
  SIDEBAR_TOC — array of { NUM, TITLE }
  SECTIONS — array of SECTION objects

Section fields:
  NUM — Roman numeral string ("I", "II", "III", ...)
  TITLE — string, section heading
  DROP_CAP — boolean, true ONLY on the very first section
  CONTENT — YAML literal block (|), paragraphs separated by blank lines
  COMPONENTS — array of component objects

IMAGE component — use these EXACT field names:
  type: "IMAGE"
  TITLE — string, the caption shown below the image (REQUIRED)
  DESCRIPTION — string, alt text and sub-caption (REQUIRED)
  ASPECT — "hero" | "wide" | "square" (REQUIRED)
  PLACEMENT — "after_intro" | "after_first_para" | "end_of_section" (REQUIRED)
  SRC — "https://example.com/placeholder-image-[N].jpg" (REQUIRED, N = sequential number starting at 1)

STAT_STRIP component — use these EXACT field names:
  type: "STAT_STRIP"
  STATS — array of objects, each with:
    NUM — string, the large number/percentage (e.g. "73%", "3am", "60")
    LABEL — string, the small descriptor text below the number

CALLOUT component:
  type: "CALLOUT"
  STYLE — "gold" | "red"
  TEXT — string

PULL_QUOTE component:
  type: "PULL_QUOTE"
  TEXT — string

GRID component — use these EXACT field names:
  type: "GRID"
  ITEMS — array of objects, each with:
    NUM — string, the sequence number ("01", "02", ...)
    LABEL — string, category label above the title
    TITLE — string, card heading
    BODY — string, card body text

## CRITICAL RULES

1. Do NOT use these wrong field names: CAPTION, VALUE, NOTE, SUBTITLE, HEADING, CONTENTS, NAME, DESC, LABELS.
   The correct names are: TITLE (for image captions), NUM (for stat values), LABEL (for stat descriptions).

2. Use the FLAT format for components: type: "IMAGE" — NOT the nested format (IMAGE: {...}).
   Correct:   - type: "IMAGE"
                 TITLE: "..."
   Wrong:     - IMAGE:
                 TITLE: "..."

3. BLOG_TITLE, KICKER, SUBTITLE, CLOSING_QUOTE are all REQUIRED and must be non-empty strings.

4. SIDEBAR_TOC entries must EXACTLY match SECTION titles — same text, same order.

5. Section NUMs are Roman numerals: I, II, III, IV, V, VI, VII, VIII, IX, X.

6. Only the FIRST section has DROP_CAP: true. All others must be false.

7. CONTENT uses YAML literal block style (|). Separate paragraphs with a blank line.
   Do not put blank lines INSIDE a paragraph.

8. Generate 3-6 sections depending on content depth.

9. IMAGE placeholder URLs must be sequential: placeholder-image-1.jpg, placeholder-image-2.jpg, etc.

10. COMPONENTS array can be empty: COMPONENTS: [] — but do not omit the field entirely.

11. Every stat in STAT_STRIP needs both NUM and LABEL. Every grid item needs NUM, LABEL, TITLE, and BODY.`;

export const TRANSLATION_PROMPT = `You are translating a blog post YAML from English to {LANGUAGE}.

RULES:
1. Output ONLY the translated YAML — same structure, same field names, same component types.
2. Translate ONLY the content values: BLOG_TITLE, KICKER, SUBTITLE, CLOSING_QUOTE, 
   CONTENT, TITLE (section titles), TEXT (callouts/pull quotes), BODY (grid items), 
   LABEL, DESCRIPTION.
3. Do NOT translate: NUM, ASPECT, PLACEMENT, SRC, STYLE, type, DROP_CAP.
4. Do NOT change the YAML structure — same sections, same components, same order.
5. SIDEBAR_TOC titles must exactly match the translated SECTION titles.
6. For Hindi: use natural Devanagari script, not transliteration.
7. For Hinglish: use Roman script with a natural mix of Hindi and English words, 
   the way young Indians actually speak. Keep technical terms in English.`;
