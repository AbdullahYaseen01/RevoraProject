import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  User, 
  ArrowRight, 
  TrendingUp,
  BookOpen,
  Tag
} from 'lucide-react'

export default function BlogPage() {
  const posts = [
    {
      title: "10 Essential Tips for Real Estate Wholesaling Success",
      excerpt: "Learn the fundamental strategies that successful wholesalers use to find deals, negotiate contracts, and close transactions faster.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "Wholesaling",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=300&fit=crop"
    },
    {
      title: "How to Build a Network of Cash Buyers in 2024",
      excerpt: "Discover proven methods for finding and building relationships with verified cash buyers who can close deals quickly.",
      author: "Michael Chen",
      date: "2024-01-12",
      category: "Networking",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=300&fit=crop"
    },
    {
      title: "Skip Tracing Best Practices: Legal and Ethical Guidelines",
      excerpt: "Navigate the complex world of skip tracing while staying compliant with TCPA and other regulations.",
      author: "Emily Rodriguez",
      date: "2024-01-10",
      category: "Skip Tracing",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=300&fit=crop"
    },
    {
      title: "Market Analysis: Top 10 Cities for Real Estate Investment",
      excerpt: "Our comprehensive analysis of the best markets for real estate investment based on growth potential and rental yields.",
      author: "David Thompson",
      date: "2024-01-08",
      category: "Market Analysis",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=300&fit=crop"
    },
    {
      title: "Digital Contracts: The Future of Real Estate Transactions",
      excerpt: "Explore how digital contracts and e-signatures are revolutionizing real estate transactions and what it means for investors.",
      author: "Lisa Wang",
      date: "2024-01-05",
      category: "Technology",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop"
    },
    {
      title: "Tax Strategies for Real Estate Investors: 2024 Guide",
      excerpt: "Maximize your returns with these essential tax strategies and deductions available to real estate investors.",
      author: "Robert Martinez",
      date: "2024-01-03",
      category: "Taxes",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=300&fit=crop"
    }
  ]

  const categories = [
    "All Posts", "Wholesaling", "Networking", "Skip Tracing", "Market Analysis", "Technology", "Taxes", "Legal"
  ]

  const featuredPost = posts[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Revara Blog
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Expert insights, tips, and strategies to help you succeed in real estate investing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#featured" 
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Read Latest
              </a>
              <a 
                href="/auth/signup" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Subscribe
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category, index) => (
            <Badge 
              key={index} 
              variant={index === 0 ? "default" : "outline"}
              className="px-4 py-2 cursor-pointer hover:bg-purple-100 hover:text-purple-800"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      <div id="featured" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Article
          </h2>
        </div>

        <Card className="shadow-xl border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-64 lg:h-auto">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-purple-100 text-purple-800">{featuredPost.category}</Badge>
                <span className="text-gray-500 text-sm">{featuredPost.readTime}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
              <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-2" />
                  <span>{featuredPost.author}</span>
                  <Calendar className="w-4 h-4 ml-4 mr-2" />
                  <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                </div>
                <a 
                  href="#" 
                  className="flex items-center text-purple-600 font-semibold hover:text-purple-700"
                >
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Articles
          </h2>
          <p className="text-xl text-gray-600">
            Stay updated with the latest trends and strategies in real estate investing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post, index) => (
            <Card key={index} className="shadow-lg border-gray-200 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="h-48">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">{post.category}</Badge>
                  <span className="text-gray-500 text-xs">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <User className="w-3 h-3 mr-1" />
                    <span>{post.author}</span>
                    <Calendar className="w-3 h-3 ml-2 mr-1" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <a 
                    href="#" 
                    className="flex items-center text-purple-600 font-semibold text-sm hover:text-purple-700"
                  >
                    Read <ArrowRight className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Get the latest real estate investing tips and market insights delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-purple-200 text-sm mt-2">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
