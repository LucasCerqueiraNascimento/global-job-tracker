"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const AUTHORIZED_EMAIL = "us.nascimento.id@gmail.com";

export function LoginForm() {
  const [email, setEmail] = useState(AUTHORIZED_EMAIL);
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.assign("/dashboard");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (error) throw error;

      if (data.session) {
        window.location.assign("/dashboard");
        return;
      }

      setMessage("Cadastro criado. Confira seu e-mail para confirmar o acesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível autenticar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
        {mode === "login" ? "Primeiro acesso? Criar conta" : "Já tenho uma conta"}
      </button>
    </>
  );
}
