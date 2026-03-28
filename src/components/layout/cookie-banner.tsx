"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"

const COOKIE_KEY = "mesteri_cookie_consent"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY)
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted")
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, "declined")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] md:bottom-6 md:left-6 md:right-auto"
      style={{ maxWidth: "560px" }}
    >
      {/* Panel */}
      <div
        style={{
          background: "#0e0b07",
          border: "1px solid rgba(196,146,30,0.22)",
          borderBottom: "none",
          borderRadius: "14px 14px 0 0",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(196,146,30,0.08)",
        }}
        className="md:border-b md:[border-radius:0px]"
      >
        {/* Gold top line */}
        <div
          className="h-px w-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(196,146,30,0.45) 40%, rgba(196,146,30,0.45) 60%, transparent)",
          }}
        />

        <div className="px-5 pt-5 pb-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rotate-45 shrink-0" />
              <p className="font-condensed tracking-[0.22em] uppercase text-white/75" style={{ fontSize: "11px" }}>
                Cookie-uri
              </p>
            </div>
            <button
              onClick={decline}
              className="text-white/20 hover:text-white/50 transition-colors duration-150 shrink-0 mt-0.5"
              aria-label="Închide"
            >
              <X style={{ width: "14px", height: "14px" }} />
            </button>
          </div>

          {/* Text */}
          <p className="font-condensed tracking-wide text-white/45 leading-relaxed mb-5" style={{ fontSize: "15px" }}>
            Folosim cookie-uri esențiale pentru funcționarea platformei și cookie-uri analitice pentru
            a înțelege cum este utilizat site-ul. Citește{" "}
            <Link href="/confidentialitate" className="text-primary/70 hover:text-primary underline underline-offset-2 transition-colors duration-150">
              politica de confidențialitate
            </Link>
            {" "}și{" "}
            <Link href="/cookies" className="text-primary/70 hover:text-primary underline underline-offset-2 transition-colors duration-150">
              politica de cookie-uri
            </Link>
            .
          </p>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={decline}
              className="flex-1 h-10 font-condensed tracking-[0.16em] uppercase transition-all duration-150"
              style={{
                fontSize: "11px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.35)",
                background: "transparent",
                borderRadius: "6px",
              }}
            >
              Refuză
            </button>
            <button
              onClick={accept}
              className="flex-[2] h-10 font-condensed tracking-[0.16em] uppercase font-semibold transition-all duration-150"
              style={{
                fontSize: "11px",
                background: "hsl(38 68% 44%)",
                color: "white",
                border: "1px solid hsl(38 68% 44% / 0.6)",
                borderRadius: "6px",
                boxShadow: "0 4px 18px hsl(38 68% 44% / 0.3)",
              }}
            >
              Acceptă toate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
