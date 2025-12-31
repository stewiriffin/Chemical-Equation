import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Beaker } from "lucide-react"
import { useEquationBalance } from "@/lib/hooks/useEquationBalance"
import { StepsExplanation } from "@/components/chemistry/StepsExplanation"
import { useSuccessAnimation } from "@/components/visualization/SuccessAnimation"
import { MolecularWeightDisplay } from "@/components/chemistry/MolecularWeightDisplay"
import { ReactionInfo } from "@/components/chemistry/ReactionInfo"
import { CopyButton } from "@/components/shared/CopyButton"

export function EquationDisplay() {
  const { result } = useEquationBalance()
  const { celebrate } = useSuccessAnimation()
  const [previousResult, setPreviousResult] = useState(result)

  // Trigger confetti when new result appears
  useEffect(() => {
    if (result && result !== previousResult) {
      celebrate()
      setPreviousResult(result)
    }
  }, [result, previousResult, celebrate])

  if (!result) {
    return (
      <Card className="h-full min-h-[400px] flex items-center justify-center transition-all hover:shadow-glow-sm">
        <CardContent className="text-center space-y-4 py-12">
          <Beaker className="mx-auto h-16 w-16 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No Equation Balanced Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Enter a chemical equation on the left and click "Balance Equation" to see the results and step-by-step explanation.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Balanced Equation Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="transition-all hover:shadow-glow-md hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Balanced Equation</CardTitle>
            <CopyButton text={result.balanced} label="Copy Equation" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Original:</p>
              <p className="font-mono text-base">{result.original}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Balanced:</p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="font-mono text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              >
                {result.balanced}
              </motion.p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reaction Info and Molecular Weights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <ReactionInfo
            original={result.original}
            reactionType={result.metadata?.reactionType}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <MolecularWeightDisplay
            molecularWeights={result.metadata?.molecularWeights}
          />
        </motion.div>
      </div>

      {/* Step-by-Step Explanation Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <StepsExplanation steps={result.steps} />
      </motion.div>
    </div>
  )
}
