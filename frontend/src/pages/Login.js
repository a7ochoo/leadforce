import React, { useState } from "react";
import "../styles/Auth.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState("form"); // form | verify
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      if (isLogin) {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.href = "/";
        } else {
          setError(data.error || "Email ou mot de passe incorrect");
        }
      } else {
        // Inscription → envoie code SANS créer le compte
        const res = await fetch(`${API_URL}/api/auth/send-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, firstName, lastName }),
        });
        const data = await res.json();
        if (data.success) {
          setStep("verify");
          setMessage("Code envoyé à " + email);
        } else {
          setError(data.error || "Erreur lors de l'envoi");
        }
      }
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-and-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verifyCode }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      } else {
        setError(data.error || "Code incorrect ou expiré");
      }
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(""); setMessage("");
    try {
      await fetch(`${API_URL}/api/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setMessage("Nouveau code envoyé!");
    } catch {
      setError("Erreur lors de l'envoi");
    }
  };

  // PAGE VÉRIFICATION CODE
  if (step === "verify") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-top">
            <div className="logo-row">
              <div className="logo-box"><span>LF</span></div>
              <span className="logo-text">LeadForce</span>
            </div>
            <div className="verify-icon">📧</div>
            <h1 className="auth-title">Vérifiez votre email</h1>
            <p className="auth-subtitle">
              Code à 6 chiffres envoyé à <strong>{email}</strong>.<br/>
              Votre compte sera créé après vérification.
            </p>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleVerify}>
              <div className="form-group">
                <label>Code de vérification</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="code-input"
                  required
                  maxLength={6}
                  disabled={loading}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading || verifyCode.length < 6}>
                {loading ? "Vérification..." : "Créer mon compte →"}
              </button>
            </form>

            <div className="resend-row">
              <span>Pas reçu le code?</span>
              <button type="button" onClick={handleResend} className="resend-btn">Renvoyer</button>
            </div>
          </div>
          <div className="auth-card-footer">
            <p className="toggle-text">
              <a onClick={() => { setStep("form"); setError(""); setMessage(""); setVerifyCode(""); }}>
                ← Modifier mon email
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // PAGE CONNEXION / INSCRIPTION
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
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? "Chargement..."
                : isLogin
                  ? "Se connecter"
                  : "Envoyer le code de vérification →"}
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
