import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import { useAuth, useRace } from '../../context'
import { isFabFourMember } from '../../auth'
import { flipBudget, flipFabFour, selectBudget, selectFabFour } from '../../store'
import { SRELogo } from '../shared/svg/SRELogo'
import StoreToggle from './StoreToggle'
import StatsDropdown from './Dropdowns/Statistieken'
import ChartsDropdown from './Dropdowns/Charts'
import SettingsDropdown from './Dropdowns/Settings'
import MobileDropdown from './Dropdowns/Mobile'
import './index.css'

// Full class names so Tailwind can find them when scanning the source
const RACE_COLORS = {
  giro: { border: 'border-pink-300', logo: 'text-pink-300 hover:text-pink-200' },
  tour: { border: 'border-yellow-300', logo: 'text-yellow-300 hover:text-yellow-200' },
  vuelta: { border: 'border-red-300', logo: 'text-red-300 hover:text-red-200' },
  default: { border: 'border-blue-300', logo: 'text-blue-300 hover:text-blue-200' },
}

export default function Navbar() {
  const { isLoggedIn, isAdmin, loading } = useAuth()
  const { racename, currentStageLink } = useRace()
  const colors = RACE_COLORS[racename] ?? RACE_COLORS.default
  const hasRace = racename !== null

  return (
    <div
      className={`flex fixed items-center select-none shadow-lg z-50 bg-gray-800 text-gray-400 h-12 w-full border-t-2 border-solid gap-x-4 ${colors.border} ${isLoggedIn ? '' : 'hidden'}`}
    >
      <Link className="h-full py-2 px-2" to="/">
        <SRELogo className={`h-full fill-current duration-300 ${colors.logo}`} />
      </Link>
      <div className="flex items-center gap-x-5 h-full text-lg">
        {hasRace && (
          <Link className="navbar_link" to={currentStageLink}>
            <span>Current stage</span>
          </Link>
        )}
        {!loading && <ChartsDropdown showRaceSpecificData={hasRace} />}
        {!loading && <StatsDropdown showRaceSpecificData={hasRace} />}
        {isAdmin && (
          <Link className="navbar_link" to="/admin/sqlinterface">
            <span>
              <FontAwesomeIcon icon={faShieldHalved} /> Admin
            </span>
          </Link>
        )}
        {isFabFourMember() && (
          <div className="flex">
            <StoreToggle label="Budget" selector={selectBudget} action={flipBudget} />
            <StoreToggle label="FabFour" selector={selectFabFour} action={flipFabFour} />
          </div>
        )}
      </div>
      <div className="flex flex-row-reverse grow items-center h-full">
        <SettingsDropdown />
        <MobileDropdown />
        {racename && (
          <img className="hidden md:block p-1 h-full object-contain" src={`/images/${racename}.png`} alt="logo_small" />
        )}
      </div>
    </div>
  )
}
