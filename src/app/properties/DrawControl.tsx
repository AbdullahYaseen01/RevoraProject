"use client"
import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet-draw"

type Props = {
  onPolygonCreated: (polygon: [number, number][]) => void
}

export default function DrawControl({ onPolygonCreated }: Props) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const drawControl = new (L as any).Control.Draw({
      draw: {
        polygon: true,
        rectangle: false,
        marker: false,
        circle: false,
        circlemarker: false,
        polyline: false,
      },
      edit: { featureGroup: new L.FeatureGroup().addTo(map) }
    })

    map.addControl(drawControl)

    function onCreated(e: any) {
      const layer = e.layer
      const latlngs = layer.getLatLngs()[0] as Array<{ lat: number, lng: number }>
      const poly = latlngs.map(p => [p.lat, p.lng]) as [number, number][]
      onPolygonCreated(poly)
    }

    map.on(L.Draw.Event.CREATED, onCreated)

    return () => {
      map.off(L.Draw.Event.CREATED, onCreated)
      map.removeControl(drawControl)
    }
  }, [map, onPolygonCreated])

  return null
}


