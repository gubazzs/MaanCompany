'use client'

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    let tx = 0, ty = 0, x = 0, y = 0
    let rafId: number

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }

    const loop = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      glow.style.left = x + 'px'
      glow.style.top = y + 'px'
      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove)
    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <div className="glow" ref={glowRef} />
}
