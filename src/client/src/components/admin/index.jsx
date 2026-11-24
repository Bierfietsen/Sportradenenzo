import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'
import Table from '../shared/table'
import LoadingDiv from '../shared/LoadingDiv'
import ManualUpdate from './manualupdate'
import ImportExport from './importExport'
import './index.css'

const TABS = [
  { subpage: 'sqlinterface', label: 'DB interface' },
  { subpage: 'dbinfo', label: 'DB Info' },
  { subpage: 'manualupdate', label: 'Manual Update' },
  { subpage: 'importexport', label: 'Import/Export' },
]

const WORD_SEPARATORS = [' ', '\n', '\t', '(', ')', '"', '{', '}', '.', ',']
const CLOSING_BRACKETS = { '(': ')', '{': '}' }

const TABLE_NAMES = ['account', 'race', 'stage', 'account_participation', 'rider', 'rider_participation', 'team_selection_rider', 'stage_selection', 'stage_selection_rider', 'results_points']
const TABLE_IDS = ['account_id', 'race_id', 'stage_id', 'account_participation_id', 'rider_id', 'rider_participation_id', 'stage_selection_id']
const SQL_COMMANDS = `AND, ANY, AVG, ARRAY_AGG, BETWEEN, COUNT, CASE, DISTINCT, DESC, DELETE, FROM, GROUP BY, HAVING, INNER JOIN, INSERT INTO, IS NULL, JOIN, LIMIT, MAX, MIN, NOT, SELECT, SUM, USING, UNION, UPDATE, VALUES, WHERE, AS, ADD, ADD CONSTRAINT, ALTER, ALTER COLUMN, ALTER TABLE, ALL, ASC, BACKUP DATABASE, CHECK, COLUMN, CONSTRAINT, CREATE, CREATE DATABASE, CREATE INDEX, CREATE OR REPLACE VIEW, CREATE TABLE, CREATE PROCEDURE, CREATE UNIQUE INDEX, CREATE VIEW, DATABASE, DEFAULT, DROP, DROP COLUMN, DROP CONSTRAINT, DROP DATABASE, DROP DEFAULT, DROP INDEX, DROP TABLE, DROP VIEW, EXEC, EXISTS, FOREIGN KEY, FULL OUTER JOIN, IN, INDEX, INSERT INTO SELECT, IS NOT NULL, LEFT JOIN, LIKE, NOT NULL, OR, ORDER BY, OUTER JOIN, PRIMARY KEY, PROCEDURE, RIGHT JOIN, ROWNUM, SELECT DISTINCT, SELECT INTO, SELECT TOP, SET, TABLE, TOP, TRUNCATE TABLE, UNION ALL, UNIQUE, VIEW`.split(', ')
const COLUMN_NAMES = ['budgetparticipation', 'finished', 'finalscore', 'pcs_id', 'stagenr', 'starttime', 'complete', 'username', 'email', 'admin', 'price', 'dnf', 'team', 'totalscore', 'kopman_id', 'stagepos', 'gcpos', 'pointspos', 'kompos', 'yocpos', 'stagescore', 'gcscore', 'pointsscore', 'komscore', 'yocscore', 'teamscore', 'stageresult', 'gcresult', 'pointsresult', 'komresult', 'yocresult', 'firstname', 'lastname', 'initials', 'country', 'type']
const AUTOCOMPLETE_SUGGESTIONS = [...TABLE_NAMES, ...TABLE_IDS, ...SQL_COMMANDS, ...COLUMN_NAMES, 'false', 'true']

// Index of the separator before the word that ends at cursorPos (-1 if the word starts the text)
function wordStart(text, cursorPos) {
  for (let i = cursorPos - 1; i > -1; i--) {
    if (WORD_SEPARATORS.includes(text.charAt(i))) return i
  }
  return -1
}

// Suggestions containing the typed characters in order, best prefix match first
function findSuggestions(currWord) {
  const regex = new RegExp(
    [...currWord].map((c) => '[' + c.replace(/[\]\\^]/g, '\\$&') + ']\\w*').join(''),
    'i'
  )
  const word = currWord.toLowerCase()
  return AUTOCOMPLETE_SUGGESTIONS.filter((s) => s.search(regex) !== -1).sort((a, b) => {
    for (let i = 0; i < word.length; i++) {
      const aEq = a.toLowerCase().charAt(i) === word.charAt(i)
      const bEq = b.toLowerCase().charAt(i) === word.charAt(i)
      if (aEq && !bEq) return -1
      if (!aEq && bEq) return 1
    }
    return a.length - b.length
  })
}

// Replaces ${name} placeholders in the query with values from lines like: var name = `value`
function substituteVariables(query, extraVars) {
  const variables = {}
  for (const variable of extraVars.split('var ')) {
    if (!variable.length) continue
    const equalsPos = variable.indexOf('=')
    variables[variable.substring(0, equalsPos - 1)] = variable.substring(equalsPos + 3, variable.lastIndexOf('`'))
  }
  for (let i = 0; query.includes('$') && i <= 200; i++) {
    const toReplace = query.substring(query.indexOf('$'), query.indexOf('}') + 1)
    query = query.replace(toReplace, variables[toReplace.substring(2, toReplace.length - 1)])
  }
  return query
}

const cellText = (value) => (value == null ? 'null' : value.toString())

function OutputTable({ output }) {
  const [activeTab, setActiveTab] = useState(0)

  const isError = !Array.isArray(output) && Boolean(output.name)
  const responses = Array.isArray(output) ? output : [output] // one result per query

  return (
    <div className="outputTableContainer">
      <div className="tab">
        {responses.map((response, tabNR) => (
          <button
            key={tabNR}
            className={'tablinks' + (tabNR === activeTab ? ' active' : '')}
            onClick={() => setActiveTab(tabNR)}
          >
            {tabNR + ': ' + response.command}
          </button>
        ))}
      </div>
      {responses.map((response, tabNR) => {
        const rows = isError ? [] : (response.rows ?? [])
        const properties = Object.keys(response)
        return (
          <div key={tabNR} className="tabcontent text-white" style={{ display: tabNR === activeTab ? 'block' : 'none' }}>
            <table>
              <thead>
                <tr>
                  {properties.map((property) => (
                    <th key={property}>{property}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {properties.map((property) => (
                    <td key={property}>
                      {property === 'fields' || property === 'rows'
                        ? response[property].length
                        : String(response[property]).substring(0, 20)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <table className="outputTable">
              <thead>
                <tr>
                  {rows.length > 0 && Object.keys(rows[0]).map((column) => <th key={column}>{column}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 200).map((row, i) => (
                  <tr key={i}>
                    {Object.entries(row).map(([column, value]) => (
                      <td key={column}>{cellText(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}

function SqlInterface() {
  const inputRef = useRef(null)
  const extraVarsRef = useRef(null)
  const pendingSelection = useRef(null) // caret position to restore after `value` changes

  const [value, setValue] = useState('')
  const [cursorPos, setCursorPos] = useState(0)
  const [suggestions, setSuggestions] = useState([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [autoCompleteActive, setAutoCompleteActive] = useState(false)
  const [output, setOutput] = useState([])
  const [queryRun, setQueryRun] = useState(0)
  const [errorData, setErrorData] = useState([])

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  useLayoutEffect(() => {
    if (pendingSelection.current !== null) {
      document.activeElement.setSelectionRange(pendingSelection.current, pendingSelection.current)
      pendingSelection.current = null
    }
  }, [value])

  const submitQuery = (e) => {
    e.preventDefault()
    const query = substituteVariables(value, extraVarsRef.current.value)
    axios.post('/api/admin/query', { query }).then((res) => {
      setErrorData(
        res.data.errorBool
          ? [
              { ' ': 'Error:', '  ': res.data.error },
              { ' ': 'Hint:', '  ': res.data.data.hint },
            ]
          : ''
      )
      setOutput(res.data.data)
      setQueryRun((n) => n + 1) // reset the output tabs
    })
  }

  const handleChange = (e) => {
    const deletion = e.target.value.length < value.length
    const position = e.target.selectionStart
    let newValue = e.target.value
    setCursorPos(position)

    const lastTyped = newValue[position - 1]
    if (!deletion && lastTyped in CLOSING_BRACKETS) {
      newValue = newValue.substring(0, position) + CLOSING_BRACKETS[lastTyped] + newValue.substring(position)
      pendingSelection.current = position
    }
    setValue(newValue)

    const currWord = newValue.substring(wordStart(newValue, position) + 1, position)
    if (currWord.length > 0) {
      const current = findSuggestions(currWord)
      setSuggestions(current)
      setSelectedSuggestion(0)
      setAutoCompleteActive(!deletion && current.length > 0)
    }
  }

  const insertSuggestion = (index) => {
    const start = wordStart(value, cursorPos)
    const toInsert = suggestions[index] + ' '
    setValue(value.substring(0, start + 1) + toInsert + value.substring(cursorPos))
    pendingSelection.current = start + toInsert.length + 1
    setSuggestions([])
    setSelectedSuggestion(0)
    setAutoCompleteActive(false)
  }

  const keyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      submitQuery(e)
      setAutoCompleteActive(false)
      return
    }
    if (autoCompleteActive) {
      const len = suggestions.length
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault()
        insertSuggestion(selectedSuggestion)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSuggestion((i) => (i - 1 + len) % len)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSuggestion((i) => (i + 1) % len)
      } else if (['ArrowLeft', 'ArrowRight', 'Escape', ' ', 'Backspace'].includes(e.key)) {
        setAutoCompleteActive(false)
      }
    }
    setCursorPos(document.activeElement.selectionStart)
  }

  return (
    <div onClick={() => setAutoCompleteActive(false)}>
      <form action="" onSubmit={submitQuery} id="queryform">
        <div style={{ position: 'relative' }}>
          <textarea ref={extraVarsRef} className="queryInputBox" rows="5" cols="130" onKeyDown={keyDown}></textarea>
        </div>

        <div style={{ position: 'relative' }}>
          <textarea
            className="queryInputBox"
            rows="20"
            cols="130"
            value={value}
            onChange={handleChange}
            onKeyDown={keyDown}
            ref={inputRef}
          />
          <div id="sugPopUp" style={{ top: 0, left: 0, display: autoCompleteActive ? 'block' : 'none' }}>
            {suggestions.map((suggestion, i) => (
              <div
                key={suggestion}
                className={'suggestion ' + (i === selectedSuggestion ? 'selectedSuggestion' : '')}
                onClick={() => {
                  insertSuggestion(i)
                  inputRef.current.focus()
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
        <input type="submit" value="submit" />
      </form>
      <Table data={errorData} />
      <OutputTable key={queryRun} output={output} />
    </div>
  )
}

// Mounted only while its tab is open, so the info is refetched every time the tab is opened
function DBInfo() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.post('/api/admin/getdbinfo').then((res) => {
      setTables(res.data.tables.map((table, i) => ({ title: res.data.titles[i], rows: table.rows })))
      setLoading(false)
    })
  }, [])

  return (
    <>
      {tables.map(({ title, rows }) => (
        <div className="tableDiv" key={title}>
          <Table data={rows} title={title} />
        </div>
      ))}
      <LoadingDiv loading={loading} />
    </>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const { subpage } = useParams()
  const known = TABS.some((tab) => tab.subpage === subpage)
  const activeTab = known ? subpage : 'sqlinterface'

  useEffect(() => {
    document.title = 'Admin'
  }, [])

  useEffect(() => {
    if (!known) navigate('/admin/sqlinterface', { replace: true })
  }, [known, navigate])

  // Tabs stay mounted (hidden) so their state survives switching
  const display = (tab) => (tab === activeTab ? 'block' : 'none')

  return (
    <div className="adminpageContainer text-white">
      <div style={{ display: 'flex' }}>
        {TABS.map((tab) => (
          <button
            key={tab.subpage}
            className={'klassementButton ' + display(tab.subpage)}
            onClick={() => navigate('/admin/' + tab.subpage)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ display: display('sqlinterface') }}>
        <SqlInterface />
      </div>
      <div style={{ display: display('dbinfo'), position: 'relative' }}>
        {activeTab === 'dbinfo' && <DBInfo />}
      </div>
      <div style={{ display: display('manualupdate') }}>
        <ManualUpdate />
      </div>
      <div style={{ display: display('importexport') }}>
        <ImportExport />
      </div>
    </div>
  )
}
