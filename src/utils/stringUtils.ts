import { ReferenceInfo } from "@/types/chat"

// Map of footnote symbols to their numeric equivalents
export const footnoteMap: { [key: string]: number } = {
  '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9, '¹⁰': 10,
  '¹¹': 11, '¹²': 12, '¹³': 13, '¹⁴': 14, '¹⁵': 15, '¹⁶': 16, '¹⁷': 17, '¹⁸': 18, '¹⁹': 19, '²⁰': 20
}

export const getFootnoteNumber = (symbol: string): number | null => {
  return footnoteMap[symbol] || null
}

export const getFootnoteSymbolsPattern = (): string => {
  return Object.keys(footnoteMap).join('|')
}

export const getFootnoteSymbol = (number: number): string | null => {
  const entry = Object.entries(footnoteMap).find(([, value]) => value === number)
  return entry ? entry[0] : null
}

export const formatReferenceText = (reference: ReferenceInfo): string => {
  const parts = []
  
  if (reference.title) {
    parts.push(reference.title)
  }
  
  if (reference.section) {
    parts.push(reference.section)
  }
  
  if (reference.page) {
    parts.push(reference.page)
  }

  return parts.join(' - ')
} 