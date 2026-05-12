import React, { useState } from "react";
import "../styles/Questionnaire.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function Questionnaire() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const channel = params.get("channel") || "email";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // Infos personnelles
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Projet
    type: "",
    budget: "",
    financing: "",
    delay: "",
    city: "",
    surface: "",
    rooms: "",
    criteria: "",
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_URL}/api/questionnaire/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token, channel })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Erreur lors de l'envoi");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="q-container">
        <div className="q-card">
          <div className="q-success">
            <div className="q-success-icon">✅</div>
            <h1>Merci!</h1>
            <p>Votre dossier a été transmis à l'agent immobilier.<br/>Il vous contactera très prochainement.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="q-container">
      <div className="q-card">
        <div className="q-header">
          <div className="q-logo">
            <div className="q-logo-box">LF</div>
            <span>LeadForce</span>
          </div>
          <div className="q-progress">
            <div className="q-progress-bar" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
          <p className="q-step-label">Étape {step} sur 3</p>
        </div>

        {/* ÉTAPE 1: Infos personnelles */}
        {step === 1 && (
          <div className="q-step">
            <h2>Vos informations</h2>
            <p>Pour que l'agent puisse vous contacter</p>

            <div className="q-row">
              <div className="q-group">
                <label>Prénom <span>*</span></label>
                <input type="text" placeholder="Ahmed" value={form.firstName}
                  onChange={e => update("firstName", e.target.value)} />
              </div>
              <div className="q-group">
                <label>Nom <span>*</span></label>
                <input type="text" placeholder="Berred" value={form.lastName}
                  onChange={e => update("lastName", e.target.value)} />
              </div>
            </div>

            {channel === "whatsapp" && (
              <div className="q-group">
                <label>Adresse email <span>*</span></label>
                <input type="email" placeholder="vous@exemple.com" value={form.email}
                  onChange={e => update("email", e.target.value)} />
              </div>
            )}

            {channel === "email" && (
              <div className="q-group">
                <label>Numéro de téléphone <span>*</span></label>
                <input type="tel" placeholder="+33 6 XX XX XX XX" value={form.phone}
                  onChange={e => update("phone", e.target.value)} />
              </div>
            )}

            <button className="q-btn"
              disabled={!form.firstName || !form.lastName || (channel === "whatsapp" && !form.email) || (channel === "email" && !form.phone)}
              onClick={() => setStep(2)}>
              Continuer →
            </button>
          </div>
        )}

        {/* ÉTAPE 2: Projet immobilier */}
        {step === 2 && (
          <div className="q-step">
            <h2>Votre projet</h2>
            <p>Dites-nous ce que vous cherchez</p>

            <div className="q-group">
              <label>Type de projet <span>*</span></label>
              <div className="q-options">
                {["Achat", "Location"].map(opt => (
                  <button key={opt} className={`q-option ${form.type === opt ? "active" : ""}`}
                    onClick={() => update("type", opt)}>{opt}</button>
                ))}
              </div>
            </div>

            <div className="q-group">
              <label>Budget <span>*</span></label>
              <input type="text" placeholder="Ex: 300 000€ ou 1 200€/mois" value={form.budget}
                onChange={e => update("budget", e.target.value)} />
            </div>

            <div className="q-group">
              <label>Financement <span>*</span></label>
              <div className="q-options">
                {["Confirmé", "En cours", "Non démarré"].map(opt => (
                  <button key={opt} className={`q-option ${form.financing === opt ? "active" : ""}`}
                    onClick={() => update("financing", opt)}>{opt}</button>
                ))}
              </div>
            </div>

            <div className="q-group">
              <label>Délai d'achat <span>*</span></label>
              <div className="q-options">
                {["Immédiat", "1-3 mois", "3-6 mois", "+6 mois"].map(opt => (
                  <button key={opt} className={`q-option ${form.delay === opt ? "active" : ""}`}
                    onClick={() => update("delay", opt)}>{opt}</button>
                ))}
              </div>
            </div>

            <div className="q-nav">
              <button className="q-btn-back" onClick={() => setStep(1)}>← Retour</button>
              <button className="q-btn"
                disabled={!form.type || !form.budget || !form.financing || !form.delay}
                onClick={() => setStep(3)}>Continuer →</button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3: Critères */}
        {step === 3 && (
          <div className="q-step">
            <h2>Vos critères</h2>
            <p>Pour affiner votre recherche</p>

            <div className="q-group">
              <label>Ville / Zone recherchée <span>*</span></label>
              <input type="text" placeholder="Ex: Paris 15e, Lyon, Bordeaux..." value={form.city}
                onChange={e => update("city", e.target.value)} />
            </div>

            <div className="q-row">
              <div className="q-group">
                <label>Surface (m²)</label>
                <input type="text" placeholder="Ex: 60m²" value={form.surface}
                  onChange={e => update("surface", e.target.value)} />
              </div>
              <div className="q-group">
                <label>Nombre de pièces</label>
                <div className="q-options">
                  {["1", "2", "3", "4", "5+"].map(opt => (
                    <button key={opt} className={`q-option small ${form.rooms === opt ? "active" : ""}`}
                      onClick={() => update("rooms", opt)}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="q-group">
              <label>Critères importants</label>
              <textarea placeholder="Ex: jardin, parking, proche écoles, lumineux..."
                value={form.criteria} onChange={e => update("criteria", e.target.value)} rows={3} />
            </div>

            {error && <div className="q-error">{error}</div>}

            <div className="q-nav">
              <button className="q-btn-back" onClick={() => setStep(2)}>← Retour</button>
              <button className="q-btn" disabled={!form.city || loading} onClick={handleSubmit}>
                {loading ? "Envoi..." : "Envoyer mon dossier →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Questionnaire;
