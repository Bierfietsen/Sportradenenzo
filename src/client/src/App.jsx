import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'
import axios from 'axios'

import { installResponseInterceptor } from './api'
import { clearSession, getAuthToken, setAuthToken, tokenIsAdmin } from './auth'
import { AuthContext, RaceContext, useAuth } from './context'

import Navbar from './components/navbar'
import LogInSignUp from './components/LogInSignUp'
import Home from './components/home'
import Stage from './components/stage'
import Teamselection from './components/teamselection'
import Admin from './components/admin'
import Statistics from './components/statistics'
import Charts from './components/charts'
import Rider from './components/rider'
import Profile from './components/profile'
import Fourofour from './components/fourofour'
import Settings from './components/settings'
import EmailVerification from './components/EmailVerification'
import PasswordRecovery from './components/PasswordRecovery'

import './components/css/buttons.css'
import './components/css/fonts.css'
import './components/css/menus.css'
import './components/css/tables.css'

// Pages that are reachable without being logged in
const PUBLIC_PATHS = ['/passwordrecovery/', '/verify/']

function stageLinkFor(race) {
  return race.stagenr === 0 ? '/teamselection' : `/stage/${race.stagenr}`
}

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return null
  return isAdmin ? children : <Navigate to="/" replace />
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const [auth, setAuth] = useState({ isLoggedIn: false, isAdmin: false, loading: true })
  const [redirect, setRedirect] = useState('/home') // where to go after logging in
  const [notFoundMessage, setNotFoundMessage] = useState('')
  const [race, setRaceState] = useState(() => ({
    race_id: sessionStorage.getItem('race_id'),
    racename: sessionStorage.getItem('racename'),
    currentStageLink: sessionStorage.getItem('currentStageLink') ?? '/home',
  }))

  // The interceptor lives for the lifetime of the app, so it reads the latest path through a ref
  const pathRef = useRef(location.pathname)
  pathRef.current = location.pathname

  const login = useCallback((token) => {
    setAuthToken(token)
    setAuth({ isLoggedIn: true, isAdmin: tokenIsAdmin(token), loading: false })
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setAuth({ isLoggedIn: false, isAdmin: false, loading: false })
    navigate('/')
  }, [navigate])

  useEffect(
    () =>
      installResponseInterceptor({
        onAuthenticated: (token) =>
          setAuth((prev) => (prev.isLoggedIn ? prev : { ...prev, isLoggedIn: true, isAdmin: tokenIsAdmin(token) })),
        onUnauthorized: () => {
          setAuth((prev) => ({ ...prev, isLoggedIn: false, isAdmin: false }))
          if (pathRef.current !== '/') {
            setRedirect(pathRef.current)
            navigate('/', { replace: true })
          }
        },
        onNotFound: (message) => {
          setRedirect(pathRef.current)
          setNotFoundMessage(message)
          navigate('/404', { replace: true })
        },
      }),
    [navigate]
  )

  // Check once on load whether the stored token is still valid
  useEffect(() => {
    if (PUBLIC_PATHS.some((p) => location.pathname.includes(p))) return

    const sendToLogin = () => {
      setRedirect(location.pathname)
      setAuth((prev) => ({ ...prev, loading: false }))
      navigate('/login', { replace: true })
    }

    const token = getAuthToken()
    if (!token) {
      sendToLogin()
      return
    }
    axios.post('/api/getlogin', { token }).then((res) => {
      if (res.data) {
        setAuth({ isLoggedIn: res.data.isLoggedIn, isAdmin: res.data.admin, loading: false })
      } else {
        sendToLogin()
      }
    })
    // Only on first load: later auth changes are handled by the interceptor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setRace = useCallback((newRace) => {
    const next = { race_id: newRace.race_id, racename: newRace.name, currentStageLink: stageLinkFor(newRace) }
    setRaceState(next)
    for (const [key, value] of Object.entries(next)) sessionStorage.setItem(key, value)
  }, [])

  const authValue = useMemo(() => ({ ...auth, login, logout }), [auth, login, logout])
  const raceValue = useMemo(() => ({ ...race, setRace }), [race, setRace])

  return (
    <AuthContext.Provider value={authValue}>
      <RaceContext.Provider value={raceValue}>
        <div className="content">
          <Navbar />
          <div className="pageContainer">
            <Routes>
              <Route path="/" element={<Navigate to={auth.isLoggedIn ? '/home' : '/login'} replace />} />
              <Route
                path="/login"
                element={auth.isLoggedIn ? <Navigate to={redirect} replace /> : auth.loading ? null : <LogInSignUp />}
              />
              <Route path="/passwordrecovery/:token" element={<PasswordRecovery />} />
              <Route path="/verify/:token" element={<EmailVerification />} />
              <Route path="/home" element={<Home />} />
              <Route path="/stage/:stagenumber" element={<Stage />} />
              <Route path="/teamselection" element={<Teamselection />} />
              <Route path="/statistics/:selection" element={<Statistics />} />
              <Route path="/charts/:chartname" element={<Charts />} />
              <Route path="/profile/id/:account_id" element={<Profile />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/rider/:rider_id" element={<Rider />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/admin/:subpage"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              <Route path="/404" element={<Fourofour message={notFoundMessage} />} />
              <Route path="*" element={<Fourofour />} />
            </Routes>
          </div>
        </div>
      </RaceContext.Provider>
    </AuthContext.Provider>
  )
}
