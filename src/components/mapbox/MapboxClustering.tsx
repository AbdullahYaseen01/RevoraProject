"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

export interface ClusterPoint {
  id: string
  coordinates: [number, number]
  properties?: Record<string, any>
}

export interface MapboxClusteringProps {
  map: mapboxgl.Map
  points: ClusterPoint[]
  onClusterClick?: (cluster: any) => void
  onPointClick?: (point: ClusterPoint) => void
  clusterRadius?: number
  clusterMaxZoom?: number
  clusterMinPoints?: number
  className?: string
}

export default function MapboxClustering({
  map,
  points,
  onClusterClick,
  onPointClick,
  clusterRadius = 50,
  clusterMaxZoom = 14,
  clusterMinPoints = 2,
  className = ''
}: MapboxClusteringProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const sourceId = 'cluster-source'
  const clusterLayerId = 'cluster-layer'
  const clusterCountLayerId = 'cluster-count-layer'
  const unclusteredPointLayerId = 'unclustered-point-layer'

  // Initialize clustering
  useEffect(() => {
    if (!map || !isLoaded) return

    // Add source
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true,
        clusterMaxZoom: clusterMaxZoom,
        clusterRadius: clusterRadius,
        clusterMinPoints: clusterMinPoints
      })
    }

    // Add cluster layer
    if (!map.getLayer(clusterLayerId)) {
      map.addLayer({
        id: clusterLayerId,
        type: 'circle',
        source: sourceId,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100, '#f1f075',
            750, '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100, 30,
            750, 40
          ]
        }
      })
    }

    // Add cluster count layer
    if (!map.getLayer(clusterCountLayerId)) {
      map.addLayer({
        id: clusterCountLayerId,
        type: 'symbol',
        source: sourceId,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      })
    }

    // Add unclustered point layer
    if (!map.getLayer(unclusteredPointLayerId)) {
      map.addLayer({
        id: unclusteredPointLayerId,
        type: 'circle',
        source: sourceId,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      })
    }

    // Event listeners
    const handleClusterClick = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [clusterLayerId]
      })

      if (features.length > 0) {
        const clusterId = features[0].properties?.cluster_id
        const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return

          map.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom: (zoom ?? undefined) as unknown as number | undefined
          })
        })

        onClusterClick?.(features[0])
      }
    }

    const handlePointClick = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [unclusteredPointLayerId]
      })

      if (features.length > 0) {
        const pointId = features[0].properties?.id
        const point = points.find(p => p.id === pointId)
        if (point) {
          onPointClick?.(point)
        }
      }
    }

    map.on('click', clusterLayerId, handleClusterClick)
    map.on('click', unclusteredPointLayerId, handlePointClick)

    // Change cursor on hover
    map.on('mouseenter', clusterLayerId, () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', clusterLayerId, () => {
      map.getCanvas().style.cursor = ''
    })

    map.on('mouseenter', unclusteredPointLayerId, () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', unclusteredPointLayerId, () => {
      map.getCanvas().style.cursor = ''
    })

    return () => {
      map.off('click', clusterLayerId, handleClusterClick)
      map.off('click', unclusteredPointLayerId, handlePointClick)
    }
  }, [map, isLoaded, clusterRadius, clusterMaxZoom, clusterMinPoints, onClusterClick, onPointClick, points])

  // Update points data
  useEffect(() => {
    if (!map || !isLoaded) return

    const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource
    if (source) {
      const geojson = {
        type: 'FeatureCollection' as const,
        features: points.map(point => ({
          type: 'Feature' as const,
          properties: {
            id: point.id,
            ...point.properties
          },
          geometry: {
            type: 'Point' as const,
            coordinates: point.coordinates
          }
        }))
      }

      source.setData(geojson)
    }
  }, [map, isLoaded, points])

  // Wait for map to load
  useEffect(() => {
    if (!map) return

    const handleMapLoad = () => {
      setIsLoaded(true)
    }

    if (map.isStyleLoaded()) {
      setIsLoaded(true)
    } else {
      map.on('styledata', handleMapLoad)
    }

    return () => {
      map.off('styledata', handleMapLoad)
    }
  }, [map])

  return null
}

// Custom cluster styling hook
export function useClusterStyling(map: mapboxgl.Map | null, theme: any) {
  useEffect(() => {
    if (!map) return

    const updateClusterStyle = () => {
      if (map.getLayer('cluster-layer')) {
        map.setPaintProperty('cluster-layer', 'circle-color', [
          'step',
          ['get', 'point_count'],
          theme.colors.primary,
          100, theme.colors.secondary,
          750, theme.colors.accent
        ])
      }

      if (map.getLayer('unclustered-point-layer')) {
        map.setPaintProperty('unclustered-point-layer', 'circle-color', theme.colors.primary)
      }
    }

    if (map.isStyleLoaded()) {
      updateClusterStyle()
    } else {
      map.on('styledata', updateClusterStyle)
    }

    return () => {
      map.off('styledata', updateClusterStyle)
    }
  }, [map, theme])
}

// Cluster popup component
export interface ClusterPopupProps {
  map: mapboxgl.Map
  cluster: any
  onClose?: () => void
}

export function ClusterPopup({ map, cluster, onClose }: ClusterPopupProps) {
  const popupRef = useRef<mapboxgl.Popup | null>(null)

  useEffect(() => {
    if (!map || !cluster) return

    const coordinates = (cluster.geometry as any).coordinates
    const pointCount = cluster.properties.point_count

    const popupContent = document.createElement('div')
    popupContent.className = 'cluster-popup'
    popupContent.innerHTML = `
      <div class="p-3">
        <h3 class="font-semibold text-gray-900 mb-1">Cluster</h3>
        <p class="text-sm text-gray-600">${pointCount} properties in this area</p>
        <button class="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
          View Properties
        </button>
      </div>
    `

    popupRef.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true
    })
      .setLngLat(coordinates)
      .setDOMContent(popupContent)
      .addTo(map)

    popupRef.current.on('close', () => {
      onClose?.()
    })

    return () => {
      if (popupRef.current) {
        popupRef.current.remove()
      }
    }
  }, [map, cluster, onClose])

  return null
}
