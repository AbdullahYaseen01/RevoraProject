import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Video, 
  FileText, 
  HelpCircle,
  ChevronRight,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react'

export default function HelpPage() {
  const categories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      color: "bg-blue-500",
      articles: [
        "How to create your first account",
        "Setting up your profile",
        "Understanding the dashboard",
        "Basic navigation guide"
      ]
    },
    {
      title: "Property Search",
      icon: Search,
      color: "bg-green-500",
      articles: [
        "Using search filters effectively",
        "Understanding map view",
        "Saving and managing searches",
        "Property analysis features"
      ]
    },
    {
      title: "Cash Buyers",
      icon: Users,
      color: "bg-purple-500",
      articles: [
        "Finding verified cash buyers",
        "Contacting buyers safely",
        "Understanding buyer criteria",
        "Managing buyer relationships"
      ]
    },
    {
      title: "Skip Tracing",
      icon: FileText,
      color: "bg-orange-500",
      articles: [
        "How skip tracing works",
        "Understanding accuracy rates",
        "Compliance and regulations",
        "Best practices for outreach"
      ]
    },
    {
      title: "Contracts",
      icon: FileText,
      color: "bg-indigo-500",
      articles: [
        "Creating contracts",
        "Digital signatures",
        "Contract templates",
        "Managing contract lifecycle"
      ]
    },
    {
      title: "Billing & Account",
      icon: HelpCircle,
      color: "bg-red-500",
      articles: [
        "Understanding pricing plans",
        "Managing subscriptions",
        "Payment methods",
        "Account security"
      ]
    }
  ]

  const faqs = [
    {
      question: "How accurate is the skip tracing data?",
      answer: "Our skip tracing service maintains a 90%+ accuracy rate by aggregating data from multiple sources including public records, social media, and proprietary databases. We continuously update our data sources to ensure the highest possible accuracy."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won't be charged again."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-level encryption to protect your data and comply with all relevant privacy regulations including GDPR. Your information is never shared with third parties without your explicit consent."
    },
    {
      question: "How do I contact cash buyers?",
      answer: "You can contact cash buyers directly through our secure messaging system. Simply find buyers whose criteria match your properties and send them a message. All communications are tracked and secure."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through Stripe."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial."
    }
  ]

  const supportOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      availability: "24/7",
      responseTime: "< 5 minutes"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: FileText,
      availability: "24/7",
      responseTime: "< 2 hours"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      icon: Video,
      availability: "Always available",
      responseTime: "Instant"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our team",
      icon: MessageCircle,
      availability: "Mon-Fri 9AM-6PM EST",
      responseTime: "Immediate"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Help Center
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Find answers to your questions and get the support you need to succeed with Revara.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search for help articles, guides, or FAQs..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Topics
          </h2>
          <p className="text-xl text-gray-600">
            Start here for the most common questions and guides
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="shadow-lg border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <div className={`p-2 rounded-lg ${category.color} text-white mr-3`}>
                    <category.icon className="w-5 h-5" />
                  </div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex} className="flex items-center text-sm text-gray-600 hover:text-purple-600 cursor-pointer">
                      <ChevronRight className="w-4 h-4 mr-2" />
                      {article}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Support Options */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Support
            </h2>
            <p className="text-xl text-gray-600">
              Choose the support option that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <Card key={index} className="text-center shadow-lg border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <option.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">{option.availability}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-gray-600">{option.responseTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Quick answers to the most common questions
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="shadow-lg border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Still Need Help?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Our support team is here to help you succeed. Contact us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
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
  )
}
