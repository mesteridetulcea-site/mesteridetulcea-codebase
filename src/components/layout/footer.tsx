import Link from "next/link"
import { Hammer, Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  servicii: [
    { label: "Electricieni", href: "/mesteri?categorie=electrician" },
    { label: "Instalatori", href: "/mesteri?categorie=instalator" },
    { label: "Zidari", href: "/mesteri?categorie=zidar" },
    { label: "Zugravii", href: "/mesteri?categorie=zugrav" },
    { label: "Transport", href: "/transport" },
  ],
  informatii: [
    { label: "Despre noi", href: "/despre" },
    { label: "Cum funcționează", href: "/cum-functioneaza" },
    { label: "Devino meșter", href: "/devino-mester" },
    { label: "Întrebări frecvente", href: "/intrebari-frecvente" },
  ],
  legal: [
    { label: "Termeni și condiții", href: "/termeni" },
    { label: "Politica de confidențialitate", href: "/confidentialitate" },
    { label: "Cookie-uri", href: "/cookies" },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0f0b04] border-t border-[#584528]">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Hammer className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-white tracking-wide">Meșteri de Tulcea</span>
            </Link>
            <p className="text-sm text-white/45 italic leading-relaxed">
              Platforma care conectează locuitorii din Tulcea cu meșteri de
              încredere pentru orice tip de lucrare.
            </p>
            <div className="space-y-2 text-sm text-white/45">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary/70" />
                <span>Tulcea, România</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary/70" />
                <a
                  href="mailto:contact@mesteritulcea.ro"
                  className="hover:text-primary transition-colors"
                >
                  contact@mesteritulcea.ro
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary/70" />
                <a
                  href="tel:+40712345678"
                  className="hover:text-primary transition-colors"
                >
                  0712 345 678
                </a>
              </div>
            </div>
          </div>

          {/* Servicii */}
          <div>
            <h3 className="font-semibold mb-4 text-white tracking-widest uppercase text-sm border-b border-[#584528] pb-2">Servicii</h3>
            <ul className="space-y-2">
              {footerLinks.servicii.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/45 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informații */}
          <div>
            <h3 className="font-semibold mb-4 text-white tracking-widest uppercase text-sm border-b border-[#584528] pb-2">Informații</h3>
            <ul className="space-y-2">
              {footerLinks.informatii.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/45 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-white tracking-widest uppercase text-sm border-b border-[#584528] pb-2">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/45 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#584528]/50 mt-8 pt-8 text-center text-sm text-white/25">
          <p>
            &copy; {currentYear} Meșteri de Tulcea. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  )
}
