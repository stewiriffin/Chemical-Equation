import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Check } from "lucide-react"
import { copyShareURL } from "@/lib/utils/urlSharing"
import { toast } from "sonner"

interface ShareButtonProps {
  equation: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ShareButton({
  equation,
  variant = "outline",
  size = "sm",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      const shareURL = await copyShareURL(equation)
      setCopied(true)

      toast.success("Share link copied!", {
        description: "Anyone with this link can view this equation",
      })

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)

      // Try native share API if available (mobile)
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Chemical Equation",
            text: `Check out this balanced equation: ${equation}`,
            url: shareURL,
          })
        } catch (err) {
          // User cancelled or share failed, but URL is already copied
        }
      }
    } catch (error) {
      toast.error("Failed to share", {
        description: "Could not create share link",
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      )}
    </Button>
  )
}
