export function parseInlineMarkdown(text: string): string {
  if (!text) return "";
  
  // Convert basic inline markdown to HTML
  return text
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic: *text* (excluding things inside strong tags by doing it carefully or relying on the simple regex)
    // To prevent matching inside URLs or existing HTML, we'll just do basic replacement
    .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    // Code: `text`
    .replace(/`(.*?)`/g, "<code class=\"font-mono bg-[#111f2a] text-[#5bbfbf] px-[4px] py-[2px] rounded-[3px] text-[0.9em] border border-[rgba(91,191,191,0.2)]\">$1</code>")
    // Links: [text](url)
    .replace(/\[(.*?)\]\((.*?)\)/g, "<a href=\"$2\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-[#5bbfbf] underline decoration-[rgba(91,191,191,0.3)] underline-offset-4 hover:decoration-[#5bbfbf] transition-colors\">$1</a>");
}
