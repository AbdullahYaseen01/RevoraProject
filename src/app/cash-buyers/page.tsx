"use client"
import { useEffect, useMemo, useState } from "react"
import { Check, MapPin, Mail, Phone, ShieldCheck, Search, Users } from "lucide-react"

export default function CashBuyersPage() {
  const [city, setCity] = useState("")
  const [zip, setZip] = useState("")
  const [address, setAddress] = useState("")
  const [verifiedOnly, setVerifiedOnly] = useState(true)
  const [loading, setLoading] = useState(false)
  const [buyers, setBuyers] = useState<any[]>([])

  const hasFilters = useMemo(() => city || zip || address, [city, zip, address])

  async function onSearch(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    try {
    const params = new URLSearchParams()
    if (city) params.set("city", city)
    if (zip) params.set("zip", zip)
    if (address) params.set("address", address)
      let url = `/api/cash-buyers/search?${params.toString()}`
      if (verifiedOnly) {
        const vParams = new URLSearchParams()
        if (city) vParams.set('market', city)
        if (address) vParams.set('q', address)
        url = `/api/cash-buyers/verified?${vParams.toString()}`
      }
      const res = await fetch(url)
    const data = await res.json()
    setBuyers(data.results || [])
    } finally {
    setLoading(false)
  }
  }

  useEffect(() => {
    onSearch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-semibold text-purple-600">Verified Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Connect with Pre‑Verified Cash Buyers</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">Find active investors ready to close quickly. Filter by market and instantly view their buying criteria and contact info.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={onSearch} className="bg-white rounded-xl border shadow-sm p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="relative lg:col-span-2">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City or market" className="w-full pl-9 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <input value={zip} onChange={e=>setZip(e.target.value)} placeholder="Zip" className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none" />
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address or keyword" className="w-full pl-9 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="accent-purple-600" checked={verifiedOnly} onChange={e=>setVerifiedOnly(e.target.checked)} />
              Verified only
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </label>
            <button disabled={loading} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-60">
              {loading?"Searching...":"Search"}
            </button>
          </div>
      </form>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {!loading && buyers.length === 0 && (
          <div className="bg-white border rounded-xl p-10 text-center text-slate-600">{hasFilters ? "No buyers match your filters yet." : "Loading network..."}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border rounded-xl p-5 animate-pulse">
                <div className="h-5 w-40 bg-slate-200 rounded mb-3" />
                <div className="h-4 w-24 bg-slate-200 rounded mb-6" />
                <div className="space-y-2">
                  <div className="h-3 w-3/4 bg-slate-200 rounded" />
                  <div className="h-3 w-2/3 bg-slate-200 rounded" />
                  <div className="h-3 w-1/2 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyers.map((b) => (
              <a href={`/cash-buyers/${b.id}`} key={b.id} className="group bg-white border rounded-xl p-5 hover:shadow-lg transition-base block">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{b.profile?.legalName || b.email}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{(b.profile?.marketsOfInterest||[]).slice(0,2).join(', ') || 'Any market'}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${b.cashBuyerProfile?.verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    <ShieldCheck className="w-3 h-3" />
                    {b.cashBuyerProfile?.verificationStatus || 'PENDING'}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Active buyer</div>
                  {b.phone && (<div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" /> {b.phone}</div>)}
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> {b.email}</div>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">Criteria</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">History</span>
                </div>
                <div className="mt-5">
                  <span className="inline-block text-purple-600 group-hover:translate-x-0.5 transition-transform">View profile →</span>
                </div>
          </a>
        ))}
          </div>
        )}
      </div>
    </div>
  )
}


