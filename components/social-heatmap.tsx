"use client"

import { useEffect, useRef } from "react"

interface RegionData {
  name: string
  lat: number
  lng: number
  mentions: number
  sentiment: "positive" | "neutral" | "negative"
  trending: boolean
}

interface SocialHeatmapProps {
  data: RegionData[]
  selectedRegion: string | null
  onRegionSelect: (region: string | null) => void
}

export default function SocialHeatmap({ data, selectedRegion, onRegionSelect }: SocialHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return

    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      const map = L.map(mapRef.current!).setView([4.2105, 101.9758], 6)
      mapInstanceRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      data.forEach((region) => {
        const intensity = region.mentions / 1000
        const color =
          region.sentiment === "negative" ? "#ef4444" : region.sentiment === "neutral" ? "#f97316" : "#22c55e"

        const marker = L.circleMarker([region.lat, region.lng], {
          radius: Math.max(10, Math.min(25, intensity * 20)),
          fillColor: color,
          color: region.trending ? "#8b5cf6" : "#fff",
          weight: region.trending ? 3 : 2,
          opacity: 1,
          fillOpacity: 0.6,
        }).addTo(map)

        marker.bindPopup(`
          <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="font-weight: 600; font-size: 16px; margin: 0 0 8px 0;">${region.name}</h3>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between;">
                <span>Mentions:</span>
                <span style="font-weight: 500;">${region.mentions.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Sentiment:</span>
                <span style="font-weight: 500; color: ${color}; text-transform: capitalize;">${region.sentiment}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Trending:</span>
                <span style="font-weight: 500;">${region.trending ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        `)

        marker.on("click", () => {
          onRegionSelect(region.name === selectedRegion ? null : region.name)
        })
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [data, selectedRegion, onRegionSelect])

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
