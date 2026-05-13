import React, { useState } from "react";
import "../styles/Guide.css";

const PORTAILS = [
  {
    name: "SeLoger",
    email: "notification@seloger.com",
    logo: "🏠",
    color: "#E8001C",
    steps: [
      "Connectez-vous à votre compte SeLoger Pro",
      "Allez dans Paramètres → Notifications",
      "Activez les notifications par email",
      "Dans Gmail, allez dans Paramètres → Voir tous les paramètres",
      "Cliquez sur 'Filtres et adresses bloquées' → 'Créer un filtre'",
      "Dans le champ 'De': entrez notification@seloger.com",
      "Cliquez 'Créer un filtre' → cochez 'Transférer à'",
      "Entrez votre email connecté à LeadForce",
      "Cliquez 'Créer un filtre' ✅"
    ]
  },
  {
    name: "LeBonCoin",
    email: "noreply@leboncoin.fr",
    logo: "🔶",
    color: "#FF6E14",
    steps: [
      "Connectez-vous à votre compte LeBonCoin Pro",
      "Allez dans Mon compte → Messagerie",
      "Activez les notifications email pour les nouveaux messages",
      "Dans Gmail, allez dans Paramètres → Voir tous les paramètres",
      "Cliquez sur 'Filtres et adresses bloquées' → 'Créer un filtre'",
      "Dans le champ 'De': entrez noreply@leboncoin.fr",
      "Cliquez 'Créer un filtre' → cochez 'Transférer à'",
      "Entrez votre email connecté à LeadForce",
      "Cliquez 'Créer un filtre' ✅"
    ]
  },
  {
    name: "PAP",
    email: "contact@pap.fr",
    logo: "📋",
    color: "#0066CC",
    steps: [
      "Connectez-vous à votre compte PAP",
      "Allez dans Paramètres → Alertes email",
      "Activez les alertes pour les nouveaux messages",
      "Dans Gmail, créez un filtre pour: contact@pap.fr",
      "Transférez automatiquement vers votre email LeadForce",
      "Cliquez 'Créer un filtre' ✅"
    ]
  },
  {
    name: "Logic-Immo",
    email: "notification@logic-immo.com",
    logo: "🏡",
    color: "#00A651",
    steps: [
      "Connectez-vous à votre espace Logic-Immo",
      "Allez dans Paramètres → Notifications",
      "Activez les notifications email",
      "Dans Gmail, créez un filtre pour: notification@logic-immo.com",
      "Transférez automatiquement vers votre email LeadForce",
      "Cliquez 'Créer un filtre' ✅"
    ]
  },
  {
    name: "Bienici",
    email: "no-reply@bienici.com",
    logo: "🌐",
    color: "#6B48FF",
    steps: [
      "Connectez-vous à votre compte Bienici Pro",
      "Allez dans Paramètres → Notifications",
      "Activez les notifications par email",
      "Dans Gmail, créez un filtre pour: no-reply@bienici.com",
      "Transférez automatiquement vers votre email LeadForce",
      "Cliquez 'Créer un filtre' ✅"
    ]
  },
];

function Guide() {
  const [activePortail, setActivePortail] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="guide-container">
      <div className="guide-header">
        <h1>Guide de configuration</h1>
        <p>Connectez vos portails immobiliers en quelques minutes</p>
      </div>

      {/* COMMENT ÇA MARCHE */}
      <div className="guide-card">
        <h2 className="guide-section-title">Comment ça marche?</h2>
        <div className="flow-steps">
          <div className="flow-step">
            <div className="flow-icon">📩</div>
            <p className="flow-label">Prospect contacte sur SeLoger</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="flow-icon">📧</div>
            <p className="flow-label">SeLoger envoie un email à l'agent</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="flow-icon">🔄</div>
            <p className="flow-label">Gmail transfère à LeadForce</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="flow-icon">🤖</div>
            <p className="flow-label">IA qualifie automatiquement</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="flow-icon">🎯</div>
            <p className="flow-label">Lead dans le Pipeline</p>
          </div>
        </div>
      </div>

      {/* PORTAILS */}
      <div className="guide-card">
        <h2 className="guide-section-title">Choisissez votre portail</h2>
        <div className="portails-grid">
          {PORTAILS.map((portail, i) => (
            <button
              key={i}
              className={`portail-btn ${activePortail === i ? "active" : ""}`}
              onClick={() => { setActivePortail(i); setActiveStep(0); }}
              style={activePortail === i ? { borderColor: portail.color, background: portail.color + "10" } : {}}
            >
              <span className="portail-logo">{portail.logo}</span>
              <span className="portail-name">{portail.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* INSTRUCTIONS */}
      {activePortail !== null && (
        <div className="guide-card">
          <div className="instructions-header">
            <span className="portail-logo-big">{PORTAILS[activePortail].logo}</span>
            <div>
              <h2>{PORTAILS[activePortail].name}</h2>
              <p>Email source: <code>{PORTAILS[activePortail].email}</code></p>
            </div>
          </div>

          <div className="steps-list">
            {PORTAILS[activePortail].steps.map((step, i) => (
              <div
                key={i}
                className={`step-item ${activeStep === i ? "active" : ""} ${activeStep > i ? "done" : ""}`}
                onClick={() => setActiveStep(i)}
              >
                <div className="step-num">
                  {activeStep > i ? "✓" : i + 1}
                </div>
                <p className="step-text">{step}</p>
              </div>
            ))}
          </div>

          <div className="steps-nav">
            <button
              className="step-btn-back"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
            >
              ← Précédent
            </button>
            {activeStep < PORTAILS[activePortail].steps.length - 1 ? (
              <button className="step-btn-next" onClick={() => setActiveStep(activeStep + 1)}>
                Étape suivante →
              </button>
            ) : (
              <div className="step-done">
                <span>🎉</span> Configuration terminée!
              </div>
            )}
          </div>
        </div>
      )}

      {/* NOTE */}
      <div className="guide-note">
        <i className="ti ti-info-circle" aria-hidden="true"></i>
        <p>Compatible avec tous les portails qui envoient des notifications par email. Si votre portail n'est pas listé, contactez-nous et nous l'ajouterons!</p>
      </div>
    </div>
  );
}

export default Guide;
