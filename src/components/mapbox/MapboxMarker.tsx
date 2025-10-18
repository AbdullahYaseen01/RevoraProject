"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

export interface MapboxMarkerProps {
  map: mapboxgl.Map
  coordinates: [number, number]
  popup?: React.ReactNode
  popupOptions?: mapboxgl.PopupOptions
  className?: string
  color?: string
  size?: number
  draggable?: boolean
  onDragStart?: (e: any) => void
  onDrag?: (e: any) => void
  onDragEnd?: (e: any) => void
  onClick?: (e: any) => void
  onMouseEnter?: (e: MouseEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
  children?: React.ReactNode
}

export default function MapboxMarker({
  map,
  coordinates,
  popup,
  popupOptions,
  className = '',
  color = '#3b82f6',
  size = 20,
  draggable = false,
  onDragStart,
  onDrag,
  onDragEnd,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children
}: MapboxMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Create marker element
  const createMarkerElement = () => {
    const el = document.createElement('div')
    el.className = `mapbox-marker ${className}`
    el.style.width = `${size}px`
    el.style.height = `${size}px`
    el.style.borderRadius = '50%'
    el.style.backgroundColor = color
    el.style.border = '2px solid white'
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
    el.style.cursor = draggable ? 'grab' : 'pointer'
    el.style.display = 'flex'
    el.style.alignItems = 'center'
    el.style.justifyContent = 'center'
    el.style.transition = 'all 0.2s ease'
    
    // Add hover effects
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.1)'
      el.style.zIndex = '1000'
    })
    
    el.addEventListener('mouseleave', () => {
      if (!isDragging) {
        el.style.transform = 'scale(1)'
        el.style.zIndex = 'auto'
      }
    })

    return el
  }

  // Initialize marker
  useEffect(() => {
    if (!map) return

    const markerElement = createMarkerElement()
    
    // Add custom content if provided
    if (children) {
      const contentWrapper = document.createElement('div')
      contentWrapper.style.display = 'contents'
      markerElement.appendChild(contentWrapper)
    }

    markerRef.current = new mapboxgl.Marker({
      element: markerElement,
      draggable
    })
      .setLngLat(coordinates)
      .addTo(map)

    const marker = markerRef.current

    // Event listeners
    if (onClick) {
      markerElement.addEventListener('click', (e) => {
        e.stopPropagation()
        onClick(e as any)
      })
    }

    if (onMouseEnter) {
      markerElement.addEventListener('mouseenter', (e) => onMouseEnter(e))
    }

    if (onMouseLeave) {
      markerElement.addEventListener('mouseleave', (e) => onMouseLeave(e))
    }

    if (draggable) {
      marker.on('dragstart', (e) => {
        setIsDragging(true)
        markerElement.style.cursor = 'grabbing'
        onDragStart?.(e)
      })

      marker.on('drag', (e) => {
        onDrag?.(e)
      })

      marker.on('dragend', (e) => {
        setIsDragging(false)
        markerElement.style.cursor = 'grab'
        onDragEnd?.(e)
      })
    }

    // Create popup if provided
    if (popup) {
      const popupElement = document.createElement('div')
      popupElement.className = 'mapbox-popup-content'
      
      popupRef.current = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        ...popupOptions
      })
        .setLngLat(coordinates)
        .setDOMContent(popupElement)
        .addTo(map)

      // Render popup content using React
      if (typeof popup === 'string') {
        popupElement.innerHTML = popup
      } else {
        // For React components, we'll need to use a portal or render to string
        popupElement.innerHTML = '<div>Popup content</div>'
      }
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove()
      }
      if (popupRef.current) {
        popupRef.current.remove()
      }
    }
  }, [map, coordinates, draggable, color, size, className, children, popup, popupOptions, onClick, onMouseEnter, onMouseLeave, onDragStart, onDrag, onDragEnd, isDragging])

  // Update coordinates
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat(coordinates)
      if (popupRef.current) {
        popupRef.current.setLngLat(coordinates)
      }
    }
  }, [coordinates])

  // Update popup content
  useEffect(() => {
    if (popupRef.current && popup) {
      // Re-set content since mapboxgl.Popup doesn't expose getDOMContent in typings
      if (typeof popup === 'string') {
        popupRef.current.setDOMContent(Object.assign(document.createElement('div'), { innerHTML: popup }))
      } else {
        popupRef.current.setDOMContent(Object.assign(document.createElement('div'), { innerHTML: '<div>Popup content</div>' }))
      }
    }
  }, [popup])

  return null
}

// Custom marker with icon
export interface MapboxIconMarkerProps extends Omit<MapboxMarkerProps, 'children'> {
  icon: string
  iconSize?: [number, number]
}

export function MapboxIconMarker({
  map,
  coordinates,
  icon,
  iconSize = [25, 25],
  ...props
}: MapboxIconMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    if (!map) return

    const el = document.createElement('div')
    el.className = 'mapbox-icon-marker'
    el.style.width = `${iconSize[0]}px`
    el.style.height = `${iconSize[1]}px`
    el.style.backgroundImage = `url(${icon})`
    el.style.backgroundSize = 'contain'
    el.style.backgroundRepeat = 'no-repeat'
    el.style.backgroundPosition = 'center'
    el.style.cursor = 'pointer'

    markerRef.current = new mapboxgl.Marker({
      element: el
    })
      .setLngLat(coordinates)
      .addTo(map)

    return () => {
      if (markerRef.current) {
        markerRef.current.remove()
      }
    }
  }, [map, coordinates, icon, iconSize])

  return null
}
