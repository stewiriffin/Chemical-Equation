import { ElementCount, MolecularWeight } from '@/types/chemistry'
import { getElement } from '@/data/periodicTableData'
import { parseFormula } from './parser'

/**
 * Calculate molecular weight of a chemical formula
 * Returns total weight and breakdown by element
 */
export function calculateMolecularWeight(formula: string): MolecularWeight {
  const elements = parseFormula(formula)

  let totalWeight = 0
  const breakdown: ElementCount[] = []

  elements.forEach(({ symbol, count }) => {
    const element = getElement(symbol)
    if (!element) {
      throw new Error(`Unknown element: ${symbol}`)
    }

    const weight = element.atomicMass * count
    totalWeight += weight

    breakdown.push({
      symbol,
      count,
    })
  })

  return {
    compound: formula,
    weight: totalWeight,
    breakdown,
  }
}

/**
 * Calculate percent composition by mass
 */
export function calculatePercentComposition(formula: string): Record<string, number> {
  const elements = parseFormula(formula)
  const totalWeight = calculateMolecularWeight(formula).weight
  const percentages: Record<string, number> = {}

  elements.forEach(({ symbol, count }) => {
    const element = getElement(symbol)
    if (element) {
      const elementWeight = element.atomicMass * count
      percentages[symbol] = (elementWeight / totalWeight) * 100
    }
  })

  return percentages
}

/**
 * Format molecular weight for display
 */
export function formatMolecularWeight(weight: number): string {
  return `${weight.toFixed(3)} g/mol`
}
