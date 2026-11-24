import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useRace } from '../../context'
import { selectBudget } from '../../store'
import ToggleSwitch from '../shared/ToggleSwitch'
import CanvasJSChart from './CanvasJSChart'

export default function Charts() {
  const navigate = useNavigate()
  const { chartname } = useParams()
  const { race_id } = useRace()
  const budget = useSelector(selectBudget)
  const [options, setOptions] = useState({})
  // Grouped is on by default (the original initial state was a truthy object)
  const [grouped, setGrouped] = useState(true)
  const [showEind, setShowEind] = useState(false)

  useEffect(() => {
    if (!race_id) {
      navigate('/home')
      return
    }
    let apilink = '/api/' + chartname
    let extraParams = {}
    if (chartname === 'totalscorespread') {
      extraParams = { perRace: grouped }
      if (grouped) apilink += 'grouped'
    } else if (chartname === 'scorespread') {
      extraParams = { perStage: grouped, excludeFinal: !showEind }
      if (grouped) apilink += 'grouped'
    }

    let ignore = false
    axios.post(apilink, { race_id, budgetparticipation: budget, extraParams }).then((res) => {
      if (ignore) return
      document.title = res.data.title
      setOptions({ ...res.data.options, theme: 'dark1' })
    })
    return () => {
      ignore = true
    }
  }, [navigate, chartname, race_id, budget, grouped, showEind])

  return (
    <div className="statisticsContainer">
      {chartname === 'scorespread' && (
        <ToggleSwitch labels={['Zonder', 'Met Eindklassement']} checked={showEind} onChange={() => setShowEind(!showEind)} />
      )}
      {chartname.includes('scorespread') && (
        <ToggleSwitch labels={['', 'Gegroepeerd']} checked={grouped} onChange={() => setGrouped(!grouped)} />
      )}
      <CanvasJSChart options={options} />
    </div>
  )
}
