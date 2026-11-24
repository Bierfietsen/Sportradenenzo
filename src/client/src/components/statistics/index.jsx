import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useRace } from '../../context'
import { selectBudget, selectFabFour } from '../../store'
import Table from '../shared/table'
import ToggleSwitch from '../shared/ToggleSwitch'
import './index.css'

export default function Statistics() {
  const navigate = useNavigate()
  const { selection } = useParams()
  const { race_id } = useRace()
  const budgetparticipation = useSelector(selectBudget)
  const fabFourOnly = useSelector(selectFabFour)
  const [tables, setTables] = useState([])
  const [details, setDetails] = useState(false)
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)

  useEffect(() => {
    if (!race_id) {
      navigate('/home')
      return
    }
    let ignore = false
    axios
      .post('/api/statistics', { selection, race_id, budgetparticipation, fabFourOnly, details, showSelectedOnly })
      .then((res) => {
        if (ignore) return
        if (res.data.mode === '404') {
          navigate('/404')
        } else {
          document.title = res.data.title
          setTables(res.data.tables)
        }
      })
    return () => {
      ignore = true
    }
  }, [navigate, selection, race_id, budgetparticipation, fabFourOnly, details, showSelectedOnly])

  return (
    <div className="statisticsContainer">
      {selection === 'allriders' && (
        <ToggleSwitch
          labels={['Alle', 'Geselecteerde']}
          checked={showSelectedOnly}
          onChange={() => setShowSelectedOnly(!showSelectedOnly)}
        />
      )}
      {selection === 'teams' && tables.length > 0 && (
        <ToggleSwitch labels={['Simpel', 'Details']} checked={details} onChange={() => setDetails(!details)} />
      )}
      {tables.map((table) => (
        <div className="tableDiv" key={table.title}>
          <Table data={table.tableData} title={table.title} coltype={table.coltype} hiddenCols={table.hiddenCols} />
        </div>
      ))}
    </div>
  )
}
