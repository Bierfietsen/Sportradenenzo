import { useState } from 'react'
import axios from 'axios'
import { useEmailValidation } from './emailValidation'

export default function PasswordRecoveryForm({ onClose }) {
  const [emailSent, setEmailSent] = useState(false)
  const { emailCorrect, onEmailEvent, validateEmail } = useEmailValidation()

  const submitRecovery = async (e) => {
    e.preventDefault()
    const email = e.target.elements.recovery_email.value
    if (!validateEmail(email)) return
    const res = await axios.post('/api/recoverytoken', { email })
    if (res) setEmailSent(true)
  }

  return (
    <div className="relative h-56 w-full m-auto md:w-1/6 md:min-w-min mt-12 bg-white p-5 shadow-2xl rounded-md">
      <div className="absolute top-0 right-0">
        <button className="button_standard text" onClick={onClose}>
          <span className="text-gray-600 text-xl">X</span>
        </button>
      </div>
      <div className="mt-1 mb-6 font-bold text-gray-600 text-center">Enter Your Email</div>
      <form onSubmit={submitRecovery}>
        <div className="ml-1 mb-1 text-sm text-gray-600">E-mail address</div>
        <div className="mb-4">
          <input
            className={emailCorrect ? 'form-control' : 'form-control error'}
            name="recovery_email"
            type="email"
            placeholder="Email Address"
            onChange={onEmailEvent}
            onBlur={onEmailEvent}
          />
        </div>
        <div className="min-h-min">
          {emailSent ? (
            <button type="button" className="button_standard green disabled mt-4 float-right rounded-md shadow-md">
              Mail Sent
            </button>
          ) : (
            <button className="landing_button mt-4 float-right rounded-md shadow-md">Send Mail</button>
          )}
        </div>
      </form>
    </div>
  )
}
