"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { trackMixpanel } from "@/lib/mixpanel";

export default function ContactFormSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const form = formRef.current;
    const section = sectionRef.current;
    if (!form || !section) return;

    // Animate form on scroll
    gsap.fromTo(
      form,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { 
          trigger: section, 
          start: "top 80%" 
        },
      }
    );
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        
        // Track lead generation - GA4
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'generate_lead', {
            form_id: 'contact_form',
            form_name: 'Portfolio Contact',
          });
        }

        // Track lead generation - Mixpanel
        trackMixpanel('Generate Lead', {
          source: 'form',
          form_id: 'contact_form',
          form_name: 'Portfolio Contact',
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact-form"
      ref={sectionRef}
      className="relative w-full bg-[var(--frozen-water)] py-16 sm:py-20 px-6"
    >
      <div className="max-w-2xl mx-auto">
        {/* Personal Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-mono text-[var(--fresh-sky)] tracking-wider">
              INBOX OPEN
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--yale-blue)] mb-3">
            Drop me a line
          </h2>
          <p className="text-base sm:text-lg text-[var(--yale-blue)]/70 sn-pro max-w-md mx-auto">
            Messages go straight to my inbox. I typically reply within 24 hours.
          </p>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-5"
          style={{ opacity: 0 }}
        >
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--yale-blue)] mb-2 sn-pro">
              Your name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              disabled={status === "sending"}
              className="w-full px-4 py-3.5 rounded-lg bg-white border-2 border-[var(--pacific-blue)]/20 
                text-[var(--yale-blue)] placeholder:text-[var(--fresh-sky)]/50 
                focus:border-[var(--pacific-blue)] focus:ring-2 focus:ring-[var(--pacific-blue)]/20 
                focus:outline-none sn-pro transition-all disabled:opacity-60"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--yale-blue)] mb-2 sn-pro">
              Your email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
              disabled={status === "sending"}
              className="w-full px-4 py-3.5 rounded-lg bg-white border-2 border-[var(--pacific-blue)]/20 
                text-[var(--yale-blue)] placeholder:text-[var(--fresh-sky)]/50 
                focus:border-[var(--pacific-blue)] focus:ring-2 focus:ring-[var(--pacific-blue)]/20 
                focus:outline-none sn-pro transition-all disabled:opacity-60"
            />
          </div>

          {/* Message Input */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[var(--yale-blue)] mb-2 sn-pro">
              What's on your mind?
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Tell me about your project..."
              value={formData.message}
              onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
              required
              rows={5}
              disabled={status === "sending"}
              className="w-full px-4 py-3.5 rounded-lg bg-white border-2 border-[var(--pacific-blue)]/20 
                text-[var(--yale-blue)] placeholder:text-[var(--fresh-sky)]/50 
                focus:border-[var(--pacific-blue)] focus:ring-2 focus:ring-[var(--pacific-blue)]/20 
                focus:outline-none resize-none sn-pro transition-all disabled:opacity-60"
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full sm:w-auto text-lg font-bold tracking-wide rounded-lg px-8 py-4
                bg-[var(--yale-blue)] text-[var(--pale-sky)]
                border-b-[4px] border-r-[3px] border-[var(--pacific-blue)]
                shadow-[2px_2px_0_var(--pacific-blue)]
                active:border-b-[2px] active:border-r-[2px]
                active:shadow-[1px_1px_0_var(--pacific-blue)]
                active:translate-x-[2px] active:translate-y-[2px]
                transition-all duration-75 cursor-pointer select-none
                hover:brightness-110 hover:scale-105
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {status === "sending" ? "Sending..." : status === "success" ? "Sent! ✓" : "Send Message →"}
            </button>

            {/* Alternative contact */}
            <a 
              href="mailto:swayamprajapat21@gmail.com"
              className="text-sm text-[var(--fresh-sky)] hover:text-[var(--pacific-blue)] 
                underline underline-offset-2 transition-colors sn-pro"
            >
              or email directly
            </a>
          </div>

          {/* Success Message */}
          {status === "success" && (
            <div className="p-4 rounded-lg bg-emerald-50 border-2 border-emerald-200 text-center">
              <p className="text-emerald-700 font-medium sn-pro">
                ✓ Message received! I'll get back to you soon.
              </p>
            </div>
          )}

          {/* Error Message */}
          {status === "error" && (
            <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200 text-center">
              <p className="text-red-700 sn-pro">
                Something went wrong. Try{" "}
                <a href="mailto:swayamprajapat21@gmail.com" className="underline font-medium">
                  emailing me directly
                </a>
                .
              </p>
            </div>
          )}
        </form>

        {/* Trust indicators */}
        <div className="mt-10 pt-8 border-t border-[var(--pacific-blue)]/20">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--yale-blue)]/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="sn-pro">Spam-free</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="sn-pro">Reply within 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="sn-pro">Secure & private</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
