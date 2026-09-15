import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Run a fast, lightweight query to keep Supabase Postgres active and prevent pausing
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Keep-alive database ping failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to ping database",
      },
      { status: 500 }
    );
  }
}
