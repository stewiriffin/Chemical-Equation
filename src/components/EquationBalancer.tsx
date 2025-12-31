import { motion } from "framer-motion"
import { EquationInput } from "./equation/EquationInput"
import { EquationDisplay } from "./equation/EquationDisplay"
import { EquationHistory } from "./equation/EquationHistory"
import { Header } from "./layout/Header"
import { ParticleBackground } from "./visualization/ParticleBackground"
import { Toaster } from "./ui/toaster"
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts"
import { useEquationContext } from "@/lib/context/EquationContext"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Keyboard } from "lucide-react"

/**
 * Main orchestrator component for the Chemical Equation Balancer
 * Coordinates the input and display components with visual enhancements
 */
export default function EquationBalancer() {
  const { dispatch } = useEquationContext()
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Setup keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'd',
      ctrl: true,
      callback: () => dispatch({ type: 'TOGGLE_DARK_MODE' }),
      description: 'Toggle dark mode',
    },
    {
      key: '/',
      ctrl: true,
      callback: () => setShowShortcuts(true),
      description: 'Show keyboard shortcuts',
    },
  ])

  return (
    <>
      <ParticleBackground />
      <Header onShowShortcuts={() => setShowShortcuts(true)} />

      {/* Keyboard Shortcuts Help Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Productivity tips to speed up your workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">Ctrl+Enter</kbd>
                <span className="text-muted-foreground">Balance equation</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">Ctrl+D</kbd>
                <span className="text-muted-foreground">Toggle dark mode</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">Ctrl+/</kbd>
                <span className="text-muted-foreground">Show shortcuts</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">Enter</kbd>
                <span className="text-muted-foreground">Balance (in input)</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - Input Section (40%) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <EquationInput />
              <EquationHistory />
            </motion.div>

            {/* Right Column - Results Section (60%) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <EquationDisplay />
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Toaster />
    </>
  )
}
