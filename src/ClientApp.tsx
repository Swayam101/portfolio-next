"use client";

import dynamic from "next/dynamic";
import "@/lib/gsap"; // Register GSAP ScrollTrigger globally
import Loader from "@/components/ui/Loader";
import Header from "@/components/hero-section/Header";
import FloatingNav from "@/components/layout/FloatingNav";
import HeroSection from "@/sections/HeroSection";
import FooterCTA from "@/sections/FooterSection";

// Lazy-load below-the-fold sections — smaller initial bundle, animations run on mount
const AboutMeSection = dynamic(() => import("@/sections/AboutMeSection"), { ssr: true });
const CTASection = dynamic(() => import("@/sections/CTASection"), { ssr: true });
const ContactFormSection = dynamic(() => import("@/sections/ContactFormSection"), { ssr: true });
const ProjectsSection = dynamic(() => import("@/sections/ProjectsSection"), { ssr: true });
const WhyWorkWithMeSection = dynamic(() => import("@/sections/WhyWorkWithMeSection"), { ssr: true });

const ClientApp = () => {
  return (
    <>
      <Loader />
      <main className="overflow-x-hidden">
        <FloatingNav />
        <Header />
        <HeroSection />
        <AboutMeSection />
        <CTASection />
        <ContactFormSection />
        <ProjectsSection />
        <WhyWorkWithMeSection />
        <FooterCTA />
      </main>
    </>
  );
};

export default ClientApp;
