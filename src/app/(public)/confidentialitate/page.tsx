import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Politica de confidențialitate — Meșteri de Tulcea",
  description:
    "Află cum colectăm, utilizăm și protejăm datele tale personale pe platforma Meșteri de Tulcea, în conformitate cu GDPR.",
}

const LAST_UPDATED = "1 martie 2025"

export default function ConfidentialitatePage() {
  return (
    <>
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
            Politica de confidențialitate
          </h1>
          <p className="mt-3 text-white/40 text-sm">
            Ultima actualizare: {LAST_UPDATED}
          </p>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-10 text-sm text-muted-foreground leading-relaxed">

          <div className="p-4 border border-primary/30 bg-primary/5 rounded-sm text-foreground text-sm">
            Această politică descrie modul în care <strong>Meșteri de Tulcea</strong> prelucrează datele tale cu caracter personal, în conformitate cu <strong>Regulamentul (UE) 2016/679 (GDPR)</strong> și legislația română aplicabilă.
          </div>

          <Section title="1. Operatorul de date">
            <p>
              Operatorul de date cu caracter personal este <strong>Meșteri de Tulcea</strong>,
              cu sediul în Tulcea, România. Ne poți contacta la{" "}
              <a href="mailto:contact@mesteritulcea.ro" className="text-primary hover:underline">
                contact@mesteritulcea.ro
              </a>{" "}
              pentru orice aspect legat de prelucrarea datelor tale.
            </p>
          </Section>

          <Section title="2. Date colectate">
            <p>Colectăm următoarele categorii de date:</p>
            <SubSection title="Date furnizate direct de tine">
              <ul>
                <li><strong>La înregistrare:</strong> adresă de email, nume, parolă (stocată criptat)</li>
                <li><strong>Profil meșter:</strong> nume complet, număr de telefon, adresă, descriere servicii, fotografii de lucru</li>
                <li><strong>Recenzii:</strong> text, rating, titlu</li>
                <li><strong>Cereri de servicii:</strong> descrierea solicitării, locație aproximativă</li>
              </ul>
            </SubSection>
            <SubSection title="Date colectate automat">
              <ul>
                <li>Adresă IP și date de localizare aproximativă</li>
                <li>Tip browser și sistem de operare</li>
                <li>Pagini vizitate și durată sesiune</li>
                <li>Cookie-uri (detaliate în <Link href="/cookies" className="text-primary hover:underline">Politica de cookie-uri</Link>)</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="3. Scopurile prelucrării și temeiul legal">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-medium text-foreground">Scop</th>
                  <th className="text-left py-2 font-medium text-foreground">Temei legal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Crearea și gestionarea contului", "Executarea contractului (art. 6(1)(b) GDPR)"],
                  ["Afișarea profilurilor meșterilor", "Executarea contractului"],
                  ["Trimiterea notificărilor despre cereri de servicii", "Executarea contractului / Interes legitim"],
                  ["Prevenirea fraudei și securitatea platformei", "Interes legitim (art. 6(1)(f) GDPR)"],
                  ["Îmbunătățirea platformei (analiză statistică)", "Interes legitim"],
                  ["Comunicări de marketing (cu acordul tău)", "Consimțământ (art. 6(1)(a) GDPR)"],
                  ["Respectarea obligațiilor legale", "Obligație legală (art. 6(1)(c) GDPR)"],
                ].map(([scop, temei]) => (
                  <tr key={scop}>
                    <td className="py-2 pr-4">{scop}</td>
                    <td className="py-2">{temei}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="4. Durata păstrării datelor">
            <ul>
              <li><strong>Datele contului:</strong> pe durata existenței contului + 1 an după ștergere</li>
              <li><strong>Profiluri meșteri:</strong> pe durata activității + 2 ani după inactivare</li>
              <li><strong>Recenzii:</strong> pe durata existenței profilului meșterului evaluat</li>
              <li><strong>Loguri de securitate:</strong> 90 de zile</li>
              <li><strong>Date de facturare (dacă există):</strong> 5 ani conform obligațiilor fiscale</li>
            </ul>
            <p>
              La expirarea perioadelor de mai sus, datele sunt șterse sau anonimizate
              ireversibil.
            </p>
          </Section>

          <Section title="5. Cui transmitem datele tale">
            <p>Nu vindem datele tale personale. Le transmitem exclusiv:</p>
            <ul>
              <li>
                <strong>Supabase Inc.</strong> — furnizor de infrastructură baze de date și
                autentificare (SUA, cu garanții adecvate prin Clauze Contractuale Standard)
              </li>
              <li>
                <strong>Resend Inc.</strong> — serviciu de trimitere emailuri tranzacționale
              </li>
              <li>
                <strong>Autorități publice</strong> — exclusiv când suntem obligați legal
              </li>
            </ul>
            <p>
              Toți sub-procesatorii noștri oferă garanții adecvate de protecție a datelor
              conform GDPR.
            </p>
          </Section>

          <Section title="6. Drepturile tale">
            <p>
              În conformitate cu GDPR, ai următoarele drepturi pe care le poți exercita
              contactându-ne la{" "}
              <a href="mailto:contact@mesteritulcea.ro" className="text-primary hover:underline">
                contact@mesteritulcea.ro
              </a>
              :
            </p>
            <ul>
              <li><strong>Dreptul de acces</strong> — să știi ce date deținem despre tine</li>
              <li><strong>Dreptul la rectificare</strong> — corectarea datelor inexacte</li>
              <li><strong>Dreptul la ștergere</strong> — &quot;dreptul de a fi uitat&quot;, în condițiile legii</li>
              <li><strong>Dreptul la restricționarea prelucrării</strong> — în anumite circumstanțe</li>
              <li><strong>Dreptul la portabilitate</strong> — primirea datelor tale într-un format structurat</li>
              <li><strong>Dreptul de opoziție</strong> — în special față de prelucrarea bazată pe interes legitim</li>
              <li><strong>Dreptul de retragere a consimțământului</strong> — oricând, fără ca retragerea să afecteze prelucrările anterioare</li>
            </ul>
            <p>
              Ai dreptul să depui o plângere la{" "}
              <strong>Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</strong>{" "}
              — <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.dataprotection.ro</a>.
            </p>
          </Section>

          <Section title="7. Securitatea datelor">
            <p>
              Aplicăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor
              tale: criptare în tranzit (HTTPS/TLS), criptare a parolelor, control al
              accesului bazat pe roluri, backup regulat și monitorizare de securitate.
            </p>
            <p>
              În cazul unui incident de securitate care te-ar putea afecta, te vom notifica
              conform termenelor legale (72 de ore către ANSPDCP, fără întârzieri nejustificate
              către tine).
            </p>
          </Section>

          <Section title="8. Modificarea politicii">
            <p>
              Putem actualiza această politică periodic. Versiunea curentă este întotdeauna
              disponibilă pe această pagină. Pentru modificări semnificative, te vom notifica
              prin email sau prin notificare pe platformă.
            </p>
          </Section>

        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-foreground mb-4 pb-2 border-b border-border">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <h3 className="text-sm font-medium text-foreground mb-2">{title}</h3>
      {children}
    </div>
  )
}
