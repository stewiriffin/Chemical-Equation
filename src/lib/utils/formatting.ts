/**
 * Format chemical formula with HTML subscripts for display
 * Example: "H2O" → "H₂O" or "H<sub>2</sub>O"
 */
export function formatChemicalFormula(formula: string, useHtml: boolean = false): string {
  if (useHtml) {
    // Replace numbers with <sub> tags
    return formula.replace(/(\d+)/g, '<sub>$1</sub>')
  } else {
    // Replace numbers with Unicode subscript characters
    const subscriptMap: Record<string, string> = {
      '0': '₀',
      '1': '₁',
      '2': '₂',
      '3': '₃',
      '4': '₄',
      '5': '₅',
      '6': '₆',
      '7': '₇',
      '8': '₈',
      '9': '₉'
    }

    return formula.replace(/\d/g, digit => subscriptMap[digit] || digit)
  }
}

/**
 * Format an entire chemical equation with subscripts
 */
export function formatChemicalEquation(equation: string, useHtml: boolean = false): string {
  // Split by arrow and +
  const parts = equation.split(/(→|\+|->|=)/)

  return parts.map(part => {
    const trimmed = part.trim()
    // If it's an operator, return as is
    if (trimmed === '→' || trimmed === '+' || trimmed === '->' || trimmed === '=') {
      return trimmed
    }
    // Otherwise format as chemical formula
    return formatChemicalFormula(trimmed, useHtml)
  }).join(' ')
}

/**
 * Extract coefficient and formula from a compound string
 * Example: "2H2O" → { coefficient: 2, formula: "H2O" }
 */
export function parseCompoundString(compoundStr: string): { coefficient: number; formula: string } {
  const match = compoundStr.match(/^(\d+)?(.+)$/)
  if (!match) {
    return { coefficient: 1, formula: compoundStr }
  }

  const coefficient = match[1] ? parseInt(match[1], 10) : 1
  const formula = match[2]

  return { coefficient, formula }
}

/**
 * Truncate long decimal numbers
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals)
}

/**
 * Format molecular weight
 */
export function formatMolecularWeight(weight: number): string {
  return `${formatNumber(weight, 3)} g/mol`
}
