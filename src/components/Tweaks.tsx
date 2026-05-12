'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ── useTweaks ───────────────────────────────────────────────────────────────

const MANN_DEFAULTS = {
  accent: 'silver',
  cardStyle: 'metal',
  density: 'default',
  heroVariant: 'image',
} as const

type TweakKey = keyof typeof MANN_DEFAULTS
type TweakValues = typeof MANN_DEFAULTS

function useTweaks(defaults: TweakValues) {
  const [values, setValues] = useState(defaults)
  const setTweak = useCallback((key: TweakKey, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }))
  }, [])
  return [values, setTweak] as const
}

// ── Panel styles ─────────────────────────────────────────────────────────────

const PANEL_CSS = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}
  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2}
`

// ── TweakSection ─────────────────────────────────────────────────────────────

function TweakSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  )
}

// ── TweakRadio (segmented control) ───────────────────────────────────────────

interface RadioOption { value: string; label: string }

function TweakRadio({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: RadioOption[]
  onChange: (v: string) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const valueRef = useRef(value)
  valueRef.current = value

  const idx = Math.max(0, options.findIndex((o) => o.value === value))
  const n = options.length

  const segAt = (clientX: number): string => {
    if (!trackRef.current) return value
    const r = trackRef.current.getBoundingClientRect()
    const i = Math.floor(((clientX - r.left - 2) / (r.width - 4)) * n)
    return options[Math.max(0, Math.min(n - 1, i))].value
  }

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true)
    const v0 = segAt(e.clientX)
    if (v0 !== valueRef.current) onChange(v0)
    const move = (ev: PointerEvent) => {
      const v = segAt(ev.clientX)
      if (v !== valueRef.current) onChange(v)
    }
    const up = () => {
      setDragging(false)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  return (
    <div className="twk-row">
      <div className="twk-lbl"><span>{label}</span></div>
      <div
        ref={trackRef}
        role="radiogroup"
        onPointerDown={onPointerDown}
        className={dragging ? 'twk-seg dragging' : 'twk-seg'}
      >
        <div
          className="twk-seg-thumb"
          style={{
            left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
            width: `calc((100% - 4px) / ${n})`,
          }}
        />
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── TweaksPanel shell ─────────────────────────────────────────────────────────

function TweaksPanel({ title = 'Tweaks', children }: { title?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef({ x: 16, y: 16 })
  const PAD = 16

  const clampToViewport = useCallback(() => {
    const panel = dragRef.current
    if (!panel) return
    const maxRight = Math.max(PAD, window.innerWidth - panel.offsetWidth - PAD)
    const maxBottom = Math.max(PAD, window.innerHeight - panel.offsetHeight - PAD)
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    }
    panel.style.right = offsetRef.current.x + 'px'
    panel.style.bottom = offsetRef.current.y + 'px'
  }, [])

  useEffect(() => {
    if (!open) return
    clampToViewport()
    const ro = new ResizeObserver(clampToViewport)
    ro.observe(document.documentElement)
    return () => ro.disconnect()
  }, [open, clampToViewport])

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const t = e?.data?.type
      if (t === '__activate_edit_mode') setOpen(true)
      else if (t === '__deactivate_edit_mode') setOpen(false)
    }
    window.addEventListener('message', onMsg)
    window.parent.postMessage({ type: '__edit_mode_available' }, '*')
    return () => window.removeEventListener('message', onMsg)
  }, [])

  const dismiss = () => {
    setOpen(false)
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*')
  }

  const onDragStart = (e: React.MouseEvent) => {
    const panel = dragRef.current
    if (!panel) return
    const r = panel.getBoundingClientRect()
    const sx = e.clientX, sy = e.clientY
    const startRight = window.innerWidth - r.right
    const startBottom = window.innerHeight - r.bottom
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      }
      clampToViewport()
    }
    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  if (!open) return null

  return (
    <>
      <style>{PANEL_CSS}</style>
      <div
        ref={dragRef}
        className="twk-panel"
        style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}
      >
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button
            className="twk-x"
            aria-label="Close tweaks"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={dismiss}
          >
            ✕
          </button>
        </div>
        <div className="twk-body">{children}</div>
      </div>
    </>
  )
}

// ── MannTweaks ────────────────────────────────────────────────────────────────

export default function Tweaks() {
  const [t, setTweak] = useTweaks(MANN_DEFAULTS)

  useEffect(() => {
    const body = document.body
    body.classList.remove('accent-silver', 'accent-cool')
    body.classList.add('accent-' + t.accent)
    body.classList.remove('cards-metal', 'cards-glass', 'cards-flat')
    body.classList.add('cards-' + t.cardStyle)
    body.classList.remove('density-default', 'density-compact', 'density-airy')
    body.classList.add('density-' + t.density)
    body.classList.remove('hero-image', 'hero-typo')
    body.classList.add('hero-' + t.heroVariant)
  }, [t.accent, t.cardStyle, t.density, t.heroVariant])

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Aesthetic">
        <TweakRadio
          label="Accent"
          value={t.accent}
          onChange={(v) => setTweak('accent', v)}
          options={[
            { value: 'silver', label: 'Silver' },
            { value: 'cool', label: 'Cool blue' },
          ]}
        />
        <TweakRadio
          label="Card style"
          value={t.cardStyle}
          onChange={(v) => setTweak('cardStyle', v)}
          options={[
            { value: 'metal', label: 'Metal' },
            { value: 'glass', label: 'Glass' },
            { value: 'flat', label: 'Flat' },
          ]}
        />
      </TweakSection>
      <TweakSection label="Layout">
        <TweakRadio
          label="Density"
          value={t.density}
          onChange={(v) => setTweak('density', v)}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'default', label: 'Default' },
            { value: 'airy', label: 'Airy' },
          ]}
        />
        <TweakRadio
          label="Hero"
          value={t.heroVariant}
          onChange={(v) => setTweak('heroVariant', v)}
          options={[
            { value: 'image', label: 'Imagery' },
            { value: 'typo', label: 'Typo' },
          ]}
        />
      </TweakSection>
    </TweaksPanel>
  )
}
