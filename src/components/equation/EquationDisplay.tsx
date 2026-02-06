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
import { ExportButton } from "@/components/shared/ExportButton"
import { ShareButton } from "@/components/shared/ShareButton"

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
      <Card className="h-full min-h-[300px] sm:min-h-[400px] flex items-center justify-center transition-all hover:shadow-glow-sm">
        <CardContent className="text-center space-y-4 py-8 sm:py-12 px-4">
          <Beaker className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold">No Equation Balanced Yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto">
              Enter a chemical equation and click "Balance Equation" to see the results and step-by-step explanation.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Export Controls - Responsive layout */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
        <ShareButton equation={result.balanced} />
        <ExportButton result={result} />
      </div>

      {/* Container for export functionality */}
      <div id="equation-export-container" className="space-y-4 sm:space-y-6">
        {/* Balanced Equation Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="transition-all hover:shadow-glow-md hover:border-primary/50">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
              <CardTitle className="text-base sm:text-lg">Balanced Equation</CardTitle>
              <CopyButton text={result.balanced} label="Copy" />
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground shrink-0">Original:</span>
                <p className="font-mono text-sm break-all">{result.original}</p>
              </div>
              <Separator className="my-2" />
              <div>
                <span className="text-xs sm:text-sm text-muted-foreground block mb-1">Balanced:</span>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="font-mono text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent break-words"
                >
                  {result.balanced}
                </motion.p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reaction Info and Molecular Weights Grid - Stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
    </div>
  )
}
