'use client'

import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )

    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))

    return () => io.disconnect()
  }, [])

  return null
}
