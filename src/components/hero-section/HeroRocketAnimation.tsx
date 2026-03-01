import React from 'react'
import { useHydrationSafeMediaQuery } from '../../hooks/useHydrationSafeMediaQuery'

const HeroRocketAnimation: React.FC = () => {
  const isMobile = useHydrationSafeMediaQuery({ maxWidth: 767 })
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 900 400"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <path
          id="route"
          d="M 60,80 C 60,310 330,310 480,310 C 535.23,310 580,265.23 580,210 C 580,154.76999999999998 535.23,110 480,110 C 424.77,110 380,154.76999999999998 380,210 C 380,265.23 424.77,310 480,310 C 630,310 860,310 860,420"
          fill="none"
          stroke="var(--pacific-blue)"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeDasharray="6 5"
        />
      </defs>
      <image
        href="/isit2.webp"
        width={isMobile ? "150" : "200"}
        height={isMobile ? "100" : "130"}
        x={isMobile ? "-100" : "-150"}
        y={isMobile ? "-50" : "-65"}
        preserveAspectRatio="xMidYMid meet"
      >
        <animateMotion
          dur="5s"
          repeatCount="1"
          rotate="auto"
          calcMode="linear"
        >
          <mpath href="#route" />
        </animateMotion>
      </image>
    </svg>
  )
}

export default HeroRocketAnimation
