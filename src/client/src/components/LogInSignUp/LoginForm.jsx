import { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { useAuth } from '../../context'
import { useEmailValidation } from './emailValidation'
import PasswordRecoveryForm from './PasswordRecoveryForm'

const LOGIN_FAILED = 'Login failed: incorrect email/password combination'

export default function LoginForm({ signup }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [showRecovery, setShowRecovery] = useState(false)
  const { emailCorrect, onEmailEvent, validateEmail } = useEmailValidation()

  const logIn = async (email, password) => {
    const res = await axios.post('/api/login', { email, password })
    if (res.data.succes) {
      login(res.data.token)
      navigate('/')
    } else {
      setError(LOGIN_FAILED)
    }
  }

  const loginSubmit = (e) => {
    e.preventDefault()
    const { email, password } = e.target.elements
    logIn(email.value, password.value)
  }

  const signupSubmit = async (e) => {
    e.preventDefault()
    const { email, username, password, password2 } = e.target.elements
    if (password.value !== password2.value) {
      setError('Passwords do not match')
      return
    }
    if (!validateEmail(email.value)) {
      setError('Email is not a correct address')
      return
    }
    const res = await axios.post('/api/signup', {
      email: email.value,
      username: username.value,
      password: password.value,
    })
    if (res.data.succes) {
      await logIn(email.value, password.value)
    } else {
      setError(res.data.error)
    }
  }

  return (
    <div className="flex flex-col max-w-full m-auto md:mr-12 md:ml-4 mt-12 bg-white p-5 shadow-2xl rounded-md">
      <div className="mt-1 mb-6 font-bold text-gray-600 text-center">
        {signup ? 'Create an account' : 'Log in to manage your team'}
      </div>
      <form onSubmit={signup ? signupSubmit : loginSubmit}>
        {signup && (
          <>
            <div className="ml-1 mb-1 text-sm text-gray-600">Username</div>
            <div className="mb-4">
              <input className="form-control" name="username" type="text" placeholder="Username" />
            </div>
          </>
        )}
        <div className="ml-1 mb-1 text-sm text-gray-600">E-mail address</div>
        <div className="mb-4">
          <input
            className={emailCorrect ? 'form-control' : 'form-control error'}
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={onEmailEvent}
            onBlur={onEmailEvent}
          />
        </div>
        <div className="ml-1 mb-1 text-sm text-gray-600">Password</div>
        <div className="mb-4">
          <input className="form-control" name="password" type="password" placeholder="Password" />
        </div>
        {signup && (
          <>
            <div className="ml-1 mb-1 text-sm text-gray-600">Repeat Password</div>
            <div className="mb-4">
              <input className="form-control" name="password2" type="password" placeholder="Password" />
            </div>
          </>
        )}
        {error && <div className="errordiv">{error}</div>}
        <button className="landing_button mt-4 float-right rounded-md shadow-md">{signup ? 'Sign up' : 'Log in'}</button>
      </form>
      {!signup && (
        <div className="float-left">
          <button className="bg-transparent h-6 ml-2 mt-2" onClick={() => setShowRecovery(true)}>
            <span className="text-xs text-blue-500">Forgot password?</span>
          </button>
          <div className={showRecovery ? 'modal display-block' : 'modal display-none'}>
            <div className={showRecovery ? 'display-block' : 'modal display-none'}>
              <PasswordRecoveryForm onClose={() => setShowRecovery(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
