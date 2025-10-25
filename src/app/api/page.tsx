import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Code, 
  Key, 
  BookOpen, 
  Zap, 
  Shield, 
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react'

export default function APIPage() {
  const endpoints = [
    {
      method: "GET",
      path: "/api/properties/search",
      description: "Search for properties with various filters",
      auth: "Required",
      example: "curl -H 'Authorization: Bearer YOUR_TOKEN' 'https://api.revara.com/v1/properties/search?city=Miami&beds=3'"
    },
    {
      method: "POST",
      path: "/api/cash-buyers/search",
      description: "Find verified cash buyers matching criteria",
      auth: "Required",
      example: "curl -X POST -H 'Authorization: Bearer YOUR_TOKEN' -d '{\"propertyType\":\"single-family\",\"priceRange\":\"200000-500000\"}' 'https://api.revara.com/v1/cash-buyers/search'"
    },
    {
      method: "POST",
      path: "/api/skip-trace",
      description: "Perform skip tracing on property addresses",
      auth: "Required",
      example: "curl -X POST -H 'Authorization: Bearer YOUR_TOKEN' -d '{\"address\":\"123 Main St, Miami, FL\"}' 'https://api.revara.com/v1/skip-trace'"
    },
    {
      method: "GET",
      path: "/api/contracts",
      description: "Retrieve user's contracts",
      auth: "Required",
      example: "curl -H 'Authorization: Bearer YOUR_TOKEN' 'https://api.revara.com/v1/contracts'"
    }
  ]

  const features = [
    {
      title: "RESTful API",
      description: "Clean, intuitive REST API design following industry best practices",
      icon: Code
    },
    {
      title: "Authentication",
      description: "Secure API key authentication with role-based access control",
      icon: Key
    },
    {
      title: "Rate Limiting",
      description: "Generous rate limits with clear documentation and monitoring",
      icon: Zap
    },
    {
      title: "Webhooks",
      description: "Real-time notifications for important events and updates",
      icon: BookOpen
    },
    {
      title: "SDKs",
      description: "Official SDKs for popular programming languages",
      icon: Shield
    },
    {
      title: "Documentation",
      description: "Comprehensive documentation with interactive examples",
      icon: CheckCircle
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              API Documentation
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Integrate Revara's powerful real estate tools into your applications with our comprehensive API.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#getting-started" 
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </a>
              <a 
                href="#endpoints" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                View Endpoints
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div id="getting-started" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Getting Started
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow these simple steps to start using our API
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-lg border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Get API Key</h3>
              <p className="text-gray-600 mb-4">
                Sign up for an account and generate your API key from the dashboard.
              </p>
              <a href="/auth/signup" className="text-blue-600 font-semibold hover:underline">
                Sign Up →
              </a>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Make Requests</h3>
              <p className="text-gray-600 mb-4">
                Use your API key to make authenticated requests to our endpoints.
              </p>
              <a href="#endpoints" className="text-green-600 font-semibold hover:underline">
                View Examples →
              </a>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Build & Scale</h3>
              <p className="text-gray-600 mb-4">
                Integrate our powerful features into your applications and scale your business.
              </p>
              <a href="/contact" className="text-purple-600 font-semibold hover:underline">
                Get Support →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              API Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to build powerful real estate applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-lg border-gray-200 hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div id="endpoints" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            API Endpoints
          </h2>
          <p className="text-xl text-gray-600">
            Explore our comprehensive API endpoints
          </p>
        </div>

        <div className="space-y-6">
          {endpoints.map((endpoint, index) => (
            <Card key={index} className="shadow-lg border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge className={`mr-3 ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                  </div>
                  <Badge variant="outline">{endpoint.auth}</Badge>
                </div>
                <p className="text-gray-600 mt-2">{endpoint.description}</p>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span>Example Request</span>
                    <button className="text-gray-400 hover:text-white">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <code>{endpoint.example}</code>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rate Limits
            </h2>
            <p className="text-xl text-gray-600">
              Fair usage policies to ensure optimal performance for all users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Tier</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">1,000</div>
                <p className="text-gray-600 mb-4">requests per month</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Basic property search</li>
                  <li>• Limited skip tracing</li>
                  <li>• Community support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-blue-500 ring-2 ring-blue-500">
              <CardContent className="p-8">
                <div className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4 inline-block">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Tier</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">10,000</div>
                <p className="text-gray-600 mb-4">requests per month</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• All API endpoints</li>
                  <li>• Priority support</li>
                  <li>• Webhook support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-purple-600 mb-4">Unlimited</div>
                <p className="text-gray-600 mb-4">requests per month</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Custom integrations</li>
                  <li>• Dedicated support</li>
                  <li>• SLA guarantees</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Get your API key and start integrating Revara's powerful features into your applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/auth/signup" 
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get API Access
            </a>
            <a 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
