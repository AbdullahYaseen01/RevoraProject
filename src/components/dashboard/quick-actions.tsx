import Link from "next/link"
import { Search, Map, Users, FileText, Zap } from "lucide-react"

const actions = [
  {
    name: "Search Properties",
    description: "Find distressed properties",
    href: "/dashboard/search",
    icon: Search,
    color: "bg-blue-500",
  },
  {
    name: "View Map",
    description: "Interactive property map",
    href: "/dashboard/map",
    icon: Map,
    color: "bg-green-500",
  },
  {
    name: "Cash Buyers",
    description: "Browse verified buyers",
    href: "/dashboard/buyers",
    icon: Users,
    color: "bg-purple-500",
  },
  {
    name: "Generate Contract",
    description: "Create legal documents",
    href: "/dashboard/contracts",
    icon: FileText,
    color: "bg-orange-500",
  },
  {
    name: "Skip Trace",
    description: "Find property owners",
    href: "/dashboard/trace",
    icon: Zap,
    color: "bg-red-500",
  },
]

export default function QuickActions() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors"
            >
              <span className={`${action.color} flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center`}>
                <action.icon className="h-5 w-5 text-white" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{action.name}</p>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
