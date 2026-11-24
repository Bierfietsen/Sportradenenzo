import { useEffect, useState } from 'react'

// Mobile: a button that opens the given form in a modal. Closes on Escape or a click on the backdrop.
export default function FormModal({ buttonText, children }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!visible) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setVisible(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [visible])

  const closeOnBackdropClick = (e) => {
    if (e.target === e.currentTarget && !window.getSelection().toString().length) setVisible(false)
  }

  return (
    <>
      <button className="landing_button" onClick={() => setVisible(true)}>
        {buttonText}
      </button>
      <div className={visible ? 'modal display-block' : 'modal display-none'} onClick={closeOnBackdropClick}>
        <div className={visible ? 'display-block' : 'modal display-none'}>{children}</div>
      </div>
    </>
  )
}
