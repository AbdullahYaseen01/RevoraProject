export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">GDPR Compliance</h1>
        <p className="text-xl text-gray-600 mb-8">Your data protection rights under GDPR</p>
        <a href="/privacy" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
          View Privacy Policy
        </a>
      </div>
    </div>
  )
}
