/**
 * Encode equation to URL-safe format
 */
export function encodeEquationToURL(equation: string): string {
  return encodeURIComponent(btoa(equation))
}

/**
 * Decode equation from URL
 */
export function decodeEquationFromURL(encoded: string): string | null {
  try {
    return atob(decodeURIComponent(encoded))
  } catch (error) {
    console.error("Failed to decode equation from URL:", error)
    return null
  }
}

/**
 * Generate shareable URL for equation
 */
export function generateShareURL(equation: string): string {
  const encoded = encodeEquationToURL(equation)
  const baseURL = window.location.origin + window.location.pathname
  return `${baseURL}?eq=${encoded}`
}

/**
 * Get equation from URL parameters
 */
export function getEquationFromURL(): string | null {
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('eq')

  if (!encoded) return null

  return decodeEquationFromURL(encoded)
}

/**
 * Copy share URL to clipboard
 */
export async function copyShareURL(equation: string): Promise<string> {
  const shareURL = generateShareURL(equation)
  await navigator.clipboard.writeText(shareURL)
  return shareURL
}

/**
 * Update URL without reloading page
 */
export function updateURL(equation: string | null): void {
  const url = new URL(window.location.href)

  if (equation) {
    url.searchParams.set('eq', encodeEquationToURL(equation))
  } else {
    url.searchParams.delete('eq')
  }

  window.history.replaceState({}, '', url.toString())
}
