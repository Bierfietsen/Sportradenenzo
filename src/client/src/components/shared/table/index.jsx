import { useState } from 'react'
import { Link } from 'react-router'
import FlagIcon from '../FlagIcon'
import './index.css'

// Columns with these names/suffixes carry metadata and are never shown
const isMetaColumn = (column) => column === 'rowClassName' || column.endsWith('_link')

// displayCols: null (show all) or { column: visible }
const isVisible = (displayCols, column) => displayCols == null || displayCols[column] !== false

function buildDisplayCols(data, hiddenCols) {
  if (hiddenCols == null || data.length === 0) return null
  const displayCols = {}
  for (const column of Object.keys(data[0])) {
    if (!isMetaColumn(column)) displayCols[column] = !hiddenCols.includes(column)
  }
  return displayCols
}

// Numbers: empty values go last when descending, first when ascending
function sortRows(rows, key, isNumber, descending) {
  const sorted = [...rows]
  if (isNumber && descending) {
    sorted.sort((x, y) => (!x[key] ? 1 : !y[key] ? -1 : parseFloat(y[key]) - parseFloat(x[key])))
  } else if (isNumber) {
    sorted.sort((x, y) => (!y[key] ? 1 : !x[key] ? -1 : parseFloat(x[key]) - parseFloat(y[key])))
  } else if (descending) {
    sorted.sort((x, y) => y[key].localeCompare(x[key]))
  } else {
    sorted.sort((x, y) => x[key].localeCompare(y[key]))
  }
  return sorted
}

function Headers({ data, displayCols, coltype, colNames, onSort }) {
  if (data.length === 0) return <thead><tr></tr></thead>
  const columns = Object.keys(data[0]).filter((column) => !isMetaColumn(column) && isVisible(displayCols, column))
  return (
    <thead>
      <tr>
        {columns.map((column) => {
          const headerText = colNames?.[column] ?? (column === 'country' ? '' : column)
          return coltype?.[column] != null ? (
            <th className="sortable" key={column} onClick={() => onSort(column)}>
              {headerText}
            </th>
          ) : (
            <th key={column}>{headerText}</th>
          )
        })}
      </tr>
    </thead>
  )
}

function Row({ rowData, displayCols }) {
  const cells = []
  let link = ''
  for (const [property, value] of Object.entries(rowData)) {
    if (property === 'rowClassName') continue
    // A *_link column holds the link target for the next column
    if (property.endsWith('_link')) {
      link = value
      continue
    }
    if (!isVisible(displayCols, property)) continue

    if (property === 'country') {
      cells.push(
        <td key={property}>
          <FlagIcon code={value} />
        </td>
      )
      continue
    }

    let content = typeof value === 'number' ? value.toLocaleString('nl', { useGrouping: true }) : value
    if (link !== '') {
      content = (
        <Link className="tableLink" to={link}>
          {content}
        </Link>
      )
      link = ''
    }
    let className = property
    if (property === ' ') className = 'rank'
    if (property === '  ' && value?.length) className = 'change' + value[0]
    cells.push(
      <td key={property} className={className}>
        {content}
      </td>
    )
  }
  return <tr className={rowData.rowClassName ?? ''}>{cells}</tr>
}

/**
 * Generic data table: one column per key of the row objects.
 *
 * data        rows (required)
 * title       caption
 * coltype     { column: 1 (number) | 0 (string) } makes columns sortable
 * colNames    { column: header text }
 * hiddenCols  columns hidden by default; shows checkboxes to toggle columns
 * maxRows     split the rows over pages of this size
 * classNames  class of the <table>
 * headers     show the header row (default true)
 * colWidths   column widths in %
 */
export default function Table({ data, title, coltype, colNames, hiddenCols, maxRows, classNames = '', headers = true, colWidths = [] }) {
  const [sourceData, setSourceData] = useState(data)
  const [rows, setRows] = useState(data)
  const [desc, setDesc] = useState({ ...coltype }) // numbers sort descending first, strings ascending
  const [displayCols, setDisplayCols] = useState(() => buildDisplayCols(data, hiddenCols))
  const [page, setPage] = useState(0)

  // Reset sorting, paging and column selection when new data comes in
  if (data !== sourceData) {
    setSourceData(data)
    setRows(data)
    setDesc({ ...coltype })
    setDisplayCols(buildDisplayCols(data, hiddenCols))
    setPage(0)
  }

  const onSort = (key) => {
    setRows(sortRows(rows, key, Boolean(coltype[key]), Boolean(desc[key])))
    setDesc({ ...desc, [key]: !desc[key] })
  }

  const toggleColumn = (column) => setDisplayCols({ ...displayCols, [column]: !displayCols[column] })

  const pageCount = maxRows < rows.length ? Math.ceil(rows.length / maxRows) : 1
  const visibleRows = pageCount > 1 ? rows.slice(maxRows * page, maxRows * (page + 1)) : rows
  const goToPage = (i) => {
    if (i >= 0 && i < pageCount) setPage(i)
  }

  return (
    <div className="tableContainer">
      {pageCount > 1 && (
        <div className="btn-group">
          <button className="scrollButton" onClick={() => goToPage(page - 1)}>
            prev
          </button>
          {Array.from({ length: pageCount }, (_, i) => (
            <button key={i} className={`scrollButton ${i === page ? 'table' : 'none'}`} onClick={() => goToPage(i)}>
              {i + 1}
            </button>
          ))}
          <button className="scrollButton" onClick={() => goToPage(page + 1)}>
            next
          </button>
        </div>
      )}
      {displayCols != null && (
        <div className="toggleColumsDiv">
          {Object.entries(displayCols).map(([name, checked]) => (
            <div key={name} className="toggleDiv">
              <input type="checkbox" id={name} name={name} checked={checked} onChange={() => toggleColumn(name)} />
              <label className="toggleColLabel" htmlFor={name}>
                {name}
              </label>
            </div>
          ))}
        </div>
      )}
      <table className={classNames} style={{ display: 'table' }}>
        <colgroup>
          {colWidths.map((width, i) => (
            <col key={i} style={{ width: `${width}%` }} />
          ))}
        </colgroup>
        <caption>{title}</caption>
        {headers && (
          <Headers data={rows} displayCols={displayCols} colNames={colNames} coltype={coltype} onSort={onSort} />
        )}
        <tbody>
          {visibleRows.map((rowData, i) => (
            <Row key={i} rowData={rowData} displayCols={displayCols} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
