import { notFound } from "next/navigation"
import { getPropertyById } from "@/lib/rentcast"

type Props = { params: { id: string } }

export default async function PropertyDetails({ params }: Props) {
  const data = await getPropertyById(params.id)
  if (!data) return notFound()

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{data.address}</h1>
        <div className="text-gray-600">{data.city}, {data.state} {data.zipCode}</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Beds" value={data.beds ?? '-'} />
        <Stat label="Baths" value={data.baths ?? '-'} />
        <Stat label="Sq Ft" value={data.squareFeet ?? '-'} />
        <Stat label="Year Built" value={data.yearBuilt ?? '-'} />
        <Stat label="Last Sale Price" value={data.lastSalePrice ? `$${Math.round(data.lastSalePrice).toLocaleString()}` : 'N/A'} />
        <Stat label="Type" value={data.propertyType ?? '-'} />
      </div>
      <form action={`/api/contact-owner`} method="post" className="border rounded p-4 space-y-2 max-w-md">
        <input type="hidden" name="propertyId" value={params.id} />
        <div className="font-medium">Contact Owner</div>
        <p className="text-sm text-gray-600">Skiptrace costs $0.10. We only charge if contact info is found.</p>
        <button className="bg-black text-white rounded px-4 py-2">Skiptrace Owner</button>
      </form>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">All Data</h2>
        <pre className="bg-gray-50 p-3 rounded overflow-auto text-sm">{JSON.stringify(data, null, 2)}</pre>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="border rounded p-3">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="text-lg">{value}</div>
    </div>
  )
}


