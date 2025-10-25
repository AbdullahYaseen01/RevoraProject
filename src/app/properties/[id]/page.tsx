import { notFound } from "next/navigation"
import { getPropertyById } from "@/lib/rentcast"

type Props = { params: Promise<{ id: string }> }

export default async function PropertyDetails({ params }: Props) {
  const { id } = await params
  const data = await getPropertyById(id)
  if (!data) return notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.address || 'Property Details'}</h1>
            <div className="text-lg text-gray-700">{data.city}, {data.state} {data.zipCode}</div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Stat label="Beds" value={data.beds ?? '-'} />
            <Stat label="Baths" value={data.baths ?? '-'} />
            <Stat label="Sq Ft" value={data.squareFeet ?? '-'} />
            <Stat label="Year Built" value={data.yearBuilt ?? '-'} />
            <Stat label="Last Sale Price" value={data.lastSalePrice ? `$${Math.round(data.lastSalePrice).toLocaleString()}` : 'N/A'} />
            <Stat label="Type" value={data.propertyType ?? '-'} />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Contact Owner</h2>
            <form action={`/api/contact-owner`} method="post" className="space-y-3">
              <input type="hidden" name="propertyId" value={id} />
              <p className="text-blue-800">Skiptrace costs $0.10. We only charge if contact info is found.</p>
              <button className="bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors font-medium">
                Skiptrace Owner
              </button>
            </form>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Data</h2>
            <pre className="bg-white p-4 rounded border overflow-auto text-sm text-gray-700 max-h-96">{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-1">{label}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </div>
  )
}


