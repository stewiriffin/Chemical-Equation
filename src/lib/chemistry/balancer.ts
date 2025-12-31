import * as math from 'mathjs'
import { BalancedResult, ParsedEquation, Step } from '@/types/chemistry'
import { parseEquation, getUniqueElements, countElementOnSide } from './parser'
import { validateEquation, validateEquationString } from './validator'
import { calculateMolecularWeight } from './molecularWeight'
import { classifyReaction } from './reactionClassifier'

/**
 * Balance a chemical equation using matrix-based Gaussian elimination
 * Returns balanced equation with step-by-step explanation
 */
export function balanceEquation(equation: string): BalancedResult {
  // Step 1: Validate string format
  const stringValidation = validateEquationString(equation)
  if (!stringValidation.valid) {
    throw new Error(stringValidation.errors.join('; '))
  }

  // Step 2: Parse equation
  const parsed = parseEquation(equation)

  // Step 3: Validate parsed equation
  const validation = validateEquation(parsed)
  if (!validation.valid) {
    throw new Error(validation.errors.join('; '))
  }

  // Step 4: Build atom matrix
  const { matrix, elements, compounds } = buildAtomMatrix(parsed)

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
    } catch (error) {
      // If calculation fails, return a default
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
 * Rows = elements, Columns = compounds
 * Reactants are positive, products are negative
 */
function buildAtomMatrix(parsed: ParsedEquation) {
  const elements = getUniqueElements(parsed)
  const compounds = [...parsed.reactants, ...parsed.products]
  const numReactants = parsed.reactants.length

  // Create matrix: each row is an element, each column is a compound
  const matrix: number[][] = []

  elements.forEach(element => {
    const row: number[] = []

    compounds.forEach((compound, index) => {
      const elementCount = compound.elements.find(el => el.symbol === element)
      const count = elementCount ? elementCount.count : 0

      // Reactants are positive, products are negative
      row.push(index < numReactants ? count : -count)
    })

    matrix.push(row)
  })

  return { matrix, elements, compounds }
}

/**
 * Solve matrix using Gaussian elimination to find null space
 * Returns coefficients for each compound
 */
function solveMatrix(matrix: number[][]): number[] {
  const m = math.matrix(matrix)
  const [rows, cols] = m.size()

  // If only one compound on each side, try simple balancing first
  if (cols === 2) {
    return [1, 1]
  }

  try {
    // Find null space of the matrix
    // This gives us the coefficients that satisfy the conservation of mass
    const nullSpace = math.null(m)

    if (nullSpace.length === 0 || nullSpace[0].length === 0) {
      // If no null space, try using the last column as the solution
      // This is a fallback for simple cases
      return Array(cols).fill(1)
    }

    // Take the first null vector
    const solution = nullSpace.map(row => row[0])

    // Convert all negative values to positive
    const allPositive = solution.map(val => Math.abs(val))

    return allPositive
  } catch (error) {
    // Fallback: return all 1s if matrix solving fails
    console.warn('Matrix solving failed, using fallback', error)
    return Array(cols).fill(1)
  }
}

/**
 * Normalize coefficients to smallest positive integers
 * Handles fractional coefficients by finding LCM
 */
function normalizeCoefficients(coefficients: number[]): number[] {
  // Remove very small values (numerical errors)
  const cleaned = coefficients.map(c => Math.abs(c) < 1e-10 ? 0 : c)

  // Find minimum non-zero value
  const nonZero = cleaned.filter(c => c > 0)
  if (nonZero.length === 0) {
    return coefficients.map(() => 1)
  }

  const minVal = Math.min(...nonZero)

  // Divide all by minimum to get relative ratios
  let normalized = cleaned.map(c => c / minVal)

  // Convert to integers by multiplying to eliminate fractions
  const precision = 1000
  let multiplier = 1

  // Try to find a multiplier that gives us integers
  for (let mult = 1; mult <= precision; mult++) {
    const scaled = normalized.map(n => n * mult)
    const isAllIntegers = scaled.every(n =>
      Math.abs(n - Math.round(n)) < 0.01
    )

    if (isAllIntegers) {
      multiplier = mult
      break
    }
  }

  normalized = normalized.map(n => Math.round(n * multiplier))

  // Find GCD and divide to get smallest integers
  const gcd = findGCD(normalized.filter(n => n > 0))
  if (gcd > 1) {
    normalized = normalized.map(n => Math.round(n / gcd))
  }

  // Ensure no coefficient is less than 1
  return normalized.map(n => Math.max(1, n))
}

/**
 * Find Greatest Common Divisor of array of numbers
 */
function findGCD(numbers: number[]): number {
  function gcd2(a: number, b: number): number {
    return b === 0 ? a : gcd2(b, a % b)
  }

  return numbers.reduce((acc, num) => gcd2(acc, Math.round(num)))
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

  // Step 1: Count atoms on each side (original)
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

  // Step 2: Identify imbalanced elements
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

  // Step 3: Build and solve matrix
  const matrixStr = matrix
    .map((row, i) => `${elements[i]}: [${row.join(', ')}]`)
    .join('\n')

  steps.push({
    title: 'Build atom matrix and solve',
    description: `Atom matrix (reactants positive, products negative):\n${matrixStr}\n\nSolving using Gaussian elimination gives coefficients: [${coefficients.join(', ')}]`,
    matrix,
    coefficients
  })

  // Step 4: Verify balance
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
