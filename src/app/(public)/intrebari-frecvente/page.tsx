import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Întrebări frecvente — Meșteri de Tulcea",
  description:
    "Răspunsuri la cele mai frecvente întrebări despre platforma Meșteri de Tulcea, atât pentru clienți cât și pentru meșteri.",
}

const faq: { category: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    category: "Întrebări generale",
    items: [
      {
        q: "Ce este Meșteri de Tulcea?",
        a: "Meșteri de Tulcea este o platformă online care conectează locuitorii din județul Tulcea cu meșteri locali verificați — electricieni, instalatori, zidari, zugravi, tâmplari și multe alte specialități. Scopul nostru este să faci mai ușor și mai sigur procesul de a găsi un meșter de încredere.",
      },
      {
        q: "Este gratuit să folosesc platforma?",
        a: "Da. Căutarea meșterilor și vizualizarea profilurilor este complet gratuită pentru clienți. Crearea unui cont de client (necesar pentru a lăsa recenzii) este de asemenea gratuită. Meșterii se pot înregistra gratuit pe platformă.",
      },
      {
        q: "Platforma funcționează doar în Tulcea?",
        a: "Da. Ne concentrăm exclusiv pe județul Tulcea. Toți meșterii listați activează în această zonă. Această focalizare ne permite să verificăm mai bine calitatea profilurilor și să fim cu adevărat utili comunității locale.",
      },
      {
        q: "Cum pot contacta echipa Meșteri de Tulcea?",
        a: (
          <>
            Ne poți scrie la{" "}
            <a href="mailto:contact@mesteritulcea.ro" className="text-primary hover:underline">
              contact@mesteritulcea.ro
            </a>
            . Răspundem de obicei în 1–2 zile lucrătoare.
          </>
        ),
      },
    ],
  },
  {
    category: "Pentru clienți",
    items: [
      {
        q: "Cum găsesc un meșter?",
        a: (
          <>
            Folosește bara de căutare de pe pagina principală (ex: &quot;electrician&quot;, &quot;instalator
            termică&quot;, &quot;montat gresie&quot;) sau navighează direct pe{" "}
            <Link href="/mesteri" className="text-primary hover:underline">
              pagina Meșteri
            </Link>{" "}
            și filtrează după specialitate. Fiecare profil afișează informații complete și
            recenzii de la alți clienți.
          </>
        ),
      },
      {
        q: "Meșterii sunt verificați?",
        a: "Fiecare profil de meșter este revizuit manual de echipa noastră înainte de publicare. Verificăm că informațiile furnizate sunt coerente și că profilul este complet. Totuși, nu verificăm autorizațiile profesionale ale meșterilor — îți recomandăm să soliciți tu dovezi de calificare direct meșterului înainte de a contracta lucrări de amploare.",
      },
      {
        q: "Pot contacta un meșter fără să am cont?",
        a: "Da. Numărul de telefon și butonul WhatsApp sunt vizibile pe profilul meșterului fără a fi necesar un cont. Contul este necesar doar dacă vrei să lași o recenzie sau să salvezi meșteri la favorite.",
      },
      {
        q: "Platforma intermediază plata sau contractul?",
        a: "Nu. Meșteri de Tulcea nu este parte a contractului dintre tine și meșter și nu procesează plăți. Toate negocierile, acordurile și plățile au loc direct între tine și meșter.",
      },
      {
        q: "Ce fac dacă am o problemă cu un meșter găsit pe platformă?",
        a: "Soluționarea disputelor este responsabilitatea ta și a meșterului — noi nu suntem parte contractantă. Poți lăsa o recenzie negativă pentru a avertiza alți clienți. Dacă consideri că un profil conține informații false sau înșelătoare, ne poți scrie la contact@mesteritulcea.ro și vom analiza situația.",
      },
    ],
  },
  {
    category: "Recenzii",
    items: [
      {
        q: "Cum pot lăsa o recenzie?",
        a: "Trebuie să ai un cont activ pe platformă. Intră pe profilul meșterului, apasă pe \"Lasă o recenzie\", selectează un rating (1–5 stele) și opțional adaugă un titlu și un comentariu.",
      },
      {
        q: "Pot modifica o recenzie după ce am trimis-o?",
        a: "Nu, recenziile nu pot fi editate după trimitere. Poți în schimb șterge recenzia ta și posta una nouă.",
      },
      {
        q: "Pot lăsa mai multe recenzii pentru același meșter?",
        a: "Nu. Fiecare utilizator poate lăsa o singură recenzie per meșter. Dacă ai șters recenzia anterioară, poți posta una nouă.",
      },
      {
        q: "Recenziile sunt moderate?",
        a: "Da. Echipa noastră poate elimina recenziile care conțin limbaj ofensator, sunt în mod evident false sau au scop de spam/concurență neloială. Recenziile autentice, chiar negative, nu sunt eliminate.",
      },
    ],
  },
  {
    category: "Pentru meșteri",
    items: [
      {
        q: "Cum mă înregistrez ca meșter?",
        a: (
          <>
            Creează un cont pe platformă (sau folosește contul existent), apoi accesează{" "}
            <strong>Panou Meșter</strong> din meniu și completează formularul de înregistrare.
            Profilul tău va fi revizuit de echipa noastră înainte de a fi publicat.
          </>
        ),
      },
      {
        q: "Cât durează aprobarea profilului?",
        a: "De obicei 1–2 zile lucrătoare. Dacă profilul este respins, vei primi un mesaj cu motivul și poți corecta și retrimite.",
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
        a: "Când un client caută o specialitate similară cu a ta în zona ta, sistemul poate trimite o notificare pe email. Poți gestiona preferințele de notificare din profilul tău.",
      },
      {
        q: "Pot fi eliminat de pe platformă?",
        a: "Da. Ne rezervăm dreptul de a suspenda sau elimina profiluri care conțin informații false, primesc multiple reclamații justificate sau încalcă Termenii și Condițiile platformei.",
      },
    ],
  },
  {
    category: "Cont și date personale",
    items: [
      {
        q: "Cum îmi șterg contul?",
        a: (
          <>
            Scrie-ne la{" "}
            <a href="mailto:contact@mesteritulcea.ro" className="text-primary hover:underline">
              contact@mesteritulcea.ro
            </a>{" "}
            cu subiectul &quot;Ștergere cont&quot; de pe adresa de email asociată contului. Vom
            procesa cererea în termen de 30 de zile conform GDPR.
          </>
        ),
      },
      {
        q: "Ce date colectați despre mine?",
        a: (
          <>
            Detalii complete găsești în{" "}
            <Link href="/confidentialitate" className="text-primary hover:underline">
              Politica de confidențialitate
            </Link>
            . Pe scurt: adresă de email, nume, și informațiile pe care le adaugi tu în profil.
          </>
        ),
      },
    ],
  },
]

export default function IntrebariFrecventePage() {
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
            Întrebări frecvente
          </h1>
          <p className="mt-3 text-white/40 max-w-lg leading-relaxed">
            Nu găsești răspunsul?{" "}
            <a href="mailto:contact@mesteritulcea.ro" className="text-primary/70 hover:text-primary transition-colors">
              Scrie-ne
            </a>
            .
          </p>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-14">
          {faq.map((section) => (
            <div key={section.category}>
              <h2 className="text-base font-semibold text-foreground mb-6 pb-2 border-b border-border">
                {section.category}
              </h2>
              <div className="space-y-0 divide-y divide-border">
                {section.items.map((item) => (
                  <details key={item.q} className="group py-4">
                    <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                      <span className="font-medium text-foreground text-sm pr-4">
                        {item.q}
                      </span>
                      <span className="text-primary shrink-0 mt-0.5 text-base leading-none group-open:rotate-45 transition-transform duration-200">
                        +
                      </span>
                    </summary>
                    <div className="mt-3 text-sm text-muted-foreground leading-relaxed pr-8">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </>
  )
}
