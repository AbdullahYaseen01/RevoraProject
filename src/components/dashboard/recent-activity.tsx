import Link from "next/link"
import { MapPin, DollarSign, Clock, CheckCircle } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "property_found",
    description: "Found distressed property at 123 Oak Street",
    location: "Atlanta, GA",
    time: "2 hours ago",
    value: "$185,000",
    status: "contact_owner",
    icon: MapPin,
    color: "text-blue-600",
  },
  {
    id: 2,
    type: "contact_success",
    description: "Successfully contacted property owner",
    location: "456 Maple Ave, Dallas, TX",
    time: "4 hours ago",
    value: "$220,000",
    status: "waiting_response",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "cash_buyer_match",
    description: "Matched with verified cash buyer",
    location: "789 Pine Street",
    time: "1 day ago",
    value: "$165,000",
    status: "negotiating",
    icon: DollarSign,
    color: "text-purple-600",
  },
  {
    id: 4,
    type: "contract_generated",
    description: "Generated purchase agreement",
    location: "321 Elm Street",
    time: "2 days ago",
    value: "$195,000",
    status: "pending_signature",
    icon: Clock,
    color: "text-orange-600",
  },
]

const statusStyles = {
  contact_owner: "bg-blue-100 text-blue-800",
  waiting_response: "bg-yellow-100 text-yellow-800",
  negotiating: "bg-purple-100 text-purple-800",
  pending_signature: "bg-orange-100 text-orange-800",
}

export default function RecentActivity() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <Link
            href="/dashboard/activity"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${activity.color}`}
                      >
                        <activity.icon className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.location}</p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap">
                        <p className="text-gray-900 font-medium">{activity.value}</p>
                        <p className="text-gray-500">{activity.time}</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[activity.status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"}`}
                        >
                          {activity.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
