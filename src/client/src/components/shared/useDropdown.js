import { useEffect, useState } from 'react'

// Open/close state for a dropdown that closes on the next click or key press anywhere
export default function useDropdown() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    document.addEventListener('click', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('click', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  const show = (event) => {
    event?.preventDefault()
    setOpen(true)
  }

  return { open, show, close: () => setOpen(false) }
}
