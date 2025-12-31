import { useEffect } from 'react'

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  callback: () => void
  description: string
}

/**
 * Custom hook for keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatch = shortcut.alt ? event.altKey : !event.altKey
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault()
          shortcut.callback()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts])
}

/**
 * Get formatted shortcut display string
 */
export function getShortcutDisplay(shortcut: KeyboardShortcut): string {
  const parts: string[] = []

  if (shortcut.ctrl) {
    // Use Cmd on Mac, Ctrl on Windows/Linux
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    parts.push(isMac ? '⌘' : 'Ctrl')
  }
  if (shortcut.shift) parts.push('Shift')
  if (shortcut.alt) parts.push('Alt')

  parts.push(shortcut.key.toUpperCase())

  return parts.join('+')
}
