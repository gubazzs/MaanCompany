'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <div className="nav-inner">
        <a href="#top" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="navBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f4f4f4" />
                  <stop offset="0.5" stopColor="#bdbdbd" />
                  <stop offset="1" stopColor="#5a5a5a" />
                </linearGradient>
              </defs>
              <rect x="6" y="11" width="5" height="14" rx="1" fill="url(#navBarGrad)" />
              <rect x="13.5" y="8" width="5" height="17" rx="1" fill="url(#navBarGrad)" />
              <rect x="21" y="5" width="5" height="20" rx="1" fill="url(#navBarGrad)" />
            </svg>
          </span>
          <span className="brand-name">MANN</span>
        </a>
        <div className="nav-links">
          <a href="#metodo">Método</a>
          <a href="#solucoes">Soluções</a>
          <a href="#para-quem">Para quem</a>
          <a href="#processo">Processo</a>
          <a href="#diferenciais">Diferenciais</a>
        </div>
      </div>
    </nav>
  )
}
