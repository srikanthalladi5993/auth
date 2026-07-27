import { useSelector } from 'react-redux'
import { selectApplications, selectSelectedApp, selectSelectedMenu } from '../../features/dashboard/dashboardSlice'

/**
 * Convenience hook that returns the full applications list plus
 * the currently selected application and menu — all in one call.
 *
 * Usage:
 *   const { applications, selectedApp, selectedMenu } = useApplications()
 */
export function useApplications() {
  const applications = useSelector(selectApplications)
  const selectedApp = useSelector(selectSelectedApp)
  const selectedMenu = useSelector(selectSelectedMenu)

  return { applications, selectedApp, selectedMenu }
}
