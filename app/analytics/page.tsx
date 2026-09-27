import { AppShell } from "@/components/app-shell";
import { applications } from "@/lib/seed";

export default function AnalyticsPage(){
 const countries=[...new Set(applications.map(a=>a.countryCode))].map(code=>{
  const total=applications.filter(a=>a.countryCode===code).length;
  const response=applications.filter(a=>a.countryCode===code && ["Resposta recebida","Entrevista","Oferta"].includes(a.status)).length;
  return {code,total,response,rate:total?Math.round(response/total*100):0};
 }).sort((a,b)=>b.total-a.total);
 const max=Math.max(...countries.map(c=>c.total));
 return <AppShell><header className="topbar compact"><div><span className="eyebrow">ANALYTICS</span><h1>Onde estamos tendo retorno?</h1><p>Compare volume de candidaturas e respostas por mercado.</p></div></header><section className="analytics-grid"><div className="panel"><div className="panel-head"><div><span className="eyebrow">POR PAÍS</span><h2>Volume de candidaturas</h2></div></div><div className="bars">{countries.map(c=><div className="bar-row" key={c.code}><span>{c.code}</span><div className="bar-track"><i style={{width:`${Math.max(8,c.total/max*100)}%`}}/></div><strong>{c.total}</strong></div>)}</div></div><div className="panel"><div className="panel-head"><div><span className="eyebrow">RESPOSTA</span><h2>Taxa inicial por mercado</h2></div></div><div className="rate-list">{countries.map(c=><div className="rate-row" key={c.code}><div><strong>{c.code}</strong><span>{c.response} resposta(s) / {c.total}</span></div><b>{c.rate}%</b></div>)}</div></div></section><div className="insight-card"><span className="eyebrow">PRÓXIMA FASE</span><h2>Quando o Gmail estiver conectado, este painel será automático.</h2><p>O sistema poderá distinguir resposta positiva, entrevista, recusa, pedido de documentos e ausência de retorno, atualizando as métricas sem cadastro manual.</p></div></AppShell>
}
