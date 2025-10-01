"use client";

import { Clock } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

const sampleActivities: Activity[] = [
  {
    id: "1",
    type: "property",
    description: "New property added: 123 Main St",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "buyer",
    description: "Cash buyer verified: John Smith",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    type: "contract",
    description: "Contract generated for 456 Oak Ave",
    timestamp: "1 day ago",
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>

      <div className="space-y-4">
        {sampleActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
