import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Politica de confidențialitate — Meșteri de Tulcea",
  description:
    "Modul în care Meșteri de Tulcea colectează, utilizează și protejează datele tale cu caracter personal, în conformitate cu GDPR.",
}

const LAST_UPDATED = "1 martie 2025"

// ─── Placeholder-uri de completat ────────────────────────────────────────────
const COMPANY_NAME    = "WORLD TEAM INSTAL S.R.L."
const COMPANY_CUI     = "CUI: RO49712990"
const COMPANY_REG     = "Nr. Reg. Com.: J2024000138363"
const COMPANY_ADDRESS = "Strada Nalbelor Nr. 26, Municipiul Tulcea, Județul Tulcea, România"
const COMPANY_EMAIL   = "contact@mesteridetulcea.ro"
// ─────────────────────────────────────────────────────────────────────────────

const sections = [
  { id: "operator",      label: "1. Operatorul de date" },
  { id: "date",          label: "2. Date colectate" },
  { id: "scopuri",       label: "3. Scopuri și temeiuri legale" },
  { id: "durata",        label: "4. Durata stocării" },
  { id: "destinatari",   label: "5. Destinatarii datelor" },
  { id: "transferuri",   label: "6. Transferuri internaționale" },
  { id: "drepturi",      label: "7. Drepturile tale" },
  { id: "securitate",    label: "8. Securitatea datelor" },
  { id: "cookies",       label: "9. Cookie-uri" },
  { id: "automata",      label: "10. Decizie automată" },
  { id: "modificari",    label: "11. Modificarea politicii" },
  { id: "contact",       label: "12. Contact" },
]

export default function ConfidentialitatePage() {
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
            style={{ fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 600, maxWidth: "620px" }}
          >
            Politica de{" "}
            <em style={{ color: "#a07828", fontStyle: "italic" }}>confidențialitate</em>
          </h1>
          <p
            className="font-condensed tracking-wide mt-4"
            style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)" }}
          >
            Ultima actualizare: {LAST_UPDATED}
          </p>
          <p
            className="font-condensed tracking-wide mt-3"
            style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", maxWidth: "540px", lineHeight: 1.7 }}
          >
            Această politică descrie modul în care prelucrăm datele tale cu caracter personal,
            în conformitate cu <strong className="text-white/60">Regulamentul (UE) 2016/679 (GDPR)</strong> și
            legislația română aplicabilă. Te rugăm să o citești integral.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: "#f9f5ec" }}>
        <div className="container px-4 md:px-8 py-14 md:py-20">
          <div className="md:grid md:gap-16" style={{ gridTemplateColumns: "210px 1fr" }}>

            {/* ── Sidebar nav ── */}
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

              {/* Operator notice box */}
              <div
                className="font-condensed tracking-wide leading-relaxed px-6 py-5"
                style={{
                  fontSize: "13px",
                  color: "rgba(13,9,5,0.55)",
                  background: "#fdfaf3",
                  border: "1px solid rgba(160,112,32,0.2)",
                  lineHeight: 1.75,
                }}
              >
                Platforma <strong style={{ color: "#0d0905" }}>Meșteri de Tulcea</strong> este operată de{" "}
                <strong style={{ color: "#0d0905" }}>{COMPANY_NAME}</strong>, {COMPANY_CUI},{" "}
                {COMPANY_REG}, cu sediul la {COMPANY_ADDRESS}, în calitate de{" "}
                <strong style={{ color: "#0d0905" }}>operator de date cu caracter personal</strong> în
                sensul art. 4 alin. (7) din GDPR.
              </div>

              <P id="operator" title="1. Operatorul de date">
                <p>
                  Operatorul de date cu caracter personal este <strong>{COMPANY_NAME}</strong>,
                  {COMPANY_CUI}, {COMPANY_REG}, cu sediul social la {COMPANY_ADDRESS}.
                </p>
                <p>
                  Pentru orice aspect legat de prelucrarea datelor tale personale, ne poți contacta la:{" "}
                  <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: "#a07828" }} className="hover:underline">
                    {COMPANY_EMAIL}
                  </a>.
                </p>
                <p>
                  Prezenta politică se aplică tuturor utilizatorilor platformei Meșteri de Tulcea —
                  atât clienților, cât și meșterilor înregistrați.
                </p>
              </P>

              <P id="date" title="2. Date cu caracter personal colectate">
                <p>Colectăm date cu caracter personal în două moduri:</p>

                <p className="font-semibold" style={{ color: "#0d0905", marginBottom: "-8px" }}>A. Date furnizate direct de tine</p>
                <ul>
                  <li><strong>La crearea contului:</strong> adresă de email, nume complet, parolă (stocată exclusiv în formă criptată).</li>
                  <li><strong>Profil client (opțional):</strong> număr de telefon, fotografie de profil (avatar).</li>
                  <li><strong>Profil meșter:</strong> denumire activitate/nume complet, specialitate, număr de telefon, număr de contact suplimentar, adresă sau zonă de activitate, descriere servicii, ani de experiență, fotografii cu lucrări anterioare.</li>
                  <li><strong>Recenzii:</strong> text, rating (1–5 stele), titlu opțional.</li>
                  <li><strong>Cereri de contact / notificări:</strong> termenul de căutare introdus de client, zona de interes.</li>
                  <li><strong>Donații (dacă folosești funcționalitatea):</strong> nume, mesaj opțional, suma donată. Datele de plată sunt procesate de procesatorul de plăți și nu sunt stocate de noi.</li>
                  <li><strong>Comunicări cu echipa:</strong> mesajele pe care ni le trimiți prin email.</li>
                </ul>

                <p className="font-semibold" style={{ color: "#0d0905", marginBottom: "-8px" }}>B. Date colectate automat</p>
                <ul>
                  <li>Adresă IP și localizare geografică aproximativă (la nivel de localitate/județ).</li>
                  <li>Tip browser, sistem de operare, rezoluție ecran.</li>
                  <li>Pagini vizitate, durata sesiunii, acțiuni efectuate pe platformă.</li>
                  <li>Date de autentificare (token de sesiune, data și ora autentificărilor).</li>
                  <li>Cookie-uri și tehnologii similare — detaliate în <Link href="/cookies" style={{ color: "#a07828" }} className="hover:underline">Politica de cookie-uri</Link>.</li>
                </ul>

                <p>
                  Nu colectăm și nu prelucrăm date din categorii speciale în sensul art. 9 GDPR
                  (date de sănătate, biometrice, etnice, religioase etc.).
                  Nu colectăm în mod intenționat date de la persoane cu vârsta sub 18 ani.
                  Dacă devenim conștienți că am colectat astfel de date, le vom șterge imediat.
                </p>
              </P>

              <P id="scopuri" title="3. Scopurile prelucrării și temeiul legal">
                <p>
                  Prelucrăm datele tale numai pentru scopuri determinate, explicite și legitime,
                  în baza unuia din temeiurile legale prevăzute de art. 6 GDPR:
                </p>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid rgba(160,112,32,0.25)" }}>
                        <th style={{ textAlign: "left", padding: "10px 16px 10px 0", color: "#0d0905", fontWeight: 600, whiteSpace: "nowrap" }}>Scop prelucrare</th>
                        <th style={{ textAlign: "left", padding: "10px 0", color: "#0d0905", fontWeight: 600 }}>Temei legal (art. 6 GDPR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Crearea și administrarea contului de utilizator", "Art. 6(1)(b) — executarea contractului"],
                        ["Afișarea publică a profilului meșterului", "Art. 6(1)(b) — executarea contractului"],
                        ["Trimiterea notificărilor email despre căutări relevante", "Art. 6(1)(b) — executarea contractului"],
                        ["Gestionarea recenziilor și a conținutului publicat", "Art. 6(1)(b) — executarea contractului"],
                        ["Trimiterea emailurilor tranzacționale (confirmare cont, resetare parolă)", "Art. 6(1)(b) — executarea contractului"],
                        ["Prevenirea fraudei și asigurarea securității platformei", "Art. 6(1)(f) — interes legitim"],
                        ["Îmbunătățirea platformei prin analiză statistică anonimizată", "Art. 6(1)(f) — interes legitim"],
                        ["Moderarea profilurilor și a conținutului publicat", "Art. 6(1)(f) — interes legitim"],
                        ["Comunicări de marketing și noutăți (numai cu acordul tău)", "Art. 6(1)(a) — consimțământ"],
                        ["Respectarea obligațiilor fiscale și contabile", "Art. 6(1)(c) — obligație legală"],
                        ["Răspuns la solicitări ale autorităților publice", "Art. 6(1)(c) — obligație legală"],
                      ].map(([scop, temei], i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(160,112,32,0.1)" }}>
                          <td style={{ padding: "10px 16px 10px 0", color: "rgba(13,9,5,0.65)", verticalAlign: "top" }}>{scop}</td>
                          <td style={{ padding: "10px 0", color: "rgba(13,9,5,0.65)", verticalAlign: "top" }}>{temei}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p>
                  Prelucrarea bazată pe interesul nostru legitim [art. 6(1)(f)] are loc numai
                  atunci când am evaluat că interesul nostru nu prevalează în mod nejustificat
                  față de drepturile și libertățile fundamentale ale persoanelor vizate.
                  Ai dreptul de a te opune oricărei prelucrări bazate pe interes legitim
                  (a se vedea secțiunea 7).
                </p>
              </P>

              <P id="durata" title="4. Durata stocării datelor">
                <p>Păstrăm datele tale numai atât timp cât este necesar scopului pentru care au fost colectate:</p>
                <ul>
                  <li><strong>Date cont utilizator:</strong> pe durata existenței contului activ, plus maximum 12 luni de la ștergerea sau dezactivarea contului.</li>
                  <li><strong>Profil meșter și fotografii:</strong> pe durata activității pe platformă, plus maximum 24 de luni de la dezactivarea sau eliminarea profilului.</li>
                  <li><strong>Recenzii publicate:</strong> pe durata existenței profilului meșterului evaluat; la ștergerea profilului meșterului, recenziile aferente sunt anonimizate sau șterse.</li>
                  <li><strong>Loguri tehnice și de securitate:</strong> maximum 90 de zile calendaristice.</li>
                  <li><strong>Date de facturare și plăți (pachete comerciale):</strong> minimum 5 ani de la data tranzacției, conform obligațiilor legale fiscale și contabile (Legea contabilității nr. 82/1991).</li>
                  <li><strong>Comunicări email cu echipa:</strong> maximum 2 ani de la ultima comunicare.</li>
                </ul>
                <p>
                  La expirarea perioadelor de mai sus, datele sunt șterse definitiv sau anonimizate
                  ireversibil, astfel încât să nu mai poată fi asociate unei persoane identificate
                  sau identificabile.
                </p>
              </P>

              <P id="destinatari" title="5. Destinatarii datelor tale">
                <p>
                  Nu vindem, nu închiriem și nu comercializăm datele tale personale.
                  Le transmitem exclusiv în situațiile de mai jos, cu garanții contractuale adecvate:
                </p>
                <ul>
                  <li>
                    <strong>Supabase Inc.</strong> (SUA) — furnizor de infrastructură: baze de date,
                    autentificare și stocare fișiere. Transferul se realizează cu garanții adecvate
                    prin Clauze Contractuale Standard (SCC) aprobate de Comisia Europeană.
                  </li>
                  <li>
                    <strong>Resend Inc.</strong> (SUA) — serviciu de trimitere a emailurilor
                    tranzacționale (confirmare cont, notificări). Transferul se realizează cu garanții
                    adecvate prin Clauze Contractuale Standard.
                  </li>
                  <li>
                    <strong>Furnizor de hosting / CDN</strong> — serviciu de găzduire web și
                    livrare a conținutului platformei. Datele tehnice de acces (IP, sesiune)
                    pot fi înregistrate în logurile serverului.
                  </li>
                  <li>
                    <strong>Procesator de plăți</strong> — pentru achiziționarea de pachete
                    comerciale (dacă este cazul). Datele cardului nu sunt stocate de noi;
                    tranzacțiile sunt procesate direct de furnizorul de plăți.
                  </li>
                  <li>
                    <strong>Autorități publice competente</strong> — exclusiv atunci când suntem
                    obligați legal (ex: ANAF, instanțe judecătorești, organe de urmărire penală),
                    în condițiile și limitele prevăzute de lege.
                  </li>
                </ul>
                <p>
                  Cu toți sub-procesatorii avem încheiate acorduri de prelucrare a datelor (DPA)
                  care obligă aceștia să respecte GDPR și să aplice măsuri tehnice și organizatorice
                  adecvate de protecție.
                </p>
              </P>

              <P id="transferuri" title="6. Transferuri internaționale de date">
                <p>
                  Unii din sub-procesatorii noștri (Supabase Inc., Resend Inc.) sunt stabiliți
                  în Statele Unite ale Americii, o țară terță care nu beneficiază de o decizie
                  de adecvare a Comisiei Europene la momentul redactării prezentei politici.
                </p>
                <p>
                  Transferurile de date către acești furnizori se realizează în baza{" "}
                  <strong>Clauzelor Contractuale Standard (SCC)</strong> adoptate prin Decizia
                  de punere în aplicare (UE) 2021/914 a Comisiei Europene, care constituie
                  garanții adecvate conform art. 46 alin. (2) lit. (c) GDPR.
                </p>
                <p>
                  Poți solicita o copie a garanțiilor aplicabile transferurilor internaționale
                  contactându-ne la {COMPANY_EMAIL}.
                </p>
              </P>

              <P id="drepturi" title="7. Drepturile tale în temeiul GDPR">
                <p>
                  În calitate de persoană vizată, beneficiezi de următoarele drepturi pe care le
                  poți exercita în orice moment, contactându-ne la{" "}
                  <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: "#a07828" }} className="hover:underline">
                    {COMPANY_EMAIL}
                  </a>
                  . Vom răspunde solicitărilor tale în termen de maximum <strong>30 de zile calendaristice</strong>.
                </p>
                <ul>
                  <li>
                    <strong>Dreptul de acces (art. 15 GDPR)</strong> — dreptul de a obține
                    confirmarea că prelucrăm date ale tale și, dacă da, de a primi o copie a
                    acestora și informații despre prelucrare.
                  </li>
                  <li>
                    <strong>Dreptul la rectificare (art. 16 GDPR)</strong> — dreptul de a
                    solicita corectarea datelor inexacte sau completarea datelor incomplete.
                    Multe date pot fi actualizate direct din contul tău.
                  </li>
                  <li>
                    <strong>Dreptul la ștergere / „dreptul de a fi uitat" (art. 17 GDPR)</strong> —
                    dreptul de a solicita ștergerea datelor tale, în condițiile legii (ex: datele
                    nu mai sunt necesare scopului pentru care au fost colectate; îți retragi
                    consimțământul; te opui prelucrării și nu există motive legitime prevalente).
                    Dreptul nu se aplică atunci când prelucrarea este necesară respectării unei
                    obligații legale.
                  </li>
                  <li>
                    <strong>Dreptul la restricționarea prelucrării (art. 18 GDPR)</strong> —
                    dreptul de a solicita limitarea prelucrării datelor tale în anumite
                    circumstanțe (ex: contești exactitatea datelor; prelucrarea este ilegală,
                    dar preferi restricționarea în loc de ștergere).
                  </li>
                  <li>
                    <strong>Dreptul la portabilitate (art. 20 GDPR)</strong> — dreptul de a
                    primi datele furnizate de tine într-un format structurat, utilizat curent
                    și lizibil automat (ex: JSON, CSV), și de a le transmite unui alt operator,
                    pentru prelucrările bazate pe contract sau consimțământ.
                  </li>
                  <li>
                    <strong>Dreptul de opoziție (art. 21 GDPR)</strong> — dreptul de a te
                    opune prelucrării datelor tale bazate pe interes legitim, inclusiv creării
                    de profiluri în aceste scopuri. Prelucrarea va înceta cu excepția cazului
                    în care demonstrăm motive legitime imperioase care prevalează.
                  </li>
                  <li>
                    <strong>Dreptul de retragere a consimțământului</strong> — acolo unde
                    prelucrarea se bazează pe consimțământul tău (ex: emailuri de marketing),
                    poți retrage consimțământul oricând, fără a afecta legalitatea prelucrărilor
                    efectuate anterior retragerii.
                  </li>
                </ul>
                <p>
                  Dacă consideri că drepturile tale nu au fost respectate, ai dreptul să depui
                  o plângere la autoritatea de supraveghere competentă din România:{" "}
                  <strong>Autoritatea Națională de Supraveghere a Prelucrării Datelor cu
                  Caracter Personal (ANSPDCP)</strong>,{" "}
                  <a
                    href="https://www.dataprotection.ro"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#a07828" }}
                    className="hover:underline"
                  >
                    www.dataprotection.ro
                  </a>
                  , B-dul G-ral Gheorghe Magheru nr. 28–30, sector 1, București.
                </p>
              </P>

              <P id="securitate" title="8. Securitatea datelor">
                <p>
                  Aplicăm măsuri tehnice și organizatorice adecvate pentru a proteja datele
                  tale împotriva accesului neautorizat, pierderii, distrugerii sau divulgării
                  accidentale:
                </p>
                <ul>
                  <li>Criptare în tranzit prin protocol HTTPS/TLS pentru toate comunicațiile cu platforma.</li>
                  <li>Parolele utilizatorilor sunt stocate exclusiv în formă criptată (hash), utilizând algoritmi moderni — parola în clar nu este accesibilă nimănui.</li>
                  <li>Control al accesului bazat pe roluri (RBAC) — angajații și sistemele au acces doar la datele strict necesare atribuțiilor lor.</li>
                  <li>Autentificarea prin token-uri de sesiune cu durată de viață limitată.</li>
                  <li>Backup regulat al bazei de date în locații geografice redundante.</li>
                  <li>Monitorizare și alertare pentru activități suspecte.</li>
                </ul>
                <p>
                  În cazul unui incident de securitate (breșă de date) care ar putea genera un
                  risc ridicat pentru drepturile și libertățile tale, vom notifica{" "}
                  <strong>ANSPDCP în termen de 72 de ore</strong> de la constatare și te vom
                  informa pe tine fără întârzieri nejustificate, conform art. 33–34 GDPR.
                </p>
                <p>
                  Nicio măsură de securitate nu este infailibilă. Dacă suspectezi o utilizare
                  neautorizată a contului tău, contactează-ne imediat la {COMPANY_EMAIL}.
                </p>
              </P>

              <P id="cookies" title="9. Cookie-uri și tehnologii similare">
                <p>
                  Platforma utilizează cookie-uri și tehnologii similare pentru funcționarea
                  corectă a serviciilor (sesiune de autentificare, preferințe utilizator) și
                  pentru analiza anonimă a traficului.
                </p>
                <p>
                  Detalii complete despre tipurile de cookie-uri utilizate, scopurile acestora
                  și modalitățile de gestionare a preferințelor tale găsești în{" "}
                  <Link href="/cookies" style={{ color: "#a07828" }} className="hover:underline">
                    Politica de cookie-uri
                  </Link>
                  .
                </p>
              </P>

              <P id="automata" title="10. Decizie automată și profilare">
                <p>
                  Nu utilizăm sisteme de decizie automată sau profilare care să producă efecte
                  juridice sau care să te afecteze semnificativ, în sensul art. 22 GDPR.
                </p>
                <p>
                  Ordinea de afișare a profilurilor de meșteri în rezultatele de căutare poate
                  fi influențată de criterii obiective (relevanță față de termenul căutat,
                  existența unui pachet comercial activ, rating mediu). Aceasta nu constituie
                  profilare în sensul GDPR.
                </p>
              </P>

              <P id="modificari" title="11. Modificarea prezentei politici">
                <p>
                  Ne rezervăm dreptul de a modifica această politică periodic, pentru a reflecta
                  modificări ale practicilor noastre de prelucrare sau ale cadrului legal aplicabil.
                  Data ultimei actualizări este afișată în antetul acestei pagini.
                </p>
                <p>
                  Pentru modificări semnificative care afectează drepturile tale, te vom notifica
                  prin email cu cel puțin 14 zile înainte de intrarea în vigoare a noilor prevederi.
                  Continuarea utilizării platformei după această dată constituie acceptarea politicii
                  actualizate.
                </p>
                <p>
                  Îți recomandăm să consulți periodic această pagină pentru a fi la curent cu
                  modul în care îți protejăm datele.
                </p>
              </P>

              <P id="contact" title="12. Contact">
                <p>
                  Pentru orice întrebare, solicitare sau plângere legată de prelucrarea datelor
                  tale personale, ne poți contacta:
                </p>
                <ul>
                  <li><strong>Societate:</strong> {COMPANY_NAME}</li>
                  <li><strong>CUI:</strong> {COMPANY_CUI}</li>
                  <li><strong>Adresă:</strong> {COMPANY_ADDRESS}</li>
                  <li>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: "#a07828" }} className="hover:underline">
                      {COMPANY_EMAIL}
                    </a>
                  </li>
                </ul>
                <p>
                  Vei primi un răspuns la solicitările legate de drepturile GDPR în termen de
                  maximum <strong>30 de zile calendaristice</strong> de la primirea solicitării.
                  Termenul poate fi prelungit cu maximum 60 de zile suplimentare în cazuri
                  complexe, cu informarea ta prealabilă.
                </p>
              </P>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function P({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
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
      `}</style>
    </section>
  )
}
