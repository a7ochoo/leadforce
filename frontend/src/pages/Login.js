import React, { useState } from "react";
import "../styles/Auth.css";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://localhost:3000";

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, plan: "agent" }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("✅ Inscription réussie! Redirection...");
        setTimeout(() => { window.location.href = "/"; }, 2000);
      } else {
        setError(data.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("✅ Connexion réussie! Redirection...");
        setTimeout(() => { window.location.href = "/"; }, 2000);
      } else {
        setError(data.error || "Erreur lors de la connexion");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="logo">LeadForce</h1>
        <h2>{isLogin ? "Connexion" : "S'inscrire"}</h2>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Prénom</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={loading} />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={loading} />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Pas de compte? " : "Déjà un compte? "}
          <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(""); setMessage(""); }}>
            {isLogin ? "S'inscrire" : "Se connecter"}
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
