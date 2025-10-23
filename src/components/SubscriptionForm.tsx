"use client"

import { useState } from 'react'

interface SubscriptionFormProps {
  className?: string
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
}

export default function SubscriptionForm({
  className = '',
  title = 'Stay Updated with Market Insights',
  description = 'Get the latest real estate trends, investment opportunities, and platform updates delivered to your inbox.',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe'
}: SubscriptionFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage('Please enter your email address')
      setIsSuccess(false)
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setMessage('Thanks for Subscribe! Check your email for confirmation.')
        setEmail('')
      } else {
        setIsSuccess(false)
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setIsSuccess(false)
      setMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`bg-gradient-to-br from-purple-900 to-black p-8 rounded-lg ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900 placeholder-gray-500 transition-all duration-200 hover:shadow-md"
          disabled={isLoading}
          required
        />
        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 min-w-[120px]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              <span className="hidden sm:inline">Sending...</span>
              <span className="sm:hidden">...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center">
              <span className="hidden sm:inline">{buttonText}</span>
              <span className="sm:hidden">Subscribe</span>
            </span>
          )}
        </button>
      </form>

      {message && (
        <div className={`mt-4 text-center p-4 rounded-lg max-w-md mx-auto animate-fadeIn ${
          isSuccess 
            ? 'bg-green-50 text-green-800 border border-green-200 shadow-lg' 
            : 'bg-red-50 text-red-800 border border-red-200 shadow-lg'
        }`}>
          <div className="flex items-center justify-center">
            {isSuccess ? (
              <div className="flex items-center">
                <div className="animate-bounce mr-3">
                  <span className="text-green-600 text-2xl">🎉</span>
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Thanks for Subscribe!</div>
                  <div className="text-sm opacity-90">Check your email for confirmation</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-red-600 text-xl mr-3">⚠️</span>
                <span className="font-medium">{message}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
