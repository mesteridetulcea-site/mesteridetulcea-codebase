import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, MapPin, Users, Star, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Despre noi — Meșteri de Tulcea",
  description:
    "Aflați povestea platformei Meșteri de Tulcea — de ce am creat-o, misiunea noastră și valorile care ne ghidează.",
}

export default function DesprePage() {
  return (
    <>
      <div className="bg-[#0f0b04] border-b border-[#584528]">
        <div className="container py-10 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center text-white/50 hover:text-primary transition-colors text-sm mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi acasă
          </Link>
          <p className="text-primary text-xs tracking-[0.2em] uppercase font-condensed mb-3">
            Povestea noastră
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-white font-semibold max-w-2xl leading-tight">
            Construim punți între oameni și meșteri de încredere
          </h1>
          <p className="mt-5 text-white/45 max-w-xl leading-relaxed">
            Meșteri de Tulcea s-a născut dintr-o nevoie reală: să faci mai ușor ca
            oricând să găsești un meșter bun în județul nostru.
          </p>
        </div>
      </div>

      {/* Story section */}
      <div className="container py-14 md:py-20">
        <div className="max-w-3xl mx-auto">

          <div className="prose prose-stone prose-sm md:prose-base text-muted-foreground leading-relaxed space-y-6">
            <p>
              Cine nu a trecut prin frustrarea de a căuta un electrician de urgență, un
              instalator de încredere sau un zugrav cu experiență — și de a ajunge în
              final la o listă lungă de recomandări din gura lumii, fără nicio garanție?
            </p>
            <p>
              Am construit <strong className="text-foreground">Meșteri de Tulcea</strong> ca
              răspuns la această problemă. Platforma noastră reunește meșterii verificați
              din județul Tulcea într-un singur loc, oferind clienților informații clare:
              specialitate, portofoliu de lucrări, recenzii reale de la alți clienți și
              date de contact directe.
            </p>
            <p>
              Nu suntem o agenție de intermediere și nu percepem comisioane pentru
              contacte. Credem în transparență: meșterii își administrează propriul profil,
              clienții lasă recenzii autentice, iar noi asigurăm infrastructura care le
              aduce împreună.
            </p>
          </div>

          {/* Values */}
          <div className="mt-16 grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Verificare și calitate",
                text: "Fiecare profil de meșter este revizuit manual de echipa noastră înainte de a fi publicat. Nu aprobăm profiluri incomplete sau suspecte.",
              },
              {
                icon: Star,
                title: "Recenzii autentice",
                text: "Recenziile pot fi lăsate doar de utilizatori înregistrați care au un cont activ. Fiecare utilizator poate lăsa o singură recenzie per meșter.",
              },
              {
                icon: Users,
                title: "Comunitate locală",
                text: "Ne concentrăm exclusiv pe județul Tulcea. Nu vrem să fim o platformă națională generică — vrem să cunoaștem meșterii și comunitățile pe care le servim.",
              },
              {
                icon: MapPin,
                title: "Acces direct",
                text: "Nicio barieră, nicio taxă de contact. Dai click pe numărul de telefon al meșterului și îl suni direct. Simplu.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="border border-border p-6 rounded-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-sm">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 bg-[#0f0b04] rounded-sm p-8 md:p-12">
            <p className="text-center text-primary text-xs tracking-[0.2em] uppercase font-condensed mb-8">
              Platforma în cifre
            </p>
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { value: "Tulcea", label: "Județ acoperit" },
                { value: "Gratuit", label: "Contact meșteri" },
                { value: "Verificat", label: "Fiecare profil" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="font-display text-2xl md:text-3xl text-white font-semibold">
                    {value}
                  </div>
                  <div className="text-white/35 text-xs mt-1 tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">
              Ești meșter în zona Tulcea și vrei să fii găsit mai ușor de clienți?
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Înregistrează-te ca meșter
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">
              Ai întrebări?{" "}
              <a href="mailto:contact@mesteritulcea.ro" className="text-primary hover:underline">
                Scrie-ne
              </a>
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
