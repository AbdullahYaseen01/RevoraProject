"use client";

import { MapPin, Bed, Bath, Square } from "lucide-react";

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image?: string;
}

export default function PropertyPreview({ property }: { property: Property }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {property.image ? (
          <img
            src={property.image}
            alt={property.address}
            className="w-full h-full object-cover"
          />
        ) : (
          <MapPin className="w-12 h-12 text-gray-400" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{property.address}</h3>
          <p className="text-lg font-bold text-blue-600">
            ${property.price.toLocaleString()}
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {property.city}, {property.state}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.beds} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.baths} baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
