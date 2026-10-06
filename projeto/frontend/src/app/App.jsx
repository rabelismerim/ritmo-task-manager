import { useCallback, useState } from "react";
import Login from "../features/auth/Login";
import Dashboard from "../features/tasks/Dashboard";
export default function App() {
  const [token, setToken] = useState(() =>
    sessionStorage.getItem("ritmo.token"),
  );
  const logout = useCallback(() => {
    sessionStorage.removeItem("ritmo.token");
    setToken(null);
  }, []);
  function authenticate(value) {
    sessionStorage.setItem("ritmo.token", value);
    setToken(value);
  }
  return (
    <>
      <header className="topbar">
        <a className="brand" href="/" aria-label="Ritmo, página inicial">
          <span className="brand-icon">r.</span>ritmo
          <span className="brand-dot">.</span>
        </a>
        <span className="tagline">SUAS TAREFAS, NO SEU TEMPO</span>
        {token && (
          <button className="logout" onClick={logout}>
            Sair da conta ↗
          </button>
        )}
      </header>
      {token ? (
        <Dashboard token={token} onLogout={logout} />
      ) : (
        <Login onLogin={authenticate} />
      )}
      <footer className="footer">
        Feito para simplificar. <span>React + Django</span>
      </footer>
    </>
  );
}
