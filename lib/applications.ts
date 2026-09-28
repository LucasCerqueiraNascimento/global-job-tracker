import type { Application, ApplicationStatus, Candidate } from "./types";
import { createClient } from "./supabase/server";

type Relation<T> = T | T[] | null;

type ApplicationRow = {
  id: string;
  role_title: string;
  status: string;
  source: string;
  stage: string | null;
  applied_at: string;
  follow_up_at: string | null;
  recipient_email: string | null;
  cv_name: string | null;
  notes: string | null;
  candidate: Relation<{ full_name: string }>;
  company: Relation<{
    name: string;
    country: string | null;
    country_code: string | null;
    city: string | null;
  }>;
};

function one<T>(value: Relation<T>): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

import { redirect } from "next/navigation";

export async function getApplications(): Promise<Application[]> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("applications")
    .select(`
      id,
      role_title,
      status,
      source,
      stage,
      applied_at,
      follow_up_at,
      recipient_email,
      cv_name,
      notes,
      candidate:candidates!applications_candidate_id_fkey(full_name),
      company:companies!applications_company_id_fkey(name,country,country_code,city)
    `)
    .order("applied_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load applications: ${error.message}`);
  }

  return ((data ?? []) as unknown as ApplicationRow[]).map((row) => {
    const candidate = one(row.candidate);
    const company = one(row.company);

    return {
      id: row.id,
      candidate: (candidate?.full_name ?? "Fabrina Silva") as Candidate,
      company: company?.name ?? "Empresa não identificada",
      role: row.role_title,
      country: company?.country ?? "",
      countryCode: company?.country_code ?? "—",
      city: company?.city ?? "",
      appliedAt: row.applied_at,
      status: row.status as ApplicationStatus,
      email: row.recipient_email ?? "Portal",
      stage: row.stage ?? "Histórico",
      followUpAt: row.follow_up_at ?? undefined,
      source: row.source === "Portal" ? "Portal" : "Email",
      cv: row.cv_name ?? "",
      notes: row.notes ?? undefined,
    };
  });
}
