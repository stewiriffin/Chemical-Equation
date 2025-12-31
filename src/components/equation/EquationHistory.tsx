import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, Trash2, Clock } from "lucide-react"
import { useEquationContext } from "@/lib/context/EquationContext"
import { motion, AnimatePresence } from "framer-motion"
import { clearHistory as clearLocalStorageHistory } from "@/lib/utils/localStorage"

export function EquationHistory() {
  const { state, dispatch } = useEquationContext()
  const [expanded, setExpanded] = useState(false)

  const handleHistoryClick = (equation: string) => {
    dispatch({ type: 'SET_EQUATION', payload: equation })
    dispatch({ type: 'RESET_RESULT' })
  }

  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ type: 'REMOVE_FROM_HISTORY', payload: id })
  }

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_HISTORY' })
    clearLocalStorageHistory()
  }

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (state.history.length === 0) {
    return (
      <Card className="transition-all hover:shadow-glow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            History
          </CardTitle>
          <CardDescription>
            Your recently balanced equations will appear here
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="transition-all hover:shadow-glow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            History ({state.history.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Click any equation to load it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <AnimatePresence mode="popLayout">
          {state.history.slice(0, expanded ? undefined : 5).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-3 group relative"
                onClick={() => handleHistoryClick(item.equation)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                  <p className="font-mono text-sm truncate">{item.equation}</p>
                  {item.balanced && (
                    <p className="font-mono text-xs text-muted-foreground truncate mt-1">
                      → {item.balanced}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                  onClick={(e) => handleRemoveItem(item.id, e)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {state.history.length > 5 && (
          <Button
            variant="ghost"
            className="w-full mt-2"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : `Show ${state.history.length - 5} More`}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
