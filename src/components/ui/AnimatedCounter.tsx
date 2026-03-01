import { useState,useRef,useEffect } from "react";

const AnimatedCounter=({ target, trigger }: { target: number; trigger: boolean }) =>{
    const [val, setVal] = useState(0);
    const raf = useRef<number | null>(null);
    const start = useRef<number | null>(null);
  
    useEffect(() => {
      if (!trigger) return;
      start.current = null;
      function tick(now: number) {
        if (!start.current) start.current = now;
        const t = Math.min((now - start.current) / 900, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setVal(Math.round(ease * target));
        if (t < 1) raf.current = requestAnimationFrame(tick);
      }
      raf.current = requestAnimationFrame(tick);
      return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    }, [trigger, target]);
  
    return <span>{String(val).padStart(2, "0")}</span>;
  }

  export default AnimatedCounter