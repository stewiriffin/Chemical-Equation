import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

interface CopyButtonProps {
  text: string
  label?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function CopyButton({
  text,
  label = "Copy",
  variant = "outline",
  size = "sm",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Copied to clipboard!", {
        description: text.length > 50 ? `${text.substring(0, 50)}...` : text,
      })

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      toast.error("Failed to copy", {
        description: "Could not copy to clipboard",
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}
