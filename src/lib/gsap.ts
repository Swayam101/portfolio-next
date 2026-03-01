import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger once at app init — required for scroll-based animations
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
