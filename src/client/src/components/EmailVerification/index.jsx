import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import AuthLayout from '../LogInSignUp/AuthLayout'

export default function EmailVerification() {
  const { token } = useParams()
  const [status, setStatus] = useState({ tried: false, success: false })

  useEffect(() => {
    axios.patch('/api/emailVerfication', { token }).then((res) => setStatus({ tried: true, success: res.data }))
  }, [token])

  let message = 'Verifying, please wait a moment'
  if (status.tried) {
    message = status.success ? 'Success! Your email has been verified.' : 'Oops! Something went wrong, please try again later.'
  }

  return (
    <AuthLayout>
      <div className="block min-w-min">
        <div className="flex flex-col max-w-full m-auto md:mr-12 md:ml-4 mt-12 bg-white p-5 shadow-2xl rounded-md">
          <div>{message}</div>
        </div>
      </div>
    </AuthLayout>
  )
}
