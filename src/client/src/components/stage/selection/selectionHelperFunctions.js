import axios from 'axios'

export async function getSelectionData({ race_id, stage, budget }) {
  const res = await axios.post('/api/getstageselection', { race_id, stage, budgetParticipation: budget })
  const data = res.data
  if (data.mode === '404') return { mode: '404' }
  return {
    mode: 'selection',
    teamSelection: data.teamSelection,
    stageSelection: data.stageSelection,
    kopman: data.kopman,
    starttime: data.starttime,
    prevClassifications: data.prevClassifications,
    selectionsComplete: data.selectionsComplete,
  }
}

export async function updateKopmanCall(rider_participation_id, setremove, { race_id, stage, budget }) {
  const link = setremove === 'set' ? 'setkopman' : 'removekopman'
  const res = await axios.post('/api/' + link, { race_id, stage, rider_participation_id, budgetParticipation: budget })
  return {
    kopman: res.data.kopman,
    selectionsComplete: res.data.selectionsComplete,
  }
}

export async function updateRiderCall(rider_participation_id, addRemove, { race_id, stage, budget }) {
  const link = addRemove === 'add' ? 'addridertostage' : 'removeriderfromstage'
  const res = await axios.post('/api/' + link, { race_id, stage, rider_participation_id, budgetParticipation: budget })
  return {
    stageSelection: res.data.stageSelection,
    kopman: res.data.kopman,
    prevClassifications: res.data.prevClassifications,
    selectionsComplete: res.data.selectionsComplete,
  }
}
