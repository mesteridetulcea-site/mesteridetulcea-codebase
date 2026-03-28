// Normalize Romanian text (remove diacritics)
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ș/g, "s")
    .replace(/ț/g, "t")
    .replace(/ă/g, "a")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
}

// Check if query looks like a service request (longer, more descriptive)
export function looksLikeServiceRequest(query: string): boolean {
  const words = query.trim().split(/\s+/)
  const requestKeywords = [
    "am nevoie",
    "caut",
    "vreau",
    "trebuie",
    "ajutor",
    "repara",
    "instala",
    "schimba",
    "problema",
    "stricat",
    "defect",
    "urgent",
  ]

  const normalizedQuery = normalizeText(query)

  // More than 5 words or contains request keywords
  return (
    words.length > 5 ||
    requestKeywords.some((keyword) => normalizedQuery.includes(keyword))
  )
}

// Calculate match score for a category
export function calculateCategoryMatch(
  query: string,
  categoryName: string,
  keywords: string[] | null
): number {
  const normalizedQuery = normalizeText(query)
  const normalizedCategoryName = normalizeText(categoryName)

  // 1. Direct full match with category name
  if (normalizedQuery.includes(normalizedCategoryName)) return 100
  if (normalizedCategoryName.includes(normalizedQuery)) return 90

  // Extract meaningful query words (min 3 chars)
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length >= 3)

  // 2. Keyword matching — word-by-word with prefix support for Romanian inflections
  // e.g. "priza" matches keyword "prize" via 4-char prefix "priz"
  //      "repar" matches keyword "reparare" via substring
  if (keywords && keywords.length > 0) {
    for (const keyword of keywords) {
      const nk = normalizeText(keyword)

      // Full phrase in query
      if (normalizedQuery.includes(nk)) return 80

      // Word-level matching
      for (const qw of queryWords) {
        // Substring: "reparare".includes("repar") or "prize".includes("priz")
        if (nk.includes(qw)) return 75
        if (qw.includes(nk)) return 70

        // 4-char prefix match for Romanian inflections
        // "priza" vs "prize" → both start with "priz" → match
        if (qw.length >= 4 && nk.length >= 4 && qw.slice(0, 4) === nk.slice(0, 4)) {
          return 60
        }
      }
    }
  }

  // 3. Partial word matching against category name
  const categoryWords = normalizedCategoryName.split(/\s+/)
  let matchCount = 0
  for (const qw of queryWords) {
    for (const cw of categoryWords) {
      if (cw.includes(qw)) matchCount++
    }
  }
  if (matchCount > 0) return 50 + matchCount * 10

  return 0
}
