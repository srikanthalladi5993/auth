import type { AppOffer } from '../types'
import evqcOffer from './evqc/data/offer-one.json'
import chipManufacturingOffer from './chip-manufacturing/data/offer-two.json'
import espOilRigOffer from './esp-oil-rig/data/offer-three.json'

export const OFFER_REGISTRY: Record<string, AppOffer> = {
  evqc: evqcOffer as AppOffer,
  'chip-manufacturing': chipManufacturingOffer as AppOffer,
  'esp-oil-rig': espOilRigOffer as AppOffer,
}

export const OFFER_KEYS = Object.keys(OFFER_REGISTRY)

export const getEnabledOffers = (): AppOffer[] => Object.values(OFFER_REGISTRY)
