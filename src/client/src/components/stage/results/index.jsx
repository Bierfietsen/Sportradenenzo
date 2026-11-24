import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { isFabFourMember } from '../../../auth'
import Table from '../../shared/table'
import LoadingDiv from '../../shared/LoadingDiv'
import ResultsTables from './ResultsTables'
import SelectionComparison from './SelectionComparison'
import PouleTable from './PouleTable'
import './results.css'

// Wait until 10s past the next minute, just after the server's auto-scrape
function msUntilNextScrape() {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 10, 0)
  const ms = target - now
  return ms < 0 ? ms + 60 * 1000 : ms
}

export default function Results({ data }) {
  const navigate = useNavigate()
  const { race_id, stage, budget } = data
  const baseKey = `${race_id}-${stage}-${budget}`

  const [classificationIndex, setClassificationIndex] = useState(data.stageType === 'FinalStandings' ? 1 : 0)
  // While the stage results are incomplete everything is re-fetched every minute.
  // The count resets when switching race, stage or budget.
  const [refresh, setRefresh] = useState({ key: baseKey, count: 0 })
  const refreshCount = refresh.key === baseKey ? refresh.count : 0

  const [poule, setPoule] = useState({ key: null, teamresult: [], userScores: [] })
  const [stageResultsLengths, setStageResultsLengths] = useState([0, 0, 0, 0, 0])
  // Downloaded classifications by `${baseKey}-${refreshCount}-${classificationIndex}`
  const [classifications, setClassifications] = useState({})
  const requested = useRef(new Set())

  useEffect(() => {
    let ignore = false
    let timer
    axios.post('/api/getPouleTeamResults', { race_id, stage, budgetParticipation: budget }).then((res) => {
      if (ignore) return
      if (res.data.mode === '404') {
        navigate('/')
        return
      }
      if (res.data.mode === 'results') {
        if (!res.data.resultsComplete) {
          timer = setTimeout(
            () => setRefresh({ key: `${race_id}-${stage}-${budget}`, count: refreshCount + 1 }),
            msUntilNextScrape()
          )
        }
        setPoule({ key: `${race_id}-${stage}-${budget}`, teamresult: res.data.teamresult, userScores: res.data.userScores })
      }
    })
    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [navigate, race_id, stage, budget, refreshCount])

  const resultsKey = `${baseKey}-${refreshCount}-${classificationIndex}`

  useEffect(() => {
    if (requested.current.has(resultsKey)) return
    requested.current.add(resultsKey)
    axios
      .post('/api/getClassificationResults', { race_id, stage, budgetParticipation: budget, classificationIndex })
      .then((res) => {
        setClassifications((prev) => ({ ...prev, [resultsKey]: res.data.stageResults }))
        setStageResultsLengths(res.data.stageResultsLengths)
      })
  }, [race_id, stage, budget, classificationIndex, resultsKey])

  // During an auto refresh keep showing the previous results until the new ones arrive
  const previousKey = `${baseKey}-${refreshCount - 1}-${classificationIndex}`
  const currentResults = classifications[resultsKey] ?? classifications[previousKey]
  const loadingPoule = poule.key !== baseKey
  const loadingResults = currentResults === undefined

  const stageResults = [[], [], [], [], []]
  stageResults[classificationIndex] = currentResults ?? []

  return (
    <div className="stageContainer">
      {isFabFourMember() && <SelectionComparison title="Alle Opstellingen" data={data} />}

      <div className="res">
        <LoadingDiv loading={loadingPoule} />
        <Table data={poule.teamresult} title="Selectie" />
        <PouleTable tableData={poule.userScores} data={data} />
      </div>
      <div className="stage">
        <LoadingDiv loading={loadingResults} />
        <ResultsTables
          data={stageResults}
          stageResultsLengths={stageResultsLengths}
          classificationIndex={classificationIndex}
          changedClassificationDisplay={setClassificationIndex}
        />
      </div>
    </div>
  )
}
