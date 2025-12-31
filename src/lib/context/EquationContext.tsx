import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { BalancedResult, EquationHistoryItem } from '@/types/chemistry'

// State interface
interface EquationState {
  currentEquation: string
  isValid: boolean
  validationErrors: string[]
  balancedResult: BalancedResult | null
  isBalancing: boolean
  error: string | null
  history: EquationHistoryItem[]
  currentTab: 'balance' | 'stoichiometry' | 'limiting-reactant'
  showPeriodicTable: boolean
  darkMode: boolean
}

// Action types
type EquationAction =
  | { type: 'SET_EQUATION'; payload: string }
  | { type: 'SET_BALANCING'; payload: boolean }
  | { type: 'SET_RESULT'; payload: BalancedResult }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'ADD_TO_HISTORY'; payload: EquationHistoryItem }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_TAB'; payload: EquationState['currentTab'] }
  | { type: 'TOGGLE_PERIODIC_TABLE' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'RESET_RESULT' }

// Initial state
const initialState: EquationState = {
  currentEquation: '',
  isValid: true,
  validationErrors: [],
  balancedResult: null,
  isBalancing: false,
  error: null,
  history: [],
  currentTab: 'balance',
  showPeriodicTable: false,
  darkMode: false,
}

// Reducer
function equationReducer(state: EquationState, action: EquationAction): EquationState {
  switch (action.type) {
    case 'SET_EQUATION':
      return {
        ...state,
        currentEquation: action.payload,
        error: null,
      }
    case 'SET_BALANCING':
      return {
        ...state,
        isBalancing: action.payload,
      }
    case 'SET_RESULT':
      return {
        ...state,
        balancedResult: action.payload,
        error: null,
        isBalancing: false,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        balancedResult: null,
        isBalancing: false,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, 100), // Keep last 100
      }
    case 'CLEAR_HISTORY':
      return {
        ...state,
        history: [],
      }
    case 'SET_TAB':
      return {
        ...state,
        currentTab: action.payload,
      }
    case 'TOGGLE_PERIODIC_TABLE':
      return {
        ...state,
        showPeriodicTable: !state.showPeriodicTable,
      }
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      }
    case 'RESET_RESULT':
      return {
        ...state,
        balancedResult: null,
        error: null,
      }
    default:
      return state
  }
}

// Context
interface EquationContextType {
  state: EquationState
  dispatch: React.Dispatch<EquationAction>
}

const EquationContext = createContext<EquationContextType | undefined>(undefined)

// Provider component
interface EquationProviderProps {
  children: ReactNode
}

export function EquationProvider({ children }: EquationProviderProps) {
  const [state, dispatch] = useReducer(equationReducer, initialState)

  return (
    <EquationContext.Provider value={{ state, dispatch }}>
      {children}
    </EquationContext.Provider>
  )
}

// Custom hook to use context
export function useEquationContext() {
  const context = useContext(EquationContext)
  if (context === undefined) {
    throw new Error('useEquationContext must be used within an EquationProvider')
  }
  return context
}
