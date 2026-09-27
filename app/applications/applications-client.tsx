"use client";

import { useMemo, useState } from "react";
import { applications } from "@/lib/seed";
import { Icon } from "@/components/icons";
import { StatusBadge } from "@/components/status-badge";

export function ApplicationsClient() {
  const [search,setSearch]=useState("");
  const [candidate,setCandidate]=useState("Todos");
  const [status,setStatus]=useState("Todos");
  const [country,setCountry]=useState("Todos");

  const rows=useMemo(()=>applications.filter(a=>{
    const q=search.toLowerCase();
    return (!q || `${a.company} ${a.role} ${a.city} ${a.email}`.toLowerCase().includes(q)) &&
      (candidate==="Todos" || a.candidate===candidate) &&
      (status==="Todos" || a.status===status) &&
      (country==="Todos" || a.countryCode===country);
  }),[search,candidate,status,country]);

  return <>
    <div className="filter-bar">
      <label className="search-box"><Icon name="search"/><input placeholder="Buscar empresa, vaga, cidade ou e-mail..." value={search} onChange={e=>setSearch(e.target.value)}/></label>
      <select value={candidate} onChange={e=>setCandidate(e.target.value)}><option>Todos</option><option>Fabrina Silva</option><option>Lucas Nascimento</option></select>
      <select value={status} onChange={e=>setStatus(e.target.value)}><option>Todos</option>{["Aguardando","Follow-up","Resposta recebida","Entrevista","Oferta","Recusada"].map(x=><option key={x}>{x}</option>)}</select>
      <select value={country} onChange={e=>setCountry(e.target.value)}><option>Todos</option>{[...new Set(applications.map(a=>a.countryCode))].map(x=><option key={x}>{x}</option>)}</select>
    </div>
    <div className="results-meta"><strong>{rows.length}</strong> candidaturas encontradas</div>
    <div className="panel no-pad"><div className="table-wrap"><table className="applications-table"><thead><tr><th>Empresa / vaga</th><th>Candidato</th><th>País</th><th>E-mail / origem</th><th>Etapa</th><th>Status</th><th>Follow-up</th></tr></thead><tbody>{rows.map(a=><tr key={a.id}><td><strong>{a.company}</strong><span>{a.role}</span></td><td>{a.candidate}</td><td><span className="country-pill">{a.countryCode}</span>{a.city}</td><td><strong className="email-cell">{a.email}</strong><span>{a.source}</span></td><td>{a.stage}</td><td><StatusBadge status={a.status}/></td><td>{a.followUpAt ? new Date(a.followUpAt+"T12:00:00").toLocaleDateString("pt-BR") : "—"}</td></tr>)}</tbody></table></div></div>
  </>;
}
