import { NextRequest, NextResponse } from "next/server"
import { searchProperties } from "@/lib/rentcast"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Basic search parameters
    const city = searchParams.get("city") || undefined
    const zipCode = searchParams.get("zip") || undefined
    const address = searchParams.get("address") || undefined
    const state = searchParams.get("state") || undefined
    
    // Property details filters
    const bedsMin = searchParams.get("bedsMin") ? Number(searchParams.get("bedsMin")) : undefined
    const bedsMax = searchParams.get("bedsMax") ? Number(searchParams.get("bedsMax")) : undefined
    const bathsMin = searchParams.get("bathsMin") ? Number(searchParams.get("bathsMin")) : undefined
    const bathsMax = searchParams.get("bathsMax") ? Number(searchParams.get("bathsMax")) : undefined
    const squareFeetMin = searchParams.get("squareFeetMin") ? Number(searchParams.get("squareFeetMin")) : undefined
    const squareFeetMax = searchParams.get("squareFeetMax") ? Number(searchParams.get("squareFeetMax")) : undefined
    
    // Price filters
    const priceMin = searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined
    const priceMax = searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined
    
    // Property type and status filters
    const propertyType = searchParams.get("propertyType") || undefined
    const status = searchParams.get("status") || undefined
    
    // Year built filters
    const yearBuiltMin = searchParams.get("yearBuiltMin") ? Number(searchParams.get("yearBuiltMin")) : undefined
    const yearBuiltMax = searchParams.get("yearBuiltMax") ? Number(searchParams.get("yearBuiltMax")) : undefined
    
    // Lot size filters
    const lotSizeMin = searchParams.get("lotSizeMin") ? Number(searchParams.get("lotSizeMin")) : undefined
    const lotSizeMax = searchParams.get("lotSizeMax") ? Number(searchParams.get("lotSizeMax")) : undefined
    
    // Pagination
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 20
    const offset = (page - 1) * limit
    
    // Sorting
    const sortBy = searchParams.get("sortBy") || "lastSaleDate"
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"
    
    // Search mode: 'rentcast' for external API, 'database' for local search
    const searchMode = searchParams.get("searchMode") || "rentcast"

    let results: any[] = []
    let totalCount = 0

    if (searchMode === "database") {
      // Search in local database with advanced filtering
      const where: any = {}
      
      if (city) where.city = { contains: city, mode: "insensitive" }
      if (zipCode) where.zipCode = { contains: zipCode, mode: "insensitive" }
      if (address) where.address = { contains: address, mode: "insensitive" }
      if (state) where.state = { contains: state, mode: "insensitive" }
      if (propertyType) where.propertyType = { contains: propertyType, mode: "insensitive" }
      if (status) where.status = { contains: status, mode: "insensitive" }
      
      if (bedsMin !== undefined || bedsMax !== undefined) {
        where.beds = {}
        if (bedsMin !== undefined) where.beds.gte = bedsMin
        if (bedsMax !== undefined) where.beds.lte = bedsMax
      }
      
      if (bathsMin !== undefined || bathsMax !== undefined) {
        where.baths = {}
        if (bathsMin !== undefined) where.baths.gte = bathsMin
        if (bathsMax !== undefined) where.baths.lte = bathsMax
      }
      
      if (squareFeetMin !== undefined || squareFeetMax !== undefined) {
        where.squareFeet = {}
        if (squareFeetMin !== undefined) where.squareFeet.gte = squareFeetMin
        if (squareFeetMax !== undefined) where.squareFeet.lte = squareFeetMax
      }
      
      if (priceMin !== undefined || priceMax !== undefined) {
        where.lastSalePrice = {}
        if (priceMin !== undefined) where.lastSalePrice.gte = priceMin
        if (priceMax !== undefined) where.lastSalePrice.lte = priceMax
      }
      
      if (yearBuiltMin !== undefined || yearBuiltMax !== undefined) {
        where.yearBuilt = {}
        if (yearBuiltMin !== undefined) where.yearBuilt.gte = yearBuiltMin
        if (yearBuiltMax !== undefined) where.yearBuilt.lte = yearBuiltMax
      }
      
      if (lotSizeMin !== undefined || lotSizeMax !== undefined) {
        where.lotSize = {}
        if (lotSizeMin !== undefined) where.lotSize.gte = lotSizeMin
        if (lotSizeMax !== undefined) where.lotSize.lte = lotSizeMax
      }

      // Build orderBy clause
      const orderBy: any = {}
      if (sortBy === "price") orderBy.lastSalePrice = sortOrder
      else if (sortBy === "beds") orderBy.beds = sortOrder
      else if (sortBy === "baths") orderBy.baths = sortOrder
      else if (sortBy === "squareFeet") orderBy.squareFeet = sortOrder
      else if (sortBy === "yearBuilt") orderBy.yearBuilt = sortOrder
      else if (sortBy === "address") orderBy.address = sortOrder
      else orderBy.lastSaleDate = sortOrder

      // Get total count for pagination
      totalCount = await prisma.property.count({ where })
      
      // Get paginated results
      const dbResults = await prisma.property.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          }
        }
      })

      results = dbResults.map(property => ({
        id: property.rentcastId,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        latitude: property.latitude,
        longitude: property.longitude,
        beds: property.beds,
        baths: property.baths,
        squareFeet: property.squareFeet,
        lotSize: property.lotSize,
        yearBuilt: property.yearBuilt,
        lastSalePrice: property.lastSalePrice,
        lastSaleDate: property.lastSaleDate,
        propertyType: property.propertyType,
        status: property.status,
        imageUrl: property.images[0]?.imageUrl
      }))
    } else {
      // Use Rentcast API for external search
      const rentcastResults = await searchProperties({ 
        city, 
        zipCode, 
        address, 
        bedsMin, 
        bathsMin, 
        squareFeetMin 
      })

      // Apply additional filters to Rentcast results
      let filteredResults = rentcastResults

      if (bedsMax !== undefined) {
        filteredResults = filteredResults.filter(p => (p.beds || 0) <= bedsMax)
      }
      if (bathsMax !== undefined) {
        filteredResults = filteredResults.filter(p => (p.baths || 0) <= bathsMax)
      }
      if (squareFeetMax !== undefined) {
        filteredResults = filteredResults.filter(p => (p.squareFeet || 0) <= squareFeetMax)
      }
      if (priceMin !== undefined) {
        filteredResults = filteredResults.filter(p => (p.lastSalePrice || 0) >= priceMin)
      }
      if (priceMax !== undefined) {
        filteredResults = filteredResults.filter(p => (p.lastSalePrice || 0) <= priceMax)
      }
      if (propertyType) {
        filteredResults = filteredResults.filter(p => 
          p.propertyType?.toLowerCase().includes(propertyType.toLowerCase())
        )
      }
      if (state) {
        filteredResults = filteredResults.filter(p => 
          p.state?.toLowerCase().includes(state.toLowerCase())
        )
      }
      if (yearBuiltMin !== undefined) {
        filteredResults = filteredResults.filter(p => (p.yearBuilt || 0) >= yearBuiltMin)
      }
      if (yearBuiltMax !== undefined) {
        filteredResults = filteredResults.filter(p => (p.yearBuilt || 0) <= yearBuiltMax)
      }
      if (lotSizeMin !== undefined) {
        filteredResults = filteredResults.filter(p => (p.lotSize || 0) >= lotSizeMin)
      }
      if (lotSizeMax !== undefined) {
        filteredResults = filteredResults.filter(p => (p.lotSize || 0) <= lotSizeMax)
      }

      // Sort results
      filteredResults.sort((a, b) => {
        let aValue: any, bValue: any
        
        switch (sortBy) {
          case "price":
            aValue = a.lastSalePrice || 0
            bValue = b.lastSalePrice || 0
            break
          case "beds":
            aValue = a.beds || 0
            bValue = b.beds || 0
            break
          case "baths":
            aValue = a.baths || 0
            bValue = b.baths || 0
            break
          case "squareFeet":
            aValue = a.squareFeet || 0
            bValue = b.squareFeet || 0
            break
          case "yearBuilt":
            aValue = a.yearBuilt || 0
            bValue = b.yearBuilt || 0
            break
          case "address":
            aValue = a.address || ""
            bValue = b.address || ""
            break
          default:
            aValue = a.lastSaleDate || ""
            bValue = b.lastSaleDate || ""
        }
        
        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })

      totalCount = filteredResults.length
      results = filteredResults.slice(offset, offset + limit)

      // Cache results in database
      await Promise.all(results.map(async (p) => {
        await prisma.property.upsert({
          where: { rentcastId: p.id },
          update: {
            address: p.address,
            city: p.city,
            state: p.state,
            zipCode: p.zipCode,
            latitude: p.latitude,
            longitude: p.longitude,
            beds: p.beds ?? undefined,
            baths: p.baths ?? undefined,
            squareFeet: p.squareFeet ?? undefined,
            lotSize: p.lotSize ?? undefined,
            yearBuilt: p.yearBuilt ?? undefined,
            lastSalePrice: p.lastSalePrice ?? undefined,
            lastSaleDate: p.lastSaleDate ? new Date(p.lastSaleDate) : undefined,
            propertyType: p.propertyType ?? undefined,
            status: p.status ?? undefined,
          },
          create: {
            rentcastId: p.id,
            address: p.address,
            city: p.city,
            state: p.state,
            zipCode: p.zipCode,
            latitude: p.latitude,
            longitude: p.longitude,
            beds: p.beds ?? undefined,
            baths: p.baths ?? undefined,
            squareFeet: p.squareFeet ?? undefined,
            lotSize: p.lotSize ?? undefined,
            yearBuilt: p.yearBuilt ?? undefined,
            lastSalePrice: p.lastSalePrice ?? undefined,
            lastSaleDate: p.lastSaleDate ? new Date(p.lastSaleDate) : undefined,
            propertyType: p.propertyType ?? undefined,
            status: p.status ?? undefined,
          }
        })
      }))
    }

    // Save search to user's search history if authenticated
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      await prisma.search.create({
        data: {
          userId: session.user.id,
          searchParams: {
            city,
            zipCode,
            address,
            state,
            bedsMin,
            bedsMax,
            bathsMin,
            bathsMax,
            squareFeetMin,
            squareFeetMax,
            priceMin,
            priceMax,
            propertyType,
            status,
            yearBuiltMin,
            yearBuiltMax,
            lotSizeMin,
            lotSizeMax,
            sortBy,
            sortOrder,
            searchMode
          }
        }
      })
    }

    return NextResponse.json({ 
      results,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || "Search failed" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Basic search parameters
    const city = body.city || undefined
    const zipCode = body.zipCode || undefined
    const address = body.address || undefined
    const state = body.state || undefined
    
    // Property details filters
    const bedsMin = body.bedsMin || undefined
    const bedsMax = body.bedsMax || undefined
    const bathsMin = body.bathsMin || undefined
    const bathsMax = body.bathsMax || undefined
    const squareFeetMin = body.squareFeetMin || undefined
    const squareFeetMax = body.squareFeetMax || undefined
    
    // Price filters
    const priceMin = body.priceMin || undefined
    const priceMax = body.priceMax || undefined
    
    // Property type and status filters
    const propertyType = body.propertyType || undefined
    const status = body.status || undefined
    
    // Year built filters
    const yearBuiltMin = body.yearBuiltMin || undefined
    const yearBuiltMax = body.yearBuiltMax || undefined
    
    // Lot size filters
    const lotSizeMin = body.lotSizeMin || undefined
    const lotSizeMax = body.lotSizeMax || undefined
    
    // Pagination
    const page = body.page || 1
    const limit = body.limit || 20
    const offset = (page - 1) * limit
    
    // Sorting
    const sortBy = body.sortBy || "lastSaleDate"
    const sortOrder = body.sortOrder === "asc" ? "asc" : "desc"
    
    // Search mode: 'rentcast' for external API, 'database' for local search
    const searchMode = body.searchMode || "rentcast"

    let results: any[] = []
    let totalCount = 0

    if (searchMode === "database") {
      // Search in local database with advanced filtering
      const where: any = {}
      
      if (city) where.city = { contains: city, mode: "insensitive" }
      if (zipCode) where.zipCode = { contains: zipCode, mode: "insensitive" }
      if (address) where.address = { contains: address, mode: "insensitive" }
      if (state) where.state = { contains: state, mode: "insensitive" }
      if (propertyType) where.propertyType = { contains: propertyType, mode: "insensitive" }
      if (status) where.status = { contains: status, mode: "insensitive" }
      
      if (bedsMin !== undefined || bedsMax !== undefined) {
        where.beds = {}
        if (bedsMin !== undefined) where.beds.gte = bedsMin
        if (bedsMax !== undefined) where.beds.lte = bedsMax
      }
      
      if (bathsMin !== undefined || bathsMax !== undefined) {
        where.baths = {}
        if (bathsMin !== undefined) where.baths.gte = bathsMin
        if (bathsMax !== undefined) where.baths.lte = bathsMax
      }
      
      if (squareFeetMin !== undefined || squareFeetMax !== undefined) {
        where.squareFeet = {}
        if (squareFeetMin !== undefined) where.squareFeet.gte = squareFeetMin
        if (squareFeetMax !== undefined) where.squareFeet.lte = squareFeetMax
      }
      
      if (priceMin !== undefined || priceMax !== undefined) {
        where.lastSalePrice = {}
        if (priceMin !== undefined) where.lastSalePrice.gte = priceMin
        if (priceMax !== undefined) where.lastSalePrice.lte = priceMax
      }
      
      if (yearBuiltMin !== undefined || yearBuiltMax !== undefined) {
        where.yearBuilt = {}
        if (yearBuiltMin !== undefined) where.yearBuilt.gte = yearBuiltMin
        if (yearBuiltMax !== undefined) where.yearBuilt.lte = yearBuiltMax
      }
      
      if (lotSizeMin !== undefined || lotSizeMax !== undefined) {
        where.lotSize = {}
        if (lotSizeMin !== undefined) where.lotSize.gte = lotSizeMin
        if (lotSizeMax !== undefined) where.lotSize.lte = lotSizeMax
      }

      // Build orderBy clause
      const orderBy: any = {}
      if (sortBy === "price") orderBy.lastSalePrice = sortOrder
      else if (sortBy === "beds") orderBy.beds = sortOrder
      else if (sortBy === "baths") orderBy.baths = sortOrder
      else if (sortBy === "squareFeet") orderBy.squareFeet = sortOrder
      else if (sortBy === "yearBuilt") orderBy.yearBuilt = sortOrder
      else if (sortBy === "address") orderBy.address = sortOrder
      else orderBy.lastSaleDate = sortOrder

      // Get total count for pagination
      totalCount = await prisma.property.count({ where })
      
      // Get paginated results
      const dbResults = await prisma.property.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          }
        }
      })

      results = dbResults.map(property => ({
        id: property.rentcastId,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        latitude: property.latitude,
        longitude: property.longitude,
        beds: property.beds,
        baths: property.baths,
        squareFeet: property.squareFeet,
        lotSize: property.lotSize,
        yearBuilt: property.yearBuilt,
        lastSalePrice: property.lastSalePrice,
        lastSaleDate: property.lastSaleDate,
        propertyType: property.propertyType,
        status: property.status,
        imageUrl: property.images[0]?.imageUrl
      }))
    } else {
      // Use Rentcast API for external search
      const rentcastResults = await searchProperties({ 
        city, 
        zipCode, 
        address, 
        bedsMin, 
        bathsMin, 
        squareFeetMin 
      })

      // Apply additional filters to Rentcast results
      let filteredResults = rentcastResults

      if (bedsMax !== undefined) {
        filteredResults = filteredResults.filter(p => (p.beds || 0) <= bedsMax)
      }
      if (bathsMax !== undefined) {
        filteredResults = filteredResults.filter(p => (p.baths || 0) <= bathsMax)
      }
      if (squareFeetMax !== undefined) {
        filteredResults = filteredResults.filter(p => (p.squareFeet || 0) <= squareFeetMax)
      }
      if (priceMin !== undefined) {
        filteredResults = filteredResults.filter(p => (p.lastSalePrice || 0) >= priceMin)
      }
      if (priceMax !== undefined) {
        filteredResults = filteredResults.filter(p => (p.lastSalePrice || 0) <= priceMax)
      }
      if (propertyType) {
        filteredResults = filteredResults.filter(p => 
          p.propertyType?.toLowerCase().includes(propertyType.toLowerCase())
        )
      }
      if (state) {
        filteredResults = filteredResults.filter(p => 
          p.state?.toLowerCase().includes(state.toLowerCase())
        )
      }
      if (yearBuiltMin !== undefined) {
        filteredResults = filteredResults.filter(p => (p.yearBuilt || 0) >= yearBuiltMin)
      }
      if (yearBuiltMax !== undefined) {
        filteredResults = filteredResults.filter(p => (p.yearBuilt || 0) <= yearBuiltMax)
      }
      if (lotSizeMin !== undefined) {
        filteredResults = filteredResults.filter(p => (p.lotSize || 0) >= lotSizeMin)
      }
      if (lotSizeMax !== undefined) {
        filteredResults = filteredResults.filter(p => (p.lotSize || 0) <= lotSizeMax)
      }

      // Sort results
      filteredResults.sort((a, b) => {
        let aValue: any, bValue: any
        
        switch (sortBy) {
          case "price":
            aValue = a.lastSalePrice || 0
            bValue = b.lastSalePrice || 0
            break
          case "beds":
            aValue = a.beds || 0
            bValue = b.beds || 0
            break
          case "baths":
            aValue = a.baths || 0
            bValue = b.baths || 0
            break
          case "squareFeet":
            aValue = a.squareFeet || 0
            bValue = b.squareFeet || 0
            break
          case "yearBuilt":
            aValue = a.yearBuilt || 0
            bValue = b.yearBuilt || 0
            break
          case "address":
            aValue = a.address || ""
            bValue = b.address || ""
            break
          default:
            aValue = a.lastSaleDate || ""
            bValue = b.lastSaleDate || ""
        }
        
        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })

      totalCount = filteredResults.length
      results = filteredResults.slice(offset, offset + limit)

      // Cache results in database
      await Promise.all(results.map(async (p) => {
        await prisma.property.upsert({
          where: { rentcastId: p.id },
          update: {
            address: p.address,
            city: p.city,
            state: p.state,
            zipCode: p.zipCode,
            latitude: p.latitude,
            longitude: p.longitude,
            beds: p.beds ?? undefined,
            baths: p.baths ?? undefined,
            squareFeet: p.squareFeet ?? undefined,
            lotSize: p.lotSize ?? undefined,
            yearBuilt: p.yearBuilt ?? undefined,
            lastSalePrice: p.lastSalePrice ?? undefined,
            lastSaleDate: p.lastSaleDate ? new Date(p.lastSaleDate) : undefined,
            propertyType: p.propertyType ?? undefined,
            status: p.status ?? undefined,
          },
          create: {
            rentcastId: p.id,
            address: p.address,
            city: p.city,
            state: p.state,
            zipCode: p.zipCode,
            latitude: p.latitude,
            longitude: p.longitude,
            beds: p.beds ?? undefined,
            baths: p.baths ?? undefined,
            squareFeet: p.squareFeet ?? undefined,
            lotSize: p.lotSize ?? undefined,
            yearBuilt: p.yearBuilt ?? undefined,
            lastSalePrice: p.lastSalePrice ?? undefined,
            lastSaleDate: p.lastSaleDate ? new Date(p.lastSaleDate) : undefined,
            propertyType: p.propertyType ?? undefined,
            status: p.status ?? undefined,
          }
        })
      }))
    }

    // Save search to user's search history if authenticated
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      await prisma.search.create({
        data: {
          userId: session.user.id,
          searchParams: {
            city,
            zipCode,
            address,
            state,
            bedsMin,
            bedsMax,
            bathsMin,
            bathsMax,
            squareFeetMin,
            squareFeetMax,
            priceMin,
            priceMax,
            propertyType,
            status,
            yearBuiltMin,
            yearBuiltMax,
            lotSizeMin,
            lotSizeMax,
            sortBy,
            sortOrder,
            searchMode
          }
        }
      })
    }

    return NextResponse.json({ 
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ success: false, error: e.message || "Search failed" }, { status: 500 })
  }
}


