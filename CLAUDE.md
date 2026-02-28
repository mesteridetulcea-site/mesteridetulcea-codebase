# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Next.js)
npm run build     # Production build
npm run lint      # Run ESLint
```

No test suite is configured.

## Architecture Overview

**Meșteri de Tulcea** is a Next.js 16 App Router craft services marketplace for the Tulcea region (Romania). Users can discover and contact tradespeople ("meșteri"), leave reviews, and save favorites.

### Tech Stack

- **Framework**: Next.js 16.1.6, React 19, TypeScript 5
- **Database/Auth**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS v4 (PostCSS-based — no `tailwind.config.js`, all config in `globals.css` via `@theme`)
- **UI**: Radix UI primitives + shadcn/ui pattern in `src/components/ui/`
- **Email**: Resend (`RESEND_API_KEY`)
- **Forms**: react-hook-form + zod validation
- **Font**: Playfair Display (serif, loaded via `next/font/google`)

### Route Groups

```
src/app/
  (auth)/           # Login, register, OAuth callback — dark themed layout
  (public)/         # Home, /mesteri, /mester/[slug], /cauta — shared public layout
  (protected)/      # /cont, /mester-cont — requires auth (enforced in layout + middleware)
  admin/            # /admin — requires role === "admin"
  api/              # API routes: /api/search, /api/email/notify-mesters
```

### Data Flow

**Server actions** (`src/actions/*.ts`) handle all mutations. Pattern:
```typescript
"use server"
// 1. Get user
const { data: { user } } = await supabase.auth.getUser()
if (!user) return { error: "..." }
// 2. Do operation
// 3. revalidatePath() then return { success: true } or { error: "..." }
```

**API routes** (`src/app/api/`) handle GET search and POST email notifications. The notify route uses the admin client (bypasses RLS).

### Supabase Clients

Three clients, each for a different context:
- `src/lib/supabase/client.ts` — browser client (components with "use client")
- `src/lib/supabase/server.ts` — server client with cookie management (RSC, server actions, API routes)
- Admin client (`createClient()` with service role key) — used in API routes that need to bypass RLS

### Auth & Middleware

`src/middleware.ts` → `src/lib/supabase/middleware.ts`:
- Refreshes session on every request
- Redirects unauthenticated users away from `/cont/*`, `/mester-cont/*`
- Checks `profiles.role === "admin"` for `/admin/*`
- Redirects authenticated users away from `/login`, `/register`

### Database Schema (key tables)

```
profiles        — users extended from auth.users (role: client | mester | admin)
mesters         — business profiles (subscription_tier: ucenic | mester | master | premium)
categories      — service categories with keywords[] for search matching
mester_photos   — uploaded work photos (is_cover, approval_status)
reviews         — ratings + comments
favorites       — user saved mesters
service_requests — logged search queries that triggered mester notifications
```

All generated TypeScript types are in `src/types/database.ts`. Common composed types:
- `MesterWithCategory` = `Mester & { category: Category }`
- `MesterWithDetails` = `Mester & { category, profile, photos }`

### Styling System

Tailwind CSS v4 — configuration lives entirely in `src/app/globals.css`:
- Color palette uses CSS custom properties in HSL format (`--primary: 40 58% 40%`)
- Design language: warm gold/brown palette (`#0f0b04` dark, `#584528` border/accent, `#a07828` gold primary)
- Hotel-inspired aesthetic: dark header/footer sections, gold ★ ornament dividers, serif Playfair Display, sharp corners (`--radius: 0.125rem`)
- `.container` is explicitly centered via `@layer base` (Tailwind v4 does not auto-center containers)

Page layout pattern for public inner pages: dark header band → white/cream content below, using `<>` fragment wrappers.

### Constants & Utilities

- `src/lib/constants/index.ts` — `SUBSCRIPTION_TIERS`, `ITEMS_PER_PAGE` (12), `DEFAULT_CITY`
- `src/lib/utils/search.ts` — Romanian diacritics normalization, category keyword matching, service request detection heuristic
- `src/lib/hooks/use-user.ts` — `{ user, profile, loading }` client hook with auth state listener

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY       # Server-only, bypasses RLS
NEXT_PUBLIC_APP_URL             # Used for OAuth redirect URLs
RESEND_API_KEY
EMAIL_FROM
```
