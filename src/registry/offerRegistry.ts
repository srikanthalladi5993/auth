import type { ComponentType } from 'react'

export type OfferLoader = () => Promise<{ default: ComponentType<any> }>

export interface OfferDefinition {
  id: string
  name: string
  route: string
  enabled: boolean
  description: string
  loader: OfferLoader
}

export const OFFER_REGISTRY: Record<string, OfferDefinition> = {
  reference: {
    id: 'reference',
    name: 'Reference Offer',
    route: '/reference',
    enabled: true,
    description: 'Placeholder offer used to validate the Shell + registry + loader flow.',
    loader: () => import('../offers/reference/ReferenceOffer'),
  },
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard Offer',
    route: '/dashboard',
    enabled: true,
    description: 'Existing dashboard experience used as a working baseline offer.',
    loader: () => import('../offers/DashboardView'),
  },
  motor: {
    id: 'motor',
    name: 'Motor Detail',
    route: '/motor',
    enabled: true,
    description: 'ESP motor detail page loaded as a dynamic offer from the Shell registry.',
    loader: () => import('../offers/esp-oil-rig/components/MotorDetail'),
  },
}

export const DEFAULT_OFFER_ID = 'dashboard'

export const resolveOffer = (offerId?: string) => {
  const normalizedId = offerId ?? DEFAULT_OFFER_ID
  return OFFER_REGISTRY[normalizedId] ?? OFFER_REGISTRY[DEFAULT_OFFER_ID]
}

export const getEnabledOffers = () => Object.values(OFFER_REGISTRY).filter((offer) => offer.enabled)

export const registerOffer = (definition: OfferDefinition) => {
  OFFER_REGISTRY[definition.id] = definition
}
