import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

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
    { label: "Devino meșter", href: "/devino-mester" },
    { label: "Întrebări frecvente", href: "/intrebari-frecvente" },
  ],
  legal: [
    { label: "Termeni și condiții", href: "/termeni" },
    { label: "Confidențialitate", href: "/confidentialitate" },
    { label: "Cookie-uri", href: "/cookies" },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0d0905] border-t border-[#3d2e14]">
      {/* Gradient accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

      <div className="container py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="group inline-flex flex-col gap-0.5">
              <span className="font-display italic font-light text-white/35 text-[10px] tracking-[0.2em] group-hover:text-primary/50 transition-colors duration-200">
                Meșteri de
              </span>
              <span className="font-condensed font-bold text-white text-[18px] tracking-[0.25em] uppercase group-hover:text-primary transition-colors duration-200">
                Tulcea
              </span>
            </Link>
            <p className="text-sm text-white/30 leading-relaxed">
              Platforma care conectează locuitorii din Tulcea cu meșteri de
              încredere pentru orice tip de lucrare.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-white/30">
                <MapPin className="h-3.5 w-3.5 text-primary/45 shrink-0" />
                <span>Tulcea, România</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/30">
                <Mail className="h-3.5 w-3.5 text-primary/45 shrink-0" />
                <a
                  href="mailto:contact@mesteridetulcea.ro"
                  className="hover:text-primary/65 transition-colors duration-200"
                >
                  contact@mesteridetulcea.ro
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/30">
                <Phone className="h-3.5 w-3.5 text-primary/45 shrink-0" />
                <a
                  href="tel:+40758065244"
                  className="hover:text-primary/65 transition-colors duration-200"
                >
                  0758 065 244
                </a>
              </div>
            </div>
          </div>

          {/* Servicii */}
          <div>
            <h3 className="font-condensed font-semibold mb-4 text-white/80 tracking-[0.22em] uppercase text-xs">
              Servicii
            </h3>
            <div className="w-5 h-px bg-primary/45 mb-5" />
            <ul className="space-y-3">
              {footerLinks.servicii.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/28 hover:text-primary/60 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informații */}
          <div>
            <h3 className="font-condensed font-semibold mb-4 text-white/80 tracking-[0.22em] uppercase text-xs">
              Informații
            </h3>
            <div className="w-5 h-px bg-primary/45 mb-5" />
            <ul className="space-y-3">
              {footerLinks.informatii.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/28 hover:text-primary/60 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-condensed font-semibold mb-4 text-white/80 tracking-[0.22em] uppercase text-xs">
              Legal
            </h3>
            <div className="w-5 h-px bg-primary/45 mb-5" />
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/28 hover:text-primary/60 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#3d2e14]/40 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/18 font-condensed tracking-[0.15em]">
            &copy; {currentYear} Meșteri de Tulcea. Toate drepturile rezervate.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-primary/25 rotate-45" />
            <p className="text-xs text-white/15 font-condensed tracking-[0.15em]">
              Tulcea, România
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
