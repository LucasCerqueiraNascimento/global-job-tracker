"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./icons";
import { SignOutButton } from "./sign-out-button";

const nav = [
  ["/dashboard", "Dashboard", "dashboard"],
  ["/applications", "Candidaturas", "briefcase"],
  ["/follow-ups", "Follow-ups", "follow"],
  ["/analytics", "Analytics", "chart"],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">JT</div>
          <div><strong>JobTrack</strong><span>Global Applications</span></div>
        </div>

        <nav>
          {nav.map(([href, label, icon]) => (
            <Link
              key={href}
              href={href}
              className={pathname.startsWith(href) ? "nav-link active" : "nav-link"}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sync-card">
          <div className="sync-icon"><Icon name="mail" /></div>
          <strong>Gmail</strong>
          <span>Histórico real importado</span>
          <button disabled>61 registros carregados</button>
        </div>

        <div className="profile-mini">
          <div className="avatar">LN</div>
          <div>
            <strong>Lucas & Fabrina</strong>
            <span>Workspace privado</span>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
