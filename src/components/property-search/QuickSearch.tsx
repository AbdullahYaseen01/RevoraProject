"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function QuickSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      const params = new URLSearchParams()
      if (query.includes("@")) {
        // If it looks like an address, search by address
        params.set("address", query.trim())
      } else if (query.match(/^\d{5}(-\d{4})?$/)) {
        // If it looks like a ZIP code, search by ZIP
        params.set("zipCode", query.trim())
      } else {
        // Otherwise, search by city
        params.set("city", query.trim())
      }
      router.push(`/properties?${params.toString()}`)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Property Search</h2>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter city, ZIP code, or address..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </form>
      <div className="mt-3 text-sm text-gray-600">
        <p>Examples:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>San Francisco, CA</li>
          <li>94102</li>
          <li>123 Main St, San Francisco</li>
        </ul>
      </div>
    </div>
  )
}
