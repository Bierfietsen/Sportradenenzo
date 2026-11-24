import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faMountain } from '@fortawesome/free-solid-svg-icons'
import ModalButton from '../../shared/modal'
import RulesPopup from '../../shared/RulesPopup'
import './stageinfo.css'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const STAGE_NUMBERS = Array.from({ length: 23 }, (_, i) => i)

function starttimeString(starttimeInput) {
  if (starttimeInput === '') return ''
  const starttime = new Date(starttimeInput)
  return DAYS[starttime.getDay()] + ' ' + starttime.toLocaleString().replace(/-[0-9]{4}/, '').replace(':00', '')
}

function StageProfile({ race_id, stage }) {
  const src = (type) => `/images/stageProfiles/${race_id}/stage-${stage}-${type}.jpg`
  return (
    <div>
      <img className="profileImage" src={src('profile')} alt="profile" />
      <br />
      finish
      <br />
      <img className="profileImage" src={src('finish')} alt="" />
      <br />
      extra
      <br />
      <img className="profileImage" src={src('extra')} alt="" />
    </div>
  )
}

export default function StageInfo({ data, updateStage }) {
  const canGoBack = data.mode === 'selection' || data.stage !== 1
  const canGoForward = data.stageType !== 'FinalStandings' && data.stageType !== ''

  return (
    <div className="stageinfo-container space-y-4">
      <div className="flex items-center justify-center">
        {canGoBack ? (
          <button className="button_standard blue" onClick={() => updateStage(data.stage - 1)}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        ) : (
          <button className="button_standard gray disabled">
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        )}
        <select
          className="stage_select_dropdown"
          value={data.stage}
          name="stagenr"
          onChange={(e) => updateStage(parseInt(e.target.value))}
        >
          {STAGE_NUMBERS.map((i) => (
            <option value={i} key={i} className="stage_select_dropdown_option">
              {i}
            </option>
          ))}
        </select>
        {canGoForward ? (
          <button className="button_standard blue" onClick={() => updateStage(data.stage + 1)}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        ) : (
          <button className="button_standard gray disabled">
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        )}
      </div>

      <div className="m-auto">{starttimeString(data.starttime)}</div>
      <div className="flex items-center space-x-24">
        <ModalButton
          cssClassButton="button_standard blue"
          content="Profile "
          contentIcon={<FontAwesomeIcon icon={faMountain} />}
          modalContent={<StageProfile race_id={data.race_id} stage={data.stage} />}
        />
        <RulesPopup page="stageSelection" raceName={data.racename} />
      </div>
    </div>
  )
}
