"use client"
import { useState } from "react"

export default function CashBuyerSignup() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  async function submit(path: string, payload: any) {
    setLoading(true)
    const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setLoading(false)
    if (!res.ok) alert('Failed')
    else setStep(step + 1)
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Cash Buyer Sign Up</h1>
      <div className="text-sm text-gray-600">Step {step} of 6</div>

      {step === 1 && (
        <section className="border rounded p-4 space-y-2 max-w-xl">
          <div className="font-medium">Buyer Profile (Basics)</div>
          <form onSubmit={(e)=>{e.preventDefault(); const f = e.target as HTMLFormElement; submit('/api/cash-buyers/profile', { legalName: (f.legalName as any).value, businessEntity: (f.businessEntity as any).value, companyName: (f.companyName as any).value, mailingAddress: (f.mailingAddress as any).value, marketsOfInterest: (f.markets as any).value.split(',').map((s:string)=>s.trim()).filter(Boolean), contactPreferences: (f.prefs as any).value.split(',').map((s:string)=>s.trim()).filter(Boolean) })}}>
            <input name="legalName" placeholder="Legal name" className="border rounded px-3 py-2 w-full mb-2" />
            <input name="businessEntity" placeholder="Business entity" className="border rounded px-3 py-2 w-full mb-2" />
            <input name="companyName" placeholder="Company name" className="border rounded px-3 py-2 w-full mb-2" />
            <input name="mailingAddress" placeholder="Mailing address" className="border rounded px-3 py-2 w-full mb-2" />
            <input name="markets" placeholder="Markets of interest (comma separated)" className="border rounded px-3 py-2 w-full mb-2" />
            <input name="prefs" placeholder="Contact preferences (call,text,email)" className="border rounded px-3 py-2 w-full mb-2" />
            <button disabled={loading} className="bg-black text-white rounded px-4 py-2">{loading?"Saving...":"Continue"}</button>
          </form>
        </section>
      )}

      {step === 2 && (
        <section className="border rounded p-4 space-y-2 max-w-xl">
          <div className="font-medium">Investment Criteria</div>
          <form onSubmit={(e)=>{e.preventDefault(); const f = e.target as HTMLFormElement; submit('/api/cash-buyers/criteria', { investmentCriteria: { priceRange: (f.priceRange as any).value, propertyTypes: (f.types as any).value.split(',').map((s:string)=>s.trim()).filter(Boolean), beds: (f.beds as any).value, baths: (f.baths as any).value, rehabLevel: (f.rehab as any).value, strategy: (f.strategy as any).value } })}}>
            <input name="priceRange" placeholder="Price range" className="border rounded px-3 py-2 w-full mb-2" />
            <input name="types" placeholder="Property types (comma separated)" className="border rounded px-3 py-2 w-full mb-2" />
            <input name="beds" placeholder="Beds" className="border rounded px-3 py-2 w-full mb-2" />
            <input name="baths" placeholder="Baths" className="border rounded px-3 py-2 w-full mb-2" />
            <input name="rehab" placeholder="Rehab level" className="border rounded px-3 py-2 w-full mb-2" />
            <input name="strategy" placeholder="Hold vs flip" className="border rounded px-3 py-2 w-full mb-2" />
            <button disabled={loading} className="bg-black text-white rounded px-4 py-2">{loading?"Saving...":"Continue"}</button>
          </form>
        </section>
      )}

      {step === 3 && (
        <section className="border rounded p-4 space-y-2 max-w-xl">
          <div className="font-medium">Identity Verification (KYC)</div>
          <button onClick={()=>submit('/api/cash-buyers/kyc', { method: 'manual', passed: true })} disabled={loading} className="bg-black text-white rounded px-4 py-2">{loading?"Submitting...":"Mark KYC Passed (stub)"}</button>
        </section>
      )}

      {step === 4 && (
        <section className="border rounded p-4 space-y-2 max-w-xl">
          <div className="font-medium">Entity Verification</div>
          <button onClick={()=>submit('/api/cash-buyers/entity', { entityVerified: true })} disabled={loading} className="bg-black text-white rounded px-4 py-2">{loading?"Submitting...":"Mark Entity Verified (stub)"}</button>
        </section>
      )}

      {step === 5 && (
        <section className="border rounded p-4 space-y-2 max-w-xl">
          <div className="font-medium">Proof of Funds</div>
          <form onSubmit={(e)=>{e.preventDefault(); const f = e.target as HTMLFormElement; submit('/api/cash-buyers/pof', { verifiedAmountRange: (f.range as any).value })}}>
            <input name="range" placeholder="$100k–$250k" className="border rounded px-3 py-2 w-full mb-2" />
            <button disabled={loading} className="bg-black text-white rounded px-4 py-2">{loading?"Saving...":"Continue"}</button>
          </form>
        </section>
      )}

      {step === 6 && (
        <section className="border rounded p-4 space-y-2 max-w-xl">
          <div className="font-medium">Deal History (Optional)</div>
          <button onClick={()=>submit('/api/cash-buyers/deal-history', { dealHistory: { purchasesLast12m: 0 } })} disabled={loading} className="bg-black text-white rounded px-4 py-2">{loading?"Submitting...":"Finish"}</button>
        </section>
      )}
    </div>
  )
}


