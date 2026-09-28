import { LoginForm } from "@/components/login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">JT</div>
        <span className="eyebrow">GLOBAL JOB TRACKER</span>
        <h1>Entrar no painel</h1>
        <p>
          O histórico de candidaturas é privado e só fica visível após autenticação.
        </p>

        <LoginForm />

        <small className="login-note">
          Diagnóstico: interface SSR ativa · 61 registros no Supabase.
        </small>
      </section>
    </main>
  );
}
