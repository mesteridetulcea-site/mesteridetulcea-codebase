# Mesteri de Tulcea - Project Context for AI Agents

## Overview
**Mesteri de Tulcea** is a Romanian local services marketplace (similar to Thumbtack/TaskRabbit) for Tulcea city. It connects clients with local tradespeople (meșteri) like electricians, plumbers, carpenters, etc.

**Tech Stack:**
- Next.js 16.1.6 (App Router, Turbopack)
- TypeScript 5.9
- Supabase (PostgreSQL, Auth, Storage)
- shadcn/ui components
- Tailwind CSS v4
- Leaflet for maps

**Language:** Romanian (UI text, error messages)

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth route group
│   │   ├── login/page.tsx         # Login page with Suspense
│   │   ├── register/page.tsx      # Registration
│   │   ├── callback/route.ts      # OAuth callback
│   │   └── layout.tsx             # Centered card layout
│   │
│   ├── (public)/                  # Public pages (uses Header/Footer)
│   │   ├── page.tsx               # Homepage
│   │   ├── mesteri/page.tsx       # Browse mesters with filters
│   │   ├── mester/[slug]/page.tsx # Individual mester profile
│   │   ├── cauta/page.tsx         # Smart search page
│   │   ├── transport/page.tsx     # Transport requests with map
│   │   └── layout.tsx
│   │
│   ├── (protected)/               # Auth-required pages
│   │   ├── cont/                  # Client dashboard
│   │   │   ├── page.tsx           # Main dashboard
│   │   │   ├── favorite/page.tsx  # Saved favorites
│   │   │   └── cereri/page.tsx    # Service requests
│   │   ├── mester-cont/           # Mester dashboard
│   │   │   ├── page.tsx
│   │   │   ├── profil/page.tsx
│   │   │   ├── fotografii/page.tsx
│   │   │   ├── abonament/page.tsx
│   │   │   └── statistici/page.tsx
│   │   └── layout.tsx
│   │
│   ├── admin/                     # Admin panel (role: admin)
│   │   ├── page.tsx               # Dashboard with metrics
│   │   ├── mesteri/page.tsx       # Mester approvals
│   │   ├── fotografii/page.tsx    # Photo approvals
│   │   ├── categorii/page.tsx     # Category management
│   │   └── layout.tsx             # Sidebar layout, role check
│   │
│   ├── api/
│   │   ├── search/route.ts        # Search API
│   │   └── email/notify-mesters/route.ts  # Email notifications
│   │
│   ├── globals.css                # Tailwind + custom theme
│   ├── layout.tsx                 # Root layout
│   ├── not-found.tsx              # 404 page
│   └── error.tsx                  # Error boundary
│
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── layout/                    # Header, Footer
│   ├── home/                      # Homepage sections
│   ├── mester/                    # Mester-related components
│   │   ├── mester-card.tsx
│   │   ├── mester-filters.tsx
│   │   ├── photo-gallery.tsx
│   │   ├── review-form.tsx
│   │   ├── reviews-section.tsx
│   │   ├── reviews-with-form.tsx
│   │   ├── subscription-badge.tsx
│   │   ├── whatsapp-button.tsx
│   │   └── favorite-button.tsx
│   ├── search/                    # Search components
│   ├── transport/                 # Map & transport form
│   ├── admin/                     # Admin components
│   └── shared/                    # Empty state, skeletons
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client + Admin client
│   │   └── middleware.ts          # Auth middleware helper
│   ├── utils/
│   │   └── search.ts              # Search utilities
│   ├── constants/                 # App constants
│   └── hooks/
│       └── use-user.ts            # Client-side user hook
│
├── types/
│   └── database.ts                # Supabase generated types + custom types
│
├── actions/                       # Server Actions
│   ├── auth.ts                    # signIn, signUp, signOut
│   ├── mester.ts                  # Mester CRUD
│   ├── photos.ts                  # Photo upload/delete
│   ├── favorites.ts               # Toggle favorites
│   ├── reviews.ts                 # Review CRUD
│   ├── transport.ts               # Transport requests
│   └── admin.ts                   # Admin operations
│
└── middleware.ts                  # Route protection
```

---

## Database Schema (Supabase)

### Tables

**profiles**
- id (uuid, PK, references auth.users)
- email, full_name, phone, avatar_url
- role: 'client' | 'mester' | 'admin'
- created_at, updated_at

**categories**
- id (uuid, PK)
- name, slug, description, icon
- keywords (text[]) - for smart search
- order_index
- created_at

**mesters**
- id (uuid, PK)
- profile_id (FK to profiles)
- category_id (FK to categories)
- slug, business_name, description
- experience_years, whatsapp_number, address, city
- subscription_tier: 'ucenic' | 'mester' | 'master' | 'premium'
- approval_status: 'pending' | 'approved' | 'rejected'
- is_featured, average_rating, total_reviews, total_views
- created_at, updated_at

**mester_photos**
- id (uuid, PK)
- mester_id (FK)
- url, caption, is_cover, order_index
- approval_status: 'pending' | 'approved' | 'rejected'
- created_at

**reviews**
- id (uuid, PK)
- mester_id (FK)
- user_id (FK to profiles)
- rating (1-5), comment
- created_at, updated_at

**favorites**
- id (uuid, PK)
- user_id (FK)
- mester_id (FK)
- created_at

**service_requests**
- id (uuid, PK)
- query, category_id, user_id
- notified_mesters (text[])
- status: 'pending' | 'sent' | 'completed'
- created_at

**transport_requests**
- id (uuid, PK)
- user_id
- pickup_address, pickup_lat, pickup_lng
- dropoff_address, dropoff_lat, dropoff_lng
- description, phone, status
- created_at

---

## Key Patterns & Conventions

### Supabase Type Workaround
Due to TypeScript 5.9 + @supabase/ssr incompatibility, Supabase queries return `never` type. Use these patterns:

```typescript
// For INSERT/UPDATE operations:
await supabase.from("table").insert({ ... } as never)
await supabase.from("table").update({ ... } as never)

// For SELECT operations:
const { data } = await supabase
  .from("table")
  .select("*")
  .single() as { data: { id: string; ... } | null }

// For SELECT with joins:
const { data: mesters } = await supabase
  .from("mesters")
  .select(`*, category:categories(*)`)
  .eq("approval_status", "approved") as { data: MesterWithCategory[] | null }
```

### Server vs Client Components
- **Server Components** (default): Data fetching, no "use client"
- **Client Components**: Interactive UI, use "use client" directive
- Components using `useSearchParams` must be wrapped in `<Suspense>`

### Server Actions
Located in `src/actions/`. Pattern:
```typescript
"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function actionName(formData: FormData) {
  const supabase = await createClient()
  // ... logic
  revalidatePath("/relevant-path")
  return { success: true } // or { error: "Romanian message" }
}
```

### Authentication
- Uses Supabase Auth with cookie-based sessions
- `createClient()` for user operations
- `createAdminClient()` for admin operations (bypasses RLS)
- Middleware protects routes and checks roles

### Subscription Tiers
Order of priority: premium > master > mester > ucenic
- ucenic: gray badge
- mester: blue badge
- master: gold/amber badge
- premium: purple badge

### Photo Workflow
1. Upload to Supabase Storage bucket "mester-photos"
2. Create record with approval_status: 'pending'
3. Admin approves → 'approved'
4. Only approved photos shown publicly

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=              # For email notifications
EMAIL_FROM=noreply@mesteritulcea.ro
```

---

## Common Tasks

### Adding a new page
1. Create page.tsx in appropriate route group
2. Use Server Component for data fetching
3. Add metadata export for SEO
4. Create loading.tsx skeleton if needed

### Adding a server action
1. Create in src/actions/ with "use server" directive
2. Get user with createClient() or use createAdminClient()
3. Return { success: true } or { error: "Romanian message" }
4. Call revalidatePath() after mutations

### Adding a component
1. Server component by default
2. Add "use client" only if needs interactivity
3. Import types from @/types/database
4. Follow existing component patterns

### Database queries
Always use type assertions due to TypeScript issue:
```typescript
const { data } = await supabase
  .from("table")
  .select("field1, field2")
  .eq("id", id)
  .single() as { data: { field1: string; field2: number } | null }
```

---

## Current State
- All 12 phases complete
- Build passes successfully
- All routes functional
- Admin panel operational
- Transport feature with Leaflet map
- Review system implemented

---

## Known Issues
1. **Supabase types**: Use `as never` for mutations, explicit casts for queries
2. **Leaflet SSR**: Use dynamic import, check _leaflet_id to prevent double init
3. **useSearchParams**: Must wrap in Suspense boundary
4. **Middleware deprecation**: Next.js shows warning about middleware → proxy migration
