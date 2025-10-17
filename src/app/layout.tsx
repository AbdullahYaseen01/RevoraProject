import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import AuthSessionProvider from "@/components/providers/session-provider";
import Footer from "@/components/ui/Footer";
import MobileMenu from "@/components/ui/MobileMenu";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Revara - Real Estate Investment Platform",
  description: "Find distressed properties, connect with verified cash buyers, and close deals faster. The complete platform for real estate investors and wholesalers.",
  keywords: "real estate, investment, wholesaling, cash buyers, distressed properties, skip tracing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Revara
              </Link>
              <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                <Link href="/properties" className="text-gray-700 hover:text-purple-600 transition-colors">Properties</Link>
                <Link href="/cash-buyers" className="text-gray-700 hover:text-purple-600 transition-colors">Cash Buyers</Link>
                <Link href="/pricing" className="text-gray-700 hover:text-purple-600 transition-colors">Pricing</Link>
                <Link href="/affiliate" className="text-gray-700 hover:text-purple-600 transition-colors">Affiliate Program</Link>
              </nav>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-4">
                  <Link href="/auth/signin" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                    Get Started
                  </Link>
                </div>
                <MobileMenu />
              </div>
            </div>
          </header>
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
