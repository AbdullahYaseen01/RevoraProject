import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"

async function getBuyer(id: string) {
  try {
    const buyer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        profile: true,
        cashBuyerProfile: true,
        createdAt: true,
      }
    })
    return buyer
  } catch (error) {
    console.error('Error fetching buyer:', error)
    return null
  }
}

export default async function CashBuyerDetails({ params }: { params: { id: string } }) {
  const buyer = await getBuyer(params.id)
  if (!buyer) return notFound()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {buyer.profile?.legalName || buyer.profile?.companyName || 'Cash Buyer'}
            </h1>
            <p className="text-gray-600">{buyer.email}</p>
            {buyer.profile?.mailingAddress && (
              <p className="text-gray-600">📍 {buyer.profile.mailingAddress}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <p><strong>Email:</strong> {buyer.email}</p>
                <p><strong>Phone:</strong> {buyer.phone || 'Not provided'}</p>
                <p><strong>Member since:</strong> {new Date(buyer.createdAt).toLocaleDateString()}</p>
              </div>
              
              <form action="/api/contact-cash-buyer" method="post" className="mt-4">
                <input type="hidden" name="buyerId" value={buyer.id} />
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors duration-200"
                >
                  Contact This Buyer
                </button>
              </form>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Criteria</h3>
              {buyer.cashBuyerProfile?.investmentCriteria ? (
                <div className="space-y-2">
                  <p><strong>Property Types:</strong> {buyer.cashBuyerProfile.investmentCriteria.propertyTypes?.join(', ') || 'Not specified'}</p>
                  <p><strong>Price Range:</strong> {buyer.cashBuyerProfile.verifiedAmountRange || 'Not specified'}</p>
                  <p><strong>Status:</strong> {buyer.cashBuyerProfile.verificationStatus || 'PENDING'}</p>
                </div>
              ) : (
                <p className="text-gray-600">No investment criteria specified</p>
              )}
            </div>
          </div>

          {buyer.profile?.marketsOfInterest && buyer.profile.marketsOfInterest.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Markets of Interest</h3>
              <div className="flex flex-wrap gap-2">
                {buyer.profile.marketsOfInterest.map((market, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {market}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Full Profile Data</h3>
            <pre className="bg-white p-4 rounded border overflow-auto text-sm text-gray-700">
              {JSON.stringify(buyer, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}


