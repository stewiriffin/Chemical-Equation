/**
 * Element color scheme based on periodic table categories
 * Colors are designed to be visually distinct and accessible
 */

export const ELEMENT_COLORS: Record<string, string> = {
  // Hydrogen - Blue
  H: '#1E90FF',

  // Alkali metals - Purple/Violet
  Li: '#CC80FF',
  Na: '#AB5CF2',
  K: '#8F40D4',
  Rb: '#702EB0',
  Cs: '#57178F',
  Fr: '#420066',

  // Alkaline earth metals - Green
  Be: '#C2FF00',
  Mg: '#8AFF00',
  Ca: '#3DFF00',
  Sr: '#00FF00',
  Ba: '#00C900',
  Ra: '#007D00',

  // Transition metals - Gray/Silver
  Sc: '#E6E6E6',
  Ti: '#BFC2C7',
  V: '#A6A6AB',
  Cr: '#8A99C7',
  Mn: '#9C7AC7',
  Fe: '#E06633',
  Co: '#F090A0',
  Ni: '#50D050',
  Cu: '#C88033',
  Zn: '#7D80B0',

  // Post-transition metals - Brown/Gray
  Al: '#BFA6A6',
  Ga: '#C28F8F',
  In: '#A67573',
  Sn: '#668080',
  Tl: '#A6544D',
  Pb: '#575961',
  Bi: '#9E4FB5',

  // Metalloids - Pink/Brown
  B: '#FFB5B5',
  Si: '#F0C8A0',
  Ge: '#668F8F',
  As: '#BD80E3',
  Sb: '#9E63B5',
  Te: '#D47A00',
  Po: '#AB5C00',

  // Nonmetals - Various colors
  C: '#909090',
  N: '#3050F8',
  O: '#FF0D0D',
  P: '#FF8000',
  S: '#FFFF30',
  Se: '#FFA100',

  // Halogens - Green/Red
  F: '#90E050',
  Cl: '#1FF01F',
  Br: '#A62929',
  I: '#940094',
  At: '#754F45',

  // Noble gases - Cyan
  He: '#D9FFFF',
  Ne: '#B3E3F5',
  Ar: '#80D1E3',
  Kr: '#5CB8D1',
  Xe: '#429EB0',
  Rn: '#428296',

  // Lanthanides - Light green/cyan gradient
  La: '#70D4FF',
  Ce: '#FFFFC7',
  Pr: '#D9FFC7',
  Nd: '#C7FFC7',

  // Actinides - Blue gradient
  Ac: '#70ABFA',
  Th: '#00BAFF',
  Pa: '#00A1FF',
  U: '#008FFF',
}

/**
 * Get color for an element symbol
 * Returns default gray if element not found
 */
export function getElementColor(symbol: string): string {
  return ELEMENT_COLORS[symbol] || '#999999'
}

/**
 * Category colors for broader classification
 */
export const CATEGORY_COLORS = {
  'nonmetal': '#3050F8',
  'noble-gas': '#80D1E3',
  'alkali-metal': '#AB5CF2',
  'alkaline-earth': '#3DFF00',
  'transition-metal': '#BFC2C7',
  'post-transition': '#668080',
  'metalloid': '#FFB5B5',
  'halogen': '#1FF01F',
  'lanthanide': '#70D4FF',
  'actinide': '#70ABFA',
  'unknown': '#999999',
}
