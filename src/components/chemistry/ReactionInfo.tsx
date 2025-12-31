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
    <Card className="transition-all hover:shadow-glow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Reaction Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Reaction Type:</p>
          <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${badgeColor}`}>
            {formattedType}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Description:</p>
          <p className="text-sm leading-relaxed">{description}</p>
        </div>

        {reactionType === 'combustion' && (
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-md">
            <p className="text-sm text-orange-700 dark:text-orange-400">
              ⚠️ Combustion reactions release energy in the form of heat and light. Handle with care!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
