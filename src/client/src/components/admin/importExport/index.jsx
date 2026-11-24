import { useState } from 'react'
import axios from 'axios'
import { getAuthToken } from '../../../auth'

// Legacy: import/export of the old MongoDB backup
export default function ImportExport() {
  const [year, setYear] = useState('2019')
  const [raceName, setRaceName] = useState('tour')
  const [serverReply, setServerReply] = useState('')

  const post = (url) => {
    setServerReply('processing...')
    axios.post(url, { raceName, year, token: getAuthToken() }).then((res) => setServerReply(res.data))
  }

  return (
    <div className="mainContainer">
      <div className="raceType">
        <div className="grMainRow">
          <div>year</div>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
          </select>

          <div>Name</div>
          <select value={raceName} onChange={(e) => setRaceName(e.target.value)}>
            <option value="giro">Giro</option>
            <option value="tour">Tour</option>
            <option value="vuelta">Vuelta</option>
            <option value="classics">Klassieker</option>
          </select>
        </div>

        <button onClick={() => post('/api/import')}>Import Data</button>
        <button onClick={() => post('/api/export')}>Export Data</button>
      </div>
      <div className="outputStatus">{serverReply}</div>
    </div>
  )
}
