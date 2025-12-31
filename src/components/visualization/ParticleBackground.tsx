import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { getElementColor } from '@/constants/colors'

interface Particle {
  id: number
  x: number
  y: number
  symbol: string
  color: string
  size: number
  duration: number
  delay: number
}

/**
 * Animated particle background with floating chemical element symbols
 * Creates a subtle, engaging background effect
 */
export function ParticleBackground() {
  // Common elements to display as particles
  const elements = ['H', 'O', 'C', 'N', 'S', 'P', 'Cl', 'Na', 'K', 'Ca', 'Fe', 'Cu']

  // Generate random particles
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      symbol: elements[Math.floor(Math.random() * elements.length)],
      color: getElementColor(elements[Math.floor(Math.random() * elements.length)]),
      size: Math.random() * 20 + 10,
      duration: Math.random() * 20 + 15, // 15-35 seconds
      delay: Math.random() * 5,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10 dark:opacity-5">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute font-mono font-bold"
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 0,
          }}
          animate={{
            y: [`${particle.y}vh`, `${particle.y - 20}vh`, `${particle.y}vh`],
            opacity: [0, 0.6, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
          style={{
            fontSize: `${particle.size}px`,
            color: particle.color,
          }}
        >
          {particle.symbol}
        </motion.div>
      ))}
    </div>
  )
}
