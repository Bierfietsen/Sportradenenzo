import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import useDropdown from '../../shared/useDropdown'

// links: [{ to, label, raceSpecific }]
export default function LinkDropdown({ title, links, showRaceSpecificData }) {
  const { open, show } = useDropdown()
  const visibleLinks = links.filter((link) => showRaceSpecificData || !link.raceSpecific)

  return (
    <div className="navbar_link">
      <button type="button" onClick={show}>
        <span>
          {title} <FontAwesomeIcon icon={open ? faAngleUp : faAngleDown} />
        </span>
      </button>
      {open && (
        <div className="navbar_dropdown-content">
          {visibleLinks.map(({ to, label }) => (
            <Link key={to} className="navbar_dropdown_item" to={to}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
