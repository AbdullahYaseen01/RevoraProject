"use client";

import { Search, UserPlus, FileText, DollarSign } from "lucide-react";

const actions = [
  {
    name: "Find Properties",
    icon: Search,
    href: "/dashboard/properties/search",
    color: "bg-blue-500",
  },
  {
    name: "Add Cash Buyer",
    icon: UserPlus,
    href: "/dashboard/buyers/new",
    color: "bg-green-500",
  },
  {
    name: "Generate Contract",
    icon: FileText,
    href: "/dashboard/contracts/new",
    color: "bg-purple-500",
  },
  {
    name: "View Earnings",
    icon: DollarSign,
    href: "/dashboard/earnings",
    color: "bg-yellow-500",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.name}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className={`${action.color} p-2 rounded-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-700">{action.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
