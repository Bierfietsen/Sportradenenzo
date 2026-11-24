import LinkDropdown from './LinkDropdown'

const LINKS = [
  { to: '/charts/userscores', label: 'Relatief Scoreverloop', raceSpecific: true },
  { to: '/charts/userrank', label: 'Ranking', raceSpecific: true },
  { to: '/charts/riderpercentage', label: 'Puntenaandeel Renner per Etappe', raceSpecific: true },
  { to: '/charts/scorespread', label: 'Score verdeling', raceSpecific: true },
  { to: '/charts/totalscorespread', label: 'Score verdeling Totaal' },
]

export default function ChartsDropdown({ showRaceSpecificData }) {
  return <LinkDropdown title="Charts" links={LINKS} showRaceSpecificData={showRaceSpecificData} />
}
