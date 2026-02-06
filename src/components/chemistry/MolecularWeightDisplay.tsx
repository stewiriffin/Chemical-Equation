import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MolecularWeight } from "@/types/chemistry"
import { getElement } from "@/data/periodicTableData"
import { Scale } from "lucide-react"
import { getElementColor } from "@/constants/colors"

interface MolecularWeightDisplayProps {
  molecularWeights?: MolecularWeight[]
}

export function MolecularWeightDisplay({ molecularWeights }: MolecularWeightDisplayProps) {
  if (!molecularWeights || molecularWeights.length === 0) return null

  return (
    <Card className="transition-all hover:shadow-glow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Scale className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Molecular Weights</span>
          <span className="sm:hidden">Molar Mass</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {molecularWeights.map((mw, index) => (
            <div key={index} className="pb-3 border-b last:border-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <span className="font-mono font-semibold text-sm sm:text-base">{mw.compound}</span>
                <span className="text-xs sm:text-sm font-medium text-primary">
                  {mw.weight.toFixed(3)} g/mol
                </span>
              </div>

              {/* Element breakdown - scrollable on mobile */}
              <div className="flex flex-wrap gap-1 mt-1">
                {mw.breakdown.map((element, idx) => {
                  const elementData = getElement(element.symbol)
                  const color = getElementColor(element.symbol)

                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium border"
                      style={{
                        backgroundColor: `${color}15`,
                        borderColor: `${color}40`,
                        color: color,
                      }}
                    >
                      <span className="font-bold">{element.symbol}</span>
                      {element.count > 1 && (
                        <span className="text-[10px]">×{element.count}</span>
                      )}
                      {elementData && (
                        <span className="text-[9px] sm:text-[10px] opacity-70">
                          ({(elementData.atomicMass * element.count).toFixed(2)})
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
