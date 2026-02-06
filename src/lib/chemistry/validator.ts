import { ParsedEquation, ValidationResult } from '@/types/chemistry'
import { isValidElement } from '@/data/periodicTableData'
import { getUniqueElements } from './parser'

/**
 * Enhanced validation result with severity levels
 */
export interface EnhancedValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  type: 'error' | 'warning' | 'info'
  code: string
  message: string
  suggestion?: string
}

/**
 * Validate equation string format with detailed feedback
 */
export function validateEquationString(equation: string): EnhancedValidationResult {
  const errors: ValidationError[] = []

  if (!equation || equation.trim() === '') {
    errors.push({
      type: 'error',
      code: 'EMPTY',
      message: 'Equation cannot be empty',
      suggestion: 'Enter a chemical equation like H2 + O2 → H2O'
    })
    return { valid: false, errors }
  }

  // Check for arrow
  const hasArrow = equation.includes('→') || equation.includes('->') || equation.includes('=')
  if (!hasArrow) {
    errors.push({
      type: 'error',
      code: 'MISSING_ARROW',
      message: 'Equation must contain an arrow (→, ->, or =)',
      suggestion: 'Use →, ->, or = to separate reactants from products'
    })
  }

  // Check for basic structure
  const normalized = equation.replace(/→|=/g, '->')
  const sides = normalized.split('->')

  if (sides.length !== 2) {
    errors.push({
      type: 'error',
      code: 'INVALID_ARROW_COUNT',
      message: 'Equation must have exactly one arrow separating reactants and products',
      suggestion: 'Remove extra arrows and use only one (→, ->, or =)'
    })
  }

  // Check each side is not empty
  if (sides.length >= 1 && !sides[0].trim()) {
    errors.push({
      type: 'error',
      code: 'EMPTY_REACTANTS',
      message: 'Reactants side cannot be empty',
      suggestion: 'Enter at least one reactant before the arrow'
    })
  }
  if (sides.length >= 2 && !sides[1].trim()) {
    errors.push({
      type: 'error',
      code: 'EMPTY_PRODUCTS',
      message: 'Products side cannot be empty',
      suggestion: 'Enter at least one product after the arrow'
    })
  }

  // Check for multiple compounds on same side without separator
  if (sides.length === 2) {
    const reactantSide = sides[0].trim()
    const productSide = sides[1].trim()

    // Check if compounds are separated by +
    const hasReactantSeparator = reactantSide.includes('+')
    const hasProductSeparator = productSide.includes('+')

    // If no separator but multiple compounds (detected by space), add warning
    if (!hasReactantSeparator && /\s{2,}/.test(reactantSide)) {
      errors.push({
        type: 'warning',
        code: 'MISSING_REACTANT_SEPARATOR',
        message: 'Multiple reactants detected without + separator',
        suggestion: 'Use + to separate compounds, e.g., H2 + O2'
      })
    }
    if (!hasProductSeparator && /\s{2,}/.test(productSide)) {
      errors.push({
        type: 'warning',
        code: 'MISSING_PRODUCT_SEPARATOR',
        message: 'Multiple products detected without + separator',
        suggestion: 'Use + to separate compounds, e.g., CO2 + H2O'
      })
    }
  }

  return {
    valid: errors.filter(e => e.type === 'error').length === 0,
    errors
  }
}

/**
 * Validate a parsed chemical equation with detailed feedback
 */
export function validateEquation(parsed: ParsedEquation): EnhancedValidationResult {
  const errors: ValidationError[] = []

  // Check if equation has reactants and products
  if (parsed.reactants.length === 0) {
    errors.push({
      type: 'error',
      code: 'NO_REACTANTS',
      message: 'Equation must have at least one reactant',
      suggestion: 'Add at least one compound before the arrow'
    })
  }

  if (parsed.products.length === 0) {
    errors.push({
      type: 'error',
      code: 'NO_PRODUCTS',
      message: 'Equation must have at least one product',
      suggestion: 'Add at least one compound after the arrow'
    })
  }

  // Check all elements are valid
  const allElements = getUniqueElements(parsed)
  for (const element of allElements) {
    if (!isValidElement(element)) {
      const suggestion = getElementSuggestion(element)
      errors.push({
        type: 'error',
        code: 'UNKNOWN_ELEMENT',
        message: `Unknown element: "${element}"`,
        suggestion
      })
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
      errors.push({
        type: 'warning',
        code: 'ELEMENT_ONLY_IN_REACTANTS',
        message: `Element "${element}" appears in reactants but not in products`,
        suggestion: `Make sure "${element}" is included on both sides of the equation`
      })
    }
  }

  // Elements only in products
  for (const element of productElements) {
    if (!reactantElements.has(element)) {
      errors.push({
        type: 'warning',
        code: 'ELEMENT_ONLY_IN_PRODUCTS',
        message: `Element "${element}" appears in products but not in reactants`,
        suggestion: `Make sure "${element}" is included on both sides of the equation`
      })
    }
  }

  // Check for zero coefficients (parsing issue)
  parsed.reactants.forEach((compound) => {
    if (compound.coefficient === 0) {
      errors.push({
        type: 'error',
        code: 'ZERO_COEFFICIENT_REACTANT',
        message: `Reactant "${compound.formula}" has a coefficient of 0`,
        suggestion: 'Remove the leading 0 from the compound'
      })
    }
  })

  parsed.products.forEach((compound) => {
    if (compound.coefficient === 0) {
      errors.push({
        type: 'error',
        code: 'ZERO_COEFFICIENT_PRODUCT',
        message: `Product "${compound.formula}" has a coefficient of 0`,
        suggestion: 'Remove the leading 0 from the compound'
      })
    }
  })

  return {
    valid: errors.filter(e => e.type === 'error').length === 0,
    errors
  }
}

/**
 * Get suggestion for unknown element
 */
function getElementSuggestion(element: string): string {
  // Check for common typos
  const typos: Record<string, string[]> = {
    'CL': ['Did you mean Cl (Chlorine)?'],
    'CL2': ['Did you mean Cl2 (Chlorine gas)?'],
    'CO': ['Did you mean Co (Cobalt) or CO (Carbon monoxide)?'],
    'MG': ['Did you mean Mg (Magnesium)?'],
    'MN': ['Did you mean Mn (Manganese)?'],
    'AL': ['Did you mean Al (Aluminum)?'],
    'ZN': ['Did you mean Zn (Zinc)?'],
    'AG': ['Did you mean Ag (Silver)?'],
    'AU': ['Did you mean Au (Gold)?'],
    'FE': ['Did you mean Fe (Iron)?'],
    'CU': ['Did you mean Cu (Copper)?'],
    'NA': ['Did you mean Na (Sodium)?'],
    'K': ['K is Potassium. Did you mean something else?'],
  }

  const upperElement = element.toUpperCase()
  if (typos[upperElement]) {
    return typos[upperElement][0]
  }

  // Check if element looks like a number
  if (/^\d+$/.test(element)) {
    return 'Elements should start with a letter, not a number'
  }

  // Check for lowercase start
  if (/^[a-z]/.test(element)) {
    return 'Element symbols start with an uppercase letter (e.g., H, He, Li)'
  }

  // Check for single lowercase letter
  if (/^[A-Z]$/.test(element)) {
    return `${element} is a valid element symbol. Add numbers for counts (e.g., ${element}H2)`
  }

  return `Check the spelling or use the periodic table to find the correct element symbol`
}

/**
 * Legacy function for backward compatibility
 */
export function validateEquationLegacy(parsed: ParsedEquation): ValidationResult {
  const errors: string[] = []

  if (parsed.reactants.length === 0) {
    errors.push('Equation must have at least one reactant')
  }

  if (parsed.products.length === 0) {
    errors.push('Equation must have at least one product')
  }

  const allElements = getUniqueElements(parsed)
  for (const element of allElements) {
    if (!isValidElement(element)) {
      errors.push(`Unknown element: ${element}`)
    }
  }

  const reactantElements = new Set<string>()
  const productElements = new Set<string>()

  parsed.reactants.forEach(compound => {
    compound.elements.forEach(el => reactantElements.add(el.symbol))
  })

  parsed.products.forEach(compound => {
    compound.elements.forEach(el => productElements.add(el.symbol))
  })

  for (const element of reactantElements) {
    if (!productElements.has(element)) {
      errors.push(`Element ${element} appears in reactants but not in products`)
    }
  }

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
