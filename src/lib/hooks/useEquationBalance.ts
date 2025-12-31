import { useCallback } from 'react'
import { useEquationContext } from '@/lib/context/EquationContext'
import { balanceEquation } from '@/lib/chemistry/balancer'

/**
 * Custom hook for balancing chemical equations
 * Handles the balancing logic and state updates
 */
export function useEquationBalance() {
  const { state, dispatch } = useEquationContext()

  const balance = useCallback(() => {
    const equation = state.currentEquation.trim()

    if (!equation) {
      dispatch({ type: 'SET_ERROR', payload: 'Please enter a chemical equation' })
      return
    }

    dispatch({ type: 'SET_BALANCING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      // Use the real balancing algorithm
      const result = balanceEquation(equation)
      dispatch({ type: 'SET_RESULT', payload: result })

      // Add to history
      dispatch({
        type: 'ADD_TO_HISTORY',
        payload: {
          id: `${Date.now()}-${Math.random()}`,
          equation: result.original,
          balanced: result.balanced,
          timestamp: Date.now(),
        },
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to balance equation'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    }
  }, [state.currentEquation, dispatch])

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
