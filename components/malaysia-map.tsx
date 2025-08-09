"use client"

import { useEffect, useRef } from "react"

interface StateData {
  name: string
  cases: number
  active: number
  recovered: number
  severity: "low" | "medium" | "high"
}

interface MalaysiaMapProps {
  data: StateData[]
  selectedState: string | null
  onStateSelect: (state: string | null) => void
}

// Simplified Malaysian states coordinates for demonstration
const stateCoordinates: Record<string, [number, number]> = {
  Selangor: [3.0738, 101.5183],
  "Kuala Lumpur": [3.139, 101.6869],
  Johor: [1.4927, 103.7414],
  Penang: [5.4164, 100.3327],
  Perak: [4.5921, 101.0901],
  Kedah: [6.1184, 100.3685],
  Kelantan: [6.1254, 102.2386],
  Pahang: [3.8126, 103.3256],
  Terengganu: [5.3117, 103.1324],
  "Negeri Sembilan": [2.7297, 101.9381],
  Melaka: [2.1896, 102.2501],
  Perlis: [6.4449, 100.1997],
  Sabah: [5.9804, 116.0735],
  Sarawak: [1.5533, 110.3592],
}

export default function MalaysiaMap({ data, selectedState, onStateSelect }: MalaysiaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return

    // Dynamically import Leaflet only on client side
    import("leaflet").then((L) => {
      // Fix for default markers in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      // Initialize map
      const map = L.map(mapRef.current!).setView([4.2105, 101.9758], 6)
      mapInstanceRef.current = map

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      // Add markers for each state
      data.forEach((state) => {
        const coords = stateCoordinates[state.name]
        if (!coords) return

        const color = state.severity === "high" ? "#ef4444" : state.severity === "medium" ? "#f97316" : "#22c55e"

        const marker = L.circleMarker(coords, {
          radius: Math.max(8, Math.min(20, state.cases / 50)),
          fillColor: color,
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7,
        }).addTo(map)

        marker.bindPopup(`
          <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="font-weight: 600; font-size: 18px; margin: 0 0 8px 0;">${state.name}</h3>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between;">
                <span>Total Cases:</span>
                <span style="font-weight: 500;">${state.cases.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Active:</span>
                <span style="font-weight: 500; color: #f97316;">${state.active}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Recovered:</span>
                <span style="font-weight: 500; color: #22c55e;">${state.recovered}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Severity:</span>
                <span style="font-weight: 500; color: ${color}; text-transform: capitalize;">${state.severity}</span>
              </div>
            </div>
          </div>
        `)

        marker.on("click", () => {
          onStateSelect(state.name === selectedState ? null : state.name)
        })
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [data, selectedState, onStateSelect])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div ref={mapRef} className="w-full h-full rounded-lg border" style={{ minHeight: "400px" }} />
    </>
  )
}
