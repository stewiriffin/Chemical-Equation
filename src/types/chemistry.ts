// Core chemistry type definitions

export interface ElementCount {
  symbol: string
  count: number
}

export interface ParsedCompound {
  formula: string
  elements: ElementCount[]
  coefficient: number
  state?: 's' | 'l' | 'g' | 'aq'
}

export interface ParsedEquation {
  reactants: ParsedCompound[]
  products: ParsedCompound[]
}

export interface Step {
  title: string
  description: string
  matrix?: number[][]
  coefficients?: number[]
}

export type ReactionType =
  | 'synthesis'
  | 'decomposition'
  | 'single-replacement'
  | 'double-replacement'
  | 'combustion'
  | 'unknown'

export interface MolecularWeight {
  compound: string
  weight: number
  breakdown: ElementCount[]
}

export interface StoichiometryData {
  moleRatios: MoleRatio[]
  massRatios: MassRatio[]
}

export interface MoleRatio {
  compound1: string
  compound2: string
  ratio: string
}

export interface MassRatio {
  compound1: string
  compound2: string
  ratio: string
}

export interface BalancedResult {
  original: string
  balanced: string
  coefficients: number[]
  steps: Step[]
  metadata?: {
    reactionType?: ReactionType
    molecularWeights?: MolecularWeight[]
  }
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export interface Element {
  symbol: string
  name: string
  atomicNumber: number
  atomicMass: number
  group?: number
  period?: number
  category?: string
  color?: string
}

export interface EquationHistoryItem {
  id: string
  equation: string
  balanced: string
  timestamp: number
}
