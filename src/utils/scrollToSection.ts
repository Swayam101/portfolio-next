/**
 * Scrolls to a section without changing the URL (no hash).
 * @param targetId - Section id (e.g. "about", "projects") or empty string for top of page
 */
export function scrollToSection(targetId: string) {
  if (!targetId || targetId === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(targetId);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
