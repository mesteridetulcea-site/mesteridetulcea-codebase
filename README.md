# Meșteri de Tulcea

Marketplace de servicii pentru regiunea Tulcea, România. Conectează clienții cu meșteri locali verificați — instalatori, electricieni, zugravi, tâmplari și altele.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Database / Auth**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS v4 (config în `globals.css` via `@theme`)
- **UI**: Radix UI + shadcn/ui
- **Email**: Resend
- **Forms**: react-hook-form + Zod

## Funcționalități

- Listare și căutare meșteri
- Profiluri detaliate cu poze, recenzii și rating
- Autentificare completă (email/parolă, recuperare parolă)
- Favorite, recenzii, cereri de servicii
- Upload și moderare poze (admin)
- Sistem donații cu moderare admin
- Notificări email automate

## Structura rutelor

```
src/app/
  (auth)/       # /login, /register, /reset-password
  (public)/     # /, /mesteri, /mester/[slug], /cauta
  (protected)/  # /cont, /mester-cont — necesită autentificare
  admin/        # /admin — necesită rol admin
  api/          # /api/search, /api/email/notify-mesters
```

## Instalare și rulare locală

```bash
# Instalează dependențele
npm install

# Copiază și completează variabilele de mediu
cp .env.example .env.local

# Pornește serverul de development
npm run dev
```

Aplicația va fi disponibilă la [http://localhost:3000](http://localhost:3000).

## Variabile de mediu

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
RESEND_API_KEY=
EMAIL_FROM=
```

## Comenzi disponibile

```bash
npm run dev      # Server de development
npm run build    # Build de producție
npm run lint     # Verificare ESLint
```