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

  // Direct match with category name
  if (normalizedQuery.includes(normalizedCategoryName)) {
    return 100
  }

  if (normalizedCategoryName.includes(normalizedQuery)) {
    return 90
  }

  // Keyword matching
  if (keywords) {
    for (const keyword of keywords) {
      const normalizedKeyword = normalizeText(keyword)
      if (normalizedQuery.includes(normalizedKeyword)) {
        return 80
      }
      if (normalizedKeyword.includes(normalizedQuery)) {
        return 70
      }
    }
  }

  // Partial word matching
  const queryWords = normalizedQuery.split(/\s+/)
  const categoryWords = normalizedCategoryName.split(/\s+/)

  let matchCount = 0
  for (const qWord of queryWords) {
    for (const cWord of categoryWords) {
      if (qWord.length >= 3 && cWord.includes(qWord)) {
        matchCount++
      }
    }
  }

  if (matchCount > 0) {
    return 50 + matchCount * 10
  }

  return 0
}
