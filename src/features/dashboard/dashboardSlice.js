import { createSlice } from '@reduxjs/toolkit'
import offerOne from '../../offers/evqc/data/offer-one.json'
import offerTwo from '../../offers/chip-manufacturing/data/offer-two.json'
import offerThree from '../../offers/esp-oil-rig/data/offer-three.json'

const applications = [offerOne, offerTwo, offerThree]

const initialState = {
  applications,
  selectedAppId: applications[0].id,
  selectedMenuId: applications[0].menus[0].id,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    selectApplication: (state, action) => {
      state.selectedAppId = action.payload
      const selectedApp = state.applications.find((app) => app.id === action.payload)

      if (selectedApp) {
        state.selectedMenuId = selectedApp.menus[0].id
      }
    },
    selectMenu: (state, action) => {
      state.selectedMenuId = action.payload
    },
  },
})

export const { selectApplication, selectMenu } = dashboardSlice.actions

export const selectApplications = (state) => state.dashboard.applications
export const selectSelectedApp = (state) => {
  const selectedApp = state.dashboard.applications.find((app) => app.id === state.dashboard.selectedAppId)
  return selectedApp ?? state.dashboard.applications[0]
}

export const selectSelectedMenu = (state) => {
  const selectedApp = selectSelectedApp(state)
  return selectedApp.menus.find((menu) => menu.id === state.dashboard.selectedMenuId) ?? selectedApp.menus[0]
}

export default dashboardSlice.reducer
