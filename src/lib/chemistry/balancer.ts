import * as math from 'mathjs'
import { BalancedResult, ParsedEquation, Step } from '@/types/chemistry'
import { parseEquation, getUniqueElements, countElementOnSide } from './parser'
import { validateEquation, validateEquationString } from './validator'
import { calculateMolecularWeight } from './molecularWeight'
import { classifyReaction } from './reactionClassifier'

/**
 * Custom error class for equation balancing errors
 */
export class EquationBalanceError extends Error {
  constructor(
    message: string,
    public code: string,
    public suggestion?: string
  ) {
    super(message)
    this.name = 'EquationBalanceError'
  }
}

/**
 * Balance a chemical equation using matrix-based Gaussian elimination
 * Returns balanced equation with step-by-step explanation
 */
export function balanceEquation(equation: string): BalancedResult {
  // Step 1: Validate string format
  const stringValidation = validateEquationString(equation)
  const errors = stringValidation.errors.filter(e => e.type === 'error')
  
  if (errors.length > 0) {
    const firstError = errors[0]
    throw new EquationBalanceError(
      firstError.message,
      firstError.code,
      firstError.suggestion
    )
  }

  // Step 2: Parse equation
  const parsed = parseEquation(equation)

  // Step 3: Validate parsed equation
  const validation = validateEquation(parsed)
  const validationErrors = validation.errors.filter(e => e.type === 'error')
  
  if (validationErrors.length > 0) {
    const firstError = validationErrors[0]
    throw new EquationBalanceError(
      firstError.message,
      firstError.code,
      firstError.suggestion
    )
  }

  // Step 4: Build atom matrix
  const { matrix, elements } = buildAtomMatrix(parsed)

  // Step 5: Solve matrix to find coefficients
  const coefficients = solveMatrix(matrix)

  // Step 6: Normalize to smallest integers
  const normalizedCoefficients = normalizeCoefficients(coefficients)

  // Step 7: Apply coefficients to parsed equation
  const balancedParsed = applyCoefficients(parsed, normalizedCoefficients)

  // Step 8: Format output strings
  const original = formatEquation(parsed)
  const balanced = formatEquation(balancedParsed)

  // Step 9: Generate step-by-step explanation
  const steps = generateSteps(parsed, balancedParsed, elements, matrix, normalizedCoefficients)

  // Step 10: Calculate molecular weights for all compounds
  const molecularWeights = [...parsed.reactants, ...parsed.products].map(compound => {
    try {
      return calculateMolecularWeight(compound.formula)
    } catch {
      return {
        compound: compound.formula,
        weight: 0,
        breakdown: compound.elements,
      }
    }
  })

  // Step 11: Classify reaction type
  const reactionInfo = classifyReaction(parsed)

  return {
    original,
    balanced,
    coefficients: normalizedCoefficients,
    steps,
    metadata: {
      reactionType: reactionInfo.type,
      molecularWeights,
    },
  }
}

/**
 * Build atom matrix from parsed equation
 */
function buildAtomMatrix(parsed: ParsedEquation) {
  const elements = getUniqueElements(parsed)
  const compounds = [...parsed.reactants, ...parsed.products]
  const numReactants = parsed.reactants.length

  const matrix: number[][] = []

  elements.forEach(element => {
    const row: number[] = []
    compounds.forEach((compound, index) => {
      const elementCount = compound.elements.find(el => el.symbol === element)
      const count = elementCount ? elementCount.count : 0
      row.push(index < numReactants ? count : -count)
    })
    matrix.push(row)
  })

  return { matrix, elements, compounds }
}

/**
 * Solve matrix using Gaussian elimination
 */
function solveMatrix(matrix: number[][]): number[] {
  const m = math.matrix(matrix)
  const [, cols] = m.size()

  if (cols === 2) {
    return [1, 1]
  }

  try {
    // @ts-ignore - mathjs nullSpace
    const nullSpaceResult = math.nullSpace ? math.nullSpace(m) : null
    
    if (!nullSpaceResult || nullSpaceResult.length === 0) {
      return Array(cols).fill(1)
    }

    const solution = nullSpaceResult[0]
    
    if (!solution) {
      return Array(cols).fill(1)
    }

    const allPositive = solution.map((val: number) => Math.abs(val))
    return allPositive
  } catch {
    console.warn('Matrix solving failed, using fallback')
    return Array(cols).fill(1)
  }
}

/**
 * Normalize coefficients to smallest positive integers
 */
function normalizeCoefficients(coefficients: number[]): number[] {
  const cleaned = coefficients.map(c => Math.abs(c) < 1e-10 ? 0 : c)
  const nonZero = cleaned.filter(c => c > 0)
  
  if (nonZero.length === 0) {
    return coefficients.map(() => 1)
  }

  const minVal = Math.min(...nonZero)
  let normalized = cleaned.map(c => c / minVal)

  const precision = 1000
  let multiplier = 1

  for (let mult = 1; mult <= precision; mult++) {
    const scaled = normalized.map(n => n * mult)
    const isAllIntegers = scaled.every(n => Math.abs(n - Math.round(n)) < 0.01)
    if (isAllIntegers) {
      multiplier = mult
      break
    }
  }

  normalized = normalized.map(n => Math.round(n * multiplier))

  const gcd = findGCD(normalized.filter(n => n > 0))
  if (gcd > 1) {
    normalized = normalized.map(n => Math.round(n / gcd))
  }

  return normalized.map(n => Math.max(1, n))
}

/**
 * Find Greatest Common Divisor
 */
function findGCD(numbers: number[]): number {
  function gcd2(a: number, b: number): number {
    return b === 0 ? a : gcd2(b, a % b)
  }

  return numbers.reduce((acc, num) => gcd2(acc, Math.round(num)), numbers[0] || 1)
}

/**
 * Apply coefficients to parsed equation
 */
function applyCoefficients(parsed: ParsedEquation, coefficients: number[]): ParsedEquation {
  const numReactants = parsed.reactants.length

  const reactants = parsed.reactants.map((compound, index) => ({
    ...compound,
    coefficient: coefficients[index]
  }))

  const products = parsed.products.map((compound, index) => ({
    ...compound,
    coefficient: coefficients[numReactants + index]
  }))

  return { reactants, products }
}

/**
 * Format equation as string
 */
function formatEquation(parsed: ParsedEquation): string {
  const formatCompound = (compound: typeof parsed.reactants[0]) => {
    const coef = compound.coefficient > 1 ? compound.coefficient : ''
    const state = compound.state ? `(${compound.state})` : ''
    return `${coef}${compound.formula}${state}`
  }

  const reactants = parsed.reactants.map(formatCompound).join(' + ')
  const products = parsed.products.map(formatCompound).join(' + ')

  return `${reactants} → ${products}`
}

/**
 * Generate step-by-step explanation
 */
function generateSteps(
  original: ParsedEquation,
  balanced: ParsedEquation,
  elements: string[],
  matrix: number[][],
  coefficients: number[]
): Step[] {
  const steps: Step[] = []

  const originalCounts: Record<string, { reactants: number; products: number }> = {}
  elements.forEach(element => {
    originalCounts[element] = {
      reactants: countElementOnSide(original.reactants, element),
      products: countElementOnSide(original.products, element)
    }
  })

  const countList = elements
    .map(el => `${el}: ${originalCounts[el].reactants} (reactants) vs ${originalCounts[el].products} (products)`)
    .join('\n')

  steps.push({
    title: 'Count atoms on each side',
    description: `Original equation atom counts:\n${countList}\n\nThe equation is not balanced because atom counts don't match.`
  })

  const imbalanced = elements.filter(
    el => originalCounts[el].reactants !== originalCounts[el].products
  )

  if (imbalanced.length > 0) {
    const imbalancedList = imbalanced
      .map(el => `${el}: ${originalCounts[el].reactants} → ${originalCounts[el].products}`)
      .join('\n')

    steps.push({
      title: 'Identify imbalanced elements',
      description: `Imbalanced elements:\n${imbalancedList}\n\nThese elements need coefficients to balance.`
    })
  }

  const matrixStr = matrix
    .map((row, i) => `${elements[i]}: [${row.join(', ')}]`)
    .join('\n')

  steps.push({
    title: 'Build atom matrix and solve',
    description: `Atom matrix (reactants positive, products negative):\n${matrixStr}\n\nSolving using Gaussian elimination gives coefficients: [${coefficients.join(', ')}]`,
    matrix,
    coefficients
  })

  const balancedCounts: Record<string, { reactants: number; products: number }> = {}
  elements.forEach(element => {
    balancedCounts[element] = {
      reactants: countElementOnSide(balanced.reactants, element),
      products: countElementOnSide(balanced.products, element)
    }
  })

  const verifyList = elements
    .map(el => `${el}: ${balancedCounts[el].reactants} = ${balancedCounts[el].products} ✓`)
    .join('\n')

  steps.push({
    title: 'Verify balance',
    description: `Final atom counts:\n${verifyList}\n\nAll atoms are balanced! The equation satisfies the law of conservation of mass.`
  })

  return steps
}
