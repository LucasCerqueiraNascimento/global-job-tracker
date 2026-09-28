import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "global-job-tracker",
    version: "2026-09-28.2",
    time: new Date().toISOString(),
  });
}
