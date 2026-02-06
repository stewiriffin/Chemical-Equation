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
        <CardTitle className="flex items-center gap-2 text-sm">
          <Scale className="h-4 w-4" />
          Molar Mass
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {molecularWeights.map((mw, index) => (
            <div key={index} className="pb-2 border-b last:border-0 last:pb-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono font-semibold text-sm">{mw.compound}</span>
                <span className="text-xs font-medium text-primary">
                  {mw.weight.toFixed(2)} g/mol
                </span>
              </div>

              {/* Element breakdown */}
              <div className="flex flex-wrap gap-1">
                {mw.breakdown.map((element, idx) => {
                  const elementData = getElement(element.symbol)
                  const color = getElementColor(element.symbol)

                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border"
                      style={{
                        backgroundColor: `${color}15`,
                        borderColor: `${color}40`,
                        color: color,
                      }}
                    >
                      <span className="font-bold">{element.symbol}</span>
                      {element.count > 1 && (
                        <span className="text-[9px]">×{element.count}</span>
                      )}
                      {elementData && (
                        <span className="text-[9px] opacity-70">
                          ({(elementData.atomicMass * element.count).toFixed(1)})
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
