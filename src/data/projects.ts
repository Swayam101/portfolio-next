import type { Project } from "../types/project";

const MY_PROJECTS: Project[] = [
  {
    id: 1,
    slug: "fetchmate",
    title: "Fetchmate",
    description:
      "Two-sided pet care marketplace connecting pet owners with verified sitters. Features booking workflows, availability management, secure payments, and a lightweight merchandise storefront — built with a clean, frictionless UI.",
    tags: ["Next.js", "Node.js", "MongoDB", "Stripe", "Tailwind"],
    year: "2024",
    link: "https://fetch-mate-2-0.vercel.app",
    repo: "https://github.com",
    overview:
      "Fetchmate is a two-sided pet care marketplace that connects pet owners with verified sitters. The platform handles booking workflows, availability management, secure payments via Stripe, and a lightweight merchandise storefront. Built with Next.js and a clean, frictionless UI, it demonstrates full-stack e-commerce and marketplace patterns.",
    brief:
      "The client needed a platform where pet owners could find and book verified sitters, manage payments securely, and optionally purchase pet supplies. The challenge was balancing marketplace complexity with a simple user experience.",
    response:
      "Designed a modular architecture with separate flows for owners and sitters. Implemented Stripe for payments, MongoDB for flexible document storage, and a responsive UI that works across devices. Key decisions included using Next.js API routes for serverless backend logic and Tailwind for rapid UI development.",
    specs: "Full-stack web app • Next.js, Node.js, MongoDB, Stripe • 2024",
  },
  {
    id: 2,
    slug: "chatzapp",
    title: "ChatZapp",
    description:
      "Solana wallet-authenticated AI chat platform where users stake credits to interact with personality-driven agents. Combines LLM APIs, token-based credit systems, and lightweight Web3 integrations for on-chain identity.",
    tags: ["Solana", "Web3.js", "Node.js", "OpenAI API", "PostgreSQL"],
    year: "2024",
    link: "https://chatzapp-sage.vercel.app",
    repo: "https://github.com",
    overview:
      "ChatZapp is an AI chat platform that uses Solana wallet authentication. Users stake credits to interact with personality-driven agents powered by LLM APIs. The project combines token-based credit systems with lightweight Web3 integrations for on-chain identity verification.",
    brief:
      "The goal was to create an AI chat experience with Web3-native identity — no email signup, just wallet connect. Users needed a credit system to gate AI usage and a way to interact with distinct AI personalities.",
    response:
      "Integrated Solana wallet adapter for authentication, built a credit staking mechanism, and connected OpenAI API with custom system prompts per agent. PostgreSQL stores conversation history and user credits. The architecture separates Web3 logic from the chat layer for maintainability.",
    specs: "Web3 + AI • Solana, Web3.js, Node.js, OpenAI, PostgreSQL • 2024",
  },
  // {
  //   id: 3,
  //   slug: "attendance",
  //   title: "Attendance",
  //   description:
  //     "Employee attendance and workforce tracking system with role-based dashboards, real-time status monitoring, and exportable reporting for small to mid-sized teams.",
  //   tags: ["React", "Express", "MySQL", "JWT Auth", "REST API"],
  //   year: "2023",
  //   link: "https://example.com",
  //   repo: "https://github.com",
  //   overview:
  //     "Attendance is an employee attendance and workforce tracking system built for small to mid-sized teams. It features role-based dashboards, real-time status monitoring, and exportable reporting. The stack includes React, Express, MySQL, and JWT authentication.",
  //   brief:
  //     "A business needed a simple way to track employee attendance, check-in/check-out times, and generate reports. The system had to support different roles (admin, manager, employee) with appropriate permissions.",
  //   response:
  //     "Designed a REST API with Express and MySQL, JWT for stateless auth, and role-based access control. The React frontend provides dashboards per role with real-time updates. Export functionality supports CSV for payroll integration.",
  //   specs: "SaaS • React, Express, MySQL, JWT • 2023",
  // },
  {
    id: 4,
    slug: "eleve",
    title: "Eleve",
    description:
      "Minimal thrift-commerce platform focused on curated listings, inventory tracking, and streamlined checkout. Designed for fast performance and mobile-first browsing.",
    tags: ["Next.js", "Node.js", "MongoDB", "Stripe", "Vercel"],
    year: "2023",
    link: "https://ecomsamp.vercel.app",
    repo: "https://github.com",
    overview:
      "Eleve is a minimal thrift-commerce platform focused on curated listings, inventory tracking, and streamlined checkout. Built for fast performance and mobile-first browsing, it demonstrates modern e-commerce patterns with Next.js and Vercel.",
    brief:
      "The client wanted a lightweight thrift store platform — no heavy CMS, just curated listings, simple inventory, and a smooth checkout. Mobile-first was non-negotiable.",
    response:
      "Used Next.js for SSR and static optimization, MongoDB for flexible product data, Stripe for payments. Implemented image optimization, lazy loading, and a minimal UI that keeps focus on the products. Deployed on Vercel for edge performance.",
    specs: "E-commerce • Next.js, Node.js, MongoDB, Stripe, Vercel • 2023",
  },
];

export default MY_PROJECTS;