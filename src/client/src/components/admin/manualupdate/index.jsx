import { useState } from 'react'
import axios from 'axios'
import './index.css'

export default function ManualUpdate() {
  const [gskStage, setGskStage] = useState('')
  const [gskStatus, setGskStatus] = useState('')
  const [grkStage, setGrkStage] = useState('')
  const [grkStatus, setGrkStatus] = useState('')
  const [grStage, setGrStage] = useState('')
  const [grStatus, setGrStatus] = useState('')
  const [grStageCopy, setGrStageCopy] = useState('')
  const [year, setYear] = useState('2022')
  const [raceName, setRaceName] = useState('giro')

  // Classics: these endpoints are currently commented out on the server
  const getStartlistKlassiek = (e) => {
    e.preventDefault()
    setGskStage('In Progress')
    setGskStatus('inprogress')
    axios.post('/api/getstartlistklassiek', { year: 2019, stage: gskStage }).then((res) => {
      setGskStage('')
      setGskStatus(res.data)
    })
  }

  const getResultsKlassiek = (e) => {
    e.preventDefault()
    setGrkStage('In Progress')
    setGrkStatus('inprogress')
    axios.post('/api/getresultsklassiek', { year: 2019, stage: grkStage }).then((res) => {
      setGrkStage('')
      setGrkStatus(res.data)
    })
  }

  const getStartlist = () => {
    axios.post('/api/getstartlist', { raceName, year }).then((res) => setGrStage(res.data))
  }

  const getResults = (e) => {
    e.preventDefault()
    setGrStage('In Progress')
    setGrStatus('inprogress')
    axios.post('/api/getresults', { raceName, year, stage: grStage }).then((res) => setGrStage(res.data))
  }

  const copyTeamIfSelectionEmpty = (e) => {
    e.preventDefault()
    axios
      .post('/api/copyTeamIfSelectionEmpty', { raceName, year, stage: Number(grStageCopy) })
      .then((res) => setGrStageCopy(res.data))
  }

  const endRaceActions = () => {
    axios.post('/api/endRaceActions', { raceName, year }).then((res) => setGrStage(res.data))
  }

  return (
    <div className="mainContainer">
      <div className="raceType">
        <div className="title">Klassieker</div>
        <div className="row">
          <div>year</div>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
          </select>
        </div>

        <form className="row" action="" onSubmit={getStartlistKlassiek}>
          <div className="discription">Get Startlist </div>
          <input
            className={gskStatus}
            id="gsk"
            placeholder="Stage #"
            value={gskStage}
            onChange={(e) => setGskStage(e.target.value)}
          />
          <button>Submit</button>
        </form>

        <form className="row" action="" onSubmit={getResultsKlassiek}>
          <div className="discription">Get Results incl. userscores </div>
          <input
            className={grkStatus}
            id="grk"
            placeholder="Stage #"
            value={grkStage}
            onChange={(e) => setGrkStage(e.target.value)}
          />
          <button>Submit</button>
        </form>
      </div>
      <div className="raceType">
        <div className="title">Grote Ronde</div>
        <div className="grMainRow">
          <div>year</div>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2021">2021</option>
          </select>

          <div>Name</div>
          <select value={raceName} onChange={(e) => setRaceName(e.target.value)}>
            <option value="giro">Giro</option>
            <option value="tour">Tour</option>
            <option value="vuelta">Vuelta</option>
          </select>
        </div>

        <div className="row">
          <button onClick={getStartlist}>Get Startlist</button>
        </div>

        <form className="row" action="" onSubmit={getResults}>
          <div className="discription">Get Results incl. userscores </div>
          <input
            className={'inputfield ' + grStatus}
            id="gr"
            placeholder="Stage #"
            value={grStage}
            onChange={(e) => setGrStage(e.target.value)}
          />
          <button>Submit</button>
        </form>

        <form className="row" action="" onSubmit={copyTeamIfSelectionEmpty}>
          <div className="discription">Opstelling vergeten Copy. </div>
          <input
            className="inputfield "
            id="grCopy"
            placeholder="Stage #"
            value={grStageCopy}
            onChange={(e) => setGrStageCopy(e.target.value)}
          />
          <button>Submit</button>
        </form>

        <div className="row">
          <button onClick={endRaceActions}>Race Finished/ Copy Scores</button>
        </div>
      </div>
    </div>
  )
}
