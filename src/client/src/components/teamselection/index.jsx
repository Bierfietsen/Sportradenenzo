import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useRace } from '../../context'
import { selectBudget } from '../../store'
import RulesPopup from '../shared/RulesPopup'
import RiderSelectionTable from './RiderSelectionTable'
import SelectedRidersTable from './SelectedRidersTable'
import './index.css'

const BUDGET_MAX_PRICE = 750_000
const PRICES = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700].map((p) => p * 10000)
const SKILLS = [
  { code: '', name: 'Nothing' },
  { code: 'GC', name: 'General Classification' },
  { code: 'Climb', name: 'Climbing' },
  { code: 'Sprint', name: 'Sprinting' },
  { code: 'Punch', name: 'Punching' },
  { code: 'Time Trial', name: 'Time Trialing' },
]
const SKILL_FIELDS = { GC: 'gc', Climb: 'climb', Sprint: 'sprint', Punch: 'punch', 'Time Trial': 'tt' }

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const formatPrice = (price) => price.toLocaleString('nl', { useGrouping: true })
const stripAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const priceOption = (price, prefix) => (
  <option value={price} key={prefix + price} className="minimalistic-dropdown-option">
    {formatPrice(price)}
  </option>
)

export default function Teamselection() {
  const navigate = useNavigate()
  const { race_id, racename, currentStageLink } = useRace()
  const budget = useSelector(selectBudget)
  const budgetIndex = budget ? 1 : 0

  // null: still loading, false: not participating yet, true: participating
  const [participating, setParticipating] = useState(null)
  const [allRiders, setAllRiders] = useState([])
  const [userSelection, setUserSelection] = useState([[], []])
  const [budgetLeft, setBudgetLeft] = useState([0, 0])
  const [minPrice, setMinPrice] = useState(500000)
  const [maxPrice, setMaxPrice] = useState(7000000)
  const [filterValue, setFilterValue] = useState('')
  const [skillFilter, setSkillFilter] = useState('')

  const loadTeam = useCallback(() => {
    axios.post('/api/teamselection', { apilink: 'getridersandteam', race_id }).then((res) => {
      if (res.data.noParticipation) {
        setParticipating(false)
      } else {
        setParticipating(true)
        setAllRiders(res.data.allRiders)
        setUserSelection([res.data.userSelectionGewoon, res.data.userSelectionBudget])
        // The server already subtracts the selected riders from these budgets
        setBudgetLeft([res.data.budgetGewoon, res.data.budgetBudget])
      }
    })
  }, [race_id])

  useEffect(() => {
    if (currentStageLink !== '/teamselection' || race_id === null) {
      navigate('/home')
      return
    }
    document.title = 'Team Keuze ' + capitalize(racename)
    loadTeam()
  }, [currentStageLink, race_id, racename, navigate, loadTeam])

  const joinRace = () => {
    axios.post('/api/teamselection', { apilink: 'addaccountparticipation', race_id }).then((res) => {
      if (res?.data.participationAdded) loadTeam()
    })
  }

  const addRemoveRider = (apilink, riderID, budgetParticipation) => {
    axios
      .post('/api/teamselection', { apilink, race_id, rider_participation_id: riderID, budgetParticipation })
      .then((res) => {
        if (!res?.data) return
        const updateAt = (arr, value) => arr.map((item, i) => (i === budgetParticipation ? value : item))
        setUserSelection((prev) => updateAt(prev, res.data.userSelection))
        setBudgetLeft((prev) => updateAt(prev, res.data.budgetLeft))
      })
  }

  const filteredRiders = useMemo(() => {
    const regex = new RegExp(escapeRegExp(filterValue), 'i')
    const max = budget ? BUDGET_MAX_PRICE : maxPrice
    return allRiders.filter(
      (rider) =>
        (stripAccents(rider.name).match(regex) || rider.team.match(regex)) &&
        rider.price >= minPrice &&
        rider.price <= max &&
        (skillFilter === '' || Number(rider[SKILL_FIELDS[skillFilter]]) !== 0)
    )
  }, [allRiders, filterValue, minPrice, maxPrice, skillFilter, budget])

  const selection = userSelection[budgetIndex]
  const remainingBudget = budgetLeft[budgetIndex]

  return (
    <div>
      {participating && (
        <div>
          <div className="w-full flex">
            <div className="w-1/2 p-4">
              <div className="text-lg">The rider I&apos;m looking for...</div>
              <div className="pt-2 text-lg">
                ...must be good at
                <select
                  className="minimalistic-dropdown"
                  value={skillFilter}
                  name="skillFilter"
                  onChange={(e) => setSkillFilter(e.target.value)}
                >
                  {SKILLS.map(({ code, name }) => (
                    <option value={code} key={code} className="minimalistic-dropdown-option">
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-2 text-lg">
                ...must be priced between
                <select
                  className="minimalistic-dropdown"
                  value={minPrice}
                  name="minPrice"
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                >
                  {PRICES.filter((price) => price <= maxPrice).map((price) => priceOption(price, 'min'))}
                </select>
                and
                <select
                  className="minimalistic-dropdown"
                  value={maxPrice}
                  name="maxPrice"
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                >
                  {PRICES.filter((price) => price >= minPrice).map((price) => priceOption(price, 'max'))}
                </select>
              </div>
              <div className="pt-2 text-lg">
                ...must have a (team)name like
                <input
                  type="text"
                  className="h-8 w-64 py-4 px-2 ml-2 text-base border-solid border-2 border-gray-200 rounded-md"
                  placeholder="search..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </div>
            </div>
            <div className="w-1/2 flex items-center flex-wrap mb-6 p-4">
              <div className="w-1/3">
                <span>Budget: {formatPrice(remainingBudget)}</span>
              </div>
              <div className="w-1/3">
                <RulesPopup page="teamSelection" raceName={racename} />
              </div>
              <div className="w-1/3 flex justify-end items-center space-x-14">
                {selection.length === 20 ? (
                  <button className="button_standard blue" onClick={() => navigate('/stage/1')}>
                    To stages <FontAwesomeIcon icon={faAngleRight} />
                  </button>
                ) : (
                  <button className="button_standard gray disabled">
                    To stages <FontAwesomeIcon icon={faAngleRight} />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="teamselection-tables w-full flex">
            <div className="ridertablecontainer w-1/2">
              <RiderSelectionTable
                riders={filteredRiders}
                selectionIDs={selection.map((rider) => rider.rider_participation_id)}
                selectionTeams={selection.map((rider) => rider.team)}
                budget={remainingBudget}
                skillFilter={skillFilter}
                addRemoveRider={addRemoveRider}
                budgetParticipation={budgetIndex}
              />
            </div>
            <div className="usertablecontainer w-1/2">
              <div className="w-5/6 ml-auto">
                <SelectedRidersTable
                  selection={selection}
                  addRemoveRider={addRemoveRider}
                  budgetParticipation={budgetIndex}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="containerTeamselection">
        {participating === false && (
          <button className={'button_standard blue joinRace ' + racename} onClick={joinRace}>
            Klik hier om mee te doen aan de {capitalize(racename)}
          </button>
        )}
      </div>
    </div>
  )
}
