import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (frameRef.current) clearTimeout(frameRef.current);
    if (!trigger) {
      setDisplay(text);
      return;
    }
    let iteration = 0;
    const total = text.length * 2.5;
    function step() {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration / 2.5) return char.toUpperCase();
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      iteration++;
      if (iteration <= total) frameRef.current = setTimeout(step, 28);
    }
    step();
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [trigger, text]);

  return display;
}
