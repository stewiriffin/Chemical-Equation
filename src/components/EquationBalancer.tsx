import { motion } from "framer-motion"
import { EquationInput } from "./equation/EquationInput"
import { EquationDisplay } from "./equation/EquationDisplay"
import { EquationHistory } from "./equation/EquationHistory"
import { Header } from "./layout/Header"
import { ParticleBackground } from "./visualization/ParticleBackground"
import { Toaster } from "./ui/toaster"
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts"
import { useEquationContext } from "@/lib/context/EquationContext"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Keyboard } from "lucide-react"

/**
 * Main orchestrator component for the Chemical Equation Balancer
 * Coordinates the input and display components with visual enhancements
 */
export default function EquationBalancer() {
  const { dispatch } = useEquationContext()
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      {/* Hide particle background on mobile for performance */}
      {!isMobile && <ParticleBackground />}
      <Header onShowShortcuts={() => setShowShortcuts(true)} />

      {/* Keyboard Shortcuts Help Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Productivity tips to speed up your workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2 text-sm">
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

      <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          {/* Mobile: stacked layout | Desktop: side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 px-2 sm:px-4 max-w-screen-xl mx-auto">
            {/* Left Column - Input Section */}
            <div className="order-1 md:order-1 lg:col-span-2 space-y-3 md:space-y-4">
              <EquationInput />
              {/* Hide history on mobile, show on md+ */}
              <div className="hidden md:block">
                <EquationHistory />
              </div>
            </div>

            {/* Right Column - Results Section */}
            <div className="order-2 md:order-2 lg:col-span-3">
              <EquationDisplay />
            </div>

            {/* Mobile-only History Section */}
            <div className="order-3 md:hidden">
              <EquationHistory />
            </div>
          </div>
        </motion.div>
      </div>
      <Toaster />
    </>
  )
}
