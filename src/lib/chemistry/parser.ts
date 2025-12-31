import { ParsedCompound, ParsedEquation, ElementCount } from '@/types/chemistry'

/**
 * Parse a chemical formula and return element counts
 * Handles nested parentheses like Ca(OH)2, Al2(SO4)3
 */
export function parseFormula(formula: string): ElementCount[] {
  const elements: Record<string, number> = {}

  // Remove state notation if present: (s), (l), (g), (aq)
  const cleanFormula = formula.replace(/\([slgaq]+\)/g, '')

  function parseGroup(str: string, multiplier: number = 1): void {
    let i = 0
    while (i < str.length) {
      // Handle opening parenthesis
      if (str[i] === '(') {
        let depth = 1
        let j = i + 1
        // Find matching closing parenthesis
        while (j < str.length && depth > 0) {
          if (str[j] === '(') depth++
          if (str[j] === ')') depth--
          j++
        }

        // Extract the group content
        const groupContent = str.substring(i + 1, j - 1)

        // Get multiplier after closing parenthesis
        let numStr = ''
        while (j < str.length && /\d/.test(str[j])) {
          numStr += str[j]
          j++
        }
        const groupMultiplier = numStr ? parseInt(numStr, 10) : 1

        // Recursively parse the group
        parseGroup(groupContent, multiplier * groupMultiplier)
        i = j
      }
      // Handle uppercase letter (start of element symbol)
      else if (/[A-Z]/.test(str[i])) {
        let element = str[i]
        i++

        // Check for lowercase letter (two-letter element like Ca, Fe)
        if (i < str.length && /[a-z]/.test(str[i])) {
          element += str[i]
          i++
        }

        // Get the count
        let numStr = ''
        while (i < str.length && /\d/.test(str[i])) {
          numStr += str[i]
          i++
        }
        const count = numStr ? parseInt(numStr, 10) : 1

        // Add to elements
        elements[element] = (elements[element] || 0) + count * multiplier
      }
      else {
        i++
      }
    }
  }

  parseGroup(cleanFormula)

  return Object.entries(elements).map(([symbol, count]) => ({
    symbol,
    count
  }))
}

/**
 * Parse a complete chemical equation
 * Example: "2H2 + O2 → 2H2O" or "H2 + O2 = H2O"
 */
export function parseEquation(equation: string): ParsedEquation {
  // Normalize arrow symbols
  const normalized = equation.replace(/→|=/g, '->')

  // Split by arrow
  const [reactantsSide, productsSide] = normalized.split('->')

  if (!reactantsSide || !productsSide) {
    throw new Error('Invalid equation format. Use format: reactants → products')
  }

  // Parse reactants and products
  const reactants = parseCompounds(reactantsSide.trim())
  const products = parseCompounds(productsSide.trim())

  return { reactants, products }
}

/**
 * Parse a side of the equation (reactants or products)
 * Example: "2H2 + O2(g)" → [ParsedCompound, ParsedCompound]
 */
function parseCompounds(side: string): ParsedCompound[] {
  // Split by + sign
  const compoundStrings = side.split('+').map(s => s.trim()).filter(s => s)

  return compoundStrings.map(compoundStr => parseCompound(compoundStr))
}

/**
 * Parse a single compound with its coefficient
 * Example: "2H2O(l)" → { formula: "H2O", coefficient: 2, state: "l", elements: [...] }
 */
function parseCompound(compoundStr: string): ParsedCompound {
  // Extract coefficient (leading number)
  let coefficient = 1
  let formula = compoundStr.trim()

  const coeffMatch = formula.match(/^(\d+)/)
  if (coeffMatch) {
    coefficient = parseInt(coeffMatch[1], 10)
    formula = formula.substring(coeffMatch[1].length).trim()
  }

  // Extract state if present: (s), (l), (g), (aq)
  let state: 's' | 'l' | 'g' | 'aq' | undefined
  const stateMatch = formula.match(/\(([slgaq]+)\)$/)
  if (stateMatch) {
    state = stateMatch[1] as 's' | 'l' | 'g' | 'aq'
    formula = formula.replace(/\([slgaq]+\)$/, '').trim()
  }

  // Parse the formula to get element counts
  const elements = parseFormula(formula)

  return {
    formula,
    coefficient,
    state,
    elements
  }
}

/**
 * Get all unique elements from a parsed equation
 */
export function getUniqueElements(parsed: ParsedEquation): string[] {
  const elements = new Set<string>()

  parsed.reactants.forEach(compound => {
    compound.elements.forEach(el => elements.add(el.symbol))
  })

  parsed.products.forEach(compound => {
    compound.elements.forEach(el => elements.add(el.symbol))
  })

  return Array.from(elements).sort()
}

/**
 * Count atoms for a specific element on one side of the equation
 */
export function countElementOnSide(
  compounds: ParsedCompound[],
  element: string
): number {
  let total = 0

  compounds.forEach(compound => {
    const elementCount = compound.elements.find(el => el.symbol === element)
    if (elementCount) {
      total += elementCount.count * compound.coefficient
    }
  })

  return total
}
