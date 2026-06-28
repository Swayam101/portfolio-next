"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import BounceInScale from "../components/ui/BounceInScale";

export default function ContactFormSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const tl = gsap.fromTo(
      form,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: form, start: "top 85%" },
      }
    );
    return () => tl.scrollTrigger?.kill();
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
      className="relative w-full bg-[var(--frozen-water)] py-20 sm:py-28 px-6"
    >
      <div className="max-w-xl mx-auto">
        <BounceInScale as="h2" start="top 80%" duration={0.8} delay={0} className="text-3xl sm:text-4xl font-bold text-[var(--yale-blue)] mb-2 text-center">
          Send a message
        </BounceInScale>
        <BounceInScale as="p" start="top 80%" duration={0.8} delay={0.1} className="text-[var(--fresh-sky)] sn-pro text-center mb-10">
          Got a project in mind? Drop your details below.
        </BounceInScale>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          style={{ opacity: 0 }}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            required
            disabled={status === "sending"}
            className="w-full px-4 py-3 rounded-lg bg-white/80 border-[1.5px] border-[rgba(var(--pacific-blue-rgb),0.3)] text-[var(--yale-blue)] placeholder:text-[var(--fresh-sky)]/70 focus:border-[var(--pacific-blue)] focus:outline-none sn-pro transition-colors"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            required
            disabled={status === "sending"}
            className="w-full px-4 py-3 rounded-lg bg-white/80 border-[1.5px] border-[rgba(var(--pacific-blue-rgb),0.3)] text-[var(--yale-blue)] placeholder:text-[var(--fresh-sky)]/70 focus:border-[var(--pacific-blue)] focus:outline-none sn-pro transition-colors"
          />
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
            required
            rows={4}
            disabled={status === "sending"}
            className="w-full px-4 py-3 rounded-lg bg-white/80 border-[1.5px] border-[rgba(var(--pacific-blue-rgb),0.3)] text-[var(--yale-blue)] placeholder:text-[var(--fresh-sky)]/70 focus:border-[var(--pacific-blue)] focus:outline-none resize-none sn-pro transition-colors"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 w-full sm:w-auto sm:min-w-[200px] text-lg font-bold tracking-wide rounded-lg px-6 py-4
              bg-[var(--yale-blue)] text-[var(--pale-sky)]
              border-b-[4px] border-r-[3px] border-[var(--pacific-blue)]
              shadow-[2px_2px_0_var(--pacific-blue)]
              active:border-b-[2px] active:border-r-[2px]
              active:shadow-[1px_1px_0_var(--pacific-blue)]
              active:translate-x-[2px] active:translate-y-[2px]
              transition-all duration-75 cursor-pointer select-none
              hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "Sending…" : status === "success" ? "Sent!" : "Send"}
          </button>
          {status === "error" && (
            <p className="text-sm text-[var(--yale-blue)]/80">Something went wrong. Try <a href="mailto:swayamprajapat21@gmail.com" className="underline text-[var(--pacific-blue)]">emailing directly</a>.</p>
          )}
        </form>
      </div>
    </section>
  );
}
