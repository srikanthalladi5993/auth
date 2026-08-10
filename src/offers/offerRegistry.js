import evqcOffer from './evqc/data/offer-one.json'
import chipManufacturingOffer from './chip-manufacturing/data/offer-two.json'
import espOilRigOffer from './esp-oil-rig/data/offer-three.json'

export const OFFER_REGISTRY = {
  evqc: evqcOffer,
  'chip-manufacturing': chipManufacturingOffer,
  'esp-oil-rig': espOilRigOffer,
}

export const OFFER_KEYS = Object.keys(OFFER_REGISTRY)
