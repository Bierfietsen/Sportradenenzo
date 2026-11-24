import 'flag-icons/css/flag-icons.min.css'

export default function FlagIcon({ code }) {
  if (!code) return null
  return <span className={`fi fi-${code.toLowerCase()}`} />
}
