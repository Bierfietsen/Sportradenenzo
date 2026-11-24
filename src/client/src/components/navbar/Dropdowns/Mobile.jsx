import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import useDropdown from '../../shared/useDropdown'
import { useAuth, useRace } from '../../../context'

export default function MobileDropdown() {
  const { open, show } = useDropdown()
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const { currentStageLink } = useRace()

  return (
    <div className="flex md:hidden h-full w-10 items-center" onClick={show}>
      <FontAwesomeIcon className="m-auto duration-500 active:text-white" icon={faBars} />
      {open && (
        <div className="navbar_dropdown-content right-2">
          {isLoggedIn ? (
            <>
              <Link className="navbar_settings_dropdown_item" to={currentStageLink}>
                <span>Current stage</span>
              </Link>
              {isAdmin && (
                <Link className="navbar_settings_dropdown_item" to="/admin/sqlinterface">
                  <span>Admin</span>
                </Link>
              )}
              <Link className="navbar_settings_dropdown_item" to="/settings">
                <span>Settings</span>
              </Link>
              <button className="navbar_settings_dropdown_item" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="navbar_link" to="/login">
              Log in
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
