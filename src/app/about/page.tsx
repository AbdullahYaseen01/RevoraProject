import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Target, 
  Award, 
  TrendingUp, 
  Heart, 
  Lightbulb,
  Shield,
  Globe,
  CheckCircle,
  Star
} from 'lucide-react'

export default function AboutPage() {
  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former real estate investor with 15+ years experience. Built and sold 3 successful real estate companies.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Tech veteran with expertise in real estate technology. Previously led engineering teams at Zillow and Redfin.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      bio: "Product strategist focused on user experience. Passionate about making complex real estate processes simple.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "David Thompson",
      role: "Head of Sales",
      bio: "Sales leader with deep real estate industry connections. Helps investors maximize their deal flow.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    }
  ]

  const values = [
    {
      icon: Target,
      title: "Results-Driven",
      description: "We focus on delivering measurable results that help our users close more deals and increase their profits."
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "Every feature we build is designed with our users' needs in mind. We listen, learn, and iterate based on feedback."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We constantly push the boundaries of what's possible in real estate technology to give our users a competitive edge."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We protect our users' data with enterprise-grade security and maintain the highest standards of privacy and compliance."
    }
  ]

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "$2.5B+", label: "Deals Facilitated" },
    { number: "50+", label: "Cities Covered" },
    { number: "99.9%", label: "Uptime" }
  ]

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Revara was founded with a vision to revolutionize real estate investing through technology."
    },
    {
      year: "2021",
      title: "First 1,000 Users",
      description: "Reached our first major milestone with 1,000 active users across 10 major markets."
    },
    {
      year: "2022",
      title: "Series A Funding",
      description: "Raised $15M in Series A funding to accelerate product development and market expansion."
    },
    {
      year: "2023",
      title: "Platform Launch",
      description: "Launched our comprehensive platform with advanced features for property search and buyer matching."
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Integrated AI-powered features for property analysis and predictive market insights."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Revara
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              We're on a mission to democratize real estate investing by providing powerful tools that help everyone find deals, connect with buyers, and build wealth through real estate.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Real estate investing shouldn't be limited to those with extensive networks or deep pockets. 
              We believe that with the right tools and information, anyone can succeed in real estate investing.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Revara levels the playing field by providing access to the same data, tools, and networks 
              that professional investors use, making it possible for newcomers and experienced investors 
              alike to find profitable deals and build lasting wealth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/auth/signup" 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
              >
                Join Our Mission
              </a>
              <a 
                href="/contact" 
                className="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-colors text-center"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                  <div className="text-gray-700 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape how we build products and serve our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center shadow-lg border-gray-200 hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're a diverse team of real estate experts, technologists, and entrepreneurs 
            united by our passion for making real estate investing accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="text-center shadow-lg border-gray-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              From startup to industry leader, here's how we've grown and evolved.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {milestone.year}
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Become part of a growing community of successful real estate investors who trust Revara to power their success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/auth/signup" 
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Journey
            </a>
            <a 
              href="/careers" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Join Our Team
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
