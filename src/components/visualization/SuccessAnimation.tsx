import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface SuccessAnimationProps {
  trigger: boolean
  onComplete?: () => void
}

/**
 * Success animation component using canvas-confetti
 * Triggers a confetti burst when equation is successfully balanced
 */
export function SuccessAnimation({ trigger, onComplete }: SuccessAnimationProps) {
  useEffect(() => {
    if (trigger) {
      // Fire confetti from the center
      const duration = 2000
      const animationEnd = Date.now() + duration

      const colors = ['#1E90FF', '#FF0D0D', '#3DFF00', '#FFFF30', '#AB5CF2']

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          clearInterval(interval)
          onComplete?.()
          return
        }

        const particleCount = 50 * (timeLeft / duration)

        // Fire from left
        confetti({
          particleCount,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors,
        })

        // Fire from right
        confetti({
          particleCount,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors,
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [trigger, onComplete])

  return null
}

/**
 * Simpler success animation - single burst from bottom
 */
export function useSuccessAnimation() {
  const celebrate = () => {
    const colors = ['#1E90FF', '#FF0D0D', '#3DFF00', '#FFFF30', '#AB5CF2', '#FF8000']

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    })
  }

  return { celebrate }
}
