"use client"

import { useEffect, useRef } from "react"

interface DistrictData {
  name: string
  state: string
  alertLevel: "low" | "medium" | "high"
  keywordCount: number
  verifiedCases: number
  unverifiedPosts: number
  topSymptoms: string[]
  coordinates: [number, number]
}

interface MalaysiaDistrictMapProps {
  districts: DistrictData[]
  selectedDistrict: string | null
  onDistrictSelect: (district: string | null) => void
}

export default function MalaysiaDistrictMap({
  districts,
  selectedDistrict,
  onDistrictSelect,
}: MalaysiaDistrictMapProps) {
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

      // Use a more professional, muted tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap contributors © CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map)

      districts.forEach((district) => {
        const alertColor =
          district.alertLevel === "high" ? "#dc2626" : district.alertLevel === "medium" ? "#ea580c" : "#16a34a"

        // Create custom icon based on alert level
        const alertIcon = L.divIcon({
          className: "custom-alert-marker",
          html: `
            <div style="
              width: ${Math.max(20, Math.min(40, district.keywordCount / 5))}px;
              height: ${Math.max(20, Math.min(40, district.keywordCount / 5))}px;
              background-color: ${alertColor};
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
              color: white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ${selectedDistrict === district.name ? "transform: scale(1.2);" : ""}
            ">
              ${district.keywordCount}
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        })

        const marker = L.marker(district.coordinates, { icon: alertIcon }).addTo(map)

        marker.bindPopup(`
          <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
            <h3 style="font-weight: 600; font-size: 16px; margin: 0 0 8px 0; color: #1f2937;">
              ${district.name}, ${district.state}
            </h3>
            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Alert Level:</span>
                <span style="font-weight: 500; color: ${alertColor}; text-transform: capitalize;">
                  ${district.alertLevel}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Keyword Alerts:</span>
                <span style="font-weight: 500;">${district.keywordCount}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Verified Cases:</span>
                <span style="font-weight: 500; color: #16a34a;">${district.verifiedCases}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Pending Review:</span>
                <span style="font-weight: 500; color: #ea580c;">${district.unverifiedPosts}</span>
              </div>
              <div style="margin-top: 8px;">
                <div style="color: #6b7280; font-size: 12px; margin-bottom: 4px;">Top Symptoms:</div>
                <div style="display: flex; flex-wrap: wrap; gap: 2px;">
                  ${district.topSymptoms
                    .map(
                      (symptom) =>
                        `<span style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${symptom}</span>`,
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </div>
        `)

        marker.on("click", () => {
          onDistrictSelect(district.name === selectedDistrict ? null : district.name)
        })
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [districts, selectedDistrict, onDistrictSelect])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div ref={mapRef} className="w-full h-full rounded-lg border border-gray-200" style={{ minHeight: "400px" }} />
    </>
  )
}
