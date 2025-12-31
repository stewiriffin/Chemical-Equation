import { motion } from "framer-motion"
import { EquationInput } from "./equation/EquationInput"
import { EquationDisplay } from "./equation/EquationDisplay"
import { Header } from "./layout/Header"
import { ParticleBackground } from "./visualization/ParticleBackground"
import { Toaster } from "./ui/toaster"

/**
 * Main orchestrator component for the Chemical Equation Balancer
 * Coordinates the input and display components with visual enhancements
 */
export default function EquationBalancer() {
  return (
    <>
      <ParticleBackground />
      <Header />
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
              className="lg:col-span-2"
            >
              <EquationInput />
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
