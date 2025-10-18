import { NextRequest, NextResponse } from "next/server";
import { testDatabaseConnection } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const isConnected = await testDatabaseConnection();
    
    return NextResponse.json({
      status: isConnected ? "healthy" : "unhealthy",
      database: isConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
