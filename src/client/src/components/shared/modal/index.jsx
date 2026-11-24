import { useEffect, useState } from 'react'
import './index.css'

function Modal({ show, content, onClose }) {
  return (
    <div className={`modal ${show ? 'display-block' : 'display-none'}`} onClick={onClose}>
      <div className={show ? 'modal-content display-block' : 'modal display-none'}>{content}</div>
    </div>
  )
}

/**
 * Button that opens a modal. `callback` runs when the modal opens (e.g. to fetch its content).
 * The modal closes on Escape or on a click that isn't a text selection.
 */
export default function ModalButton({ cssClassButton, content, contentIcon, modalContent, callback }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!visible) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setVisible(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [visible])

  const open = () => {
    callback?.()
    setVisible(true)
  }

  const closeOnClick = () => {
    if (!window.getSelection().toString().length) setVisible(false)
  }

  return (
    <div className="stageprofilebutton">
      <button className={cssClassButton} onClick={open}>
        {content}
        {contentIcon}
      </button>
      <Modal content={modalContent} onClose={closeOnClick} show={visible} />
    </div>
  )
}
