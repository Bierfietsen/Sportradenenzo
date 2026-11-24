import SelectionComparison from './SelectionComparison'

export default function PouleTable({ tableData, data }) {
  return (
    <div>
      <table style={{ display: 'table' }}>
        <caption>Poule Stand</caption>
        <thead>
          <tr>
            <th></th>
            <th>User</th>
            <th>Etappe</th>
            <th>Totaal</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.account_participation_id}>
              <td>{row[' ']}</td>
              <td>
                <SelectionComparison title={row.User} userToCompareId={row.account_id} data={data} />
              </td>
              <td>{row.Stage}</td>
              <td>{row.Total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
