import { ParsedEquation, ValidationResult } from '@/types/chemistry'
import { isValidElement } from '@/data/periodicTableData'
import { getUniqueElements } from './parser'

/**
 * Validate a parsed chemical equation
 * Checks:
 * - All elements are valid
 * - Both sides have at least one compound
 * - All elements appear on both sides
 */
export function validateEquation(parsed: ParsedEquation): ValidationResult {
  const errors: string[] = []

  // Check if equation has reactants and products
  if (parsed.reactants.length === 0) {
    errors.push('Equation must have at least one reactant')
  }

  if (parsed.products.length === 0) {
    errors.push('Equation must have at least one product')
  }

  // Check all elements are valid
  const allElements = getUniqueElements(parsed)
  for (const element of allElements) {
    if (!isValidElement(element)) {
      errors.push(`Unknown element: ${element}`)
    }
  }

  // Check that all elements appear on both sides
  const reactantElements = new Set<string>()
  const productElements = new Set<string>()

  parsed.reactants.forEach(compound => {
    compound.elements.forEach(el => reactantElements.add(el.symbol))
  })

  parsed.products.forEach(compound => {
    compound.elements.forEach(el => productElements.add(el.symbol))
  })

  // Elements only in reactants
  for (const element of reactantElements) {
    if (!productElements.has(element)) {
      errors.push(`Element ${element} appears in reactants but not in products`)
    }
  }

  // Elements only in products
  for (const element of productElements) {
    if (!reactantElements.has(element)) {
      errors.push(`Element ${element} appears in products but not in reactants`)
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate equation string format before parsing
 */
export function validateEquationString(equation: string): ValidationResult {
  const errors: string[] = []

  if (!equation || equation.trim() === '') {
    errors.push('Equation cannot be empty')
    return { valid: false, errors }
  }

  // Check for arrow
  if (!equation.includes('→') && !equation.includes('->') && !equation.includes('=')) {
    errors.push('Equation must contain an arrow (→, ->, or =)')
  }

  // Check for basic structure
  const normalized = equation.replace(/→|=/g, '->')
  const sides = normalized.split('->')

  if (sides.length !== 2) {
    errors.push('Equation must have exactly one arrow separating reactants and products')
  }

  // Check each side is not empty
  if (sides.length === 2) {
    if (!sides[0].trim()) {
      errors.push('Reactants side cannot be empty')
    }
    if (!sides[1].trim()) {
      errors.push('Products side cannot be empty')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
