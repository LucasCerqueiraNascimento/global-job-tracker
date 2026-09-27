import { AppShell } from "@/components/app-shell";
import { applications } from "@/lib/seed";
import { Icon } from "@/components/icons";

export default function FollowUpsPage(){
 const items=applications.filter(a=>a.followUpAt).sort((a,b)=>a.followUpAt!.localeCompare(b.followUpAt!));
 return <AppShell><header className="topbar compact"><div><span className="eyebrow">FOLLOW-UP</span><h1>Próximas ações</h1><p>Priorize as empresas que já receberam seu CV e ainda não responderam.</p></div></header><div className="follow-list">{items.map((a,i)=><article className="follow-card" key={a.id}><div className="follow-date"><span>{new Date(a.followUpAt!+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit"})}</span><small>{new Date(a.followUpAt!+"T12:00:00").toLocaleDateString("pt-BR",{month:"short"}).replace(".","")}</small></div><div className="follow-main"><span className="eyebrow">{a.candidate} · {a.countryCode}</span><h2>{a.company}</h2><p>{a.role}</p><small>Enviado em {new Date(a.appliedAt+"T12:00:00").toLocaleDateString("pt-BR")} para {a.email}</small></div><div className="follow-actions"><button className="secondary-btn"><Icon name="mail"/>Preparar follow-up</button><button className="ghost-btn">Marcar como feito</button></div></article>)}</div></AppShell>
}
