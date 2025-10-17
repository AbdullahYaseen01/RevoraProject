"use client"

import { useState } from "react"

interface Property {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  beds?: number
  baths?: number
  squareFeet?: number
  lastSalePrice?: number
  propertyType?: string
  yearBuilt?: number
}

interface ExportResultsProps {
  properties: Property[]
  loading?: boolean
}

export default function ExportResults({ properties, loading = false }: ExportResultsProps) {
  const [exporting, setExporting] = useState(false)

  const exportToCSV = () => {
    if (properties.length === 0) return

    setExporting(true)
    
    const headers = [
      'Address',
      'City',
      'State',
      'ZIP Code',
      'Bedrooms',
      'Bathrooms',
      'Square Feet',
      'Last Sale Price',
      'Property Type',
      'Year Built'
    ]

    const csvData = properties.map(property => [
      property.address,
      property.city,
      property.state,
      property.zipCode,
      property.beds || 'N/A',
      property.baths || 'N/A',
      property.squareFeet || 'N/A',
      property.lastSalePrice ? `$${property.lastSalePrice.toLocaleString()}` : 'N/A',
      property.propertyType || 'N/A',
      property.yearBuilt || 'N/A'
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `property-search-results-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExporting(false)
  }

  const exportToJSON = () => {
    if (properties.length === 0) return

    setExporting(true)
    
    const jsonData = {
      exportDate: new Date().toISOString(),
      totalProperties: properties.length,
      properties: properties.map(property => ({
        id: property.id,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        beds: property.beds,
        baths: property.baths,
        squareFeet: property.squareFeet,
        lastSalePrice: property.lastSalePrice,
        propertyType: property.propertyType,
        yearBuilt: property.yearBuilt
      }))
    }

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `property-search-results-${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExporting(false)
  }

  if (properties.length === 0 && !loading) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Export results:</span>
      <button
        onClick={exportToCSV}
        disabled={exporting || properties.length === 0}
        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
      >
        <span>📊</span>
        <span>{exporting ? 'Exporting...' : 'CSV'}</span>
      </button>
      <button
        onClick={exportToJSON}
        disabled={exporting || properties.length === 0}
        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
      >
        <span>📄</span>
        <span>{exporting ? 'Exporting...' : 'JSON'}</span>
      </button>
    </div>
  )
}
