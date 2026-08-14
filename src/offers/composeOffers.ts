import type { AppOffer } from '../types'
import { getEnabledOffers, OFFER_KEYS } from './offerRegistry'

export function composeOffers(): AppOffer[] {
  return getEnabledOffers()
}

export { OFFER_KEYS }
