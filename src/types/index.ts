export interface AuthUser {
  id?: string | number
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  gender?: string
  image?: string
  role?: string | string[]
  permissions?: string[]
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
}

export interface AppMenu {
  id: string
  label: string
}

export interface AppNode {
  id: string
  label: string
  type: string
  children?: AppNode[]
  [key: string]: string | number | boolean | undefined | AppNode[] | Record<string, unknown>
}

export interface AppStat {
  label: string
  value: string
  trend: string
}

export interface AppMetric {
  label: string
  value: string
  status: string
  detail: string
}

export interface AppTableColumn {
  key: string
  label: string
}

export interface AppTableRow extends Record<string, string | number> {}

export interface AppOffer {
  id: string
  name: string
  industry: string
  summary: string
  menus: AppMenu[]
  stats: AppStat[]
  healthMetric: AppMetric
  shiftTrend: number[]
  tableTitle: string
  notificationPanel: {
    title: string
    placeholder: string
    buttonLabel: string
  }
  subNodePanel: {
    title: string
    placeholder: string
    buttonLabel: string
  }
  nodes: AppNode[]
  tableColumns: AppTableColumn[]
  tableRows: AppTableRow[]
}

export interface DashboardState {
  applications: AppOffer[]
  selectedAppId: string | null
  selectedMenuId: string | null
}

export type MoveTreePosition = 'inside' | 'before' | 'after'

export interface MoveTreeActionPayload {
  sourceId: string
  sourceKind: 'application' | 'node'
  targetId: string
  targetKind: 'application' | 'node'
  position?: MoveTreePosition
}
