import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Politica de cookie-uri — Meșteri de Tulcea",
  description:
    "Află ce cookie-uri folosim pe Meșteri de Tulcea, de ce le folosim și cum le poți gestiona.",
}

const LAST_UPDATED = "1 martie 2025"

export default function CookiesPage() {
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
            Politica de cookie-uri
          </h1>
          <p className="mt-3 text-white/40 text-sm">
            Ultima actualizare: {LAST_UPDATED}
          </p>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-10 text-sm text-muted-foreground leading-relaxed">

          <Section title="Ce sunt cookie-urile?">
            <p>
              Cookie-urile sunt fișiere text de mici dimensiuni pe care un site web le
              plasează în browserul tău atunci când îl vizitezi. Ele permit site-ului să
              rețină informații despre vizita ta (cum ar fi preferințele de limbă sau
              starea sesiunii de autentificare), ca să nu fie nevoie să le reintroduci la
              fiecare accesare.
            </p>
            <p>
              Cookie-urile nu pot executa cod sau accesa fișierele de pe computerul tău.
              Conform legislației europene (Directiva ePrivacy și GDPR), avem obligația
              să îți explicăm ce cookie-uri folosim și să obținem consimțământul tău
              pentru cele non-esențiale.
            </p>
          </Section>

          <Section title="Cookie-urile pe care le folosim">
            <div className="space-y-6">
              <CookieCategory
                name="Strict necesare"
                badge="Întotdeauna active"
                badgeColor="bg-green-100 text-green-800"
                description="Aceste cookie-uri sunt esențiale pentru funcționarea platformei. Fără ele, serviciile de bază (autentificare, securitate) nu pot funcționa. Nu necesită consimțământ."
                cookies={[
                  {
                    name: "sb-*-auth-token",
                    provider: "Supabase",
                    purpose: "Sesiune de autentificare — menține utilizatorul logat",
                    duration: "Sesiune / 1 săptămână",
                  },
                  {
                    name: "sb-*-auth-token-code-verifier",
                    provider: "Supabase",
                    purpose: "Securitate OAuth — previne atacuri CSRF la autentificare",
                    duration: "Sesiune",
                  },
                ]}
              />

              <CookieCategory
                name="Funcționale"
                badge="Necesită consimțământ"
                badgeColor="bg-amber-100 text-amber-800"
                description="Aceste cookie-uri permit funcții îmbunătățite și personalizare (ex: reținerea preferințelor tale)."
                cookies={[
                  {
                    name: "mdt-preferences",
                    provider: "Meșteri de Tulcea",
                    purpose: "Reține preferințele de afișare (filtru categorie, sortare)",
                    duration: "30 de zile",
                  },
                ]}
              />

              <CookieCategory
                name="Analiză și performanță"
                badge="Necesită consimțământ"
                badgeColor="bg-amber-100 text-amber-800"
                description="Ne ajută să înțelegem cum folosesc vizitatorii platforma, pentru a o îmbunătăți. Datele sunt anonime sau pseudonime."
                cookies={[
                  {
                    name: "—",
                    provider: "—",
                    purpose: "În prezent nu folosim servicii de analiză terță parte",
                    duration: "—",
                  },
                ]}
              />

              <CookieCategory
                name="Marketing"
                badge="Necesită consimțământ"
                badgeColor="bg-amber-100 text-amber-800"
                description="Folosite pentru a afișa reclame relevante. În prezent nu folosim cookie-uri de marketing."
                cookies={[
                  {
                    name: "—",
                    provider: "—",
                    purpose: "Nu folosim cookie-uri de marketing sau retargeting",
                    duration: "—",
                  },
                ]}
              />
            </div>
          </Section>

          <Section title="Cum poți gestiona cookie-urile">
            <p>
              Poți controla și/sau șterge cookie-urile după cum dorești. Poți șterge
              toate cookie-urile deja prezente pe dispozitivul tău și poți seta
              majoritatea browserelor să blocheze plasarea de cookie-uri.
            </p>
            <p>
              Instrucțiuni pentru principalele browsere:
            </p>
            <ul>
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/en-us/105082" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Safari
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Microsoft Edge
                </a>
              </li>
            </ul>
            <p>
              <strong>Atenție:</strong> dacă blochezi cookie-urile strict necesare,
              nu vei putea rămâne autentificat pe platformă.
            </p>
          </Section>

          <Section title="Cookie-uri terțe">
            <p>
              Anumite funcționalități ale platformei pot implica servicii terțe (ex:
              autentificare Google prin OAuth). Aceste servicii pot plasa propriile
              cookie-uri, guvernate de politicile lor de confidențialitate:
            </p>
            <ul>
              <li>
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Politica de confidențialitate Google
                </a>
              </li>
            </ul>
          </Section>

          <Section title="Contact">
            <p>
              Pentru întrebări legate de utilizarea cookie-urilor, scrie-ne la{" "}
              <a href="mailto:contact@mesteritulcea.ro" className="text-primary hover:underline">
                contact@mesteritulcea.ro
              </a>
              . Mai multe detalii despre prelucrarea datelor personale găsești în{" "}
              <Link href="/confidentialitate" className="text-primary hover:underline">
                Politica de confidențialitate
              </Link>
              .
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

interface CookieRow {
  name: string
  provider: string
  purpose: string
  duration: string
}

function CookieCategory({
  name,
  badge,
  badgeColor,
  description,
  cookies,
}: {
  name: string
  badge: string
  badgeColor: string
  description: string
  cookies: CookieRow[]
}) {
  return (
    <div className="border border-border rounded-sm p-4 space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="font-medium text-foreground">{name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <p className="text-xs">{description}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-1.5 pr-3 font-medium text-foreground">Cookie</th>
              <th className="text-left py-1.5 pr-3 font-medium text-foreground">Furnizor</th>
              <th className="text-left py-1.5 pr-3 font-medium text-foreground">Scop</th>
              <th className="text-left py-1.5 font-medium text-foreground">Durată</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cookies.map((c) => (
              <tr key={c.name}>
                <td className="py-1.5 pr-3 font-mono">{c.name}</td>
                <td className="py-1.5 pr-3">{c.provider}</td>
                <td className="py-1.5 pr-3">{c.purpose}</td>
                <td className="py-1.5">{c.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
