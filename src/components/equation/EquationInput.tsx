import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, AlertTriangle } from "lucide-react"
import { useEquationBalance } from "@/lib/hooks/useEquationBalance"
import { PeriodicTable } from "@/components/chemistry/PeriodicTable"
import { useRef, useEffect } from "react"
import { useDebounce } from "@/lib/hooks/useDebounce"
import { useEquationContext } from "@/lib/context/EquationContext"
import { validateEquationString } from "@/lib/chemistry/validator"
import { parseEquation } from "@/lib/chemistry/parser"
import { ValidationError } from "@/types/chemistry"

// Example equations to display - fewer on mobile
const exampleEquations = [
  "H2 + O2 → H2O",
  "CH4 + O2 → CO2 + H2O",
  "Fe + O2 → Fe2O3",
  "N2 + H2 → NH3",
  "C3H8 + O2 → CO2 + H2O",
]

export function EquationInput() {
  const { equation, error, isBalancing, balance, setEquation, clearError } = useEquationBalance()
  const { state, dispatch } = useEquationContext()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Debounce the equation for real-time validation
  const debouncedEquation = useDebounce(equation, 300)

  // Real-time validation effect
  useEffect(() => {
    if (!debouncedEquation.trim()) {
      dispatch({ type: 'CLEAR_VALIDATION_ERRORS' })
      return
    }

    // Validate string format
    const stringValidation = validateEquationString(debouncedEquation)

    if (!stringValidation.valid) {
      dispatch({ type: 'SET_VALIDATION_ERRORS', payload: stringValidation.errors })
      return
    }

    // Try to parse the equation for deeper validation
    try {
      const parsed = parseEquation(debouncedEquation)
      // Import dynamic validation here to avoid circular dependency
      import("@/lib/chemistry/validator").then(({ validateEquation }) => {
        const parsedValidation = validateEquation(parsed)
        dispatch({ type: 'SET_VALIDATION_ERRORS', payload: parsedValidation.errors })
      }).catch(() => {
        // If import fails, just use string validation results
        dispatch({ type: 'SET_VALIDATION_ERRORS', payload: stringValidation.errors })
      })
    } catch {
      // Parse error - could be due to invalid formula format
      // Don't dispatch error here as it's handled by the string validation
    }
  }, [debouncedEquation, dispatch])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (equation.trim()) {
        balance()
      }
    }
  }

  const handleExampleClick = (example: string) => {
    setEquation(example)
    clearError()
    dispatch({ type: 'CLEAR_VALIDATION_ERRORS' })
  }

  const handleElementSelect = (symbol: string) => {
    // Insert element at cursor position or append to end
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart
      const textBefore = equation.substring(0, cursorPos)
      const textAfter = equation.substring(cursorPos)
      const newEquation = textBefore + symbol + textAfter
      setEquation(newEquation)

      // Set cursor after inserted element
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = cursorPos + symbol.length
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
          textareaRef.current.focus()
        }
      }, 0)
    } else {
      setEquation(equation + symbol)
    }
  }

  // Get the main error
  const mainError = state.validationErrors.find((e: ValidationError) => e.type === 'error')

  return (
    <Card className="transition-all hover:shadow-glow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Enter Equation</CardTitle>
        <CardDescription className="text-xs">
          Type: reactants → products
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="equation" className="text-sm">Chemical Equation</Label>
            <PeriodicTable onElementSelect={handleElementSelect} />
          </div>
          <Textarea
            ref={textareaRef}
            id="equation"
            value={equation}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEquation(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., H2 + O2 → H2O"
            className="font-mono text-sm min-h-[80px]"
            aria-describedby="equation-error"
          />
          
          {/* Real-time validation feedback */}
          {mainError && (
            <div 
              role="alert"
              className="flex items-start gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md"
            >
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-destructive font-medium break-words">{mainError.message}</p>
                {mainError.suggestion && (
                  <p className="text-xs text-destructive/80 mt-1 break-words">{mainError.suggestion}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Warning messages */}
          {state.validationErrors.filter((e: ValidationError) => e.type === 'warning').length > 0 && (
            <div className="space-y-2">
              {state.validationErrors.filter((e: ValidationError) => e.type === 'warning').slice(0, 2).map((warning: ValidationError, index: number) => (
                <div 
                  key={index}
                  role="status"
                  className="flex items-start gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-md"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-amber-600 dark:text-amber-400 break-words">{warning.message}</p>
                    {warning.suggestion && (
                      <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1 break-words">{warning.suggestion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* API error message */}
          {error && !mainError && (
            <div className="flex items-start gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive break-words">{error}</p>
            </div>
          )}
        </div>
        
        <Button
          onClick={balance}
          disabled={!equation.trim() || isBalancing || (state.validationErrors.filter((e: ValidationError) => e.type === 'error').length > 0)}
          className="w-full"
        >
          {isBalancing ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Balancing...
            </span>
          ) : "Balance Equation"}
        </Button>

        <Separator className="my-3" />

        {/* Example Equations */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase text-muted-foreground">
            Examples
          </h3>
          <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto pr-1">
            {exampleEquations.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleExampleClick(example)}
                className="justify-start font-mono text-left text-xs truncate hover:bg-accent h-8"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
