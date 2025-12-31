import { ParsedEquation, ReactionType } from '@/types/chemistry'

/**
 * Classify chemical reaction type based on reactants and products
 * Returns the type of reaction and a description
 */
export function classifyReaction(parsed: ParsedEquation): {
  type: ReactionType
  description: string
} {
  const numReactants = parsed.reactants.length
  const numProducts = parsed.products.length

  // Get element symbols from compounds
  const reactantElements = new Set<string>()
  const productElements = new Set<string>()

  parsed.reactants.forEach(compound => {
    compound.elements.forEach(el => reactantElements.add(el.symbol))
  })

  parsed.products.forEach(compound => {
    compound.elements.forEach(el => productElements.add(el.symbol))
  })

  // Check for combustion (hydrocarbon + O2 → CO2 + H2O)
  const hasOxygenReactant = parsed.reactants.some(c =>
    c.elements.some(el => el.symbol === 'O')
  )
  const hasCO2 = parsed.products.some(c => c.formula === 'CO2')
  const hasH2O = parsed.products.some(c => c.formula === 'H2O' || c.formula === 'HOH')

  if (hasOxygenReactant && hasCO2 && hasH2O) {
    return {
      type: 'combustion',
      description: 'Combustion reaction - a substance reacts with oxygen to produce carbon dioxide and water, releasing energy.',
    }
  }

  // Synthesis: A + B → AB (multiple reactants, one product)
  if (numReactants >= 2 && numProducts === 1) {
    return {
      type: 'synthesis',
      description: 'Synthesis (Combination) reaction - two or more substances combine to form a single product.',
    }
  }

  // Decomposition: AB → A + B (one reactant, multiple products)
  if (numReactants === 1 && numProducts >= 2) {
    return {
      type: 'decomposition',
      description: 'Decomposition reaction - a single compound breaks down into two or more simpler substances.',
    }
  }

  // Single replacement: A + BC → AC + B (element replaces another in compound)
  if (numReactants === 2 && numProducts === 2) {
    // Check if one reactant is a single element
    const singleElementReactants = parsed.reactants.filter(c => c.elements.length === 1)

    if (singleElementReactants.length === 1) {
      return {
        type: 'single-replacement',
        description: 'Single Replacement reaction - one element replaces another element in a compound.',
      }
    }

    // Double replacement: AB + CD → AD + CB
    // Both reactants are compounds with 2+ elements
    const compoundReactants = parsed.reactants.filter(c => c.elements.length >= 2)

    if (compoundReactants.length === 2) {
      return {
        type: 'double-replacement',
        description: 'Double Replacement reaction - the positive and negative ions of two compounds switch places.',
      }
    }
  }

  // Default: unknown
  return {
    type: 'unknown',
    description: 'Complex or unclassified reaction type.',
  }
}

/**
 * Get color for reaction type badge
 */
export function getReactionTypeColor(type: ReactionType): string {
  const colors: Record<ReactionType, string> = {
    synthesis: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    decomposition: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    'single-replacement': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    'double-replacement': 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    combustion: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    unknown: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
  }

  return colors[type] || colors.unknown
}

/**
 * Format reaction type for display
 */
export function formatReactionType(type: ReactionType): string {
  const formatted: Record<ReactionType, string> = {
    synthesis: 'Synthesis',
    decomposition: 'Decomposition',
    'single-replacement': 'Single Replacement',
    'double-replacement': 'Double Replacement',
    combustion: 'Combustion',
    unknown: 'Unknown',
  }

  return formatted[type] || 'Unknown'
}
