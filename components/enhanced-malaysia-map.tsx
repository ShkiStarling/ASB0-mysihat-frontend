"use client";

import { memo, useEffect, useRef } from "react";

interface DistrictData {
  name: string;
  state: string;
  alertLevel: "low" | "medium" | "high";
  keywordCount: number;
  verifiedCases: number;
  unverifiedPosts: number;
  topSymptoms: string[];
  coordinates: [number, number];
  keywords: string[];
}

interface EnhancedMalaysiaMapProps {
  districts: DistrictData[];
  selectedDistrict: string | null;
  filteredDistricts?: DistrictData[];
  onThreatClick?: (districtName: string) => void;
}

function EnhancedMalaysiaMap({
  districts,
  selectedDistrict,
  onThreatClick,
  filteredDistricts = districts,
}: EnhancedMalaysiaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        zoomControl: false,
        attributionControl: true,
      }).setView([4.2105, 101.9758], 6);

      mapInstanceRef.current = map;

      // Add custom zoom control with styling to match the image
      const zoomControl = L.control
        .zoom({
          position: "topleft",
        })
        .addTo(map);

      // Style the zoom control to match the image
      const style = document.createElement("style");
      style.textContent = `
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }
        .leaflet-control-zoom a {
          background: white !important;
          border: 1px solid #ddd !important;
          color: #333 !important;
          font-size: 18px !important;
          font-weight: bold !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 30px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f5f5f5 !important;
        }
        .leaflet-control-zoom-in {
          border-radius: 4px 4px 0 0 !important;
        }
        .leaflet-control-zoom-out {
          border-radius: 0 0 4px 4px !important;
          border-top: none !important;
        }
      `;
      document.head.appendChild(style);

      // Use OpenStreetMap tiles to match the image style
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
          map.removeLayer(layer);
        }
      });

      filteredDistricts.forEach((district) => {
        const alertColor =
          district.alertLevel === "high"
            ? "#dc2626"
            : district.alertLevel === "medium"
            ? "#ea580c"
            : "#16a34a";

        const size = Math.max(12, Math.min(24, district.keywordCount / 8));

        // Create circle markers similar to the image
        const marker = L.circleMarker(district.coordinates, {
          radius: size,
          fillColor: alertColor,
          color: "white",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map);

        // Add hover tooltip
        marker.bindTooltip(
          `
          <div style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12px;
            line-height: 1.4;
          ">
            <div style="font-weight: 600; margin-bottom: 2px;">${district.name}, ${district.state}</div>
            <div style="color: #666;">
              <span style="color: ${alertColor}; font-weight: 500; text-transform: capitalize;">${district.alertLevel} Risk</span> • 
              ${district.keywordCount} alerts
            </div>
          </div>
          `,
          {
            permanent: false,
            sticky: true,
            direction: "top",
            offset: [0, -10],
            className: "custom-tooltip",
          }
        );

        // Enhanced popup with clean styling
        marker.bindPopup(
          `
          <div style="
            padding: 12px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            min-width: 200px;
            background: white;
            border-radius: 8px;
            border: none;
          ">
            <div style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 8px;
              padding-bottom: 6px;
              border-bottom: 1px solid #e5e7eb;
            ">
              <h3 style="
                font-weight: 600; 
                font-size: 16px; 
                margin: 0; 
                color: #111827;
              ">${district.name}</h3>
              <span style="
                background: ${alertColor}20;
                color: ${alertColor};
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
              ">${district.alertLevel}</span>
            </div>
            
            <div style="color: #6b7280; font-size: 13px; margin-bottom: 8px;">
              📍 ${district.state}
            </div>
            
            <div style="
              display: grid; 
              grid-template-columns: repeat(3, 1fr); 
              gap: 8px; 
              margin-bottom: 8px;
            ">
              <div style="text-align: center; padding: 6px; background: #fef2f2; border-radius: 6px;">
                <div style="font-size: 16px; font-weight: 700; color: #dc2626;">
                  ${district.keywordCount}
                </div>
                <div style="font-size: 10px; color: #7f1d1d;">Alerts</div>
              </div>
              <div style="text-align: center; padding: 6px; background: #f0fdf4; border-radius: 6px;">
                <div style="font-size: 16px; font-weight: 700; color: #16a34a;">
                  ${district.verifiedCases}
                </div>
                <div style="font-size: 10px; color: #14532d;">Verified</div>
              </div>
              <div style="text-align: center; padding: 6px; background: #fff7ed; border-radius: 6px;">
                <div style="font-size: 16px; font-weight: 700; color: #ea580c;">
                  ${district.unverifiedPosts}
                </div>
                <div style="font-size: 10px; color: #9a3412;">Pending</div>
              </div>
            </div>
            
            <div>
              <div style="
                color: #374151; 
                font-size: 11px; 
                font-weight: 600; 
                margin-bottom: 4px;
                text-transform: uppercase;
              ">Top Symptoms</div>
              <div style="display: flex; flex-wrap: wrap; gap: 2px;">
                ${district.topSymptoms
                  .map(
                    (symptom) =>
                      `<span style="
                        background: #f3f4f6; 
                        padding: 2px 4px; 
                        border-radius: 3px; 
                        font-size: 10px;
                        color: #374151;
                      ">${symptom}</span>`
                  )
                  .join("")}
              </div>
            </div>
          </div>
        `,
          {
            maxWidth: 250,
            className: "custom-popup-clean",
          }
        );

        marker.on("click", () => {
          if (onThreatClick) {
            (window as any).handleThreatClick = (districtName: string) => {
              onThreatClick(districtName);
            };
          }
        });

        // Highlight selected district
        if (selectedDistrict === district.name) {
          marker.setStyle({
            weight: 4,
            color: "#1f2937",
          });
        }
      });

      // Add custom CSS for clean popup and tooltip styling
      const popupStyle = document.createElement("style");
      popupStyle.textContent = `
        .custom-popup-clean .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
          padding: 0;
        }
        
        .custom-popup-clean .leaflet-popup-content {
          margin: 0;
        }
        
        .custom-popup-clean .leaflet-popup-tip {
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .custom-popup-clean .leaflet-popup-close-button {
          color: #6b7280;
          font-size: 16px;
          padding: 4px 8px;
        }
        
        .custom-popup-clean .leaflet-popup-close-button:hover {
          color: #374151;
          background: #f9fafb;
        }

        .custom-tooltip {
          background: rgba(0, 0, 0, 0.8) !important;
          border: none !important;
          border-radius: 6px !important;
          color: white !important;
          font-size: 12px !important;
          padding: 6px 8px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
        }

        .custom-tooltip:before {
          border-top-color: rgba(0, 0, 0, 0.8) !important;
        }

        .leaflet-tooltip-top:before {
          border-top-color: rgba(0, 0, 0, 0.8) !important;
        }
      `;
      document.head.appendChild(popupStyle);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [filteredDistricts, selectedDistrict, onThreatClick]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-full rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-blue-50"
          style={{ minHeight: "400px" }}
        />

        {/* Legend - positioned like in the image */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-gray-700">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              <span className="text-gray-700">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="text-gray-700">Low Risk</span>
            </div>
          </div>
        </div>

        {/* Last updated - positioned like in the image */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-1">
          <span className="text-xs text-gray-600">
            Last updated: 2 hours ago
          </span>
        </div>
      </div>
    </>
  );
}

export default memo(EnhancedMalaysiaMap, (prev, next) => {
  return JSON.stringify(prev.districts) === JSON.stringify(next.districts);
});
