import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Politica de cookie-uri — Meșteri de Tulcea",
  description:
    "Ce cookie-uri folosim pe Meșteri de Tulcea, de ce le folosim, cât timp le stocăm și cum le poți gestiona.",
}

const LAST_UPDATED = "1 martie 2025"
const COMPANY_EMAIL = "contact@mesteridetulcea.ro"

const sections = [
  { id: "ce-sunt",     label: "1. Ce sunt cookie-urile" },
  { id: "baza-legala", label: "2. Baza legală" },
  { id: "categorii",   label: "3. Categoriile de cookie-uri" },
  { id: "tabel",       label: "4. Lista cookie-urilor" },
  { id: "terte",       label: "5. Cookie-uri terțe" },
  { id: "gestionare",  label: "6. Cum le gestionezi" },
  { id: "modificari",  label: "7. Modificarea politicii" },
  { id: "contact",     label: "8. Contact" },
]

interface CookieRow {
  name: string
  provider: string
  purpose: string
  duration: string
  necessary: boolean
}

const cookieList: CookieRow[] = [
  {
    name: "sb-*-auth-token",
    provider: "Supabase Inc.",
    purpose: "Menține sesiunea de autentificare activă. Fără acest cookie nu poți rămâne conectat.",
    duration: "Sesiune / 7 zile",
    necessary: true,
  },
  {
    name: "sb-*-auth-token-code-verifier",
    provider: "Supabase Inc.",
    purpose: "Securitate OAuth (PKCE) — previne atacurile CSRF la autentificarea cu Google.",
    duration: "Sesiune",
    necessary: true,
  },
  {
    name: "sb-*-provider-token",
    provider: "Supabase Inc.",
    purpose: "Token OAuth pentru autentificarea prin furnizori externi (Google).",
    duration: "Sesiune",
    necessary: true,
  },
]

export default function CookiesPage() {
  return (
    <>
      {/* ── Dark hero band ── */}
      <div
        className="-mt-[62px]"
        style={{ background: "#0d0905", borderBottom: "1px solid #3d2e14" }}
      >
        <div className="container px-4 md:px-8 pt-[110px] md:pt-[136px] pb-12 md:pb-20">
          <p className="font-condensed tracking-[0.32em] uppercase text-xs mb-5" style={{ color: "#a07828" }}>
            Legal
          </p>
          <h1
            className="font-display leading-[1.06] text-white"
            style={{ fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 600, maxWidth: "580px" }}
          >
            Politica de{" "}
            <em style={{ color: "#a07828", fontStyle: "italic" }}>cookie-uri</em>
          </h1>
          <p
            className="font-condensed tracking-wide mt-4"
            style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)" }}
          >
            Ultima actualizare: {LAST_UPDATED}
          </p>
          <p
            className="font-condensed tracking-wide mt-3"
            style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", maxWidth: "520px", lineHeight: 1.7 }}
          >
            Această pagină explică ce cookie-uri sunt utilizate pe platforma Meșteri de Tulcea,
            scopul fiecăruia și modalitățile prin care le poți controla.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: "#f9f5ec" }}>
        <div className="container px-4 md:px-8 py-14 md:py-20">
          <div className="md:grid md:gap-16" style={{ gridTemplateColumns: "210px 1fr" }}>

            {/* ── Sidebar ── */}
            <div className="hidden md:block">
              <div className="sticky" style={{ top: "82px" }}>
                <p className="font-condensed tracking-[0.28em] uppercase mb-4" style={{ fontSize: "10px", color: "rgba(13,9,5,0.35)" }}>
                  Cuprins
                </p>
                <nav className="flex flex-col" style={{ borderLeft: "1px solid rgba(160,112,32,0.2)" }}>
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="font-condensed tracking-wide transition-colors duration-200 hover:text-[#a07828]"
                      style={{
                        fontSize: "12px",
                        color: "rgba(13,9,5,0.45)",
                        padding: "6px 0 6px 16px",
                        borderLeft: "2px solid transparent",
                        marginLeft: "-1px",
                        lineHeight: 1.4,
                      }}
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* ── Sections ── */}
            <div className="space-y-12">

              <C id="ce-sunt" title="1. Ce sunt cookie-urile">
                <p>
                  Cookie-urile sunt fișiere text de mici dimensiuni pe care un site web le
                  salvează în browserul tău atunci când îl vizitezi. La fiecare vizită ulterioară,
                  browserul trimite conținutul cookie-ului înapoi către server, permițând site-ului
                  să recunoască dispozitivul tău și să rețină anumite informații (ex: faptul că
                  ești autentificat).
                </p>
                <p>
                  Cookie-urile <strong>nu pot executa cod</strong>, nu pot accesa fișierele
                  de pe dispozitivul tău și nu conțin programe malware. Ele nu stochează date
                  sensibile în mod direct (parole, date bancare etc.).
                </p>
                <p>
                  Pe lângă cookie-uri, site-urile pot utiliza tehnologii similare precum
                  <strong> localStorage</strong> și <strong>sessionStorage</strong> — spații
                  de stocare în browser care funcționează similar cookie-urilor, dar nu sunt
                  trimise automat serverului. Meșteri de Tulcea utilizează localStorage pentru
                  reținerea preferințelor de afișare (filtru, sortare), fără a implica cookie-uri
                  pentru aceste funcții.
                </p>
              </C>

              <C id="baza-legala" title="2. Baza legală">
                <p>
                  Utilizarea cookie-urilor este reglementată în România prin:
                </p>
                <ul>
                  <li>
                    <strong>Legea nr. 506/2004</strong> privind prelucrarea datelor cu caracter
                    personal și protecția vieții private în sectorul comunicațiilor electronice
                    (transpunerea Directivei ePrivacy 2002/58/CE, modificată prin Directiva
                    2009/136/CE) — impune consimțământul prealabil pentru cookie-urile non-esențiale.
                  </li>
                  <li>
                    <strong>Regulamentul (UE) 2016/679 (GDPR)</strong> — aplicabil atunci când
                    cookie-urile prelucrează date cu caracter personal.
                  </li>
                </ul>
                <p>
                  Meșteri de Tulcea utilizează <strong>exclusiv cookie-uri strict necesare</strong>
                  pentru funcționarea platformei (autentificare și securitate sesiune).
                  Aceste cookie-uri sunt plasate în temeiul <strong>interesului legitim al
                  operatorului</strong> de a furniza serviciul solicitat și nu necesită
                  consimțământul tău prealabil, conform art. 4<sup>1</sup> alin. (5) lit. a)
                  din Legea 506/2004.
                </p>
                <p>
                  Preferințele de afișare (filtru categorie, sortare) sunt reținute în
                  <strong> localStorage</strong> al browserului tău, nu prin cookie-uri,
                  și nu transmit date către serverul nostru.
                </p>
                <p>
                  Nu utilizăm cookie-uri de analiză, marketing sau retargeting.
                </p>
              </C>

              <C id="categorii" title="3. Categoriile de cookie-uri utilizate">
                {/* Strictly necessary */}
                <div
                  style={{
                    background: "#fdfaf3",
                    border: "1px solid rgba(160,112,32,0.2)",
                    padding: "24px 24px 20px",
                    marginBottom: "16px",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <h3
                      className="font-display"
                      style={{ fontSize: "17px", fontWeight: 600, color: "#0d0905" }}
                    >
                      Strict necesare
                    </h3>
                    <span
                      className="font-condensed tracking-wide uppercase"
                      style={{
                        fontSize: "10px",
                        padding: "3px 10px",
                        background: "rgba(34,197,94,0.1)",
                        color: "rgb(22,163,74)",
                        border: "1px solid rgba(34,197,94,0.25)",
                      }}
                    >
                      Întotdeauna active
                    </span>
                  </div>
                  <p
                    className="font-condensed tracking-wide leading-relaxed"
                    style={{ fontSize: "14px", color: "rgba(13,9,5,0.6)", lineHeight: 1.75 }}
                  >
                    Esențiale pentru funcționarea platformei — sesiunea de autentificare și
                    securitatea OAuth. Fără acestea, nu poți rămâne conectat și nu poți folosi
                    funcțiile care necesită cont. <strong style={{ color: "#0d0905" }}>Nu necesită consimțământ.</strong>
                  </p>
                </div>

                {/* Analytics - not used */}
                <div
                  style={{
                    background: "#fdfaf3",
                    border: "1px solid rgba(160,112,32,0.15)",
                    padding: "24px 24px 20px",
                    marginBottom: "16px",
                    opacity: 0.7,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <h3
                      className="font-display"
                      style={{ fontSize: "17px", fontWeight: 600, color: "#0d0905" }}
                    >
                      Analiză și performanță
                    </h3>
                    <span
                      className="font-condensed tracking-wide uppercase"
                      style={{
                        fontSize: "10px",
                        padding: "3px 10px",
                        background: "rgba(13,9,5,0.04)",
                        color: "rgba(13,9,5,0.4)",
                        border: "1px solid rgba(13,9,5,0.1)",
                      }}
                    >
                      Nu sunt utilizate
                    </span>
                  </div>
                  <p
                    className="font-condensed tracking-wide leading-relaxed"
                    style={{ fontSize: "14px", color: "rgba(13,9,5,0.45)", lineHeight: 1.75 }}
                  >
                    În prezent nu utilizăm niciun serviciu de analiză terță parte (ex: Google
                    Analytics, Hotjar). Dacă vom integra în viitor astfel de servicii, vom
                    actualiza această politică și vom implementa un mecanism de consimțământ.
                  </p>
                </div>

                {/* Marketing - not used */}
                <div
                  style={{
                    background: "#fdfaf3",
                    border: "1px solid rgba(160,112,32,0.15)",
                    padding: "24px 24px 20px",
                    opacity: 0.7,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <h3
                      className="font-display"
                      style={{ fontSize: "17px", fontWeight: 600, color: "#0d0905" }}
                    >
                      Marketing și retargeting
                    </h3>
                    <span
                      className="font-condensed tracking-wide uppercase"
                      style={{
                        fontSize: "10px",
                        padding: "3px 10px",
                        background: "rgba(13,9,5,0.04)",
                        color: "rgba(13,9,5,0.4)",
                        border: "1px solid rgba(13,9,5,0.1)",
                      }}
                    >
                      Nu sunt utilizate
                    </span>
                  </div>
                  <p
                    className="font-condensed tracking-wide leading-relaxed"
                    style={{ fontSize: "14px", color: "rgba(13,9,5,0.45)", lineHeight: 1.75 }}
                  >
                    Nu utilizăm cookie-uri de marketing, publicitate comportamentală sau
                    retargeting. Nu partajăm date din cookie-uri cu rețele publicitare.
                  </p>
                </div>
              </C>

              <C id="tabel" title="4. Lista completă a cookie-urilor utilizate">
                <p>
                  Tabelul de mai jos prezintă toate cookie-urile plasate de platforma
                  Meșteri de Tulcea:
                </p>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid rgba(160,112,32,0.25)" }}>
                        {["Nume cookie", "Furnizor", "Scop", "Durată", "Tip"].map((h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: "left",
                              padding: "10px 14px 10px 0",
                              color: "#0d0905",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cookieList.map((c) => (
                        <tr
                          key={c.name}
                          style={{ borderBottom: "1px solid rgba(160,112,32,0.1)" }}
                        >
                          <td
                            style={{
                              padding: "10px 14px 10px 0",
                              fontFamily: "monospace",
                              fontSize: "12px",
                              color: "#0d0905",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {c.name}
                          </td>
                          <td style={{ padding: "10px 14px 10px 0", color: "rgba(13,9,5,0.65)", verticalAlign: "top" }}>
                            {c.provider}
                          </td>
                          <td style={{ padding: "10px 14px 10px 0", color: "rgba(13,9,5,0.65)", verticalAlign: "top" }}>
                            {c.purpose}
                          </td>
                          <td style={{ padding: "10px 14px 10px 0", color: "rgba(13,9,5,0.65)", whiteSpace: "nowrap", verticalAlign: "top" }}>
                            {c.duration}
                          </td>
                          <td style={{ padding: "10px 0", verticalAlign: "top" }}>
                            <span
                              className="font-condensed tracking-wide uppercase"
                              style={{
                                fontSize: "9px",
                                padding: "2px 8px",
                                background: c.necessary ? "rgba(34,197,94,0.08)" : "rgba(234,179,8,0.08)",
                                color: c.necessary ? "rgb(22,163,74)" : "rgb(161,98,7)",
                                border: `1px solid ${c.necessary ? "rgba(34,197,94,0.2)" : "rgba(234,179,8,0.2)"}`,
                              }}
                            >
                              {c.necessary ? "Necesar" : "Funcțional"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p>
                  <em style={{ color: "rgba(13,9,5,0.45)", fontSize: "13px" }}>
                    Notă: cookie-urile Supabase au un prefix dinamic (ex: <code>sb-[id]-auth-token</code>)
                    care variază în funcție de configurația proiectului. Funcția lor rămâne cea
                    descrisă mai sus.
                  </em>
                </p>
              </C>

              <C id="terte" title="5. Cookie-uri și servicii terțe">
                <p>
                  Anumite funcționalități ale platformei implică servicii terțe care pot plasa
                  propriile cookie-uri sau pot accesa informații din browserul tău. Aceste
                  cookie-uri sunt guvernate de politicile de confidențialitate ale furnizorilor
                  respectivi, independent de prezenta politică.
                </p>
                <ul>
                  <li>
                    <strong>Google OAuth</strong> — dacă alegi să te autentifici cu contul Google,
                    Google poate plasa cookie-uri proprii pe dispozitivul tău.{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#a07828" }}
                      className="hover:underline"
                    >
                      Politica de confidențialitate Google →
                    </a>
                  </li>
                  <li>
                    <strong>Supabase Inc.</strong> — furnizorul de autentificare și baze de date.
                    Cookie-urile Supabase sunt strict necesare și sunt listate în tabelul de mai sus.{" "}
                    <a
                      href="https://supabase.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#a07828" }}
                      className="hover:underline"
                    >
                      Politica Supabase →
                    </a>
                  </li>
                </ul>
                <p>
                  Nu avem control asupra cookie-urilor plasate de serviciile terțe și nu răspundem
                  pentru practicile de confidențialitate ale acestora. Îți recomandăm să consultezi
                  politicile lor înainte de a utiliza funcțiile respective.
                </p>
              </C>

              <C id="gestionare" title="6. Cum poți gestiona cookie-urile">
                <p>
                  Ai dreptul să controlezi și să gestionezi cookie-urile din browserul tău.
                  Poți seta browserul să blocheze sau să șteargă cookie-urile, inclusiv pe cele
                  ale Meșteri de Tulcea.
                </p>
                <p>
                  <strong style={{ color: "#0d0905" }}>Important:</strong> dacă blochezi sau ștergi
                  cookie-urile strict necesare (autentificare Supabase), nu vei putea rămâne
                  conectat la contul tău și funcționalitățile care necesită autentificare nu vor
                  fi disponibile.
                </p>
                <p>Instrucțiuni pentru principalele browsere:</p>
                <ul>
                  <li>
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: "#a07828" }} className="hover:underline">
                      Google Chrome — gestionare cookie-uri →
                    </a>
                  </li>
                  <li>
                    <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" style={{ color: "#a07828" }} className="hover:underline">
                      Mozilla Firefox — gestionare cookie-uri →
                    </a>
                  </li>
                  <li>
                    <a href="https://support.apple.com/en-us/105082" target="_blank" rel="noopener noreferrer" style={{ color: "#a07828" }} className="hover:underline">
                      Apple Safari — gestionare cookie-uri →
                    </a>
                  </li>
                  <li>
                    <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer" style={{ color: "#a07828" }} className="hover:underline">
                      Microsoft Edge — gestionare cookie-uri →
                    </a>
                  </li>
                </ul>
                <p>
                  Pe lângă setările browserului, poți utiliza extensii de browser dedicate
                  gestionării cookie-urilor (ex: uBlock Origin, Privacy Badger) sau modul
                  de navigare privată / incognito, care nu salvează cookie-uri între sesiuni.
                </p>
              </C>

              <C id="modificari" title="7. Modificarea politicii de cookie-uri">
                <p>
                  Ne rezervăm dreptul de a actualiza această politică pentru a reflecta
                  modificări ale serviciilor utilizate sau ale cadrului legal aplicabil.
                  Data ultimei actualizări este afișată în antetul acestei pagini.
                </p>
                <p>
                  Dacă vom introduce cookie-uri de analiză sau marketing în viitor, vom actualiza
                  această politică și vom implementa un mecanism de colectare a consimțământului
                  înainte de a plasa acele cookie-uri.
                </p>
              </C>

              <C id="contact" title="8. Contact">
                <p>
                  Pentru orice întrebări legate de utilizarea cookie-urilor sau pentru a-ți
                  exercita drepturile privind datele personale, ne poți contacta la:{" "}
                  <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: "#a07828" }} className="hover:underline">
                    {COMPANY_EMAIL}
                  </a>
                  .
                </p>
                <p>
                  Mai multe detalii despre prelucrarea datelor personale în ansamblu găsești în{" "}
                  <Link href="/confidentialitate" style={{ color: "#a07828" }} className="hover:underline">
                    Politica de confidențialitate
                  </Link>
                  .
                </p>
              </C>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function C({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-4 mb-5">
        <h2
          className="font-display shrink-0 leading-none"
          style={{ fontSize: "clamp(17px, 1.9vw, 21px)", fontWeight: 600, color: "#0d0905" }}
        >
          {title}
        </h2>
        <div className="flex-1 h-px" style={{ background: "rgba(160,112,32,0.2)" }} />
      </div>
      <div
        className="font-condensed tracking-wide leading-relaxed space-y-4"
        style={{ fontSize: "15px", color: "rgba(13,9,5,0.62)", lineHeight: 1.8 }}
      >
        {children}
      </div>
      <style>{`
        #${id} ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        #${id} ul li { padding-left: 20px; position: relative; }
        #${id} ul li::before { content: ''; position: absolute; left: 0; top: 10px; width: 5px; height: 5px; background: rgba(160,112,32,0.55); transform: rotate(45deg); }
        #${id} strong { color: #0d0905; font-weight: 600; }
        #${id} code { font-family: monospace; font-size: 12px; background: rgba(160,112,32,0.08); padding: 1px 5px; }
      `}</style>
    </section>
  )
}
