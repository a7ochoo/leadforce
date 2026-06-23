import React, { useState } from "react";
import "../styles/Auth.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin
        ? { email, password }
        : { email, password, firstName, lastName, plan: "agent" };
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-top">
          <div className="logo-row">
            <div className="logo-box"><span>LF</span></div>
            <span className="logo-text">LeadForce</span>
          </div>

          <h1 className="auth-title">{isLogin ? "Bon retour" : "Créer un compte"}</h1>
          <p className="auth-subtitle">
            {isLogin
              ? "Connectez-vous à votre espace agent immobilier"
              : "Commencez votre essai gratuit de 7 jours — sans carte bancaire"}
          </p>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" placeholder="Ahmed" value={firstName}
                    onChange={(e) => setFirstName(e.target.value)} required disabled={loading} />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" placeholder="Berred" value={lastName}
                    onChange={(e) => setLastName(e.target.value)} required disabled={loading} />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Adresse email</label>
              <input type="email" placeholder="vous@agence.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <div className="password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer mon compte →"}
            </button>
          </form>
        </div>

        <div className="auth-card-footer">
          <p className="toggle-text">
            {isLogin ? "Pas encore de compte? " : "Déjà un compte? "}
            <a onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }}>
              {isLogin ? "Créer un compte gratuit →" : "Se connecter"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
