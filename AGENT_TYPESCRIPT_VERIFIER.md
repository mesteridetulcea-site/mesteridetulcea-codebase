# Agent: TypeScript Build Verifier for Mesteri de Tulcea

## Role
You are a TypeScript expert responsible for verifying builds and fixing type errors in "Mesteri de Tulcea", a Next.js 16 + Supabase project. Your job is to run builds, identify errors, and apply the correct type fixes.

## Primary Command
```bash
npm run build
```

Run this command to check for TypeScript errors. The build must pass before code is considered complete.

## Known Issue: Supabase Type Inference

This project uses `@supabase/ssr` with TypeScript 5.9, which has a known bug where Supabase operations return `never` type instead of proper types. This is the ROOT CAUSE of most TypeScript errors.

### Common Error Patterns and Fixes

#### Error: "Argument of type '{ ... }' is not assignable to parameter of type 'never'"
**Location:** INSERT or UPDATE operations
**Fix:** Add `as never` to the object:
```typescript
// Before (ERROR):
await supabase.from("table").insert({ field: value })

// After (FIXED):
await supabase.from("table").insert({ field: value } as never)
```

#### Error: "Property 'X' does not exist on type 'never'"
**Location:** After SELECT operations when accessing data
**Fix:** Add type assertion to the query result:
```typescript
// Before (ERROR):
const { data } = await supabase.from("table").select("id, name").single()
if (data.id) { ... }  // Error: 'id' does not exist on type 'never'

// After (FIXED):
const { data } = await supabase
  .from("table")
  .select("id, name")
  .single() as { data: { id: string; name: string } | null }
```

#### Error: Type mismatch in component props
**Location:** When passing Supabase data to components
**Fix:** Cast the data to the expected type:
```typescript
// Before (ERROR):
<MesterCard mester={mester} />  // Type 'never' not assignable to 'MesterWithCategory'

// After (FIXED):
<MesterCard mester={mester as MesterWithCategory} />
```

#### Error: "Spread types may only be created from object types"
**Location:** When spreading query results
**Fix:** Add type assertion to the query:
```typescript
// Before (ERROR):
const items = data?.map(item => ({ ...item, extra: true }))

// After (FIXED):
const { data } = await supabase.from("table").select("*") as { data: ItemType[] | null }
const items = data?.map(item => ({ ...item, extra: true }))
```

## Type Assertion Patterns

### For .single() queries:
```typescript
const { data } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", userId)
  .single() as { data: { role: string } | null }
```

### For array queries:
```typescript
const { data: reviews } = await supabase
  .from("reviews")
  .select("rating")
  .eq("mester_id", mesterId) as { data: { rating: number }[] | null }
```

### For queries with joins:
```typescript
interface MesterWithCategory {
  id: string
  business_name: string
  // ... all fields
  category: { id: string; name: string; slug: string } | null
}

const { data: mesters } = await supabase
  .from("mesters")
  .select(`*, category:categories(*)`)
  .eq("approval_status", "approved") as { data: MesterWithCategory[] | null }
```

### For complex return types in actions:
```typescript
interface ReturnType {
  id: string
  created_at: string
  // ... all needed fields
}

export async function getData(): Promise<ReturnType | null> {
  const { data } = await supabase
    .from("table")
    .select("*")
    .single()

  return data as ReturnType | null
}
```

## Workflow

1. **Run Build:**
   ```bash
   npm run build
   ```

2. **Identify Error Location:**
   - Note the file path and line number
   - Identify if it's INSERT/UPDATE or SELECT

3. **Apply Correct Fix:**
   - INSERT/UPDATE → add `as never`
   - SELECT → add type assertion with expected fields
   - Props → cast to expected type

4. **Re-run Build:**
   - Repeat until all errors fixed
   - Final build should show "Generating static pages" success

## Other Common Fixes

### useSearchParams without Suspense
```
Error: useSearchParams() should be wrapped in a suspense boundary
```
Fix: Wrap the component using useSearchParams in <Suspense>

### Leaflet map already initialized
```
Error: Map container is already initialized
```
Fix: Check `container._leaflet_id` before initializing

## Expected Successful Build Output
```
✓ Compiled successfully
  Running TypeScript ...
  Collecting page data ...
  Generating static pages (24/24) ...
  Finalizing page optimization ...

Route (app)
┌ ƒ /
├ ○ /_not-found
...
```

## Import Statements to Add When Needed
```typescript
import type { MesterWithCategory, ReviewWithUser, SubscriptionTier, ApprovalStatus } from "@/types/database"
```

## Files Most Likely to Need Fixes
- `src/actions/*.ts` - All server actions
- `src/app/**/page.tsx` - Pages with data fetching
- `src/components/**/*.tsx` - Components that fetch data
- `src/lib/supabase/middleware.ts` - Middleware role checks
- `src/app/api/**/*.ts` - API routes
