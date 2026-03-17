import { Clock } from "lucide-react"

export default function AbonamentPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] px-6 text-center">
      <div
        className="flex items-center justify-center mb-6"
        style={{ width: "64px", height: "64px", border: "1px solid rgba(160,112,32,0.35)", background: "rgba(160,112,32,0.06)" }}
      >
        <Clock style={{ width: "26px", height: "26px", color: "#a07828" }} />
      </div>
      <p className="font-condensed tracking-[0.28em] uppercase text-xs mb-3" style={{ color: "#a07828" }}>
        În curând
      </p>
      <h2
        className="font-display text-[#1a0f05] leading-snug mb-3"
        style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 600 }}
      >
        Abonamente — disponibile în curând
      </h2>
      <p className="font-condensed tracking-wide text-[#8a6848] max-w-sm" style={{ fontSize: "14px", lineHeight: 1.75 }}>
        Sistemul de abonamente este în pregătire și va fi activat în curând.
        Momentan toate profilurile beneficiază de acces complet gratuit.
      </p>
      <div className="mt-8" style={{ width: "48px", height: "1px", background: "rgba(160,112,32,0.3)", margin: "32px auto 0" }} />
    </div>
  )
}
