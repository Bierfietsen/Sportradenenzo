import { configureStore, createSlice } from '@reduxjs/toolkit'

const toggleSlice = (name) =>
  createSlice({
    name,
    initialState: { value: false },
    reducers: {
      flip: (state) => {
        state.value = !state.value
      },
    },
  })

const budgetSwitch = toggleSlice('budget')
const fabFourSwitch = toggleSlice('fabFour')

export const flipBudget = budgetSwitch.actions.flip
export const flipFabFour = fabFourSwitch.actions.flip

export const selectBudget = (state) => state.budgetSwitch.value
export const selectFabFour = (state) => state.fabFourSwitch.value

export default configureStore({
  reducer: {
    budgetSwitch: budgetSwitch.reducer,
    fabFourSwitch: fabFourSwitch.reducer,
  },
})
