"use client"

import { MapContainer, TileLayer, CircleMarker } from "react-leaflet"

import { cn } from "@/lib/utils"

const PIN = "#fb5607"

type Props = { lat: number; lon: number; className?: string }

export function HomeWeatherMap({ lat, lon, className }: Props) {
  return (
    <div
      className={cn(
        "home-weather-map pointer-events-none absolute inset-0 z-0 min-h-[12rem] select-none",
        className,
      )}
      aria-hidden
      tabIndex={-1}
    >
      <MapContainer
        center={[lat, lon]}
        zoom={15}
        maxZoom={19}
        className="h-full w-full [&_.leaflet-tile]:rounded-sm"
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <CircleMarker
          center={[lat, lon]}
          radius={11}
          pathOptions={{
            fillColor: PIN,
            fillOpacity: 0.5,
            color: PIN,
            weight: 2.5,
            opacity: 1,
          }}
        />
      </MapContainer>
    </div>
  )
}
