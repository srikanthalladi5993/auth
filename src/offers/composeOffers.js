import { OFFER_KEYS, OFFER_REGISTRY } from './offerRegistry'

function parseEnabledOffers(value) {
  if (!value || typeof value !== 'string') {
    return OFFER_KEYS
  }

  const keys = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  if (!keys.length) {
    return OFFER_KEYS
  }

  return keys.filter((key) => OFFER_REGISTRY[key])
}

export function composeOffers() {
  const enabledKeys = parseEnabledOffers(import.meta.env.VITE_ENABLED_OFFERS)

  if (!enabledKeys.length) {
    return OFFER_KEYS.map((key) => OFFER_REGISTRY[key])
  }

  return enabledKeys.map((key) => OFFER_REGISTRY[key])
}
