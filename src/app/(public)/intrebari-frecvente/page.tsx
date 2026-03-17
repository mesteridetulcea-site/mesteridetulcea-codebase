import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Întrebări frecvente — Meșteri de Tulcea",
  description:
    "Răspunsuri la cele mai frecvente întrebări despre platforma Meșteri de Tulcea — pentru clienți și meșteri.",
}

const faq: { id: string; category: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    id: "generale",
    category: "Întrebări generale",
    items: [
      {
        q: "Ce este Meșteri de Tulcea?",
        a: "Meșteri de Tulcea este un site de prezentare și listare prin care poți găsi meșteri și prestatori de servicii din județul Tulcea. Publicarea unui profil pe platformă nu constituie o recomandare, o garanție sau o certificare a calității serviciilor prestate.",
      },
      {
        q: "Este gratuit să folosesc platforma?",
        a: "Da. Căutarea meșterilor și vizualizarea profilurilor este complet gratuită pentru clienți, fără cont necesar. Crearea unui cont de client (necesar pentru recenzii și favorite) este de asemenea gratuită.",
      },
      {
        q: "Platforma funcționează doar în județul Tulcea?",
        a: "Da. Ne concentrăm exclusiv pe județul Tulcea și zona limitrofă. Toți meșterii listați activează în această zonă.",
      },
      {
        q: "Cum pot contacta echipa Meșteri de Tulcea?",
        a: (
          <>
            Ne poți scrie la{" "}
            <a href="mailto:contact@mesteritulcea.ro" style={{ color: "#a07828" }} className="hover:underline">
              contact@mesteritulcea.ro
            </a>
            . Răspundem de obicei în 1–2 zile lucrătoare.
          </>
        ),
      },
    ],
  },
  {
    id: "clienti",
    category: "Pentru clienți",
    items: [
      {
        q: "Cum găsesc un meșter?",
        a: (
          <>
            Folosește bara de căutare de pe pagina principală (ex: „electrician", „instalator
            termică", „montat gresie") sau navighează direct pe{" "}
            <Link href="/mesteri" style={{ color: "#a07828" }} className="hover:underline">
              pagina Meșteri
            </Link>{" "}
            și filtrează după specialitate.
          </>
        ),
      },
      {
        q: "Profilurile meșterilor sunt verificate?",
        a: "Fiecare profil este revizuit manual de echipa noastră înainte de publicare — verificăm că informațiile sunt coerente și că profilul este complet. Nu verificăm autorizațiile profesionale sau calificările meșterilor. Îți recomandăm să soliciți tu dovezi de calificare direct meșterului înainte de a contracta lucrări.",
      },
      {
        q: "Pot contacta un meșter fără să am cont?",
        a: "Da. Datele de contact sunt vizibile pe profilul meșterului fără cont. Contul este necesar doar pentru a lăsa recenzii sau a salva meșteri la favorite.",
      },
      {
        q: "Platforma intermediază plata sau contractul?",
        a: "Nu. Meșteri de Tulcea nu este parte a contractului dintre tine și meșter și nu procesează plăți. Toate negocierile, acordurile și plățile au loc direct între tine și meșter, în afara platformei.",
      },
      {
        q: "Ce fac dacă am o problemă cu un meșter?",
        a: "Soluționarea disputelor este responsabilitatea ta și a meșterului — platforma nu este parte contractantă și nu poate interveni în litigii. Poți lăsa o recenzie pentru a informa alți utilizatori. Dacă un profil conține informații false sau înșelătoare, scrie-ne la contact@mesteritulcea.ro.",
      },
    ],
  },
  {
    id: "recenzii",
    category: "Recenzii",
    items: [
      {
        q: "Cum pot lăsa o recenzie?",
        a: "Trebuie să ai un cont activ. Intră pe profilul meșterului, apasă butonul Lasă o recenzie, selectează un rating (1–5 stele) și adaugă opțional un comentariu.",
      },
      {
        q: "Pot modifica o recenzie după ce am trimis-o?",
        a: "Nu. Recenziile nu pot fi editate după trimitere. Poți șterge recenzia și posta una nouă.",
      },
      {
        q: "Pot lăsa mai multe recenzii pentru același meșter?",
        a: "Nu. Fiecare utilizator poate lăsa o singură recenzie per meșter. Dacă ai șters recenzia anterioară, poți posta una nouă.",
      },
      {
        q: "Recenziile sunt moderate?",
        a: "Da. Echipa noastră poate elimina recenziile care conțin limbaj ofensator, sunt în mod evident false sau au scop de spam. Recenziile autentice, inclusiv cele negative, nu sunt eliminate.",
      },
    ],
  },
  {
    id: "mesteri",
    category: "Pentru meșteri",
    items: [
      {
        q: "Cum mă înregistrez ca meșter?",
        a: (
          <>
            Creează un cont pe platformă selectând opțiunea „Meșter" la înregistrare și completează
            formularul de profil. Profilul tău va fi revizuit manual de echipa noastră înainte
            de publicare.
          </>
        ),
      },
      {
        q: "Cât durează aprobarea profilului?",
        a: "De obicei 1–2 zile lucrătoare. Dacă profilul este respins, vei primi un mesaj cu motivul și poți corecta informațiile și retrimite.",
      },
      {
        q: "Este gratuit pentru meșteri?",
        a: "Înregistrarea de bază este gratuită. Există planuri plătite (opționale) care oferă vizibilitate suplimentară în rezultatele de căutare.",
      },
      {
        q: "Pot adăuga fotografii cu lucrările mele?",
        a: "Da. Din panoul de meșter poți încărca fotografii cu lucrările finalizate. Fotografiile sunt revizuite de echipă înainte de publicare.",
      },
      {
        q: "Cum primesc notificări despre clienți interesați?",
        a: "Când un utilizator caută o specialitate similară cu a ta în zona ta, sistemul poate trimite o notificare pe email. Poți gestiona preferințele din setările contului.",
      },
      {
        q: "Pot fi eliminat de pe platformă?",
        a: "Da. Ne rezervăm dreptul de a suspenda sau elimina profiluri care conțin informații false, primesc reclamații justificate repetate sau încalcă Termenii și Condițiile platformei.",
      },
    ],
  },
  {
    id: "cont",
    category: "Cont și date personale",
    items: [
      {
        q: "Cum îmi șterg contul?",
        a: (
          <>
            Scrie-ne la{" "}
            <a href="mailto:contact@mesteritulcea.ro" style={{ color: "#a07828" }} className="hover:underline">
              contact@mesteritulcea.ro
            </a>{" "}
            cu subiectul „Ștergere cont" de pe adresa asociată contului. Vom procesa cererea în
            termen de 30 de zile conform GDPR.
          </>
        ),
      },
      {
        q: "Ce date colectați despre mine?",
        a: (
          <>
            Detalii complete găsești în{" "}
            <Link href="/confidentialitate" style={{ color: "#a07828" }} className="hover:underline">
              Politica de confidențialitate
            </Link>
            . Pe scurt: adresă de email, nume și informațiile pe care le adaugi tu în profil.
          </>
        ),
      },
    ],
  },
]

export default function IntrebariFrecventePage() {
  return (
    <>
      {/* ── Dark hero band ── */}
      <div
        className="-mt-[62px]"
        style={{ background: "#0d0905", borderBottom: "1px solid #3d2e14" }}
      >
        <div className="container px-4 md:px-8 pt-[110px] md:pt-[140px] pb-12 md:pb-20">
          <p className="font-condensed tracking-[0.32em] uppercase text-xs mb-5" style={{ color: "#a07828" }}>
            Ajutor
          </p>
          <h1
            className="font-display leading-[1.06] text-white"
            style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 600, maxWidth: "640px" }}
          >
            Întrebări{" "}
            <em style={{ color: "#a07828", fontStyle: "italic" }}>frecvente</em>
          </h1>
          <p
            className="font-condensed tracking-wide mt-5"
            style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", maxWidth: "480px", lineHeight: 1.7 }}
          >
            Nu găsești răspunsul?{" "}
            <a href="mailto:contact@mesteritulcea.ro" style={{ color: "#a07828" }} className="hover:underline">
              Scrie-ne
            </a>{" "}
            și răspundem în 1–2 zile lucrătoare.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: "#f9f5ec" }}>
        <div className="container px-4 md:px-8 py-14 md:py-20">

          <div className="md:grid md:gap-16" style={{ gridTemplateColumns: "200px 1fr" }}>

            {/* ── Sidebar nav — desktop only ── */}
            <div className="hidden md:block">
              <div className="sticky" style={{ top: "82px" }}>
                <p className="font-condensed tracking-[0.28em] uppercase mb-4" style={{ fontSize: "10px", color: "rgba(13,9,5,0.35)" }}>
                  Categorii
                </p>
                <nav className="flex flex-col gap-0" style={{ borderLeft: "1px solid rgba(160,112,32,0.2)" }}>
                  {faq.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="font-condensed tracking-wide transition-colors duration-200 hover:text-[#a07828]"
                      style={{
                        fontSize: "13px",
                        color: "rgba(13,9,5,0.5)",
                        padding: "8px 0 8px 16px",
                        borderLeft: "2px solid transparent",
                        marginLeft: "-1px",
                      }}
                    >
                      {section.category}
                    </a>
                  ))}
                </nav>

                {/* Ornament */}
                <div className="mt-8 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: "rgba(160,112,32,0.35)" }} />
                  <div className="flex-1 h-px" style={{ background: "rgba(160,112,32,0.15)" }} />
                </div>
              </div>
            </div>

            {/* ── FAQ sections ── */}
            <div className="space-y-14">
              {faq.map((section, si) => (
                <div key={section.id} id={section.id}>

                  {/* Category header */}
                  <div className="flex items-center gap-4 mb-6">
                    <h2
                      className="font-display shrink-0 leading-none"
                      style={{ fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 600, color: "#0d0905" }}
                    >
                      {section.category}
                    </h2>
                    <div className="flex-1 h-px" style={{ background: "rgba(160,112,32,0.2)" }} />
                    <span
                      className="font-condensed shrink-0"
                      style={{ fontSize: "11px", color: "rgba(160,112,32,0.5)" }}
                    >
                      {String(si + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Accordion items */}
                  <div style={{ borderTop: "1px solid rgba(160,112,32,0.15)" }}>
                    {section.items.map((item) => (
                      <details
                        key={item.q}
                        className="group"
                        style={{ borderBottom: "1px solid rgba(160,112,32,0.15)" }}
                      >
                        <summary
                          className="flex items-start justify-between gap-5 cursor-pointer list-none py-5"
                          style={{ WebkitAppearance: "none" } as React.CSSProperties}
                        >
                          <span
                            className="font-display leading-snug"
                            style={{ fontSize: "clamp(15px, 1.6vw, 17px)", fontWeight: 600, color: "#0d0905" }}
                          >
                            {item.q}
                          </span>
                          {/* + / × toggle */}
                          <span
                            className="shrink-0 flex items-center justify-center transition-transform duration-200 group-open:rotate-45 mt-0.5"
                            style={{
                              width: "24px",
                              height: "24px",
                              border: "1px solid rgba(160,112,32,0.3)",
                              color: "#a07828",
                              fontSize: "16px",
                              lineHeight: 1,
                              flexShrink: 0,
                            }}
                          >
                            +
                          </span>
                        </summary>
                        <div
                          className="font-condensed tracking-wide leading-relaxed pb-6 pr-10"
                          style={{ fontSize: "15px", color: "rgba(13,9,5,0.58)", lineHeight: 1.8 }}
                        >
                          {item.a}
                        </div>
                      </details>
                    ))}
                  </div>

                </div>
              ))}

              {/* Bottom contact nudge */}
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 px-7 py-6"
                style={{ background: "#0d0905" }}
              >
                <div>
                  <p
                    className="font-display text-white leading-snug mb-1"
                    style={{ fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 600 }}
                  >
                    Nu ai găsit ce căutai?
                  </p>
                  <p className="font-condensed tracking-wide" style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                    Scrie-ne și îți răspundem în 1–2 zile lucrătoare.
                  </p>
                </div>
                <a
                  href="mailto:contact@mesteritulcea.ro"
                  className="font-condensed tracking-[0.14em] uppercase shrink-0 transition-colors duration-200"
                  style={{
                    background: "#a07828",
                    color: "#fff",
                    padding: "12px 24px",
                    fontSize: "12px",
                  }}
                >
                  contact@mesteritulcea.ro
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}
