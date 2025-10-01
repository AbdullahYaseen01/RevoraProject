"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Map,
  Users,
  CreditCard,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  BarChart3,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Property Search", href: "/dashboard/search", icon: Search },
  { name: "Map View", href: "/dashboard/map", icon: Map },
  { name: "Cash Buyers", href: "/dashboard/buyers", icon: Users },
];

export default function DashboardNav() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
                Revara
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
                  >
                    <Icon className="mr-2" size={16} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {/* Notifications */}
            <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Bell className="h-6 w-6" />
            </button>

            {/* User menu */}
            <div className="relative group">
              <div className="flex items-center space-x-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session?.user?.email}
                  </p>
                </div>
                <button className="flex-shrink-0 bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {session?.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
              </div>

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="mr-3" size={16} />
                  Settings
                </Link>
                <Link
                  href="/dashboard/subscription"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <CreditCard className="mr-3" size={16} />
                  Subscription
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-3" size={16} />
                  Sign out
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="mr-3" size={16} />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => {
                signOut();
                setMobileMenuOpen(false);
              }}
              className="flex items-center w-full pl-3 pr-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              <LogOut className="mr-3" size={16} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
