import { useState } from "react";
import { login } from "./api";
export default function Login({ onLogin }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const { token } = await login(
        form.get("username").trim(),
        form.get("password"),
      );
      onLogin(token);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login-layout">
      <section className="intro">
        <span className="eyebrow">MENOS RUÍDO. MAIS FOCO.</span>
        <h1>
          Um espaço para
          <br />o que <em>importa.</em>
        </h1>
        <p>
          Organize suas ideias, cuide das suas tarefas e encontre o seu próprio
          ritmo.
        </p>
        <div className="intro-note">
          <span>✓</span> Uma tarefa de cada vez.
        </div>
      </section>
      <section className="login-card">
        <span className="eyebrow">BEM-VINDO DE VOLTA</span>
        <h2>Vamos começar?</h2>
        <p>Entre para acessar suas listas.</p>
        <form onSubmit={submit}>
          <label htmlFor="username">Usuário</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            placeholder="Seu nome de usuário"
          />
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Sua senha"
          />
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <button className="primary" disabled={busy}>
            {busy ? "Entrando…" : "Entrar na minha conta →"}
          </button>
        </form>
        <small>Seu espaço pessoal de organização.</small>
      </section>
    </main>
  );
}
