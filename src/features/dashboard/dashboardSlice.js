import { createSlice } from '@reduxjs/toolkit'
import { composeOffers } from '../../offers/composeOffers'

const applications = composeOffers()
const defaultApplication = applications[0] ?? null
const defaultMenu = defaultApplication?.menus?.[0] ?? null

const initialState = {
  applications,
  selectedAppId: defaultApplication?.id ?? null,
  selectedMenuId: defaultMenu?.id ?? null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    selectApplication: (state, action) => {
      state.selectedAppId = action.payload
      const selectedApp = state.applications.find((app) => app.id === action.payload)

      if (selectedApp) {
        state.selectedMenuId = selectedApp.menus?.[0]?.id ?? null
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
  if (!state.dashboard.applications.length) {
    return null
  }

  const selectedApp = state.dashboard.applications.find((app) => app.id === state.dashboard.selectedAppId)
  return selectedApp ?? state.dashboard.applications[0]
}

export const selectSelectedMenu = (state) => {
  const selectedApp = selectSelectedApp(state)

  if (!selectedApp) {
    return null
  }

  return selectedApp.menus.find((menu) => menu.id === state.dashboard.selectedMenuId) ?? selectedApp.menus[0]
}

export default dashboardSlice.reducer
