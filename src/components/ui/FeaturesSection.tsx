"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Search, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3,
  MapPin,
  Clock,
  DollarSign,
  Target
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: "Advanced Property Search",
    description: "Find properties with our powerful filters including location, price range, property type, and investment potential.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Verified Cash Buyers",
    description: "Connect with pre-verified cash buyers who are ready to close deals quickly and efficiently.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: TrendingUp,
    title: "Market Analytics",
    description: "Get real-time market data, property valuations, and investment projections to make informed decisions.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "All transactions are protected with bank-level security and escrow services for your peace of mind.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description: "Get notified immediately when new properties match your criteria or when buyers show interest.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: BarChart3,
    title: "Investment Tracking",
    description: "Track your portfolio performance with detailed analytics and ROI calculations.",
    color: "from-indigo-500 to-purple-500"
  }
]

const stats = [
  { icon: MapPin, value: "50+", label: "Cities Covered" },
  { icon: Clock, value: "24/7", label: "Support Available" },
  { icon: DollarSign, value: "$2.5B+", label: "Properties Sold" },
  { icon: Target, value: "98%", label: "Success Rate" }
]

export default function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}Revara
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide everything you need to succeed in real estate investing, 
            from finding properties to closing deals.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Trusted by Thousands</h3>
            <p className="text-purple-100 text-lg">
              Join our community of successful real estate investors
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-4 bg-white/20 rounded-xl mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-purple-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
