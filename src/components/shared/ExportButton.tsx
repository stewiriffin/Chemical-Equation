import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileJson, FileText, Image, FileType } from "lucide-react"
import { BalancedResult } from "@/types/chemistry"
import {
  downloadJSON,
  downloadLatex,
  exportToPNG,
  exportToPDF,
  copyLatexToClipboard,
  copyJSONToClipboard,
} from "@/lib/utils/export"
import { toast } from "sonner"

interface ExportButtonProps {
  result: BalancedResult
  elementId?: string
}

export function ExportButton({ result, elementId = "equation-export-container" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (type: string) => {
    setIsExporting(true)
    try {
      switch (type) {
        case "json":
          downloadJSON(result, `${result.balanced.replace(/\s+/g, '_')}.json`)
          toast.success("Exported as JSON", {
            description: "The equation has been downloaded as a JSON file.",
          })
          break
        case "latex":
          downloadLatex(result, `${result.balanced.replace(/\s+/g, '_')}.tex`)
          toast.success("Exported as LaTeX", {
            description: "The equation has been downloaded as a LaTeX file.",
          })
          break
        case "png":
          await exportToPNG(elementId, `${result.balanced.replace(/\s+/g, '_')}.png`)
          toast.success("Exported as PNG", {
            description: "The equation has been downloaded as an image.",
          })
          break
        case "pdf":
          await exportToPDF(elementId, `${result.balanced.replace(/\s+/g, '_')}.pdf`)
          toast.success("Exported as PDF", {
            description: "The equation has been downloaded as a PDF.",
          })
          break
        case "copy-latex":
          await copyLatexToClipboard(result)
          toast.success("LaTeX copied!", {
            description: "The LaTeX code has been copied to clipboard.",
          })
          break
        case "copy-json":
          await copyJSONToClipboard(result)
          toast.success("JSON copied!", {
            description: "The JSON data has been copied to clipboard.",
          })
          break
      }
    } catch (error) {
      toast.error("Export failed", {
        description: error instanceof Error ? error.message : "Failed to export equation",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting} className="gap-2">
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Download As</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("png")} className="gap-2">
          <Image className="h-4 w-4" />
          <span>PNG Image</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2">
          <FileType className="h-4 w-4" />
          <span>PDF Document</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")} className="gap-2">
          <FileJson className="h-4 w-4" />
          <span>JSON Data</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("latex")} className="gap-2">
          <FileText className="h-4 w-4" />
          <span>LaTeX File</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Copy to Clipboard</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("copy-latex")} className="gap-2">
          <FileText className="h-4 w-4" />
          <span>Copy LaTeX</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("copy-json")} className="gap-2">
          <FileJson className="h-4 w-4" />
          <span>Copy JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
