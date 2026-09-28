import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    ok: false,
    checks: {},
  };

  try {
    const supabase = await createClient();
    diagnostics.checks = {
      clientCreated: true,
    };

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

    (diagnostics.checks as Record<string, unknown>).claims = {
      hasClaims: Boolean(claimsData?.claims),
      error: claimsError ? {
        name: claimsError.name,
        message: claimsError.message,
        status: "status" in claimsError ? claimsError.status : undefined,
      } : null,
    };

    const { data: probeData, error: probeError, count } = await supabase
      .from("applications")
      .select("id", { count: "exact" })
      .limit(1);

    (diagnostics.checks as Record<string, unknown>).applicationsProbe = {
      rowVisible: Boolean(probeData?.length),
      visibleCount: count ?? null,
      error: probeError ? {
        code: probeError.code,
        message: probeError.message,
        details: probeError.details,
        hint: probeError.hint,
      } : null,
    };

    const { error: relationError } = await supabase
      .from("applications")
      .select(`
        id,
        candidate:candidates!applications_candidate_id_fkey(full_name),
        company:companies!applications_company_id_fkey(name,country,country_code,city)
      `)
      .limit(1);

    (diagnostics.checks as Record<string, unknown>).relationshipProbe = {
      error: relationError ? {
        code: relationError.code,
        message: relationError.message,
        details: relationError.details,
        hint: relationError.hint,
      } : null,
    };

    diagnostics.ok = !probeError && !relationError;
    return NextResponse.json(diagnostics);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        fatal: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        } : String(error),
      },
      { status: 500 },
    );
  }
}
