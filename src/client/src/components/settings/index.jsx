import { useEffect, useState } from 'react'
import ToggleSwitch from '../shared/ToggleSwitch'

export default function Settings() {
  const [autoRedirectOnHomepage, setAutoRedirectOnHomepage] = useState(
    () => localStorage.getItem('autoRedirectOnHomepage') === 'true'
  )
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') ?? '')

  useEffect(() => {
    document.title = 'Settings'
  }, [])

  const toggleAutoRedirect = () => {
    const value = !autoRedirectOnHomepage
    setAutoRedirectOnHomepage(value)
    localStorage.setItem('autoRedirectOnHomepage', value ? 'true' : 'false')
  }

  const changeDarkMode = (e) => {
    const value = e.target.value
    setDarkMode(value)
    if (value === '') localStorage.removeItem('darkMode')
    else localStorage.setItem('darkMode', value)
  }

  return (
    <div className="w-full md:w-1/2 m-auto p-4 bg-white shadow-lg">
      <div className="text-2xl mb-2">Lokale Settings</div>
      <div className="text-base mt-3">
        Redirect automatisch naar race op Homepage
        <ToggleSwitch labels={['Off', 'On']} checked={autoRedirectOnHomepage} onChange={toggleAutoRedirect} />
      </div>
      <div className="text-base mt-3">Darkmode</div>
      <select id="selectBox" value={darkMode} onChange={changeDarkMode}>
        <option value="">System Default</option>
        <option value="dark">Dark</option>
        <option value="light">light</option>
      </select>
      <br />
      Current: {darkMode}
    </div>
  )
}
