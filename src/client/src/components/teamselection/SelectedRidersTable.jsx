import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

function UserRiderRow({ rider, addRemoveRider, budgetParticipation }) {
  return (
    <tr>
      <td>
        <div>
          <div>
            {rider.firstname} {rider.lastname}
          </div>
          <div className="text-gray-500 mt-2">{rider.team}</div>
        </div>
      </td>
      <td>{rider.price.toLocaleString('nl', { useGrouping: true })}</td>
      <td>
        <button
          className="button_standard small text red"
          onClick={() => addRemoveRider('removeRider', rider.rider_participation_id, budgetParticipation)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </td>
    </tr>
  )
}

export default function SelectedRidersTable({ selection, addRemoveRider, budgetParticipation }) {
  return (
    <table className="teamselection-table userteam">
      <thead>
        <tr>
          <th colSpan="4">
            Selection
            {selection.length < 10 ? <span className="text-blue-500"> 0</span> : ' '}
            {selection.length}/20
          </th>
        </tr>
      </thead>
      <tbody>
        {selection.map((rider) => (
          <UserRiderRow
            key={rider.rider_participation_id}
            rider={rider}
            budgetParticipation={budgetParticipation}
            addRemoveRider={addRemoveRider}
          />
        ))}
        {selection.length === 0 && (
          <tr>
            <td colSpan="4">
              <div className="text-gray-400 text-center text-2xl">Click on a rider to add them to your selection</div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
