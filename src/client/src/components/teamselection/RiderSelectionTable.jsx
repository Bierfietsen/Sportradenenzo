import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons'

const UNSELECTABLE_REASONS = {
  teamComplete: 'Jouw team is compleet',
  maxFourPerTeam: 'Je mag max 4 renners per team hebben',
  notEnoughMoney: 'Je heb genoeg geld meer',
}

function SelectionButton({ selected, riderID, budgetParticipation, addRemoveRider }) {
  let icon = faPlus
  let className
  let hoverText
  if (selected === 'unselected') {
    className = 'button_standard small blue'
  } else if (selected === 'selected') {
    icon = faXmark
    className = 'button_standard small red'
  } else if (selected.startsWith('unselectable')) {
    hoverText = UNSELECTABLE_REASONS[selected.substring('unselectable '.length)]
    className = 'button_standard small gray disabled'
  }

  const onClick = () => {
    if (selected === 'unselected') addRemoveRider('addRider', riderID, budgetParticipation)
    else if (selected === 'selected') addRemoveRider('removeRider', riderID, budgetParticipation)
  }

  return (
    <button className={className} title={hoverText} onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
    </button>
  )
}

// Picks the specialty to show in the table (GC weighs extra, the active skill filter wins)
function formatRiderSpecialty(specialties, skillFilter) {
  let specialty = ''
  let specialtyValue = ''
  let highestValue = 0
  const specialtiesTable = []
  const specialtiesScoreTable = []
  for (const [key, value] of Object.entries(specialties)) {
    if (Number(value) === 0) continue
    specialtiesTable.push(
      <div key={key} className="w-24 h-6 mb-2 pt-2">
        {key}
      </div>
    )
    specialtiesScoreTable.push(
      <div key={key} className="w-24 h-6 mb-2">
        <span className="text-xl text-yellow-400">{'★'.repeat(value)}</span>
      </div>
    )
    if (
      value > highestValue ||
      (key === 'GC' && value * 1.5 > highestValue) ||
      (key === 'Sprint' && value >= highestValue) ||
      key === skillFilter
    ) {
      specialty = key
      specialtyValue = '★'.repeat(value)
      highestValue = value
      if (key === 'GC') highestValue = value * 1.5
      if (key === skillFilter) highestValue = value + 10
    }
  }
  return { specialtiesTable, specialtiesScoreTable, specialty, specialtyValue }
}

function RiderRow({ name, team, price, selected, specialties, skillFilter, riderID, budgetParticipation, addRemoveRider }) {
  const [showInfo, setShowInfo] = useState(false)
  const toggleInfo = () => setShowInfo((show) => !show)
  const specialty = formatRiderSpecialty(specialties, skillFilter)

  return (
    <>
      <tr className="riderRow">
        <td className={selected} onClick={toggleInfo}>
          <div>
            <div>{name}</div>
            <div className="text-gray-500 mt-2">{team}</div>
          </div>
        </td>
        <td className={selected} onClick={toggleInfo}>
          <div>
            {specialty.specialty}
            <br />
            <span className="text-xl text-yellow-400">{specialty.specialtyValue}</span>
          </div>
        </td>
        <td className={selected} onClick={toggleInfo}>
          {price.toLocaleString('nl', { useGrouping: true })}
        </td>
        <td className={selected}>
          <SelectionButton
            selected={selected}
            addRemoveRider={addRemoveRider}
            riderID={riderID}
            budgetParticipation={budgetParticipation}
          />
        </td>
      </tr>
      {showInfo && (
        <tr>
          <td colSpan="4" className="bg-blue-100">
            <div className="flex flex-row pl-8">
              <div>{specialty.specialtiesTable}</div>
              <div>{specialty.specialtiesScoreTable}</div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function RiderSelectionTable({
  riders,
  selectionIDs,
  selectionTeams,
  budget,
  skillFilter,
  addRemoveRider,
  budgetParticipation,
}) {
  const selectionLength = selectionIDs.length

  // Teams that already have the maximum of 4 riders in the selection
  const ridersPerTeam = {}
  for (const teamName of selectionTeams) ridersPerTeam[teamName] = (ridersPerTeam[teamName] ?? 0) + 1
  const fullTeams = new Set(Object.keys(ridersPerTeam).filter((team) => ridersPerTeam[team] >= 4))

  const selectionState = (rider_participation_id, team, price) => {
    if (selectionIDs.includes(rider_participation_id)) return 'selected'
    if (selectionLength >= 20) return 'unselectable teamComplete'
    if (fullTeams.has(team)) return 'unselectable maxFourPerTeam'
    // Keep enough money for the remaining riders at the minimum price
    if (budget < price + 500000 * (19 - selectionLength)) return 'unselectable notEnoughMoney'
    return 'unselected'
  }

  return (
    <table className="teamselection-table">
      <thead>
        <tr>
          <th>Rider</th>
          <th>Specialty</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {riders.length === 0 && (
          <tr>
            <td colSpan="4">
              <div className="text-gray-400 text-center text-2xl">No rider found, try a different search?</div>
            </td>
          </tr>
        )}
        {riders.map(({ name, team, price, rider_participation_id, gc, climb, sprint, punch, tt }) => (
          <RiderRow
            key={rider_participation_id}
            name={name}
            team={team}
            price={price}
            selected={selectionState(rider_participation_id, team, price)}
            specialties={{ GC: gc, Climb: climb, Sprint: sprint, Punch: punch, 'Time Trial': tt }}
            skillFilter={skillFilter}
            riderID={rider_participation_id}
            budgetParticipation={budgetParticipation}
            addRemoveRider={addRemoveRider}
          />
        ))}
      </tbody>
    </table>
  )
}
