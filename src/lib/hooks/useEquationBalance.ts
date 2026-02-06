import { useCallback } from 'react'
import { useEquationContext } from '@/lib/context/EquationContext'

/**
 * Custom hook for balancing chemical equations
 * Handles the balancing logic and state updates
 */
export function useEquationBalance() {
  const { state, dispatch, balanceEquation } = useEquationContext()

  const balance = useCallback(() => {
    const equation = state.currentEquation.trim()

    if (!equation) {
      dispatch({ type: 'SET_ERROR', payload: 'Please enter a chemical equation' })
      return
    }

    dispatch({ type: 'SET_BALANCING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      // Use the balancing function from context
      balanceEquation()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to balance equation'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    }
  }, [state.currentEquation, dispatch, balanceEquation])

  const setEquation = useCallback(
    (equation: string) => {
      dispatch({ type: 'SET_EQUATION', payload: equation })
    },
    [dispatch]
  )

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [dispatch])

  const resetResult = useCallback(() => {
    dispatch({ type: 'RESET_RESULT' })
  }, [dispatch])

  return {
    equation: state.currentEquation,
    result: state.balancedResult,
    error: state.error,
    isBalancing: state.isBalancing,
    balance,
    setEquation,
    clearError,
    resetResult,
  }
}
