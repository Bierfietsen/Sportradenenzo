import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { useRace } from '../../context'

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function RacesTable({ title, races, goToRace }) {
  return (
    <div>
      {title}:
      <div className="flex">
        {races.map((race) => (
          <div className="m-2" key={race.name + race.year}>
            <button className={`button_standard blue ${race.name}`} onClick={() => goToRace(race)}>
              <span className="text-base bold">
                {capitalize(race.name)} - {race.year}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { setRace } = useRace()
  const [races, setRaces] = useState({ active: [], finished: [] })

  useEffect(() => {
    document.title = 'Home'
    axios.post('/api/getHomePageInfo').then((res) => {
      setRaces({ active: res.data.activeRaces, finished: res.data.finishedRaces })
    })
  }, [])

  const goToRace = (race) => {
    setRace(race)
    navigate(race.stagenr === 0 ? '/teamselection' : `/stage/${race.stagenr}`)
  }

  // Skip the home page when there is only one race to go to
  useEffect(() => {
    if (races.active.length === 1 && localStorage.getItem('autoRedirectOnHomepage') === 'true') {
      goToRace(races.active[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [races])

  if (races.active.length === 0 && races.finished.length === 0) return null

  return (
    <div className="standardContainer">
      <div className="activeRaces">
        <RacesTable races={races.active} goToRace={goToRace} title="Open Races" />
      </div>
      {races.finished.length > 0 && (
        <div className="finishedRace">
          <RacesTable races={races.finished} goToRace={goToRace} title="Past Races" />
        </div>
      )}
    </div>
  )
}
