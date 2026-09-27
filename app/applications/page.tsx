import { AppShell } from "@/components/app-shell";
import { Icon } from "@/components/icons";
import { ApplicationsClient } from "./applications-client";

export default function ApplicationsPage(){return <AppShell><header className="topbar compact"><div><span className="eyebrow">CONTROLE</span><h1>Todas as candidaturas</h1><p>Pesquise, filtre e acompanhe Lucas e Fabrina no mesmo painel.</p></div><button className="primary-btn"><Icon name="plus"/>Nova candidatura</button></header><ApplicationsClient/></AppShell>}
