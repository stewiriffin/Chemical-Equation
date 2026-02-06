import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table2, X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { getElement } from "@/data/periodicTableData"
import { getElementColor } from "@/constants/colors"
import { motion } from "framer-motion"

interface PeriodicTableProps {
  onElementSelect?: (symbol: string) => void
}

// Periodic table layout - [row, column] positions for each element
const elementPositions: Record<string, [number, number]> = {
  // Period 1
  H: [1, 1], He: [1, 18],
  // Period 2
  Li: [2, 1], Be: [2, 2],
  B: [2, 13], C: [2, 14], N: [2, 15], O: [2, 16], F: [2, 17], Ne: [2, 18],
  // Period 3
  Na: [3, 1], Mg: [3, 2],
  Al: [3, 13], Si: [3, 14], P: [3, 15], S: [3, 16], Cl: [3, 17], Ar: [3, 18],
  // Period 4
  K: [4, 1], Ca: [4, 2],
  Sc: [4, 3], Ti: [4, 4], V: [4, 5], Cr: [4, 6], Mn: [4, 7], Fe: [4, 8], Co: [4, 9],
  Ni: [4, 10], Cu: [4, 11], Zn: [4, 12],
  Ga: [4, 13], Ge: [4, 14], As: [4, 15], Se: [4, 16], Br: [4, 17], Kr: [4, 18],
  // Period 5
  Rb: [5, 1], Sr: [5, 2],
  Y: [5, 3], Zr: [5, 4], Nb: [5, 5], Mo: [5, 6], Tc: [5, 7], Ru: [5, 8], Rh: [5, 9],
  Pd: [5, 10], Ag: [5, 11], Cd: [5, 12],
  In: [5, 13], Sn: [5, 14], Sb: [5, 15], Te: [5, 16], I: [5, 17], Xe: [5, 18],
  // Period 6
  Cs: [6, 1], Ba: [6, 2],
  La: [6, 3], Hf: [6, 4], Ta: [6, 5], W: [6, 6], Re: [6, 7], Os: [6, 8], Ir: [6, 9],
  Pt: [6, 10], Au: [6, 11], Hg: [6, 12],
  Tl: [6, 13], Pb: [6, 14], Bi: [6, 15], Po: [6, 16], At: [6, 17], Rn: [6, 18],
  // Period 7
  Fr: [7, 1], Ra: [7, 2],
  Ac: [7, 3], Rf: [7, 4], Db: [7, 5], Sg: [7, 6], Bh: [7, 7], Hs: [7, 8], Mt: [7, 9],
  Ds: [7, 10], Rg: [7, 11], Cn: [7, 12],
  Nh: [7, 13], Fl: [7, 14], Mc: [7, 15], Lv: [7, 16], Ts: [7, 17], Og: [7, 18],
  // Lanthanides (row 8)
  Ce: [8, 4], Pr: [8, 5], Nd: [8, 6], Pm: [8, 7], Sm: [8, 8], Eu: [8, 9],
  Gd: [8, 10], Tb: [8, 11], Dy: [8, 12], Ho: [8, 13], Er: [8, 14], Tm: [8, 15],
  Yb: [8, 16], Lu: [8, 17],
  // Actinides (row 9)
  Th: [9, 4], Pa: [9, 5], U: [9, 6], Np: [9, 7], Pu: [9, 8], Am: [9, 9],
  Cm: [9, 10], Bk: [9, 11], Cf: [9, 12], Es: [9, 13], Fm: [9, 14], Md: [9, 15],
  No: [9, 16], Lr: [9, 17],
}

export function PeriodicTable({ onElementSelect }: PeriodicTableProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)

  const handleElementClick = (symbol: string) => {
    setSelectedElement(symbol)
    if (onElementSelect) {
      onElementSelect(symbol)
    }
  }

  // Create grid layout
  const renderPeriodicTable = () => {
    const rows = 9
    const cols = 18
    const grid: (string | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null))

    // Place elements in grid
    Object.entries(elementPositions).forEach(([symbol, [row, col]]) => {
      grid[row - 1][col - 1] = symbol
    })

    return (
      <div className="space-y-0.5 sm:space-y-1">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-0.5 sm:gap-1 justify-start sm:justify-center overflow-x-auto">
            {row.map((symbol, colIndex) => {
              if (!symbol) {
                return <div key={colIndex} className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0" />
              }

              const elemSymbol = symbol as string
              const element = getElement(elemSymbol)
              const color = getElementColor(elemSymbol)
              const isSelected = selectedElement === elemSymbol

              if (!element) return null

              return (
                <motion.button
                  key={symbol}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleElementClick(symbol)}
                  className={`
                    w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded border-2 font-bold text-[8px] sm:text-xs md:text-sm
                    transition-all cursor-pointer flex flex-col items-center justify-center
                    hover:shadow-lg relative group flex-shrink-0
                    ${isSelected ? 'ring-2 ring-primary ring-offset-1 sm:ring-offset-2' : ''}
                  `}
                  style={{
                    backgroundColor: `${color}25`,
                    borderColor: color,
                    color: color,
                  }}
                  title={`${element.name} (${element.atomicNumber})`}
                >
                  <span className="text-[6px] sm:text-[8px] md:text-[10px] opacity-70 leading-none">
                    {element.atomicNumber}
                  </span>
                  <span className="font-bold leading-none">{symbol}</span>

                  {/* Hover tooltip */}
                  <div className="absolute bottom-full mb-1 hidden group-hover:block z-50 pointer-events-none">
                    <div className="bg-popover border border-border rounded-lg shadow-lg p-2 text-popover-foreground whitespace-nowrap">
                      <p className="font-bold text-xs sm:text-sm">{element.name}</p>
                      <p className="text-[10px] opacity-70">{element.atomicMass.toFixed(3)}</p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 h-8 text-xs sm:gap-2 sm:h-9 sm:text-sm">
          <Table2 className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline sm:inline">Periodic Table</span>
          <span className="xs:hidden">Table</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col p-2 sm:p-4">
        <DialogHeader className="pb-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm sm:text-lg flex items-center gap-2">
              <Table2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Interactive Periodic Table
            </DialogTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                disabled={zoom >= 2}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom(1)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogDescription className="text-xs">
            Tap or click any element to insert it into your equation. Use zoom controls if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div 
            className="min-w-fit py-2"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              width: `${100 / zoom}%`
            }}
          >
            {renderPeriodicTable()}
          </div>
        </div>

        {selectedElement && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-3 sm:p-4 border rounded-lg bg-accent/50 flex-shrink-0"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-lg truncate">
                  {getElement(selectedElement)?.name}
                </h3>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:text-sm">
                  <div className="truncate">
                    <span className="text-muted-foreground">Symbol:</span>
                    <span className="ml-2 font-mono font-bold">{selectedElement}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Atomic #:</span>
                    <span className="ml-2">{getElement(selectedElement)?.atomicNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mass:</span>
                    <span className="ml-2">{getElement(selectedElement)?.atomicMass.toFixed(3)}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 capitalize">{getElement(selectedElement)?.category || 'Unknown'}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => setSelectedElement(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        <div className="mt-2 sm:mt-4 grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 text-[10px] sm:text-xs flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ backgroundColor: '#1E90FF' }} />
            <span className="hidden sm:inline">Nonmetal</span>
            <span className="sm:hidden">Non-m</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ backgroundColor: '#909090' }} />
            <span className="hidden sm:inline">Metalloid</span>
            <span className="sm:hidden">Met.</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ backgroundColor: '#FFA500' }} />
            <span className="hidden sm:inline">Metal</span>
            <span className="sm:hidden">Metal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ backgroundColor: '#32CD32' }} />
            <span className="hidden sm:inline">Noble Gas</span>
            <span className="sm:hidden">Gas</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
