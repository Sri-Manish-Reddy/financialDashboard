import { useEffect } from 'react'

/**
 * Mounts a Chart.js instance on `ref.current` using the provided factory.
 * Destroys the chart on unmount or when deps change.
 *
 * @param {React.RefObject} ref   - ref attached to the <canvas>
 * @param {Function} factory     - (canvas) => Chart instance
 * @param {Array}    deps        - dependency array (re-creates chart when changed)
 */
export default function useChart(ref, factory, deps = []) {
  useEffect(() => {
    if (!ref.current) return
    const chart = factory(ref.current)
    return () => chart.destroy()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
