import { notFound } from "next/navigation"

async function getBuyer(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/cash-buyers/${id}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed')
  const data = await res.json()
  return data.buyer
}

export default async function CashBuyerDetails({ params }: { params: { id: string } }) {
  const buyer = await getBuyer(params.id)
  if (!buyer) return notFound()
  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{buyer.profile?.legalName || buyer.email}</h1>
        <div className="text-gray-600">Markets: {(buyer.profile?.marketsOfInterest||[]).join(', ') || '—'}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="border rounded p-4">
          <div className="font-medium mb-2">Contact</div>
          <form action="/api/contact-cash-buyer" method="post" className="space-y-2">
            <input type="hidden" name="buyerId" value={buyer.id} />
            <button className="bg-black text-white rounded px-4 py-2">Skiptrace Buyer</button>
          </form>
        </section>
        <section className="border rounded p-4">
          <div className="font-medium mb-2">Criteria</div>
          <pre className="bg-gray-50 p-3 rounded overflow-auto text-sm">{JSON.stringify(buyer.cashBuyerProfile?.investmentCriteria || {}, null, 2)}</pre>
        </section>
      </div>
      <section className="space-y-2">
        <div className="font-medium">Full Profile</div>
        <pre className="bg-gray-50 p-3 rounded overflow-auto text-sm">{JSON.stringify(buyer, null, 2)}</pre>
      </section>
    </div>
  )
}


