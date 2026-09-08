import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";

export const viewport: Viewport = {
  themeColor: "#1b4965",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.swayam.cyou"),
  title: {
    default: "Full-Stack Developer — Web, Mobile & Backend | Swayam",
    template: "%s | Swayam",
  },
  description:
    "Hire a full-stack developer with 3 years of experience. I build clean, fast web software from frontend to backend. Clean architecture, sharp execution. Let's talk.",
  keywords: [
    "Swayam",
    "full-stack developer",
    "freelance developer",
    "web developer",
    "React",
    "Next.js",
    "software engineer",
  ],
  authors: [{ name: "Swayam" }],
  openGraph: {
    type: "website",
    title: "Full-Stack Developer — Web, Mobile & Backend | Swayam",
    description:
      "Hire a full-stack developer with 3 years of experience. I build clean, fast web software from frontend to backend. Clean architecture, sharp execution.",
    url: "https://www.swayam.cyou",
    siteName: "Swayam",
    locale: "en_US",
    images: [
      {
        url: "/astronaut.webp",
        width: 1200,
        height: 630,
        alt: "Swayam Prajapat — Full-stack developer portfolio",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full-Stack Developer — Web, Mobile & Backend | Swayam",
    description:
      "Hire a full-stack developer with 3 years of experience. I build clean, fast web software from frontend to backend.",
    images: ["/astronaut.webp"],
    creator: "@SPrajapat16530",
    site: "@SPrajapat16530",
  },
  alternates: {
    canonical: "https://www.swayam.cyou",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Swayam Prajapat",
  jobTitle: "Full-stack Developer",
  description:
    "Full-stack freelancer with 3 years of experience building web software that's clean, fast, and built to last. I work across the full stack — from pixel-perfect frontends to rock-solid backends.",
  url: "https://www.swayam.cyou",
  email: "swayamprajapat21@gmail.com",
  sameAs: [
    "https://github.com/Swayam101",
    "https://www.linkedin.com/in/swayam-prajapat",
    "https://x.com/SPrajapat16530",
    "https://t.me/Sammy101X",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Web Development",
    "Full-stack Development",
  ],
  knowsLanguage: ["English"],
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "professional experience",
    name: "3 years full-stack development experience",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Swayam Prajapat Portfolio",
  url: "https://www.swayam.cyou",
  description:
    "Portfolio of Swayam Prajapat — Full-stack developer specializing in web applications",
  author: {
    "@type": "Person",
    name: "Swayam Prajapat",
    url: "https://www.swayam.cyou",
  },
};

const professionalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Swayam — Full-Stack Development",
  description:
    "Freelance full-stack development services. Web, mobile, and backend development with React, Next.js, Node.js, and TypeScript.",
  url: "https://www.swayam.cyou",
  provider: {
    "@type": "Person",
    name: "Swayam Prajapat",
    email: "swayamprajapat21@gmail.com",
    url: "https://www.swayam.cyou",
  },
  areaServed: "Worldwide",
  serviceType: [
    "Web Development",
    "Full-Stack Development",
    "Freelance Development",
  ],
};

const breadcrumbHomeJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.swayam.cyou",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why work with one full-stack developer instead of a team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Web, mobile, backend — all handled by one person. No back and forth between multiple people. Faster iteration, clearer communication.",
      },
    },
    {
      "@type": "Question",
      name: "How fast can you deliver projects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Quick turnarounds without cutting corners. Your deadline is taken seriously and always kept in sight.",
      },
    },
    {
      "@type": "Question",
      name: "Do I communicate directly with the developer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No middlemen, no delays. Just clear, honest communication from start to finish, every time.",
      },
    },
    {
      "@type": "Question",
      name: "Is the code maintainable and scalable?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Clean code that's easy to scale, maintain, and hand off whenever you need to move forward.",
      },
    },
    {
      "@type": "Question",
      name: "Do you understand startup constraints?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lean mindset, tight budgets, real deadlines — I've been there, I understand what actually matters.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,600;1,400&family=SN+Pro:ital,wght@0,200..900;1,200..900&display=swap"
        />
        <link rel="preload" href="/astronaut.webp" as="image" />
        <link rel="preload" href="/isit2.webp" as="image" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-R0LTTKNQ1C"
        />
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-R0LTTKNQ1C');
            `,
          }}
        />
        <Script
          id="mixpanel-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
              for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);

              mixpanel.init('c7399c49749641e74790c433edda881f', {
                autocapture: true,
                record_sessions_percent: 100,
                debug: false
              });
            `,
          }}
        />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);
        t.async=1;
        t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "yf7xz6e38l");
    `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(professionalServiceJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbHomeJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
