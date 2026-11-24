import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useRace } from '../../context'
import { selectBudget } from '../../store'
import StageInfo from './info'
import Selection from './selection'
import Results from './results'
import './index.css'

export default function Stage() {
  const navigate = useNavigate()
  const stage = parseInt(useParams().stagenumber)
  const { race_id, racename } = useRace()
  const budget = useSelector(selectBudget) ? 1 : 0
  const [info, setInfo] = useState({ mode: '', stageType: '', starttime: '', stage })

  useEffect(() => {
    document.title = 'Etappe ' + stage
    let ignore = false
    axios.post('/api/getstageinfo', { race_id, stage }).then((res) => {
      if (ignore) return
      if (res.data.mode === '404') {
        navigate('/')
      } else {
        setInfo({ mode: res.data.mode, stageType: res.data.stageType, starttime: res.data.starttime, stage })
      }
    })
    return () => {
      ignore = true
    }
  }, [navigate, race_id, stage])

  const goToStage = (newStage) => {
    if (newStage === 0 && info.mode === 'selection') {
      navigate('/teamselection')
    } else {
      navigate('/stage/' + newStage)
    }
  }

  const childData = {
    race_id,
    stage: info.stage,
    racename,
    starttime: info.starttime,
    stageType: info.stageType,
    budget,
    mode: info.mode,
  }

  return (
    <>
      <StageInfo data={childData} updateStage={goToStage} />
      {info.mode === 'selection' && <Selection data={childData} />}
      {info.mode === 'results' && <Results data={childData} />}
    </>
  )
}
