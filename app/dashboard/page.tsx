import { AppShell } from "@/components/app-shell";
import { Icon } from "@/components/icons";
import { StatusBadge } from "@/components/status-badge";
import { applications } from "@/lib/seed";

function daysUntil(date?: string) {
  if (!date) return "—";
  const diff = Math.ceil((new Date(date).getTime() - new Date("2026-09-27T12:00:00").getTime()) / 86400000);
  if (diff < 0) return `${Math.abs(diff)}d atrasado`;
  if (diff === 0) return "Hoje";
  return `em ${diff}d`;
}

export default function DashboardPage() {
  const total = applications.length;
  const waiting = applications.filter(a => ["Aguardando","Follow-up"].includes(a.status)).length;
  const replies = applications.filter(a => ["Resposta recebida","Entrevista","Oferta"].includes(a.status)).length;
  const interviews = applications.filter(a => a.status === "Entrevista").length;
  const followUps = applications.filter(a => a.followUpAt).sort((a,b) => (a.followUpAt! > b.followUpAt! ? 1 : -1)).slice(0,4);
  const recent = [...applications].sort((a,b) => b.appliedAt.localeCompare(a.appliedAt)).slice(0,7);

  return <AppShell>
    <header className="topbar"><div><span className="eyebrow">VISÃO GERAL</span><h1>Suas candidaturas, em um só lugar.</h1><p>Acompanhe respostas, próximos follow-ups e quais mercados estão respondendo melhor.</p></div><button className="primary-btn"><Icon name="plus"/>Nova candidatura</button></header>

    <section className="stats-grid">
      <article className="stat-card"><div className="stat-icon"><Icon name="briefcase"/></div><div><span>Total de candidaturas</span><strong>{total}</strong><small>histórico inicial</small></div></article>
      <article className="stat-card"><div className="stat-icon"><Icon name="clock"/></div><div><span>Aguardando</span><strong>{waiting}</strong><small>inclui follow-up</small></div></article>
      <article className="stat-card"><div className="stat-icon"><Icon name="mail"/></div><div><span>Com resposta</span><strong>{replies}</strong><small>resposta ou avanço</small></div></article>
      <article className="stat-card accent"><div className="stat-icon"><Icon name="chart"/></div><div><span>Entrevistas</span><strong>{interviews}</strong><small>pipeline ativo</small></div></article>
    </section>

    <section className="dashboard-grid">
      <div className="panel wide"><div className="panel-head"><div><span className="eyebrow">PIPELINE</span><h2>Candidaturas recentes</h2></div><a href="/applications">Ver todas <Icon name="chevron" size={15}/></a></div>
        <div className="table-wrap"><table><thead><tr><th>Empresa / vaga</th><th>Candidato</th><th>Local</th><th>Enviado</th><th>Status</th></tr></thead><tbody>{recent.map(a => <tr key={a.id}><td><strong>{a.company}</strong><span>{a.role}</span></td><td>{a.candidate.split(" ")[0]}</td><td><span className="country-pill">{a.countryCode}</span>{a.city}</td><td>{new Date(a.appliedAt+"T12:00:00").toLocaleDateString("pt-BR")}</td><td><StatusBadge status={a.status}/></td></tr>)}</tbody></table></div>
      </div>
      <aside className="panel follow-panel"><div className="panel-head"><div><span className="eyebrow">PRÓXIMAS AÇÕES</span><h2>Follow-ups</h2></div></div>{followUps.map(a => <div className="follow-item" key={a.id}><div className="timeline-dot"/><div><strong>{a.company}</strong><span>{a.role}</span><small>{daysUntil(a.followUpAt)} · {new Date(a.followUpAt!+"T12:00:00").toLocaleDateString("pt-BR")}</small></div></div>)}<a className="text-btn" href="/follow-ups">Abrir central de follow-up <Icon name="chevron" size={15}/></a></aside>
    </section>

    <section className="market-strip"><div><span className="eyebrow">MERCADOS</span><h2>Distribuição atual</h2></div>{["MT","NZ","CA","PT","AE","BR"].map(code => {const n=applications.filter(a=>a.countryCode===code).length; return <div className="market" key={code}><span>{code}</span><strong>{n}</strong><small>candidaturas</small></div>})}</section>
  </AppShell>;
}
