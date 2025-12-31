import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle } from "lucide-react"
import { useEquationBalance } from "@/lib/hooks/useEquationBalance"

// Example equations to display
const exampleEquations = [
  "H2 + O2 → H2O",
  "CH4 + O2 → CO2 + H2O",
  "Fe + O2 → Fe2O3",
  "N2 + H2 → NH3",
  "C3H8 + O2 → CO2 + H2O",
  "Al + O2 → Al2O3",
  "NaOH + H2SO4 → Na2SO4 + H2O",
  "Ca(OH)2 + HCl → CaCl2 + H2O"
]

export function EquationInput() {
  const { equation, error, isBalancing, balance, setEquation, clearError } = useEquationBalance()

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
  }

  return (
    <Card className="transition-all hover:shadow-glow-sm">
      <CardHeader>
        <CardTitle>Enter Equation</CardTitle>
        <CardDescription>
          Type your chemical equation using the format: reactants → products
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="equation">Chemical Equation</Label>
          <Textarea
            id="equation"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., H2 + O2 → H2O"
            className="font-mono min-h-[100px]"
          />
          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
        <Button
          onClick={balance}
          disabled={!equation.trim() || isBalancing}
          className="w-full"
          size="lg"
        >
          {isBalancing ? "Balancing..." : "Balance Equation"}
        </Button>

        <Separator className="my-6" />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">
            Example Equations
          </h3>
          <div className="space-y-2">
            {exampleEquations.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleExampleClick(example)}
                className="w-full justify-start font-mono text-left hover:bg-accent"
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
