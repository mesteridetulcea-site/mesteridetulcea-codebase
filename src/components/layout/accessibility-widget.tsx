"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "mesteri_a11y"

interface A11yState {
  fontSize: number       // 0 = normal, 1 = mare, 2 = foarte mare
  contrast: boolean
  spacing: boolean
  grayscale: boolean
}

const DEFAULT: A11yState = {
  fontSize: 0,
  contrast: false,
  spacing: false,
  grayscale: false,
}

function applyState(state: A11yState) {
  const root = document.documentElement

  // Font size
  const sizes = ["", "font-size-lg", "font-size-xl"]
  root.classList.remove("font-size-lg", "font-size-xl")
  if (state.fontSize > 0) root.classList.add(sizes[state.fontSize])

  // Contrast
  root.classList.toggle("a11y-contrast", state.contrast)

  // Spacing
  root.classList.toggle("a11y-spacing", state.spacing)

  // Grayscale
  root.classList.toggle("a11y-grayscale", state.grayscale)
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<A11yState>(DEFAULT)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as A11yState
        setState(parsed)
        applyState(parsed)
      }
    } catch {}
  }, [])

  function update(patch: Partial<A11yState>) {
    const next = { ...state, ...patch }
    setState(next)
    applyState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function reset() {
    setState(DEFAULT)
    applyState(DEFAULT)
    localStorage.removeItem(STORAGE_KEY)
  }

  const hasChanges = state.fontSize > 0 || state.contrast || state.spacing || state.grayscale

  return (
    <>
      {/* CSS injected globally */}
      <style>{`
        html.font-size-lg { font-size: 110% !important; }
        html.font-size-xl { font-size: 124% !important; }
        html.a11y-contrast { filter: contrast(1.55) brightness(1.05); }
        html.a11y-spacing * { letter-spacing: 0.06em !important; word-spacing: 0.18em !important; line-height: 1.9 !important; }
        html.a11y-grayscale { filter: grayscale(100%); }
        html.a11y-contrast.a11y-grayscale { filter: contrast(1.55) brightness(1.05) grayscale(100%); }
      `}</style>

      {/* Trigger button — fixed bottom-right */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Accesibilitate"
        className="fixed z-[90] flex items-center justify-center transition-all duration-200"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 88px)",
          right: "16px",
          width: "54px",
          height: "54px",
          background: open ? "hsl(38 68% 44%)" : "#0e0b07",
          border: "1px solid rgba(196,146,30,0.35)",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.45)",
          color: open ? "white" : "rgba(196,146,30,0.75)",
        }}
      >
        {/* Accessibility icon — person with circle */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        {/* Active dot */}
        {hasChanges && !open && (
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: "hsl(38 68% 44%)" }}
          />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed z-[89]"
          style={{
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 154px)",
            right: "24px",
            width: "300px",
            background: "#0e0b07",
            border: "1px solid rgba(196,146,30,0.22)",
            borderRadius: "12px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          {/* Gold top line */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(196,146,30,0.5) 50%, transparent)" }} />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span className="font-condensed tracking-[0.22em] uppercase text-white/60" style={{ fontSize: "10px" }}>
              Accesibilitate
            </span>
            {hasChanges && (
              <button
                onClick={reset}
                className="font-condensed tracking-wide text-white/30 hover:text-red-400/70 transition-colors duration-150"
                style={{ fontSize: "10px" }}
              >
                Resetează
              </button>
            )}
          </div>

          <div className="px-4 py-4 space-y-4">

            {/* Font size */}
            <div>
              <p className="font-condensed tracking-[0.18em] uppercase text-white/30 mb-2" style={{ fontSize: "9px" }}>
                Mărime text
              </p>
              <div className="flex gap-1.5">
                {[
                  { label: "A", size: "11px", value: 0 },
                  { label: "A", size: "14px", value: 1 },
                  { label: "A", size: "17px", value: 2 },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update({ fontSize: opt.value })}
                    className="flex-1 h-9 flex items-center justify-center font-condensed font-bold transition-all duration-150"
                    style={{
                      fontSize: opt.size,
                      borderRadius: "6px",
                      border: state.fontSize === opt.value
                        ? "1px solid hsl(38 68% 44% / 0.6)"
                        : "1px solid rgba(255,255,255,0.08)",
                      background: state.fontSize === opt.value
                        ? "hsl(38 68% 44% / 0.15)"
                        : "rgba(255,255,255,0.03)",
                      color: state.fontSize === opt.value
                        ? "hsl(38 68% 44%)"
                        : "rgba(255,255,255,0.4)",
                    }}
                  >
                    A
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            {[
              { label: "Contrast ridicat", key: "contrast" as const, value: state.contrast },
              { label: "Spațiere text",    key: "spacing"  as const, value: state.spacing  },
              { label: "Mod alb-negru",    key: "grayscale" as const, value: state.grayscale },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => update({ [opt.key]: !opt.value })}
                className="w-full flex items-center justify-between px-3 h-10 transition-all duration-150"
                style={{
                  borderRadius: "6px",
                  border: opt.value
                    ? "1px solid hsl(38 68% 44% / 0.5)"
                    : "1px solid rgba(255,255,255,0.07)",
                  background: opt.value
                    ? "hsl(38 68% 44% / 0.12)"
                    : "rgba(255,255,255,0.025)",
                }}
              >
                <span
                  className="font-condensed tracking-wide"
                  style={{ fontSize: "12px", color: opt.value ? "hsl(38 68% 44%)" : "rgba(255,255,255,0.4)" }}
                >
                  {opt.label}
                </span>
                {/* Toggle pill */}
                <div
                  className="relative flex items-center"
                  style={{
                    width: "30px",
                    height: "16px",
                    borderRadius: "8px",
                    background: opt.value ? "hsl(38 68% 44%)" : "rgba(255,255,255,0.12)",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "white",
                      left: opt.value ? "15px" : "2px",
                      transition: "left 0.2s",
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
