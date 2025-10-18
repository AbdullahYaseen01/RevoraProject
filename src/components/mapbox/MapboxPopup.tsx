"use client"

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

export interface MapboxPopupProps {
  map: mapboxgl.Map
  coordinates: [number, number]
  content: React.ReactNode
  options?: mapboxgl.PopupOptions
  onClose?: () => void
  onOpen?: () => void
}

export default function MapboxPopup({
  map,
  coordinates,
  content,
  options = {},
  onClose,
  onOpen
}: MapboxPopupProps) {
  const popupRef = useRef<mapboxgl.Popup | null>(null)

  useEffect(() => {
    if (!map) return

    const popupElement = document.createElement('div')
    popupElement.className = 'mapbox-popup-content'

    popupRef.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      className: 'custom-popup',
      ...options
    })
      .setLngLat(coordinates)
      .setDOMContent(popupElement)
      .addTo(map)

    const popup = popupRef.current

    // Event listeners
    popup.on('open', () => {
      onOpen?.()
    })

    popup.on('close', () => {
      onClose?.()
    })

    // Render content
    if (typeof content === 'string') {
      popupElement.innerHTML = content
    } else {
      // For React components, create a simple text representation
      popupElement.innerHTML = '<div>Popup content</div>'
    }

    return () => {
      if (popupRef.current) {
        popupRef.current.remove()
      }
    }
  }, [map, coordinates, content, options, onClose, onOpen])

  // Update coordinates
  useEffect(() => {
    if (popupRef.current) {
      popupRef.current.setLngLat(coordinates)
    }
  }, [coordinates])

  // Update content
  useEffect(() => {
    if (popupRef.current) {
      if (typeof content === 'string') {
        popupRef.current.setDOMContent(Object.assign(document.createElement('div'), { innerHTML: content }))
      } else {
        popupRef.current.setDOMContent(Object.assign(document.createElement('div'), { innerHTML: '<div>Popup content</div>' }))
      }
    }
  }, [content])

  return null
}

// Predefined popup styles
export const popupStyles = {
  property: {
    maxWidth: '300px',
    className: 'property-popup'
  },
  marker: {
    maxWidth: '200px',
    className: 'marker-popup'
  },
  info: {
    maxWidth: '250px',
    className: 'info-popup'
  }
}
