"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">!</div>
        <span className="eyebrow">ERRO DE RUNTIME</span>
        <h1>A página encontrou um erro.</h1>
        <p>{error.message || "Erro inesperado ao carregar o aplicativo."}</p>
        {error.digest && <div className="login-message">Código: {error.digest}</div>}
        <button className="primary-btn login-submit" onClick={() => reset()}>
          Tentar novamente
        </button>
        <a className="login-switch" href="/health">Abrir diagnóstico /health</a>
      </section>
    </main>
  );
}
