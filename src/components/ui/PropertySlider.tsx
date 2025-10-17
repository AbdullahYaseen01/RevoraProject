"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  TrendingUp, 
  Star,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2
} from 'lucide-react'

const properties = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    price: "$450,000",
    address: "123 Ocean Drive, Miami, FL",
    beds: 3,
    baths: 2,
    sqft: 1200,
    roi: "+12%",
    rating: 4.8,
    status: "Hot Deal",
    type: "Condo"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
    price: "$750,000",
    address: "456 Sunset Blvd, Los Angeles, CA",
    beds: 4,
    baths: 3,
    sqft: 1800,
    roi: "+18%",
    rating: 4.9,
    status: "New Listing",
    type: "House"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    price: "$320,000",
    address: "789 Park Avenue, New York, NY",
    beds: 2,
    baths: 2,
    sqft: 950,
    roi: "+15%",
    rating: 4.7,
    status: "Featured",
    type: "Apartment"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    price: "$650,000",
    address: "321 Lake View, Chicago, IL",
    beds: 3,
    baths: 2,
    sqft: 1400,
    roi: "+22%",
    rating: 4.9,
    status: "Investment",
    type: "Townhouse"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    price: "$890,000",
    address: "654 Mountain View, Denver, CO",
    beds: 5,
    baths: 4,
    sqft: 2200,
    roi: "+25%",
    rating: 4.8,
    status: "Premium",
    type: "House"
  }
]

export default function PropertySlider() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length)
  }

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}Properties
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the best investment opportunities handpicked by our experts
          </p>
        </motion.div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-50 transition-colors group"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-purple-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-50 transition-colors group"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-purple-600" />
          </button>

          {/* Slider */}
          <div className="overflow-hidden rounded-2xl">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                    {/* Image Container */}
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.address}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          property.status === 'Hot Deal' ? 'bg-red-500 text-white' :
                          property.status === 'New Listing' ? 'bg-green-500 text-white' :
                          property.status === 'Featured' ? 'bg-blue-500 text-white' :
                          property.status === 'Investment' ? 'bg-purple-500 text-white' :
                          'bg-yellow-500 text-white'
                        }`}>
                          {property.status}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                          <Heart className="w-5 h-5 text-white" />
                        </button>
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                          <Share2 className="w-5 h-5 text-white" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="absolute bottom-4 left-4">
                        <div className="text-3xl font-bold text-white mb-1">{property.price}</div>
                        <div className="text-white/80 text-sm">{property.type}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 text-sm">{property.address}</span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            {property.beds}
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            {property.baths}
                          </div>
                          <div className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            {property.sqft} sqft
                          </div>
                        </div>
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span className="font-semibold">{property.roi}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">{property.rating}</span>
                        </div>
                        <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {properties.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-purple-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
