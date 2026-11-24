import { useEffect, useRef } from 'react'
import CanvasJS from '@canvasjs/charts'

export default function CanvasJSChart({ options }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const chart = new CanvasJS.Chart(containerRef.current, {})
    chartRef.current = chart
    return () => {
      chart.destroy()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    chart.options = options
    chart.render()
  }, [options])

  const height = options.height ? `${options.height}px` : '400px'
  return <div ref={containerRef} style={{ width: '100%', position: 'relative', height }} />
}
