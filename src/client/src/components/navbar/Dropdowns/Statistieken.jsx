import LinkDropdown from './LinkDropdown'

const LINKS = [
  { to: '/statistics/rondewinsten', label: 'Uitslagen per ronde' },
  { to: '/statistics/etappewinsten', label: 'Uitslagen per etappe', raceSpecific: true },
  { to: '/statistics/allriders', label: 'Alle renners', raceSpecific: true },
  { to: '/statistics/klassementen', label: 'Klassementen', raceSpecific: true },
  { to: '/statistics/missedpointsall', label: 'Gemiste punten iedereen', raceSpecific: true },
  { to: '/statistics/teams', label: 'Team overzichten', raceSpecific: true },
  { to: '/statistics/teamcomparisons', label: 'Selectie vergelijking', raceSpecific: true },
  { to: '/statistics/overigestats', label: 'Overige Statistieken', raceSpecific: true },
]

export default function StatistiekenDropdown({ showRaceSpecificData }) {
  return <LinkDropdown title="Statistieken" links={LINKS} showRaceSpecificData={showRaceSpecificData} />
}
