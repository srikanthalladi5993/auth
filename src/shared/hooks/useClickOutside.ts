import { useEffect, useRef } from 'react'

/**
 * Fires `callback` when a mousedown event occurs outside of the returned ref.
 * Attach the returned ref to the element you want to detect outside clicks for.
 *
 * @param {Function} callback - called when a click outside is detected
 * @param {boolean} enabled - only attach the listener when true (e.g. when dropdown is open)
 * @returns {React.RefObject}
 */
export function useClickOutside(callback, enabled = true) {
  const ref = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const handleMouseDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [callback, enabled])

  return ref
}
