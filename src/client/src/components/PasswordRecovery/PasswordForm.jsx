import { useState } from 'react'
import axios from 'axios'

export default function PasswordForm({ token }) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const { password, repeat_password } = e.target.elements
    if (password.value !== repeat_password.value) {
      setError('Passwords do not match')
      return
    }
    const res = await axios.patch('/api/password', { token, password: password.value })
    setSuccess(res.data)
  }

  return (
    <div className="flex flex-col max-w-full m-auto md:mr-12 md:ml-4 mt-12 bg-white p-5 shadow-2xl rounded-md">
      {success ? (
        <div>Password has been reset, you can now log in.</div>
      ) : (
        <>
          <div className="mt-1 mb-6 font-bold text-gray-600 text-center">Set a new password</div>
          <form onSubmit={submit}>
            <div className="ml-1 mb-1 text-sm text-gray-600">Password</div>
            <div className="mb-4">
              <input className="form-control" name="password" type="password" />
            </div>
            <div className="ml-1 mb-1 text-sm text-gray-600">Repeat Password</div>
            <div className="mb-4">
              <input className="form-control" name="repeat_password" type="password" />
            </div>
            {error && <div className="errordiv">{error}</div>}
            <button className="landing_button mt-4 float-right rounded-md shadow-md">Renew</button>
          </form>
        </>
      )}
    </div>
  )
}
