export default function AuthErrorPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">JT</div>
        <span className="eyebrow">ACESSO</span>
        <h1>Não foi possível confirmar o login.</h1>
        <p>Volte à tela de entrada e tente novamente.</p>
        <a className="primary-btn login-submit" href="/login">Voltar ao login</a>
      </section>
    </main>
  );
}
