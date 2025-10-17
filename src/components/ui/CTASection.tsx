"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, CheckCircle, Star, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const benefits = [
  "Advanced property search & filtering",
  "Verified cash buyer network",
  "Real-time market analytics",
  "Secure transaction processing",
  "24/7 customer support",
  "Mobile app access"
]

const stats = [
  { icon: Users, value: "15,000+", label: "Active Users" },
  { icon: TrendingUp, value: "$2.5B+", label: "Properties Sold" },
  { icon: Star, value: "4.9/5", label: "User Rating" }
]

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6"
              >
                <Star className="w-4 h-4 text-yellow-300 mr-2" />
                <span className="text-sm font-medium">Limited Time Offer</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl lg:text-6xl font-bold leading-tight mb-6"
              >
                Start Your
                <br />
                <span className="text-yellow-300">Investment</span>
                <br />
                Journey Today
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-purple-100 mb-8 leading-relaxed"
              >
                Join thousands of successful investors who are already using Revara 
                to find profitable real estate opportunities and grow their wealth.
              </motion.p>

              {/* Benefits List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                    <span className="text-purple-100">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/auth/signup"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                >
                  View Pricing Plans
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Stats & Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {/* Stats Cards */}
              <div className="space-y-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 1.0 + index * 0.2 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <div className="p-3 bg-white/20 rounded-xl mr-4">
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-purple-200">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="absolute -top-8 -right-8 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
              >
                <div className="text-white font-semibold mb-1">Success Rate</div>
                <div className="text-2xl font-bold text-yellow-300">98%</div>
                <div className="text-purple-200 text-sm">Deal Completion</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="absolute -bottom-8 -left-8 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
              >
                <div className="text-white font-semibold mb-1">Avg. ROI</div>
                <div className="text-2xl font-bold text-green-300">+24%</div>
                <div className="text-purple-200 text-sm">Annual Return</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
