import { lazy, Suspense } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { resolveOffer } from './offerRegistry'

export function OfferLoader() {
  const { offerId } = useParams()
  const selectedOffer = resolveOffer(offerId)

  const LazyOffer = lazy(selectedOffer.loader)

  return (
    <Suspense fallback={<div className="page-content">Loading offer...</div>}>
      <LazyOffer />
    </Suspense>
  )
}
