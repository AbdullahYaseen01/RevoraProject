"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import Link from 'next/link'
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Real Estate Investor",
    company: "Johnson Properties",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    content: "Revara has completely transformed how I find and analyze investment properties. The market analytics are incredibly accurate and have helped me increase my ROI by 40%.",
    rating: 5,
    investment: "$2.5M"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Cash Buyer",
    company: "Chen Capital",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content: "The platform's verification system gives me confidence in every deal. I've closed 15 properties this year alone, all through Revara's network.",
    rating: 5,
    investment: "$4.2M"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Property Developer",
    company: "Rodriguez Development",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    content: "The advanced search filters and market insights have saved me countless hours. I can now identify profitable opportunities in minutes instead of days.",
    rating: 5,
    investment: "$1.8M"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Investment Advisor",
    company: "Thompson Wealth",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content: "My clients love the transparency and detailed analytics. Revara has become an essential tool in my investment advisory practice.",
    rating: 5,
    investment: "$6.1M"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Wholesaler",
    company: "Wang Wholesale",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    content: "The cash buyer network is incredible. I can find qualified buyers for any property type within hours, not weeks.",
    rating: 5,
    investment: "$3.7M"
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Portfolio Manager",
    company: "Wilson Holdings",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    content: "The ROI tracking and portfolio analytics have helped me optimize my entire real estate portfolio. Highly recommended!",
    rating: 5,
    investment: "$8.9M"
  }
]

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            What Our
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Clients Say
            </span>
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Join thousands of successful investors who trust Revara for their real estate investments
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20">
                <Quote className="w-8 h-8 text-white" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Investment Amount */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 mb-6">
                <div className="text-sm text-purple-200">Total Investment</div>
                <div className="text-2xl font-bold text-white">{testimonial.investment}</div>
              </div>

              {/* Author */}
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-4">
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-purple-200 text-sm">{testimonial.role}</div>
                  <div className="text-purple-300 text-xs">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-purple-100 mb-6">
              Start your real estate investment journey today and become part of our growing community of successful investors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={"/auth/signup"} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                Get Started Free
              </Link>
              <Link href="/properties" className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300">
                View All Testimonials
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
