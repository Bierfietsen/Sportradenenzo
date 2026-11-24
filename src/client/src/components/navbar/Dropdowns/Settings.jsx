import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import useDropdown from '../../shared/useDropdown'
import { useAuth } from '../../../context'

export default function SettingsDropdown() {
  const { open, show, close } = useDropdown()
  const { logout } = useAuth()

  return (
    <div
      className="hidden md:flex group h-full w-10 items-center"
      onPointerEnter={show}
      onPointerLeave={close}
      onClick={show}
    >
      <FontAwesomeIcon className="m-auto duration-500 group-hover:text-white group-hover:rotate-45" icon={faGear} />
      {open && (
        <div className="navbar_dropdown-content right-2">
          <Link className="navbar_settings_dropdown_item" to="/settings">
            <span>Settings</span>
          </Link>
          <button className="navbar_settings_dropdown_item" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
