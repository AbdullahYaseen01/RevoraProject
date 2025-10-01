import { Search, Users, DollarSign, TrendingUp } from "lucide-react"

const stats = [
  {
    name: "Properties Found",
    stat: "247",
    previousStat: "198",
    change: "24%",
    changeType: "increase",
    icon: Search,
  },
  {
    name: "Cash Buyers",
    stat: "89",
    previousStat: "73",
    change: "22%",
    changeType: "increase",
    icon: Users,
  },
  {
    name: "Potential Value",
    stat: "$2.4M",
    previousStat: "$1.8M",
    change: "33%",
    changeType: "increase",
    icon: DollarSign,
  },
  {
    name: "Conversion Rate",
    stat: "12.5%",
    previousStat: "10.2%",
    change: "22%",
    changeType: "increase",
    icon: TrendingUp,
  },
]

export default function StatsCards() {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Overview</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline">
                <div className="flex-shrink-0">
                  <span
                    className={`text-xs font-semibold ${
                      item.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">from last month</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
