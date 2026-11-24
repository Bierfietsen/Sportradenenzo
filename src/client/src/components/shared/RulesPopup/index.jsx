import { useState } from 'react'
import EndPoints from './EndPoints'
import StagePoints from './StagePoints'
import StageSelectionExplanation from './StageSelectionExplanation'
import TeamSelectionExplanation from './TeamSelectionExplanation'

const TABS = [
  { page: 'teamSelection', label: 'Team Selectie' },
  { page: 'endPoints', label: 'Puntentelling' },
  { page: 'stageSelection', label: 'Etappe opstelling' },
  { page: 'stagePoints', label: 'Etappe punten' },
]

// "Uitleg/Regels" button with a modal explaining the game. `page` is the tab shown first.
export default function RulesPopup({ page: initialPage, raceName }) {
  const [page, setPage] = useState(initialPage)
  const [showModal, setShowModal] = useState(false)
  const toggleModal = () => setShowModal((show) => !show)

  return (
    <div className="stageprofilebutton">
      <button className="button_standard blue" onClick={toggleModal}>
        Uitleg/ Regels{' '}
      </button>
      <div className={showModal ? 'modal display-block' : 'modal display-none'}>
        <div className={showModal ? 'modal-content w-full display-block' : 'modal display-none'}>
          <div className="flex">
            <div className="grow ml-4 space-x-4">
              {TABS.map((tab) => (
                <button key={tab.page} className="button_standard blue" onClick={() => setPage(tab.page)}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div>
              <button className="button_standard text" onClick={toggleModal}>
                X
              </button>
            </div>
          </div>
          <div className="p-4">
            {page === 'teamSelection' && <TeamSelectionExplanation raceName={raceName} />}
            {page === 'endPoints' && <EndPoints />}
            {page === 'stageSelection' && <StageSelectionExplanation />}
            {page === 'stagePoints' && <StagePoints />}
          </div>
        </div>
      </div>
    </div>
  )
}
