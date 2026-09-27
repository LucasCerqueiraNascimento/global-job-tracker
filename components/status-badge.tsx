import type { ApplicationStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const key = status.toLowerCase().replaceAll(" ", "-").replaceAll("á", "a").replaceAll("ó", "o");
  return <span className={`status status-${key}`}>{status}</span>;
}
