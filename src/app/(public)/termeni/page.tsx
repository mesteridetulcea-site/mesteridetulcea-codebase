import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Termeni și condiții — Meșteri de Tulcea",
  description:
    "Termenii și condițiile de utilizare ale platformei Meșteri de Tulcea. Citește cu atenție înainte de a utiliza serviciile noastre.",
}

const LAST_UPDATED = "1 martie 2025"

// ─── Placeholder-uri de completat ────────────────────────────────────────────
const COMPANY_NAME    = "[DENUMIRE SOCIETATE]"
const COMPANY_CUI     = "[CUI: RO________]"
const COMPANY_REG     = "[Nr. Reg. Com.: J__/__/____]"
const COMPANY_ADDRESS = "[ADRESĂ SEDIU SOCIAL], Tulcea, România"
const COMPANY_EMAIL   = "contact@mesteritulcea.ro"
const PLATFORM_URL    = "https://mesteritulcea.ro"
// ─────────────────────────────────────────────────────────────────────────────

const sections = [
  { id: "definitii",       label: "1. Definiții" },
  { id: "acceptare",       label: "2. Acceptarea termenilor" },
  { id: "serviciu",        label: "3. Descrierea serviciului" },
  { id: "cont",            label: "4. Înregistrarea contului" },
  { id: "clienti",         label: "5. Obligațiile clienților" },
  { id: "mesteri",         label: "6. Obligațiile meșterilor" },
  { id: "continut",        label: "7. Recenzii și conținut" },
  { id: "interzis",        label: "8. Conduită interzisă" },
  { id: "plati",           label: "9. Plăți și pachete" },
  { id: "raspundere",      label: "10. Limitarea răspunderii" },
  { id: "proprietate",     label: "11. Proprietate intelectuală" },
  { id: "date",            label: "12. Date personale" },
  { id: "retragere",       label: "13. Dreptul de retragere" },
  { id: "litigii",         label: "14. Soluționarea litigiilor" },
  { id: "modificari",      label: "15. Modificarea termenilor" },
  { id: "legislatie",      label: "16. Legislație aplicabilă" },
  { id: "contact",         label: "17. Contact" },
]

export default function TermeniPage() {
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
            style={{ fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 600, maxWidth: "600px" }}
          >
            Termeni și{" "}
            <em style={{ color: "#a07828", fontStyle: "italic" }}>condiții</em>
          </h1>
          <p
            className="font-condensed tracking-wide mt-5"
            style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}
          >
            Ultima actualizare: {LAST_UPDATED}
          </p>
          <p
            className="font-condensed tracking-wide mt-3"
            style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", maxWidth: "520px", lineHeight: 1.7 }}
          >
            Te rugăm să citești cu atenție prezenții termeni înainte de a utiliza platforma.
            Accesarea și utilizarea site-ului constituie acceptarea necondiționată a acestor termeni.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: "#f9f5ec" }}>
        <div className="container px-4 md:px-8 py-14 md:py-20">
          <div className="md:grid md:gap-16" style={{ gridTemplateColumns: "210px 1fr" }}>

            {/* ── Sidebar nav — desktop only ── */}
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

              {/* Operator notice */}
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
                Platforma <strong style={{ color: "#0d0905" }}>Meșteri de Tulcea</strong> ({PLATFORM_URL}) este
                operată de <strong style={{ color: "#0d0905" }}>{COMPANY_NAME}</strong>, {COMPANY_CUI},{" "}
                {COMPANY_REG}, cu sediul la {COMPANY_ADDRESS}.
              </div>

              <T id="definitii" title="1. Definiții">
                <p>În sensul prezenților termeni, următorii termeni au semnificațiile de mai jos:</p>
                <ul>
                  <li><strong>„Platformă"</strong> — site-ul web Meșteri de Tulcea, accesibil la {PLATFORM_URL}, inclusiv toate funcționalitățile și serviciile oferite prin acesta.</li>
                  <li><strong>„Operator"</strong> — {COMPANY_NAME}, societatea care administrează și operează platforma.</li>
                  <li><strong>„Utilizator"</strong> — orice persoană fizică (cu vârsta de minimum 18 ani) sau juridică care accesează platforma.</li>
                  <li><strong>„Client"</strong> — utilizatorul care caută meșteri sau prestatori de servicii prin intermediul platformei.</li>
                  <li><strong>„Meșter"</strong> — persoana fizică sau juridică înregistrată pe platformă ca prestator de servicii.</li>
                  <li><strong>„Profil"</strong> — pagina publică a unui meșter, conținând informații despre servicii, experiență, fotografii și date de contact.</li>
                  <li><strong>„Conținut"</strong> — orice text, imagine, recenzie sau altă informație publicată de utilizatori pe platformă.</li>
                  <li><strong>„Pachet"</strong> — serviciu opțional plătit care oferă meșterilor vizibilitate suplimentară în rezultatele platformei.</li>
                </ul>
              </T>

              <T id="acceptare" title="2. Acceptarea termenilor">
                <p>
                  Prin accesarea, navigarea sau utilizarea platformei Meșteri de Tulcea în orice mod,
                  confirmi că ai citit, ai înțeles și ești de acord să respecți prezenții Termeni și
                  Condiții, împreună cu <Link href="/confidentialitate" style={{ color: "#a07828" }} className="hover:underline">Politica de Confidențialitate</Link> și{" "}
                  <Link href="/cookies" style={{ color: "#a07828" }} className="hover:underline">Politica de Cookies</Link>, care fac parte integrantă din prezenții termeni.
                </p>
                <p>
                  Dacă nu ești de acord cu oricare dintre acești termeni, te rugăm să nu utilizezi platforma.
                  Utilizarea continuă a platformei după publicarea unor versiuni actualizate ale termenilor
                  constituie acceptarea modificărilor.
                </p>
                <p>
                  Prezentele condiții se aplică atât clienților, cât și meșterilor înregistrați pe platformă.
                </p>
              </T>

              <T id="serviciu" title="3. Descrierea serviciului">
                <p>
                  Meșteri de Tulcea este un <strong>site de prezentare și listare</strong> care permite
                  clienților să descopere meșteri și prestatori de servicii din județul Tulcea.
                  Platforma pune la dispoziție un spațiu online în care meșterii pot publica profiluri
                  cu informații despre serviciile oferite, iar clienții pot căuta, vizualiza profiluri
                  și contacta direct prestatorii.
                </p>
                <p>
                  <strong>Operatorul nu este parte contractantă</strong> în niciun acord încheiat
                  între clienți și meșteri. Contractele de prestare de servicii se încheie exclusiv
                  între client și meșter, în afara platformei, fără implicarea sau garantarea
                  executării de către Operator.
                </p>
                <p>
                  Operatorul nu garantează și nu răspunde pentru: calitatea, legalitatea sau siguranța
                  serviciilor prestate de meșteri; solvabilitatea, autorizarea sau calificarea
                  meșterilor; existența sau acuratețea recenziilor publicate; disponibilitatea
                  meșterilor la un moment dat.
                </p>
                <p>
                  Platforma funcționează exclusiv pentru zona județului Tulcea și a zonei limitrofe.
                </p>
              </T>

              <T id="cont" title="4. Înregistrarea contului">
                <p>Crearea unui cont pe platformă este gratuită. Prin crearea unui cont, declari și garantezi că:</p>
                <ul>
                  <li>Ai vârsta de cel puțin <strong>18 ani</strong>.</li>
                  <li>Informațiile furnizate la înregistrare sunt corecte, complete și actualizate.</li>
                  <li>Nu ai un cont existent care a fost suspendat sau eliminat de echipa platformei.</li>
                  <li>Ești responsabil pentru confidențialitatea datelor de autentificare și pentru orice activitate desfășurată prin contul tău.</li>
                  <li>Vei notifica imediat operatorul în cazul oricărei utilizări neautorizate a contului.</li>
                </ul>
                <p>
                  Operatorul își rezervă dreptul de a suspenda sau șterge orice cont care încalcă
                  prezenții termeni, fără notificare prealabilă și fără obligația de a justifica decizia.
                </p>
              </T>

              <T id="clienti" title="5. Obligațiile clienților">
                <p>În calitate de client, te obligi să:</p>
                <ul>
                  <li>Furnizezi informații corecte și complete atunci când contactezi un meșter sau lași o recenzie.</li>
                  <li>Nu postezi recenzii false, înșelătoare sau motivate de scopuri concurențiale.</li>
                  <li>Verifici independent calificările, autorizațiile și reputația meșterului ales înainte de a-i contracta serviciile.</li>
                  <li>Soluționezi direct cu meșterul orice dispută privind serviciile contractate; platforma nu are calitatea de mediator și nu poate interveni în litigii comerciale.</li>
                  <li>Nu utilizezi platforma în scopuri ilegale sau care ar putea prejudicia alți utilizatori.</li>
                </ul>
              </T>

              <T id="mesteri" title="6. Obligațiile meșterilor">
                <p>În calitate de meșter înregistrat, te obligi să:</p>
                <ul>
                  <li>Furnizezi informații corecte și complete despre identitatea ta, serviciile oferite, zona de activitate, experiența și, dacă este cazul, tarifele practicate.</li>
                  <li>Deții toate autorizațiile, licențele, asigurările și înregistrările fiscale necesare desfășurării legale a activității profesionale conform legislației române în vigoare. Operatorul nu verifică existența acestor documente și nu răspunde pentru lipsa lor.</li>
                  <li>Actualizezi prompt informațiile de profil ori de câte ori acestea se modifică (disponibilitate, specialitate, date de contact etc.).</li>
                  <li>Nu adopți practici comerciale abuzive față de clienți (ex: solicitare de plăți în avans nejustificate, abandon de lucrare, utilizarea platformei pentru activități ilegale).</li>
                  <li>Nu creezi mai mult de un profil activ pe platformă.</li>
                </ul>
                <p>
                  Profilul unui meșter este supus aprobării manuale de către echipa platformei.
                  Aprobarea sau respingerea profilului se face la discreția Operatorului, fără obligația
                  de a justifica decizia. Un profil aprobat poate fi ulterior suspendat sau eliminat
                  dacă sunt identificate încălcări ale prezenților termeni.
                </p>
              </T>

              <T id="continut" title="7. Recenzii și conținut generat de utilizatori">
                <p>
                  Utilizatorii înregistrați pot posta recenzii și alte conținuturi pe platformă.
                  Prin publicarea unui conținut, acorzi Operatorului o licență neexclusivă, gratuită
                  și revocabilă de a utiliza, reproduce și afișa acel conținut în scopul operării
                  platformei.
                </p>
                <p>Ești singurul responsabil pentru conținutul pe care îl publici. Conținutul publicat trebuie să fie:</p>
                <ul>
                  <li>Bazat pe o experiență reală, personală, cu meșterul recenzat.</li>
                  <li>Corect, obiectiv și nediscriminatoriu.</li>
                  <li>Redactat în limba română.</li>
                  <li>Lipsit de informații cu caracter personal al terților (ex: date de contact ale meșterului dincolo de cele publice).</li>
                </ul>
                <p>
                  Fiecare utilizator poate posta <strong>o singură recenzie per meșter</strong>.
                  Recenzia poate fi ștearsă de autorul ei oricând; odată ștearsă, nu mai poate fi recuperată.
                </p>
                <p>
                  Operatorul poate elimina, fără notificare, orice conținut care încalcă prezentele
                  condiții, conține limbaj ofensator, este fals sau înșelător, constituie spam sau
                  publicitate mascată, ori încalcă drepturile terților.
                </p>
              </T>

              <T id="interzis" title="8. Conduită interzisă">
                <p>Este strict interzisă utilizarea platformei pentru:</p>
                <ul>
                  <li>Publicarea de informații false, înșelătoare sau care uzurpă identitatea altei persoane sau entități.</li>
                  <li>Hărțuire, amenințare sau intimidare a altor utilizatori.</li>
                  <li>Orice activitate contrară legislației române sau europene aplicabile.</li>
                  <li>Colectarea datelor altor utilizatori fără consimțământul acestora.</li>
                  <li>Utilizarea de roboți, crawlere sau alte metode automate de accesare sau scraping al platformei.</li>
                  <li>Tentative de acces neautorizat la sistemele informatice ale platformei.</li>
                  <li>Publicarea de conținut cu caracter pornografic, discriminatoriu, rasist sau care incită la ură.</li>
                  <li>Publicarea de conținut care încalcă drepturile de proprietate intelectuală ale terților.</li>
                </ul>
                <p>
                  Încălcarea acestor prevederi poate atrage suspendarea sau eliminarea contului,
                  notificarea autorităților competente și angajarea răspunderii civile sau penale
                  a utilizatorului în cauză.
                </p>
              </T>

              <T id="plati" title="9. Plăți și pachete comerciale pentru meșteri">
                <p>
                  Înregistrarea de bază pe platformă este gratuită pentru meșteri. Platforma oferă
                  opțional <strong>pachete comerciale plătite</strong> care oferă vizibilitate
                  suplimentară în rezultatele de căutare și în listele platformei.
                </p>
                <p>
                  Achiziționarea unui pachet comercial nu garantează obținerea de contracte sau
                  contacte din partea clienților. Operatorul nu răspunde pentru rezultatele
                  comerciale obținute de meșter ca urmare a achiziționării unui pachet.
                </p>
                <p>
                  Prețurile, durata și condițiile pachetelor sunt cele afișate pe platformă la
                  momentul achiziției. Operatorul își rezervă dreptul de a modifica oferta de
                  pachete și prețurile aferente, cu notificarea utilizatorilor afectați.
                </p>
                <p>
                  Rambursările pentru pachete achiziționate sunt posibile doar în condițiile
                  dreptului de retragere prevăzut la articolul 13 și numai dacă pachetul
                  nu a fost activat sau utilizat.
                </p>
              </T>

              <T id="raspundere" title="10. Limitarea răspunderii">
                <p>Operatorul nu răspunde pentru:</p>
                <ul>
                  <li>Calitatea, siguranța, legalitatea sau rezultatele serviciilor prestate de meșteri.</li>
                  <li>Disputele contractuale sau financiare dintre clienți și meșteri.</li>
                  <li>Inexactitățile, omisiunile sau informațiile false din profilurile meșterilor.</li>
                  <li>Orice daune directe, indirecte, incidentale, speciale sau consecvente rezultate din utilizarea platformei sau a serviciilor unui meșter.</li>
                  <li>Întreruperile tehnice temporare ale platformei, cauzate de întreținere, forță majoră sau cauze externe.</li>
                  <li>Pierderea sau compromiterea datelor de autentificare ale utilizatorilor din cauze neimputabile Operatorului.</li>
                </ul>
                <p>
                  Platforma este furnizată „ca atare" (<em>as is</em>). Utilizezi platforma pe
                  propriul risc. Îți recomandăm să verifici independent identitatea, autorizațiile
                  și reputația meșterului ales înainte de a contracta orice serviciu.
                </p>
                <p>
                  Răspunderea totală a Operatorului față de un utilizator, indiferent de cauza
                  acțiunii, nu poate depăși valoarea sumelor efectiv plătite de acel utilizator
                  Operatorului în ultimele 12 luni, sau 100 lei, oricare sumă este mai mare.
                </p>
              </T>

              <T id="proprietate" title="11. Proprietate intelectuală">
                <p>
                  Toate elementele platformei — inclusiv, fără limitare, design-ul, codul sursă,
                  logo-ul, denumirea comercială, structura, textele originale și graficile — sunt
                  proprietatea exclusivă a Operatorului și sunt protejate de legislația română și
                  europeană privind drepturile de autor și proprietatea intelectuală.
                </p>
                <p>
                  Reproducerea, distribuirea, modificarea, comunicarea publică sau orice altă utilizare
                  a conținutului platformei, parțial sau integral, fără acordul scris prealabil al
                  Operatorului, este interzisă și poate atrage răspunderea civilă și penală.
                </p>
                <p>
                  Prin publicarea de conținut pe platformă, utilizatorul declară că deține toate
                  drepturile necesare pentru acel conținut și că publicarea sa nu încalcă drepturile
                  niciunei terțe persoane.
                </p>
              </T>

              <T id="date" title="12. Protecția datelor personale">
                <p>
                  Prelucrarea datelor cu caracter personal ale utilizatorilor este guvernată de{" "}
                  <Link href="/confidentialitate" style={{ color: "#a07828" }} className="hover:underline">
                    Politica de Confidențialitate
                  </Link>
                  , document distinct care face parte integrantă din prezenții termeni.
                </p>
                <p>
                  Prin utilizarea platformei, îți exprimi consimțământul pentru prelucrarea datelor
                  tale personale în condițiile descrise în Politica de Confidențialitate, în conformitate
                  cu Regulamentul (UE) 2016/679 (GDPR) și legislația română aplicabilă.
                </p>
                <p>
                  Operatorul nu vinde și nu transmite datele personale ale utilizatorilor către terți,
                  cu excepția cazurilor prevăzute de lege sau menționate explicit în Politica de
                  Confidențialitate.
                </p>
              </T>

              <T id="retragere" title="13. Dreptul de retragere">
                <p>
                  Prezenta secțiune se aplică exclusiv contractelor încheiate între Operator și
                  meșteri persoane fizice autorizate sau consumatori, pentru achiziționarea de{" "}
                  <strong>pachete comerciale plătite</strong> oferite de platformă.
                  Clienții care caută meșteri prin platformă nu încheie niciun contract cu Operatorul
                  — contactul și contractarea serviciilor de construcții sau reparații se realizează
                  direct între client și meșter, în afara platformei.
                </p>
                <p>
                  În conformitate cu OUG nr. 34/2014 privind drepturile consumatorilor în contractele
                  încheiate la distanță, meșterii care achiziționează un pachet plătit beneficiază de
                  un <strong>drept de retragere de 14 zile calendaristice</strong> de la data plății,
                  fără a fi necesară invocarea unui motiv, cu condiția ca pachetul să nu fi fost
                  activat sau utilizat.
                </p>
                <p>
                  Dreptul de retragere se exercită prin transmiterea unei notificări scrise la{" "}
                  {COMPANY_EMAIL} înainte de expirarea celor 14 zile. Rambursarea sumei plătite
                  se efectuează în termen de 14 zile de la primirea notificării, prin același
                  mijloc de plată utilizat inițial.
                </p>
                <p>
                  <strong>Dreptul de retragere nu se aplică</strong> pentru pachetele deja activate
                  sau al căror beneficiu a început să fie utilizat (ex: profilul a fost afișat în
                  rezultatele promovate), dacă meșterul și-a exprimat acordul expres la începerea
                  executării și a luat cunoștință de pierderea dreptului de retragere în această situație.
                </p>
              </T>

              <T id="litigii" title="14. Soluționarea litigiilor">
                <p>
                  În cazul unor litigii sau nemulțumiri legate de utilizarea platformei, te rugăm
                  să ne contactezi în primul rând la {COMPANY_EMAIL}. Ne angajăm să răspundem
                  în termen de <strong>30 de zile calendaristice</strong> de la primirea sesizării.
                </p>
                <p>
                  Dacă litigiul nu poate fi soluționat pe cale amiabilă, consumatorii au dreptul
                  de a sesiza{" "}
                  <strong>Autoritatea Națională pentru Protecția Consumatorilor (ANPC)</strong>{" "}
                  sau de a apela la mecanismele de soluționare alternativă a litigiilor (SAL/ADR),
                  inclusiv prin platforma europeană SOL (Online Dispute Resolution) accesibilă la{" "}
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#a07828" }}
                    className="hover:underline"
                  >
                    ec.europa.eu/consumers/odr
                  </a>
                  .
                </p>
                <p>
                  Litigiile dintre meșteri (persoane juridice sau PFA/II) și Operator sunt excluse
                  de la aplicarea procedurilor de soluționare alternativă a litigiilor pentru consumatori.
                </p>
              </T>

              <T id="modificari" title="15. Modificarea termenilor">
                <p>
                  Operatorul își rezervă dreptul de a modifica prezenții termeni oricând, fără
                  notificare prealabilă. Versiunea actualizată va fi publicată pe această pagină
                  cu data ultimei modificări.
                </p>
                <p>
                  Continuarea utilizării platformei după publicarea versiunii actualizate constituie
                  acceptarea necondiționată a noilor termeni. Îți recomandăm să verifici periodic
                  această pagină pentru a fi la curent cu eventualele modificări.
                </p>
              </T>

              <T id="legislatie" title="16. Legislație aplicabilă și jurisdicție">
                <p>
                  Prezenții termeni sunt guvernați și interpretați în conformitate cu legislația
                  română în vigoare, inclusiv Codul Civil, OUG nr. 34/2014 privind drepturile
                  consumatorilor și Regulamentul (UE) 2016/679 (GDPR).
                </p>
                <p>
                  Orice litigiu decurgând din sau în legătură cu utilizarea platformei, care nu
                  poate fi soluționat pe cale amiabilă, va fi supus jurisdicției exclusive a
                  instanțelor judecătorești competente din România.
                </p>
              </T>

              <T id="contact" title="17. Contact">
                <p>Pentru orice întrebări sau sesizări legate de prezenții termeni, ne poți contacta:</p>
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
              </T>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function T({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-5">
        <h2
          className="font-display shrink-0 leading-none"
          style={{ fontSize: "clamp(17px, 1.9vw, 21px)", fontWeight: 600, color: "#0d0905" }}
        >
          {title}
        </h2>
        <div className="flex-1 h-px" style={{ background: "rgba(160,112,32,0.2)" }} />
      </div>

      {/* Content */}
      <div
        className="font-condensed tracking-wide leading-relaxed space-y-4"
        style={{ fontSize: "15px", color: "rgba(13,9,5,0.62)", lineHeight: 1.8 }}
      >
        {children}
      </div>

      {/* Child elements styling via CSS-in-JS approach using Tailwind */}
      <style>{`
        #${id} ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        #${id} ul li {
          padding-left: 20px;
          position: relative;
        }
        #${id} ul li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 10px;
          width: 5px;
          height: 5px;
          background: rgba(160,112,32,0.55);
          transform: rotate(45deg);
        }
        #${id} strong {
          color: #0d0905;
          font-weight: 600;
        }
      `}</style>
    </section>
  )
}
