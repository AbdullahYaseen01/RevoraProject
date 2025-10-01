"use client";

import { TrendingUp, Users, FileText, DollarSign } from "lucide-react";

const stats = [
  {
    name: "Active Properties",
    value: "24",
    change: "+12%",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "Cash Buyers",
    value: "156",
    change: "+8%",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    name: "Contracts",
    value: "42",
    change: "+23%",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    name: "Total Earnings",
    value: "$12.5K",
    change: "+15%",
    icon: DollarSign,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-sm font-medium text-green-600">
                {stat.change}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600">{stat.name}</p>
          </div>
        );
      })}
    </div>
  );
}
