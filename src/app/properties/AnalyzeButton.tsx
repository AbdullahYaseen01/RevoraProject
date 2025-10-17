"use client"
import dynamic from "next/dynamic"

const useMap = dynamic(() => import("react-leaflet").then(m => m.useMap), { ssr: false }) as unknown as () => any

export default function AnalyzeButton({ onAnalyze, disabled }: { onAnalyze: (bounds: { north: number; south: number; east: number; west: number }) => void, disabled?: boolean }) {
  const map = useMap && useMap()
  function handleClick() {
    if (!map) return
    const b = map.getBounds()
    onAnalyze({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() })
  }
  return (
    <button onClick={handleClick} disabled={disabled} className="bg-black text-white rounded px-3 py-1 text-sm shadow disabled:opacity-60">
      {disabled ? "Analyzing…" : "Analyze Area"}
    </button>
  )
}


