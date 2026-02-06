import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactionType } from "@/types/chemistry"
import { formatReactionType, getReactionTypeColor, classifyReaction } from "@/lib/chemistry/reactionClassifier"
import { parseEquation } from "@/lib/chemistry/parser"
import { Info } from "lucide-react"

interface ReactionInfoProps {
  original: string
  reactionType?: ReactionType
}

export function ReactionInfo({ original, reactionType }: ReactionInfoProps) {
  if (!reactionType) return null

  // Get full reaction information
  let description = ''
  try {
    const parsed = parseEquation(original)
    const info = classifyReaction(parsed)
    description = info.description
  } catch (error) {
    description = 'Unable to determine reaction details.'
  }

  const badgeColor = getReactionTypeColor(reactionType)
  const formattedType = formatReactionType(reactionType)

  return (
    <Card className="transition-all hover:shadow-glow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Info className="h-4 w-4" />
          Reaction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Type:</p>
          <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${badgeColor}`}>
            {formattedType}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Description:</p>
          <p className="text-xs leading-relaxed">{description}</p>
        </div>

        {reactionType === 'combustion' && (
          <div className="mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-md">
            <p className="text-xs text-orange-700 dark:text-orange-400">
              ⚠️ Combustion reactions release energy. Handle with care!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
