import { EquationHistoryItem } from "@/types/chemistry"

const HISTORY_KEY = "equation-balancer-history"
const MAX_HISTORY_ITEMS = 100

/**
 * Save equation history to localStorage
 */
export function saveHistory(history: EquationHistoryItem[]): void {
  try {
    // Keep only the most recent items
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory))
  } catch (error) {
    console.error("Failed to save history to localStorage:", error)
  }
}

/**
 * Load equation history from localStorage
 */
export function loadHistory(): EquationHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (!stored) return []

    const history = JSON.parse(stored) as EquationHistoryItem[]
    return Array.isArray(history) ? history : []
  } catch (error) {
    console.error("Failed to load history from localStorage:", error)
    return []
  }
}

/**
 * Clear all history from localStorage
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    console.error("Failed to clear history from localStorage:", error)
  }
}

/**
 * Add a new item to history
 */
export function addHistoryItem(item: EquationHistoryItem): EquationHistoryItem[] {
  const currentHistory = loadHistory()

  // Check if this equation already exists in history
  const existingIndex = currentHistory.findIndex(
    (h) => h.equation === item.equation
  )

  if (existingIndex !== -1) {
    // Remove the old entry to avoid duplicates
    currentHistory.splice(existingIndex, 1)
  }

  // Add new item at the beginning
  const newHistory = [item, ...currentHistory]

  // Save to localStorage
  saveHistory(newHistory)

  return newHistory
}

/**
 * Remove an item from history by ID
 */
export function removeHistoryItem(id: string): EquationHistoryItem[] {
  const currentHistory = loadHistory()
  const newHistory = currentHistory.filter((item) => item.id !== id)
  saveHistory(newHistory)
  return newHistory
}
