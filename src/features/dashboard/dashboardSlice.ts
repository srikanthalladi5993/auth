import { createSlice } from '@reduxjs/toolkit'
import { composeOffers } from '../../offers/composeOffers'
import type { AppNode, AppOffer, DashboardState, MoveTreeActionPayload } from '../../types'

function findApplicationEntry(applications: AppOffer[], applicationId: string) {
  const index = applications.findIndex((application) => application.id === applicationId)

  if (index === -1) {
    return null
  }

  return {
    list: applications,
    index,
    item: applications[index],
  }
}

function findNodeEntry(nodes: AppNode[], nodeId: string) {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index]

    if (node.id === nodeId) {
      return {
        list: nodes,
        index,
        item: node,
      }
    }

    if (node.children?.length) {
      const nestedEntry = findNodeEntry(node.children, nodeId)

      if (nestedEntry) {
        return nestedEntry
      }
    }
  }

  return null
}

function findNodeAcrossApplications(applications: AppOffer[], nodeId: string) {
  for (const application of applications) {
    const nodeEntry = findNodeEntry(application.nodes ?? [], nodeId)

    if (nodeEntry) {
      return nodeEntry
    }
  }

  return null
}

function nodeContainsId(node: AppNode | undefined, searchId: string): boolean {
  if (!node?.children?.length) {
    return false
  }

  for (const child of node.children) {
    if (child.id === searchId || nodeContainsId(child, searchId)) {
      return true
    }
  }

  return false
}

function removeFromList<T extends { id: string }>(list: T[], itemId: string) {
  const index = list.findIndex((item) => item.id === itemId)

  if (index === -1) {
    return null
  }

  const [item] = list.splice(index, 1)
  return {
    index,
    item,
  }
}

function insertIntoList<T>(list: T[], item: T, index: number) {
  const normalizedIndex = Math.max(0, Math.min(index, list.length))
  list.splice(normalizedIndex, 0, item)
}

const applications = composeOffers()
const defaultApplication = applications[0] ?? null
const defaultMenu = defaultApplication?.menus?.[0] ?? null

const initialState: DashboardState = {
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
    moveTreeItem: (state, action: { payload: MoveTreeActionPayload }) => {
      const { sourceId, sourceKind, targetId, targetKind, position = 'inside' } = action.payload ?? {}

      if (!sourceId || !sourceKind || !targetId || !targetKind) {
        return
      }

      if (sourceId === targetId && sourceKind === targetKind) {
        return
      }

      const sourceEntry =
        sourceKind === 'application'
          ? findApplicationEntry(state.applications, sourceId)
          : findNodeAcrossApplications(state.applications, sourceId)

      const targetEntry =
        targetKind === 'application'
          ? findApplicationEntry(state.applications, targetId)
          : findNodeAcrossApplications(state.applications, targetId)

      if (!sourceEntry || !targetEntry) {
        return
      }

      if (sourceKind === 'node' && targetKind === 'node' && nodeContainsId(sourceEntry.item, targetId)) {
        return
      }

      if (sourceKind === 'application' && targetKind === 'application') {
        const removedApplication = removeFromList(state.applications, sourceId)

        if (!removedApplication?.item) {
          return
        }

        let insertIndex = targetEntry.index

        if (position === 'after') {
          insertIndex += 1
        }

        if (removedApplication.index < targetEntry.index && position !== 'after') {
          insertIndex -= 1
        }

        insertIntoList(state.applications, removedApplication.item, insertIndex)
        return
      }

      if (sourceKind !== 'node') {
        return
      }

      const removedNode = removeFromList(sourceEntry.list, sourceId)

      if (!removedNode?.item) {
        return
      }

      if (targetKind === 'application') {
        const destinationNodes = targetEntry.item.nodes ?? []
        targetEntry.item.nodes = destinationNodes

        if (position === 'before') {
          insertIntoList(destinationNodes, removedNode.item, targetEntry.index)
          return
        }

        if (position === 'after') {
          insertIntoList(destinationNodes, removedNode.item, targetEntry.index + 1)
          return
        }

        destinationNodes.push(removedNode.item)
        return
      }

      if (targetKind === 'node') {
        const destinationSiblings = targetEntry.list

        if (position === 'before') {
          insertIntoList(destinationSiblings, removedNode.item, targetEntry.index)
          return
        }

        if (position === 'after') {
          insertIntoList(destinationSiblings, removedNode.item, targetEntry.index + 1)
          return
        }

        const destinationChildren = targetEntry.item.children ?? []
        targetEntry.item.children = destinationChildren
        destinationChildren.push(removedNode.item)
      }
    },
  },
})

export const { selectApplication, selectMenu, moveTreeItem } = dashboardSlice.actions

export const selectApplications = (state: { dashboard: DashboardState }) => state.dashboard.applications
export const selectSelectedApp = (state: { dashboard: DashboardState }) => {
  if (!state.dashboard.applications.length) {
    return null
  }

  const selectedApp = state.dashboard.applications.find((app) => app.id === state.dashboard.selectedAppId)
  return selectedApp ?? state.dashboard.applications[0]
}

export const selectSelectedMenu = (state: { dashboard: DashboardState }) => {
  const selectedApp = selectSelectedApp(state)

  if (!selectedApp) {
    return null
  }

  return selectedApp.menus.find((menu) => menu.id === state.dashboard.selectedMenuId) ?? selectedApp.menus[0]
}

export default dashboardSlice.reducer
