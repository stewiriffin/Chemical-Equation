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
    <Card className="transition-all hover:shadow-glow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Molecular Weights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {molecularWeights.map((mw, index) => (
            <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-semibold text-lg">{mw.compound}</span>
                <span className="text-sm font-medium text-primary">
                  {mw.weight.toFixed(3)} g/mol
                </span>
              </div>

              {/* Element breakdown */}
              <div className="flex flex-wrap gap-2 mt-2">
                {mw.breakdown.map((element, idx) => {
                  const elementData = getElement(element.symbol)
                  const color = getElementColor(element.symbol)

                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border"
                      style={{
                        backgroundColor: `${color}15`,
                        borderColor: `${color}40`,
                        color: color,
                      }}
                    >
                      <span className="font-bold">{element.symbol}</span>
                      {element.count > 1 && (
                        <span className="text-xs">×{element.count}</span>
                      )}
                      {elementData && (
                        <span className="text-xs opacity-70">
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
