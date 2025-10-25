export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
        <p className="text-xl text-gray-600 mb-8">Learn about how we use cookies</p>
        <a href="/privacy" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
          View Privacy Policy
        </a>
      </div>
    </div>
  )
}
