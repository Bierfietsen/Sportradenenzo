import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus, faCircleCheck as solidCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck as regularCircleCheck } from '@fortawesome/free-regular-svg-icons'
import LoadingDiv from '../../shared/LoadingDiv'
import FlagIcon from '../../shared/FlagIcon'

function SelecTableRow({ name, team, country, selected, riderID, kopman, updateRider, updateKopman }) {
  let updateRiderButton
  let updateKopmanButton
  if (selected === 'selected') {
    updateRiderButton = (
      <button className="button_standard small red" onClick={() => updateRider(riderID, 'remove')}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    )
    updateKopmanButton =
      kopman === riderID ? (
        <button className="button_standard small green block m-auto" onClick={() => updateKopman(riderID, 'remove')}>
          <FontAwesomeIcon icon={solidCircleCheck} />
        </button>
      ) : (
        <button className="button_standard small yellow block m-auto" onClick={() => updateKopman(riderID, 'set')}>
          <FontAwesomeIcon icon={regularCircleCheck} />
        </button>
      )
  } else if (selected === 'unselected') {
    updateRiderButton = (
      <button className="button_standard small blue" onClick={() => updateRider(riderID, 'add')}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    )
  }
  return (
    <tr className={selected}>
      <td>
        <FlagIcon code={country} />
      </td>
      <td>{name}</td>
      <td>{team}</td>
      <td className="selectbutton">{updateKopmanButton}</td>
      <td className="selectbutton">{updateRiderButton}</td>
    </tr>
  )
}

export default function SelecTable({ data, functions }) {
  const { selectionIDs, kopman, loading } = data
  const selectionLength = selectionIDs.length
  // Selected riders on top
  const teamSelectionSorted = [...data.teamSelection].sort(
    (a, b) => selectionIDs.includes(b.rider_participation_id) - selectionIDs.includes(a.rider_participation_id)
  )

  const rows = teamSelectionSorted.map(({ firstname, lastname, team, rider_participation_id, dnf, country }) => {
    let selectedState = selectionLength >= 9 ? 'unselectable' : 'unselected'
    if (dnf) selectedState = 'dnf'
    if (selectionIDs.includes(rider_participation_id)) selectedState = 'selected'
    return (
      <SelecTableRow
        key={rider_participation_id}
        name={firstname + ' ' + lastname}
        team={team}
        country={country}
        selected={selectedState}
        riderID={rider_participation_id}
        kopman={kopman}
        updateRider={functions.updateRider}
        updateKopman={functions.updateKopman}
      />
    )
  })

  return (
    <div className="selecTable w-full" style={{ position: 'relative' }}>
      <LoadingDiv loading={loading} />
      <table className="table-standard blue rounded w-full">
        <thead>
          <tr>
            <th></th>
            <th>Naam</th>
            <th>Team</th>
            <th>Kopman</th>
            <th>{selectionLength}/9</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}
