import { useState } from 'react'
import axios from 'axios'
import ModalButton from '../../shared/modal'
import Table from '../../shared/table'

// Button that opens a modal with the stage selection(s) of one user, or of everyone
export default function SelectionComparison({ title, userToCompareId, data }) {
  const [allSelections, setAllSelections] = useState([])
  const [notSelected, setNotSelected] = useState([])

  const getSelections = async () => {
    const params = { race_id: data.race_id, stage: data.stage, budgetParticipation: data.budget }
    const res =
      userToCompareId !== undefined
        ? await axios.post('/api/getSelectionComparison', { ...params, userToCompareId })
        : await axios.post('/api/getAllSelections', params)
    setAllSelections(res.data.allSelections)
    setNotSelected(res.data.notSelected)
  }

  // notSelected is ordered like allSelections but only has entries for some users
  let notSelectedIndex = 0
  const popupContent = allSelections.map((selection, i) => {
    let notSelectedTable = null
    const candidate = notSelected[notSelectedIndex]
    if (candidate && selection.title === candidate.username) {
      notSelectedTable = <Table data={candidate.riders} title="Niet Opgesteld" />
      notSelectedIndex++
    }
    const totalRiders = i === allSelections.length - 1 ? ' Totaal: ' + selection.tableData.length : ''
    return (
      <div className="tableDiv" key={selection.title}>
        <Table data={selection.tableData} title={selection.title + totalRiders} coltype={selection.coltype} />
        {notSelectedTable}
      </div>
    )
  })

  return (
    <ModalButton
      cssClassButton={'buttonStandard ' + data.racename}
      content={title}
      modalContent={popupContent}
      callback={getSelections}
    />
  )
}
