import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import Table from '../shared/table'
import FlagIcon from '../shared/FlagIcon'

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const EMPTY = []
const NO_RACE = { team: '', name: '', year: '' }

export default function Rider() {
  const { rider_id } = useParams()
  const [rider, setRider] = useState({ posData: [], pointsData: [], riderName: '', country: '', races: [] })
  const [selectedRace, setSelectedRace] = useState(0)

  useEffect(() => {
    axios.post('/api/getriderresults', { rider_id }).then((res) => {
      document.title = res.data.riderName
      setRider(res.data)
      setSelectedRace(res.data.pointsData.length - 1)
    })
  }, [rider_id])

  const posData = rider.posData[selectedRace] ?? EMPTY
  const pointsData = rider.pointsData[selectedRace] ?? EMPTY
  const race = rider.races[selectedRace] ?? NO_RACE

  return (
    <div className="statisticsContainer">
      {rider.races.map((r, index) => (
        <button
          className={`raceButton ${r.name}`}
          disabled={index === selectedRace}
          key={r.name + r.year}
          onClick={() => setSelectedRace(index)}
        >
          <span className="h7 bold">
            {capitalize(r.name)} - {r.year}
          </span>
        </button>
      ))}
      <div className="h3">
        {rider.riderName} <FlagIcon code={rider.country} /> - {race.team}{' '}
      </div>
      <div className="h4">
        {capitalize(race.name)} - {race.year}{' '}
      </div>
      <div className="tableDiv">
        <Table data={posData} title="Uitslagen" />
      </div>
      <div className="tableDiv">
        <Table data={pointsData} title="Punten" />
      </div>
    </div>
  )
}
