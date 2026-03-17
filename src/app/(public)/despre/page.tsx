import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Star, Users, MapPin, FileText, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Despre noi — Meșteri de Tulcea",
  description:
    "Meșteri de Tulcea — site-ul unde găsești meșteri și prestatori de servicii din județul Tulcea. Profiluri verificate, contact direct, fără intermediari.",
}

const values = [
  {
    icon: ShieldCheck,
    title: "Verificare manuală",
    text: "Fiecare profil este revizuit manual de echipa noastră înainte de publicare. Profilurile incomplete, suspecte sau care nu respectă condițiile platformei nu sunt aprobate.",
  },
  {
    icon: Star,
    title: "Recenzii reale",
    text: "Recenziile pot fi lăsate exclusiv de utilizatori înregistrați cu cont activ. Fiecare utilizator poate lăsa o singură recenzie per meșter, pentru a preveni abuzurile.",
  },
  {
    icon: Users,
    title: "Focus local",
    text: "Ne concentrăm exclusiv pe județul Tulcea și zona limitrofă. Nu suntem o platformă națională generică — cunoaștem comunitatea pe care o servim.",
  },
  {
    icon: MapPin,
    title: "Acces direct",
    text: "Datele de contact ale meșterilor sunt vizibile direct pe platformă. Nicio taxă, nicio înregistrare obligatorie pentru a vedea un număr de telefon.",
  },
  {
    icon: FileText,
    title: "Transparență",
    text: "Meșterii își administrează propriile profiluri și sunt responsabili pentru corectitudinea informațiilor publicate. Platforma nu modifică și nu garantează aceste date.",
  },
  {
    icon: Phone,
    title: "Contact direct",
    text: "Orice comunicare, negociere sau contract se realizează exclusiv între client și meșter, în afara platformei. Meșteri de Tulcea nu este parte în niciun acord.",
  },
]

export default function DesprePage() {
  return (
    <>
      {/* ── Dark hero band — overlaps navbar ── */}
      <div
        className="-mt-[62px]"
        style={{ background: "#0d0905", borderBottom: "1px solid #3d2e14" }}
      >
        <div className="container px-4 md:px-8 pt-[110px] md:pt-[140px] pb-14 md:pb-24">

          <p className="font-condensed tracking-[0.32em] uppercase text-xs mb-5" style={{ color: "#a07828" }}>
            Despre platformă
          </p>

          <h1
            className="font-display leading-[1.06] text-white"
            style={{ fontSize: "clamp(30px, 5vw, 58px)", fontWeight: 600, maxWidth: "700px" }}
          >
            Caută și contactează{" "}
            <em style={{ color: "#a07828", fontStyle: "italic" }}>meșteri</em>{" "}
            din județul Tulcea
          </h1>

          <p
            className="font-condensed tracking-wide mt-6 leading-relaxed"
            style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", maxWidth: "540px" }}
          >
            Site-ul unde găsești meșteri și prestatori de servicii din zona Tulcea.
            Profilurile sunt verificate manual, datele de contact sunt vizibile direct,
            fără intermediari și fără taxe.
          </p>

          {/* 3 facts inline */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mt-10">
            {[
              { value: "Gratuit", sub: "pentru clienți" },
              { value: "Verificat manual", sub: "fiecare profil" },
              { value: "Contact direct", sub: "fără intermediari" },
            ].map(({ value, sub }) => (
              <div key={value} className="flex items-center gap-3">
                <div className="w-px self-stretch shrink-0" style={{ background: "rgba(160,112,32,0.45)" }} />
                <div>
                  <div className="font-condensed font-semibold tracking-wide text-white" style={{ fontSize: "15px" }}>{value}</div>
                  <div className="font-condensed tracking-wide" style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ background: "#f9f5ec" }}>
        <div className="container px-4 md:px-8 py-14 md:py-22">

          {/* ── Ce este platforma ── */}
          <div className="md:grid md:gap-20 mb-16 md:mb-24" style={{ gridTemplateColumns: "38% 1fr" }}>

            <div className="mb-8 md:mb-0">
              <div className="md:sticky" style={{ top: "82px" }}>
                <p className="font-condensed tracking-[0.32em] uppercase text-xs mb-4" style={{ color: "#a07828" }}>
                  Ce este
                </p>
                <h2
                  className="font-display leading-snug"
                  style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 600, color: "#0d0905" }}
                >
                  Un site de listare,<br />nu un intermediar
                </h2>
                <div className="mt-5" style={{ width: "40px", height: "1px", background: "rgba(160,112,32,0.5)" }} />
              </div>
            </div>

            <div className="space-y-6 font-condensed tracking-wide leading-relaxed" style={{ fontSize: "16px", color: "rgba(13,9,5,0.6)" }}>
              <p>
                <strong style={{ color: "#0d0905", fontWeight: 600 }}>Meșteri de Tulcea</strong> este
                un site de prezentare și listare prin care poți găsi meșteri și prestatori de
                servicii din județul Tulcea. Publicarea unui profil pe platformă nu constituie
                o recomandare, o garanție sau o certificare a calității serviciilor prestate.
              </p>
              <p>
                Platforma pune la dispoziție informații publicate de meșteri — specialitate,
                date de contact, fotografii cu lucrări anterioare, recenzii de la alți utilizatori —
                cu scopul de a facilita contactul direct între client și prestator. Orice
                comunicare, negociere și acord se realizează direct între client și meșter,
                în afara platformei.
              </p>
              <p>
                Meșteri de Tulcea nu este parte în niciun acord sau contract dintre client
                și meșter, nu garantează executarea lucrărilor și nu răspunde pentru calitatea,
                termenele sau rezultatele acestora. Utilizatorii sunt responsabili să verifice
                prestatorul ales înainte de a încheia orice angajament.
              </p>
            </div>

          </div>

          {/* ── Separator ── */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(160,112,32,0.3), transparent)", marginBottom: "64px" }} />

          {/* ── Ce oferim ── */}
          <div className="mb-16 md:mb-24">
            <div className="text-center mb-12">
              <p className="font-condensed tracking-[0.32em] uppercase text-xs mb-4" style={{ color: "#a07828" }}>
                Funcționalități
              </p>
              <h2
                className="font-display leading-snug"
                style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 600, color: "#0d0905" }}
              >
                Ce poți face pe platformă
              </h2>
              <div className="mx-auto mt-4" style={{ width: "40px", height: "1px", background: "rgba(160,112,32,0.5)" }} />
              <p className="font-condensed tracking-wide mt-5 mx-auto" style={{ fontSize: "15px", color: "rgba(13,9,5,0.5)", maxWidth: "500px", lineHeight: 1.7 }}>
                Toate funcționalitățile de mai jos sunt gratuite pentru clienți.
                Meșterii pot crea un profil de bază fără costuri.
              </p>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ border: "1px solid rgba(160,112,32,0.18)" }}
            >
              {[
                {
                  num: "01",
                  title: "Căutare meșteri",
                  text: "Caută meșteri după specialitate, zonă sau cuvinte cheie. Rezultatele afișează profilele disponibile în baza de date a platformei.",
                },
                {
                  num: "02",
                  title: "Profiluri publice",
                  text: "Fiecare meșter aprobat are o pagină publică cu specialitate, experiență, fotografii cu lucrări anterioare și date de contact vizibile direct.",
                },
                {
                  num: "03",
                  title: "Recenzii",
                  text: "Utilizatorii înregistrați pot lăsa recenzii și note pentru meșterii cu care au interacționat. O singură recenzie per utilizator per meșter.",
                },
                {
                  num: "04",
                  title: "Cont meșter",
                  text: "Meșterii pot crea și administra un profil public: descriere, specialitate, fotografii, date de contact. Profilul este supus aprobării manuale.",
                },
                {
                  num: "05",
                  title: "Favorite",
                  text: "Utilizatorii înregistrați pot salva meșteri în lista de favorite pentru a-i regăsi ușor ulterior.",
                },
                {
                  num: "06",
                  title: "Notificări email",
                  text: "Meșterii pot primi notificări când apar cereri relevante pentru specialitatea lor, dacă au activată această opțiune în contul lor.",
                },
              ].map((item, i) => (
                <div
                  key={item.num}
                  className="relative group"
                  style={{
                    padding: "36px 32px",
                    borderRight: i % 3 !== 2 ? "1px solid rgba(160,112,32,0.18)" : undefined,
                    borderBottom: i < 3 ? "1px solid rgba(160,112,32,0.18)" : undefined,
                    background: "#fdfaf3",
                  }}
                >
                  <div
                    className="absolute top-4 right-5 font-display font-bold select-none pointer-events-none leading-none"
                    style={{ fontSize: "72px", color: "rgba(160,112,32,0.06)", fontWeight: 700 }}
                  >
                    {item.num}
                  </div>
                  <h3
                    className="font-display mb-3 leading-snug"
                    style={{ fontSize: "clamp(17px, 1.8vw, 21px)", fontWeight: 600, color: "#0d0905" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="font-condensed tracking-wide leading-relaxed"
                    style={{ fontSize: "14px", color: "rgba(13,9,5,0.55)", lineHeight: 1.75 }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Separator ── */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(160,112,32,0.3), transparent)", marginBottom: "64px" }} />

          {/* ── Cum funcționăm — 2x3 grid ── */}
          <div className="mb-16 md:mb-24">
            <div className="text-center mb-12">
              <p className="font-condensed tracking-[0.32em] uppercase text-xs mb-4" style={{ color: "#a07828" }}>
                Principii
              </p>
              <h2
                className="font-display leading-snug"
                style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 600, color: "#0d0905" }}
              >
                Cum funcționăm
              </h2>
              <div className="mx-auto mt-4" style={{ width: "40px", height: "1px", background: "rgba(160,112,32,0.5)" }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px" style={{ background: "rgba(160,112,32,0.18)" }}>
              {values.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="group"
                  style={{ background: "#fdfaf3", padding: "36px 30px" }}
                >
                  <div
                    className="flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-[rgba(160,112,32,0.1)]"
                    style={{ width: "52px", height: "52px", border: "1px solid rgba(160,112,32,0.3)" }}
                  >
                    <Icon style={{ width: "22px", height: "22px", color: "#a07828" }} />
                  </div>
                  <h3
                    className="font-display mb-3 leading-snug"
                    style={{ fontSize: "clamp(18px, 1.8vw, 22px)", fontWeight: 600, color: "#0d0905" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="font-condensed tracking-wide leading-relaxed"
                    style={{ fontSize: "14px", color: "rgba(13,9,5,0.55)", lineHeight: 1.75 }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Separator ── */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(160,112,32,0.3), transparent)", marginBottom: "64px" }} />

          {/* ── CTA dark band ── */}
          <div
            className="text-center px-8 py-14 md:py-20"
            style={{ background: "#0d0905" }}
          >
            <p className="font-condensed tracking-[0.32em] uppercase text-xs mb-5" style={{ color: "#a07828" }}>
              Fă parte din comunitate
            </p>
            <h2
              className="font-display text-white leading-snug mb-4"
              style={{ fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 600 }}
            >
              Ești meșter în zona Tulcea?
            </h2>
            <p
              className="font-condensed tracking-wide mb-8 mx-auto"
              style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", maxWidth: "440px", lineHeight: 1.7 }}
            >
              Creează un profil gratuit și fii descoperit de clienții din zonă.
              Profilul este supus aprobării manuale și publicat după verificare.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register/mester"
                className="inline-flex items-center justify-center gap-2 font-condensed tracking-[0.14em] uppercase transition-colors duration-200"
                style={{
                  background: "#a07828",
                  color: "#fff",
                  padding: "14px 32px",
                  fontSize: "13px",
                }}
              >
                Înregistrează-te ca meșter
                <ArrowRight style={{ width: "14px", height: "14px" }} />
              </Link>
              <Link
                href="/mesteri"
                className="inline-flex items-center justify-center gap-2 font-condensed tracking-[0.14em] uppercase transition-colors duration-200"
                style={{
                  border: "1px solid rgba(160,112,32,0.4)",
                  color: "rgba(255,255,255,0.65)",
                  padding: "14px 32px",
                  fontSize: "13px",
                }}
              >
                Vezi meșterii disponibili
              </Link>
            </div>
            <p className="mt-8 font-condensed tracking-wide" style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
              Ai întrebări?{" "}
              <a href="mailto:contact@mesteritulcea.ro" style={{ color: "#a07828" }} className="hover:underline">
                contact@mesteritulcea.ro
              </a>
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
