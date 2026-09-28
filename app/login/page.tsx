"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const AUTHORIZED_EMAIL = "us.nascimento.id@gmail.com";

export default function LoginPage() {
  const [email, setEmail] = useState(AUTHORIZED_EMAIL);
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }
      window.location.href = "/dashboard";
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      window.location.href = "/dashboard";
      return;
    }

    setMessage("Cadastro criado. Confira seu e-mail para confirmar o acesso.");
    setLoading(false);
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">JT</div>
        <span className="eyebrow">GLOBAL JOB TRACKER</span>
        <h1>{mode === "login" ? "Entrar no painel" : "Criar acesso privado"}</h1>
        <p>
          O histórico de candidaturas é privado e só fica visível após autenticação.
        </p>

        <form onSubmit={submit} className="login-form">
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={8}
              required
            />
          </label>
          <button className="primary-btn login-submit" disabled={loading}>
            {loading ? "Processando..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        {message && <div className="login-message">{message}</div>}

        <button
          type="button"
          className="login-switch"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage("");
          }}
        >
          {mode === "login"
            ? "Primeiro acesso? Criar conta"
            : "Já tenho uma conta"}
        </button>

        <small className="login-note">
          Os 61 registros importados só podem ser lidos pela conta autorizada.
        </small>
      </section>
    </main>
  );
}
