import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { isFabFourMember } from '../../../auth'
import Table from '../../shared/table'
import LoadingDiv from '../../shared/LoadingDiv'
import SelecTable from './SelecTable'
import { getSelectionData, updateKopmanCall, updateRiderCall } from './selectionHelperFunctions'
import './selection.css'

const CLASSIFICATIONS = [
  { className: 'GC', title: 'AK' },
  { className: 'Points', title: 'Punten' },
  { className: 'KOM', title: 'Berg' },
  { className: 'Youth', title: 'Jongeren' },
]

const INITIAL_STATE = {
  starttime: '',
  stageSelection: [],
  teamSelection: [],
  kopman: null,
  prevClassifications: [[], [], [], []],
  selectionsComplete: [0, 0],
}

export default function Selection({ data }) {
  const navigate = useNavigate()
  const { race_id, stage, budget } = data
  const [selection, setSelection] = useState(INITIAL_STATE)
  // The selection is loading until data for the current race/stage/budget has arrived
  const requestKey = `${race_id}-${stage}-${budget}`
  const loading = selection.key !== requestKey

  useEffect(() => {
    let ignore = false
    getSelectionData({ race_id, stage, budget }).then((selectionData) => {
      if (ignore) return
      if (selectionData.mode === '404') {
        navigate('/')
        return
      }
      setSelection((prev) => ({ ...prev, ...selectionData, key: `${race_id}-${stage}-${budget}` }))
    })
    return () => {
      ignore = true
    }
  }, [navigate, race_id, stage, budget])

  // Changes are only possible before the stage starts
  const stageStarted = () => !(new Date(selection.starttime) > new Date())

  const updateKopman = async (rider_participation_id, setremove) => {
    if (stageStarted()) return
    const updated = await updateKopmanCall(rider_participation_id, setremove, { race_id, stage, budget })
    setSelection((prev) => ({ ...prev, ...updated }))
  }

  const updateRider = async (rider_participation_id, addRemove) => {
    if (stageStarted()) return
    const updated = await updateRiderCall(rider_participation_id, addRemove, { race_id, stage, budget })
    setSelection((prev) => ({ ...prev, ...updated }))
  }

  const { prevClassifications, selectionsComplete } = selection
  const selecTableData = {
    teamSelection: selection.teamSelection,
    kopman: selection.kopman,
    selectionIDs: selection.stageSelection.map((rider) => rider.rider_participation_id),
    loading,
  }
  const completeText = selectionsComplete[0] === 10 ? 'Opstelling Compleet' : 'Opstelling niet compleet'

  return (
    <div className="stageselection-container mt-2">
      <div className="stagetext row-start-1 col-start-1 md:col-start-2">
        {isFabFourMember() ? (
          <div className={'completeContainer ' + (selectionsComplete[0] + selectionsComplete[1] === 20 ? 'allCompleet' : '')}>
            Compleet:
            <div className="gewoonCompleet">
              <div style={{ width: selectionsComplete[0] * 10 + '%' }} className="backgroundCompleet teamSize"></div>
              <div className="textCompleet">Gewoon</div>
            </div>
            <div className="budgetCompleet">
              <div style={{ width: selectionsComplete[1] * 10 + '%' }} className="backgroundCompleet teamSize"></div>
              <div className="textCompleet">Budget</div>
            </div>
          </div>
        ) : (
          <div className="completeContainerNewUsers">
            <div className="gewoonCompleet">
              <div style={{ width: selectionsComplete[0] * 10 + '%' }} className="backgroundCompleetNewUsers teamSize"></div>
              <div className="textCompleet">{completeText}</div>
            </div>
          </div>
        )}
      </div>
      <div className="row-start-1 col-start-1 md:row-span-3">
        <SelecTable data={selecTableData} functions={{ updateRider, updateKopman }} />
      </div>
      <div className="prevClassifications row-start-2 col-start-1 md:row-start-2 md:col-start-2">
        <LoadingDiv loading={loading} />
        {CLASSIFICATIONS.map(({ className, title }, i) => (
          <div
            key={className}
            style={{ display: prevClassifications[i].length ? 'block' : 'none', float: 'left' }}
            className={className}
          >
            <Table
              data={prevClassifications[i]}
              classNames="table-standard blue"
              title={title}
              headers={false}
              colWidths={[9, 38, 38, 15]}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
