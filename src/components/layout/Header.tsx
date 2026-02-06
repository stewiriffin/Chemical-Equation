import { motion } from 'framer-motion'
import { Moon, Sun, Beaker, Keyboard } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useEquationContext } from '@/lib/context/EquationContext'
import { useEffect } from 'react'

interface HeaderProps {
  onShowShortcuts?: () => void
}

/**
 * Application header with branding and dark mode toggle
 */
export function Header({ onShowShortcuts }: HeaderProps = {}) {
  const { state, dispatch } = useEquationContext()

  // Apply dark mode class to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.darkMode])

  const handleDarkModeToggle = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' })
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Beaker className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent truncate">
              <span className="hidden xs:block">Chemical Equation Balancer</span>
              <span className="xs:hidden">Equation Balancer</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block truncate">
              Balance any chemical equation
            </p>
          </div>
        </div>

        {/* Dark Mode Toggle and Shortcuts */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          {onShowShortcuts && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onShowShortcuts}
              title="Keyboard shortcuts (Ctrl+/)"
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <Keyboard className="h-4 w-4" />
            </Button>
          )}
          <Label htmlFor="dark-mode" className="cursor-pointer flex items-center gap-2">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle dark mode</span>
          </Label>
          <Switch
            id="dark-mode"
            checked={state.darkMode}
            onCheckedChange={handleDarkModeToggle}
          />
        </div>
      </div>
    </motion.header>
  )
}
