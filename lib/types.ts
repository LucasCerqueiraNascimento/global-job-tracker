export type Candidate = "Fabrina Silva" | "Lucas Nascimento";
export type ApplicationStatus =
  | "Aguardando"
  | "Follow-up"
  | "Resposta recebida"
  | "Entrevista"
  | "Oferta"
  | "Recusada"
  | "Falha de entrega";

export type Application = {
  id: string;
  candidate: Candidate;
  company: string;
  role: string;
  country: string;
  countryCode: string;
  city: string;
  appliedAt: string;
  status: ApplicationStatus;
  email: string;
  stage: string;
  followUpAt?: string;
  source: "Email" | "Portal";
  cv: string;
  notes?: string;
};
