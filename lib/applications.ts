import { redirect } from "next/navigation";
import type { Application, ApplicationStatus, Candidate } from "./types";
import { createClient } from "./supabase/server";

type ApplicationRow = {
  id: string;
  candidate_id: string;
  company_id: string;
  role_title: string;
  status: string;
  source: string;
  stage: string | null;
  applied_at: string;
  follow_up_at: string | null;
  recipient_email: string | null;
  cv_name: string | null;
  notes: string | null;
};

type CandidateRow = {
  id: string;
  full_name: string;
};

type CompanyRow = {
  id: string;
  name: string;
  country: string | null;
  country_code: string | null;
  city: string | null;
};

export async function getApplications(): Promise<Application[]> {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    redirect("/login");
  }

  const { data: applicationData, error: applicationError } = await supabase
    .from("applications")
    .select(
      "id,candidate_id,company_id,role_title,status,source,stage,applied_at,follow_up_at,recipient_email,cv_name,notes",
    )
    .order("applied_at", { ascending: false });

  if (applicationError) {
    console.error("applications query failed", {
      code: applicationError.code,
      message: applicationError.message,
      details: applicationError.details,
      hint: applicationError.hint,
    });
    return [];
  }

  const rows = (applicationData ?? []) as ApplicationRow[];
  if (!rows.length) return [];

  const candidateIds = [...new Set(rows.map((row) => row.candidate_id))];
  const companyIds = [...new Set(rows.map((row) => row.company_id))];

  const [
    { data: candidateData, error: candidateError },
    { data: companyData, error: companyError },
  ] = await Promise.all([
    supabase.from("candidates").select("id,full_name").in("id", candidateIds),
    supabase
      .from("companies")
      .select("id,name,country,country_code,city")
      .in("id", companyIds),
  ]);

  if (candidateError) {
    console.error("candidates query failed", candidateError);
  }
  if (companyError) {
    console.error("companies query failed", companyError);
  }

  const candidates = new Map(
    ((candidateData ?? []) as CandidateRow[]).map((row) => [row.id, row]),
  );
  const companies = new Map(
    ((companyData ?? []) as CompanyRow[]).map((row) => [row.id, row]),
  );

  return rows.map((row) => {
    const candidate = candidates.get(row.candidate_id);
    const company = companies.get(row.company_id);

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
