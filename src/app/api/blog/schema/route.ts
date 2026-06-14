import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const blogContent: string = body?.content;

    if (!blogContent || typeof blogContent !== "string" || !blogContent.trim()) {
      return NextResponse.json(
        { error: "Missing required field: content" },
        { status: 400 }
      );
    }

    const schemaPath = path.join(process.cwd(), "BLOG_SCHEMA.md");
    const schemaContent = fs.readFileSync(schemaPath, "utf8");

    const systemPrompt = `You are a strict YAML transformer.

Your task is to convert a given blog article into the EXACT YAML schema provided.

You are NOT writing a new blog.
You are restructuring EXISTING content.

---

CRITICAL RULES

- Output ONLY raw YAML
- DO NOT wrap in markdown
- DO NOT add explanations
- DO NOT invent new ideas or content
- Preserve the original meaning and tone
- You MAY rewrite slightly for clarity and structure

---

TRANSFORMATION RULES

1. Extract metadata:
   - BLOG_TITLE → from blog title
   - SUBTITLE → from intro or create concise hook if missing
   - TAGS → infer from topic
   - READ_TIME → estimate (e.g. 5 min read)
   - DATE → use generic if missing (e.g. June 2025)

2. Structure the content:
   - Break into 3–6 logical sections
   - Each section must have:
     - NUM (Roman numerals)
     - TITLE (derived from content)
     - CONTENT (cleaned paragraphs)

3. First section:
   - DROP_CAP: true

4. Other sections:
   - DROP_CAP: false

---

COMPONENT INSERTION RULES

You MUST enrich the blog with components where appropriate:

- IMAGE → add at least 1
- STAT_STRIP → if any numbers/data exist (or infer lightly)
- GRID → for grouped ideas or lists
- CALLOUT → highlight key insight
- PULL_QUOTE → extract strong sentence

---

IMAGE RULES

- Use placeholder URLs only:
  https://example.com/placeholder-image-[N].jpg
- Increment N (1, 2, 3...)

---

CONTENT FORMATTING

- Use | for multiline CONTENT
- Keep paragraphs clean and readable
- Separate paragraphs with a blank line
- Remove markdown formatting if present

---

SIDEBAR_TOC RULES

- Must match section titles exactly
- Use Roman numerals

---

VALIDATION CHECK (MANDATORY)

Ensure:
- YAML is valid
- indentation is correct
- No missing required fields
- Arrays are properly formatted

---

SCHEMA (FOLLOW EXACTLY)

${schemaContent}

---

Now transform the following blog content into this YAML format:

--- BLOG CONTENT START ---

${blogContent.trim()}

--- BLOG CONTENT END ---`;

    return NextResponse.json({
      prompt: systemPrompt,
      schema: schemaContent,
    });
  } catch (error) {
    console.error("Error in /api/blog-prompt:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}