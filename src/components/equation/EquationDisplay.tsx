import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Beaker, CheckCircle2 } from "lucide-react"
import { useEquationBalance } from "@/lib/hooks/useEquationBalance"
import { StepsExplanation } from "@/components/chemistry/StepsExplanation"
import { useSuccessAnimation } from "@/components/visualization/SuccessAnimation"
import { MolecularWeightDisplay } from "@/components/chemistry/MolecularWeightDisplay"
import { ReactionInfo } from "@/components/chemistry/ReactionInfo"
import { CopyButton } from "@/components/shared/CopyButton"
import { ExportButton } from "@/components/shared/ExportButton"
import { ShareButton } from "@/components/shared/ShareButton"
import { BalancedResult } from "@/types/chemistry"

export function EquationDisplay(): React.ReactElement {
  const { result } = useEquationBalance()
  const { celebrate } = useSuccessAnimation()
  const [previousResult, setPreviousResult] = useState<BalancedResult | null>(null)

  // Trigger confetti when new result appears
  useEffect(() => {
    if (result && result !== previousResult) {
      celebrate()
      setPreviousResult(result)
    }
  }, [result, previousResult, celebrate])

  if (!result) {
    return (
      <Card className="h-full min-h-[280px] flex items-center justify-center transition-all hover:shadow-glow-sm">
        <CardContent className="text-center space-y-3 py-8 px-4">
          <Beaker className="mx-auto h-10 w-10 text-muted-foreground" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold">No Equation Balanced Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Enter a chemical equation to see the results.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {/* Export Controls */}
      <div className="flex items-center justify-end gap-2">
        <ShareButton equation={result.balanced} size="sm" />
        <ExportButton result={result} />
      </div>

      {/* Container for export functionality */}
      <div 
        id="equation-export-container" 
        className="space-y-3 export-container"
        data-result={JSON.stringify(result)}
      >
        {/* Balanced Equation Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="export-section"
        >
          <Card className="transition-all hover:shadow-glow-md hover:border-primary/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Balanced Equation
              </CardTitle>
              <CopyButton text={result.balanced} label="Copy" size="sm" />
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Original:</span>
                <p className="font-mono text-sm text-slate-600 dark:text-slate-300">{result.original}</p>
              </div>
              <Separator className="my-2" />
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                <span className="text-xs text-muted-foreground block mb-1">Balanced:</span>
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="font-mono text-lg font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent break-words"
                >
                  {result.balanced}
                </motion.p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reaction Info and Molecular Weights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="export-section"
          >
            <ReactionInfo
              original={result.original}
              reactionType={result.metadata?.reactionType}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="export-section"
          >
            <MolecularWeightDisplay
              molecularWeights={result.metadata?.molecularWeights}
            />
          </motion.div>
        </div>

        {/* Step-by-Step Explanation Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="export-section"
        >
          <StepsExplanation steps={result.steps} />
        </motion.div>
      </div>
    </div>
  )
}
