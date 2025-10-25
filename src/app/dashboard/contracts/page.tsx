"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, FileText, Download, Eye, Edit, Plus, Search, Filter, Calendar, DollarSign, User, Building } from 'lucide-react'

interface Contract {
  id: string
  title: string
  type: 'Purchase Agreement' | 'Lease Agreement' | 'Service Contract' | 'NDA' | 'Other'
  status: 'Draft' | 'Pending' | 'Active' | 'Completed' | 'Cancelled'
  clientName: string
  propertyAddress: string
  amount: number
  startDate: string
  endDate: string
  createdAt: string
  lastModified: string
}

export default function ContractsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterType, setFilterType] = useState('ALL')

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    // Simulate loading contracts
    const loadContracts = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock contracts data
      const mockContracts: Contract[] = [
        {
          id: '1',
          title: 'Property Purchase Agreement - 123 Main St',
          type: 'Purchase Agreement',
          status: 'Active',
          clientName: 'John Smith',
          propertyAddress: '123 Main Street, Miami, FL 33125',
          amount: 450000,
          startDate: '2024-01-15',
          endDate: '2024-03-15',
          createdAt: '2024-01-10',
          lastModified: '2024-01-20'
        },
        {
          id: '2',
          title: 'Commercial Lease Agreement - Office Building',
          type: 'Lease Agreement',
          status: 'Pending',
          clientName: 'Maria Garcia',
          propertyAddress: '456 Business Ave, Miami, FL 33126',
          amount: 5000,
          startDate: '2024-02-01',
          endDate: '2025-01-31',
          createdAt: '2024-01-25',
          lastModified: '2024-01-28'
        },
        {
          id: '3',
          title: 'Property Management Service Contract',
          type: 'Service Contract',
          status: 'Draft',
          clientName: 'Robert Johnson',
          propertyAddress: '789 Residential Blvd, Miami, FL 33127',
          amount: 1200,
          startDate: '2024-03-01',
          endDate: '2024-12-31',
          createdAt: '2024-01-30',
          lastModified: '2024-01-30'
        },
        {
          id: '4',
          title: 'Non-Disclosure Agreement - Investment Deal',
          type: 'NDA',
          status: 'Completed',
          clientName: 'Sarah Wilson',
          propertyAddress: '321 Investment St, Miami, FL 33128',
          amount: 0,
          startDate: '2023-12-01',
          endDate: '2024-01-31',
          createdAt: '2023-11-25',
          lastModified: '2024-01-31'
        }
      ]
      
      setContracts(mockContracts)
      setIsLoading(false)
    }

    loadContracts()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Draft': return 'bg-blue-100 text-blue-800'
      case 'Completed': return 'bg-gray-100 text-gray-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Purchase Agreement': return 'bg-purple-100 text-purple-800'
      case 'Lease Agreement': return 'bg-blue-100 text-blue-800'
      case 'Service Contract': return 'bg-green-100 text-green-800'
      case 'NDA': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'ALL' || contract.status === filterStatus
    const matchesType = filterType === 'ALL' || contract.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleCreateContract = () => {
    // Create a new contract creation modal
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Create New Contract</h2>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <form id="createContractForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contract Title *</label>
              <input type="text" id="newContractTitle" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Property Purchase Agreement - 123 Main St">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
              <input type="text" id="newClientName" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., John Smith">
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contract Type *</label>
              <select id="newContractType" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select contract type</option>
                <option value="Purchase Agreement">Purchase Agreement</option>
                <option value="Lease Agreement">Lease Agreement</option>
                <option value="Service Contract">Service Contract</option>
                <option value="NDA">Non-Disclosure Agreement</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select id="newContractStatus" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select status</option>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contract Amount</label>
              <input type="number" id="newContractAmount" min="0" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="0.00">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Property Address *</label>
              <textarea id="newPropertyAddress" required rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 123 Main Street, Miami, FL 33125"></textarea>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input type="date" id="newStartDate" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input type="date" id="newEndDate" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-blue-900 mb-2">Contract Terms & Conditions</h3>
            <textarea id="newContractTerms" rows="4" class="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Enter contract terms, conditions, and special clauses..."></textarea>
          </div>
          
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Additional Notes</h3>
            <textarea id="newContractNotes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Any additional notes or comments..."></textarea>
          </div>
        </form>
        
        <div class="mt-8 flex justify-end space-x-3">
          <button onclick="this.closest('.fixed').remove()" class="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onclick="handleSaveNewContract()" class="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Create Contract</button>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Set default dates
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    
    const startDateInput = modal.querySelector('#newStartDate') as HTMLInputElement
    const endDateInput = modal.querySelector('#newEndDate') as HTMLInputElement
    
    if (startDateInput) startDateInput.value = today.toISOString().split('T')[0]
    if (endDateInput) endDateInput.value = nextMonth.toISOString().split('T')[0]
    
    // Add global function for save button
    ;(window as any).handleSaveNewContract = () => {
      const form = document.getElementById('createContractForm') as HTMLFormElement
      if (!form) return
      
      // Get form values
      const title = (document.getElementById('newContractTitle') as HTMLInputElement)?.value
      const clientName = (document.getElementById('newClientName') as HTMLInputElement)?.value
      const type = (document.getElementById('newContractType') as HTMLSelectElement)?.value
      const status = (document.getElementById('newContractStatus') as HTMLSelectElement)?.value
      const amount = parseInt((document.getElementById('newContractAmount') as HTMLInputElement)?.value || '0')
      const propertyAddress = (document.getElementById('newPropertyAddress') as HTMLTextAreaElement)?.value
      const startDate = (document.getElementById('newStartDate') as HTMLInputElement)?.value
      const endDate = (document.getElementById('newEndDate') as HTMLInputElement)?.value
      const terms = (document.getElementById('newContractTerms') as HTMLTextAreaElement)?.value
      const notes = (document.getElementById('newContractNotes') as HTMLTextAreaElement)?.value
      
      // Validate required fields
      if (!title || !clientName || !type || !status || !propertyAddress || !startDate || !endDate) {
        alert('Please fill in all required fields (marked with *)')
        return
      }
      
      // Validate dates
      if (new Date(startDate) >= new Date(endDate)) {
        alert('End date must be after start date')
        return
      }
      
      // Create new contract
      const newContract: Contract = {
        id: `contract-${Date.now()}`, // Generate unique ID
        title: title.trim(),
        type: type as Contract['type'],
        status: status as Contract['status'],
        clientName: clientName.trim(),
        propertyAddress: propertyAddress.trim(),
        amount: amount,
        startDate: startDate,
        endDate: endDate,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
      
      // Add to contracts list
      setContracts(prev => [newContract, ...prev]) // Add to beginning of list
      
      // Close modal
      modal.remove()
      
      // Show success message
      const successDiv = document.createElement('div')
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50'
      successDiv.textContent = 'Contract created successfully!'
      document.body.appendChild(successDiv)
      setTimeout(() => document.body.removeChild(successDiv), 3000)
      
      // Optional: Show contract details
      setTimeout(() => {
        handleViewContract(newContract.id)
      }, 1000)
    }
  }

  const handleViewContract = (contractId: string) => {
    // Find the contract details
    const contract = contracts.find(c => c.id === contractId)
    if (!contract) {
      alert('Contract not found')
      return
    }

    // Create a modal or navigate to contract details
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-900">${contract.title}</h2>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Client Name</label>
              <p class="mt-1 text-sm text-gray-900">${contract.clientName}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}">${contract.status}</span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Type</label>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(contract.type)}">${contract.type}</span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Amount</label>
              <p class="mt-1 text-sm text-gray-900">$${contract.amount.toLocaleString()}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Property Address</label>
            <p class="mt-1 text-sm text-gray-900">${contract.propertyAddress}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Start Date</label>
              <p class="mt-1 text-sm text-gray-900">${new Date(contract.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">End Date</label>
              <p class="mt-1 text-sm text-gray-900">${new Date(contract.endDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Created</label>
              <p class="mt-1 text-sm text-gray-900">${new Date(contract.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Modified</label>
              <p class="mt-1 text-sm text-gray-900">${new Date(contract.lastModified).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Close</button>
          <button onclick="handleEditContractFromModal('${contractId}')" class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Edit Contract</button>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Add global function for edit button in modal
    ;(window as any).handleEditContractFromModal = (id: string) => {
      modal.remove()
      handleEditContract(id)
    }
  }

  const handleEditContract = (contractId: string) => {
    // Find the contract details
    const contract = contracts.find(c => c.id === contractId)
    if (!contract) {
      alert('Contract not found')
      return
    }

    // Create an edit modal
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-900">Edit Contract</h2>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <form id="editContractForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Contract Title</label>
            <input type="text" id="contractTitle" value="${contract.title}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Client Name</label>
              <input type="text" id="clientName" value="${contract.clientName}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select id="contractStatus" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="Draft" ${contract.status === 'Draft' ? 'selected' : ''}>Draft</option>
                <option value="Pending" ${contract.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Active" ${contract.status === 'Active' ? 'selected' : ''}>Active</option>
                <option value="Completed" ${contract.status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Cancelled" ${contract.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Type</label>
              <select id="contractType" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="Purchase Agreement" ${contract.type === 'Purchase Agreement' ? 'selected' : ''}>Purchase Agreement</option>
                <option value="Lease Agreement" ${contract.type === 'Lease Agreement' ? 'selected' : ''}>Lease Agreement</option>
                <option value="Service Contract" ${contract.type === 'Service Contract' ? 'selected' : ''}>Service Contract</option>
                <option value="NDA" ${contract.type === 'NDA' ? 'selected' : ''}>NDA</option>
                <option value="Other" ${contract.type === 'Other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" id="contractAmount" value="${contract.amount}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Property Address</label>
            <textarea id="propertyAddress" rows="2" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">${contract.propertyAddress}</textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" id="startDate" value="${contract.startDate}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">End Date</label>
              <input type="date" id="endDate" value="${contract.endDate}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
        </form>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onclick="handleSaveContract('${contractId}')" class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Save Changes</button>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Add global function for save button
    ;(window as any).handleSaveContract = (id: string) => {
      const form = document.getElementById('editContractForm') as HTMLFormElement
      const formData = new FormData(form)
      
      const updatedContract = {
        ...contract,
        title: (document.getElementById('contractTitle') as HTMLInputElement).value,
        clientName: (document.getElementById('clientName') as HTMLInputElement).value,
        status: (document.getElementById('contractStatus') as HTMLSelectElement).value as Contract['status'],
        type: (document.getElementById('contractType') as HTMLSelectElement).value as Contract['type'],
        amount: parseInt((document.getElementById('contractAmount') as HTMLInputElement).value),
        propertyAddress: (document.getElementById('propertyAddress') as HTMLTextAreaElement).value,
        startDate: (document.getElementById('startDate') as HTMLInputElement).value,
        endDate: (document.getElementById('endDate') as HTMLInputElement).value,
        lastModified: new Date().toISOString()
      }
      
      // Update the contract in state
      setContracts(prev => prev.map(c => c.id === id ? updatedContract : c))
      
      modal.remove()
      
      // Show success message
      const successDiv = document.createElement('div')
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50'
      successDiv.textContent = 'Contract updated successfully!'
      document.body.appendChild(successDiv)
      setTimeout(() => document.body.removeChild(successDiv), 3000)
    }
  }

  const handleDownloadContract = (contractId: string) => {
    // Find the contract details
    const contract = contracts.find(c => c.id === contractId)
    if (!contract) {
      alert('Contract not found')
      return
    }

    // Create a PDF-like document content
    const contractContent = `
CONTRACT DOCUMENT
=================

Title: ${contract.title}
Client: ${contract.clientName}
Type: ${contract.type}
Status: ${contract.status}
Amount: $${contract.amount.toLocaleString()}

Property Details:
${contract.propertyAddress}

Contract Period:
Start Date: ${new Date(contract.startDate).toLocaleDateString()}
End Date: ${new Date(contract.endDate).toLocaleDateString()}

Document Information:
Created: ${new Date(contract.createdAt).toLocaleDateString()}
Last Modified: ${new Date(contract.lastModified).toLocaleDateString()}

---
Generated on: ${new Date().toLocaleDateString()}
Revora Property Management System
    `.trim()

    // Create and download the file
    const blob = new Blob([contractContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `contract-${contract.title.replace(/[^a-zA-Z0-9]/g, '-')}-${contractId}.txt`
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    // Show success message
    const successDiv = document.createElement('div')
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50'
    successDiv.textContent = 'Contract downloaded successfully!'
    document.body.appendChild(successDiv)
    setTimeout(() => document.body.removeChild(successDiv), 3000)
  }

  // CONDITIONAL RETURNS MUST COME AFTER ALL HOOKS
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contracts</h1>
          <p className="text-gray-600">Manage your property contracts and agreements</p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search contracts, clients, or properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="ALL">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="ALL">All Types</option>
              <option value="Purchase Agreement">Purchase Agreement</option>
              <option value="Lease Agreement">Lease Agreement</option>
              <option value="Service Contract">Service Contract</option>
              <option value="NDA">NDA</option>
              <option value="Other">Other</option>
            </select>
            <Button onClick={handleCreateContract} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Contract
            </Button>
          </div>
        </div>

        {/* Contracts List */}
        {isLoading ? (
          <Card className="shadow-lg">
            <CardContent className="py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading contracts...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredContracts.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="py-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No contracts found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || filterStatus !== 'ALL' || filterType !== 'ALL' 
                        ? 'Try adjusting your search or filters'
                        : 'Get started by creating your first contract'
                      }
                    </p>
                    <Button onClick={handleCreateContract} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Contract
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredContracts.map((contract) => (
                <Card key={contract.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{contract.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{contract.clientName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            <span>{contract.propertyAddress}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Start: {new Date(contract.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>End: {new Date(contract.endDate).toLocaleDateString()}</span>
                          </div>
                          {contract.amount > 0 && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>${contract.amount.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(contract.status)}>
                            {contract.status}
                          </Badge>
                          <Badge className={getTypeColor(contract.type)}>
                            {contract.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          Modified: {new Date(contract.lastModified).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        Created: {new Date(contract.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewContract(contract.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditContract(contract.id)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleDownloadContract(contract.id)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                  <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {contracts.filter(c => c.status === 'Active').length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {contracts.filter(c => c.status === 'Pending').length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${contracts.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
