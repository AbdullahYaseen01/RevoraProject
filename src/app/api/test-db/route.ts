import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Test basic database operations
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: "Database connection working",
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Database error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
