import { useState } from 'react'

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const emailIsValid = (email) => EMAIL_REGEX.test(email)

/**
 * Validation state for an email input: only checks on blur, then live while invalid.
 * Returns { emailCorrect, onEmailEvent, validateEmail(email) }.
 */
export function useEmailValidation() {
  const [emailCorrect, setEmailCorrect] = useState(true)

  const onEmailEvent = (e) => {
    if (!emailCorrect || e.type === 'blur') setEmailCorrect(emailIsValid(e.target.value))
  }

  const validateEmail = (email) => {
    const valid = emailIsValid(email)
    setEmailCorrect(valid)
    return valid
  }

  return { emailCorrect, onEmailEvent, validateEmail }
}
