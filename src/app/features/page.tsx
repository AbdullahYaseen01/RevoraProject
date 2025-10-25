import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  MapPin, 
  Users, 
  DollarSign, 
  FileText, 
  Shield, 
  Zap, 
  BarChart3,
  Smartphone,
  Globe,
  Lock,
  CheckCircle
} from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    {
      category: "Property Search",
      icon: Search,
      color: "bg-blue-500",
      items: [
        {
          title: "Advanced Property Search",
          description: "Search properties by location, price range, property type, and more with our powerful filters.",
          badge: "Core Feature"
        },
        {
          title: "Interactive Map View",
          description: "Visualize properties on an interactive map with clustering and detailed property information.",
          badge: "Core Feature"
        },
        {
          title: "Saved Searches",
          description: "Save your search criteria and get notified when new properties match your criteria.",
          badge: "Pro Feature"
        },
        {
          title: "Property Analysis",
          description: "Get detailed property analysis including market value, rental potential, and investment metrics.",
          badge: "Pro Feature"
        }
      ]
    },
    {
      category: "Cash Buyer Network",
      icon: Users,
      color: "bg-green-500",
      items: [
        {
          title: "Verified Cash Buyers",
          description: "Connect with pre-verified cash buyers who are ready to close deals quickly.",
          badge: "Core Feature"
        },
        {
          title: "Investment Criteria Matching",
          description: "Find buyers whose investment criteria match your property listings.",
          badge: "Core Feature"
        },
        {
          title: "Direct Communication",
          description: "Contact buyers directly through our secure messaging system.",
          badge: "Core Feature"
        },
        {
          title: "Deal History Tracking",
          description: "View buyer transaction history and success rates.",
          badge: "Pro Feature"
        }
      ]
    },
    {
      category: "Skip Tracing",
      icon: MapPin,
      color: "bg-purple-500",
      items: [
        {
          title: "Owner Contact Information",
          description: "Find property owner contact details including phone numbers and email addresses.",
          badge: "Premium Feature"
        },
        {
          title: "High Accuracy Results",
          description: "Our skip tracing service provides 90%+ accuracy rates for contact information.",
          badge: "Premium Feature"
        },
        {
          title: "Multiple Data Sources",
          description: "We aggregate data from public records, social media, and proprietary databases.",
          badge: "Premium Feature"
        },
        {
          title: "Compliance Ready",
          description: "All skip tracing activities comply with TCPA and other relevant regulations.",
          badge: "Premium Feature"
        }
      ]
    },
    {
      category: "Contract Management",
      icon: FileText,
      color: "bg-orange-500",
      items: [
        {
          title: "Digital Contracts",
          description: "Create, edit, and manage contracts digitally with our built-in contract templates.",
          badge: "Pro Feature"
        },
        {
          title: "Electronic Signatures",
          description: "Get contracts signed electronically with legally binding e-signatures.",
          badge: "Pro Feature"
        },
        {
          title: "Contract Templates",
          description: "Use pre-built templates for purchase agreements, lease agreements, and more.",
          badge: "Pro Feature"
        },
        {
          title: "Document Storage",
          description: "Securely store and organize all your contract documents in one place.",
          badge: "Pro Feature"
        }
      ]
    },
    {
      category: "Analytics & Reporting",
      icon: BarChart3,
      color: "bg-indigo-500",
      items: [
        {
          title: "Deal Pipeline Tracking",
          description: "Track your deals from initial contact to closing with detailed pipeline views.",
          badge: "Pro Feature"
        },
        {
          title: "Performance Analytics",
          description: "Analyze your performance with detailed reports and insights.",
          badge: "Pro Feature"
        },
        {
          title: "Market Trends",
          description: "Stay informed with market trend analysis and property value forecasts.",
          badge: "Premium Feature"
        },
        {
          title: "Custom Reports",
          description: "Generate custom reports tailored to your specific needs.",
          badge: "Premium Feature"
        }
      ]
    },
    {
      category: "Security & Compliance",
      icon: Shield,
      color: "bg-red-500",
      items: [
        {
          title: "Bank-Level Security",
          description: "Your data is protected with enterprise-grade security and encryption.",
          badge: "Core Feature"
        },
        {
          title: "GDPR Compliance",
          description: "Full compliance with GDPR and other data protection regulations.",
          badge: "Core Feature"
        },
        {
          title: "Two-Factor Authentication",
          description: "Secure your account with optional two-factor authentication.",
          badge: "Core Feature"
        },
        {
          title: "Audit Trails",
          description: "Complete audit trails for all activities and data access.",
          badge: "Pro Feature"
        }
      ]
    }
  ]

  const pricingTiers = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for individual investors getting started",
      features: ["Basic property search", "Map view", "Contact 5 buyers/month", "Basic support"],
      color: "border-gray-200"
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "For serious investors and wholesalers",
      features: ["Advanced search filters", "Unlimited buyer contacts", "Contract management", "Priority support", "Skip tracing credits"],
      color: "border-blue-500",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For teams and high-volume operations",
      features: ["Everything in Professional", "Team collaboration", "Custom integrations", "Dedicated support", "Advanced analytics"],
      color: "border-purple-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful Features for Real Estate Success
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Everything you need to find deals, connect with buyers, and close transactions faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/pricing" 
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Pricing
              </a>
              <a 
                href="/auth/signup" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Feature Set
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides all the tools you need to succeed in real estate investing, from property discovery to deal closing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="shadow-lg border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className={`p-2 rounded-lg ${category.color} text-white mr-3`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.items.map((feature, featureIndex) => (
                  <div key={featureIndex} className="border-l-4 border-gray-200 pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start with our free trial and upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`shadow-lg ${tier.color} ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {tier.popular && (
                  <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600">{tier.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a 
                    href="/auth/signup" 
                    className={`w-full mt-6 block text-center py-3 rounded-lg font-semibold transition-colors ${
                      tier.popular 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Real Estate Business?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of successful investors who trust Revara to power their real estate operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/auth/signup" 
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Free Trial
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
