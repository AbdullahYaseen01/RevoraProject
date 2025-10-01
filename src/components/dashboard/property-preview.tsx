import Link from "next/link"
import { MapPin, Bed, Bath, Square } from "lucide-react"

const featuredProperties = [
  {
    id: "1",
    address: "123 Oak Street",
    city: "Atlanta, GA",
    price: "$185,000",
    beds: 3,
    baths: 2,
    sqft: 1850,
    yearBuilt: 1985,
    lastSalePrice: "$210,000",
    daysOnMarket: 45,
    status: "Distressed",
    image: "/placeholder-house.jpg"
  },
  {
    id: "2",
    address: "456 Maple Ave",
    city: "Dallas, TX",
    price: "$220,000",
    beds: 4,
    baths: 3,
    sqft: 2200,
    yearBuilt: 1992,
    lastSalePrice: "$255,000",
    daysOnMarket: 32,
    status: "Pre-foreclosure",
    image: "/placeholder-house.jpg"
  },
  {
    id: "3",
    address: "789 Pine Street",
    city: "Phoenix, AZ",
    price: "$165,000",
    beds: 2,
    baths: 2,
    sqft: 1450,
    yearBuilt: 1978,
    lastSalePrice: "$195,000",
    daysOnMarket: 67,
    status: "REO",
    image: "/placeholder-house.jpg"
  }
]

const statusColors = {
  "Distressed": "bg-red-100 text-red-800",
  "Pre-foreclosure": "bg-yellow-100 text-yellow-800",
  "REO": "bg-orange-100 text-orange-800"
}

export default function PropertyPreview() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Featured Properties</h3>
          <Link
            href="/dashboard/properties"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {featuredProperties.map((property) => (
            <Link
              key={property.id}
              href={`/dashboard/properties/${property.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin size={16} className="text-gray-400" />
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {property.address}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{property.city}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Bed size={14} />
                      <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath size={14} />
                      <span>{property.baths}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Square size={14} />
                      <span>{property.sqft.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{property.price}</p>
                      <p className="text-xs text-gray-500">
                        Last sale: {property.lastSalePrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[property.status as keyof typeof statusColors]}`}>
                        {property.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {property.daysOnMarket} days on market
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
