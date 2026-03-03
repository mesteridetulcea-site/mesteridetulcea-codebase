import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Termeni și condiții — Meșteri de Tulcea",
  description:
    "Termenii și condițiile de utilizare ale platformei Meșteri de Tulcea. Citește cu atenție înainte de a utiliza serviciile noastre.",
}

const LAST_UPDATED = "1 martie 2025"

export default function TermeniPage() {
  return (
    <>
      {/* Dark header band */}
      <div className="bg-[#0f0b04] border-b border-[#584528]">
        <div className="container py-10 md:py-14">
          <Link
            href="/"
            className="inline-flex items-center text-white/50 hover:text-primary transition-colors text-sm mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi acasă
          </Link>
          <h1 className="font-display text-3xl md:text-4xl text-white font-semibold">
            Termeni și condiții
          </h1>
          <p className="mt-3 text-white/40 text-sm">
            Ultima actualizare: {LAST_UPDATED}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto prose prose-stone prose-sm md:prose-base">
          <Section title="1. Acceptarea termenilor">
            <p>
              Prin accesarea și utilizarea platformei <strong>Meșteri de Tulcea</strong>{" "}
              (<a href="https://mesteritulcea.ro">mesteritulcea.ro</a>), ești de acord să
              respecți și să fii obligat de prezenții Termeni și Condiții. Dacă nu ești de
              acord cu oricare dintre acești termeni, te rugăm să nu utilizezi platforma.
            </p>
            <p>
              Platforma este operată de Meșteri de Tulcea și este destinată exclusiv
              utilizatorilor cu domiciliul sau interese în județul Tulcea, România.
            </p>
          </Section>

          <Section title="2. Descrierea serviciului">
            <p>
              Meșteri de Tulcea este o platformă online care facilitează conectarea între
              persoane fizice (<strong>clienți</strong>) care au nevoie de servicii de
              construcții, reparații sau întreținere, și prestatori de servicii
              (<strong>meșteri</strong>) din zona Tulcea.
            </p>
            <p>
              Platforma nu este parte contractantă în niciun acord încheiat între clienți
              și meșteri. Nu garantăm calitatea, siguranța sau legalitatea serviciilor
              prestate de meșteri, nici solvabilitatea acestora.
            </p>
          </Section>

          <Section title="3. Înregistrarea contului">
            <ul>
              <li>
                Trebuie să ai cel puțin <strong>18 ani</strong> pentru a crea un cont.
              </li>
              <li>
                Ești responsabil pentru păstrarea confidențialității datelor de
                autentificare ale contului tău.
              </li>
              <li>
                Nu îți este permis să creezi conturi false sau să uzurpi identitatea
                altei persoane.
              </li>
              <li>
                Ne rezervăm dreptul de a suspenda sau șterge orice cont care încalcă
                prezentele condiții.
              </li>
            </ul>
          </Section>

          <Section title="4. Obligațiile clienților">
            <p>În calitate de client, te obligi să:</p>
            <ul>
              <li>
                Furnizezi informații corecte și complete atunci când contactezi un meșter
                sau lași o recenzie.
              </li>
              <li>
                Nu postezi recenzii false, înșelătoare sau motivate de scopuri
                concurențiale.
              </li>
              <li>
                Nu utilizezi platforma în scopuri ilegale sau care ar putea prejudicia
                alți utilizatori.
              </li>
              <li>
                Soluționezi direct cu meșterul orice dispută privind serviciile prestate.
              </li>
            </ul>
          </Section>

          <Section title="5. Obligațiile meșterilor">
            <p>În calitate de meșter înregistrat, te obligi să:</p>
            <ul>
              <li>
                Furnizezi informații corecte despre identitatea ta, serviciile oferite,
                experiența și tarifele practicate.
              </li>
              <li>
                Deții toate autorizațiile, licențele și asigurările necesare desfășurării
                activității tale profesionale conform legislației române în vigoare.
              </li>
              <li>
                Nu soliciți plăți în avans excesive sau să adopți practici comerciale
                abuzive față de clienți.
              </li>
              <li>
                Actualizezi prompt informațiile de profil în cazul în care acestea se
                schimbă (disponibilitate, tarife, specialitate etc.).
              </li>
              <li>
                Răspunzi solicitărilor clienților în termen rezonabil.
              </li>
            </ul>
            <p>
              Profilul unui meșter poate fi aprobat sau respins de echipa noastră la
              discreția noastră, fără obligația de a justifica decizia.
            </p>
          </Section>

          <Section title="6. Recenzii și conținut generat de utilizatori">
            <p>
              Prin postarea unei recenzii sau a oricărui alt conținut pe platformă,
              acorzi Meșteri de Tulcea o licență neexclusivă, gratuită și transferabilă
              de a utiliza, reproduce și afișa acel conținut în scopul operării
              platformei.
            </p>
            <p>
              Ne rezervăm dreptul de a elimina orice conținut care:
            </p>
            <ul>
              <li>Conține limbaj ofensator, discriminatoriu sau ilegal.</li>
              <li>Este fals, înșelător sau motivat de rea-credință.</li>
              <li>Încalcă drepturile de proprietate intelectuală ale terților.</li>
              <li>Constituie publicitate sau spam.</li>
            </ul>
            <p>
              Fiecare utilizator poate posta <strong>o singură recenzie</strong> per
              meșter. Recenzia poate fi ștearsă de autorul ei oricând. Recenziile șterse
              nu mai pot fi recuperate.
            </p>
          </Section>

          <Section title="7. Limitarea răspunderii">
            <p>
              Meșteri de Tulcea nu răspunde pentru:
            </p>
            <ul>
              <li>
                Calitatea, siguranța sau rezultatele serviciilor prestate de meșteri.
              </li>
              <li>
                Disputele contractuale sau financiare dintre clienți și meșteri.
              </li>
              <li>
                Orice daune directe, indirecte, incidentale sau consecvente rezultate
                din utilizarea platformei sau a serviciilor meșterilor.
              </li>
              <li>
                Inexactitățile sau omisiunile din informațiile furnizate de meșteri în
                profilurile lor.
              </li>
            </ul>
            <p>
              Utilizezi platforma pe propriul risc. Îți recomandăm să verifici
              independent reputația și autorizațiile meșterului înainte de a contracta
              orice serviciu.
            </p>
          </Section>

          <Section title="8. Proprietate intelectuală">
            <p>
              Toate elementele platformei (design, cod sursă, logo, texte originale)
              sunt proprietatea Meșteri de Tulcea și sunt protejate de legislația privind
              drepturile de autor. Reproducerea parțială sau integrală fără acordul
              nostru scris este interzisă.
            </p>
          </Section>

          <Section title="9. Confidențialitatea datelor">
            <p>
              Prelucrarea datelor cu caracter personal este guvernată de{" "}
              <Link href="/confidentialitate" className="text-primary hover:underline">
                Politica de Confidențialitate
              </Link>
              , care face parte integrantă din prezenții termeni. Prin utilizarea
              platformei, consimți la prelucrarea datelor tale conform acelei politici.
            </p>
          </Section>

          <Section title="10. Modificarea termenilor">
            <p>
              Ne rezervăm dreptul de a modifica prezenții termeni oricând, fără notificare
              prealabilă. Versiunea actualizată va fi publicată pe această pagină cu data
              ultimei modificări. Continuarea utilizării platformei după publicarea
              modificărilor constituie acceptarea noilor termeni.
            </p>
          </Section>

          <Section title="11. Legislație aplicabilă">
            <p>
              Prezenții termeni sunt guvernați de legislația română în vigoare. Orice
              litigiu decurgând din utilizarea platformei va fi soluționat de instanțele
              competente din România, cu prioritate prin mediere.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              Pentru orice întrebări legate de acești termeni, ne poți contacta la:
            </p>
            <ul>
              <li>
                Email:{" "}
                <a href="mailto:contact@mesteritulcea.ro" className="text-primary hover:underline">
                  contact@mesteritulcea.ro
                </a>
              </li>
              <li>Adresă: Tulcea, România</li>
            </ul>
          </Section>
        </div>
      </div>
    </>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
        {title}
      </h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
        {children}
      </div>
    </section>
  )
}
