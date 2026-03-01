import React from 'react'
import { scrollToSection } from '../../utils/scrollToSection'
import WaveTextHover from './WaveTextHover'

const NAV_ITEMS = [
  { label: "Home", targetId: "" },
  { label: "About", targetId: "about" },
  { label: "Contact", targetId: "contact" },
  { label: "Crafts", targetId: "projects" },
]

const Header: React.FC = () => {
  return (
    <div id="main-header" className="flex justify-around items-center w-full h-[72px] sm:h-[100px] bg-[transparent]">
      <div className="flex gap-2 sm:gap-6 items-center">
        <span className="text-xl sm:text-3xl font-bold text-[var(--yale-blue)]">
          <WaveTextHover text="Swayam" />
        </span>
        <span className="text-xl sm:text-3xl font-bold text-[var(--pacific-blue)]">
          <WaveTextHover text="Prajapat" />
        </span>
      </div>
      <div style={{ fontWeight: 300 }} className="hidden sm:block sn-pro text-xl text-right text-[var(--fresh-sky)]">
        <nav>
          <ul className="flex gap-8 text-right">
            {NAV_ITEMS.map(({ label, targetId }) => (
              <li key={label}>
                <a
                  href={targetId ? `#${targetId}` : "#hero"}
                  className="header-nav-link no-underline"
                  onClick={(e) => { e.preventDefault(); scrollToSection(targetId); }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Header