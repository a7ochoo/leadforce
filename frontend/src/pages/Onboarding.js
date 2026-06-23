import React, { useState } from "react";
import "../styles/Onboarding.css";

const SLIDES = [
  {
    icon: "ti-rocket",
    title: "Bienvenue sur LeadForce",
    text: "LeadForce qualifie automatiquement vos prospects immobiliers et vous fait gagner un temps précieux au quotidien.",
  },
  {
    icon: "ti-layout-columns",
    title: "Le Pipeline",
    text: "Tous vos prospects sont organisés en colonnes : Nouveau → Qualifié → Visite → Offre → Vendu. Cliquez sur une carte pour voir le détail et faire avancer le prospect.",
  },
  {
    icon: "ti-clipboard-list",
    title: "Le Questionnaire",
    text: "Envoyez le lien du questionnaire à vos prospects (email, WhatsApp, SMS). Il collecte automatiquement leurs infos et crée le lead dans votre Pipeline.",
  },
  {
    icon: "ti-brand-whatsapp",
    title: "WhatsApp & SMS",
    text: "2 façons de qualifier : copiez le lien questionnaire et envoyez-le au prospect, OU collez directement son message dans 'Analyser un message' — l'IA fait le reste.",
  },
  {
    icon: "ti-mail",
    title: "Email & Portails",
    text: "Connectez votre email (Gmail, Outlook...) et configurez le transfert des notifications SeLoger/LeBonCoin pour qualifier automatiquement chaque contact.",
  },
  {
    icon: "ti-target-arrow",
    title: "Le Scoring automatique",
    text: "Chaque prospect reçoit un score BON, MOYEN ou FAIBLE basé sur son financement, son délai et la complétude de ses informations. Priorisez vos efforts !",
  },
  {
    icon: "ti-gift",
    title: "1 semaine offerte en plus",
    text: "À la fin de votre essai de 7 jours, rédigez un avis détaillé sur votre expérience (ce qui vous a plu, ce qu'on peut améliorer) et recevez automatiquement 1 semaine supplémentaire gratuite.",
  },
  {
    icon: "ti-credit-card",
    title: "Abonnement",
    text: "Essai gratuit de 7 jours, sans carte bancaire. Ensuite, Agent Solo à 49€/mois. Annulation possible à tout moment, paiement sécurisé via Stripe.",
  },
  {
    icon: "ti-check",
    title: "C'est parti !",
    text: "Vous savez maintenant l'essentiel. Retrouvez le Guide complet à tout moment dans l'onglet 'Guide' du Dashboard pour aller plus loin.",
  },
];

function Onboarding({ onClose }) {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <div className="onboarding-overlay" onClick={onClose}>
      <div className="onboarding-card" onClick={(e) => e.stopPropagation()}>
        <button className="onboarding-close" onClick={onClose}>×</button>

        <div className="onboarding-progress">
          {SLIDES.map((_, i) => (
            <div key={i} className={`progress-dot ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}></div>
          ))}
        </div>

        <div className="onboarding-icon">
          <i className={`ti ${slide.icon}`} aria-hidden="true"></i>
        </div>

        <h2 className="onboarding-title">{slide.title}</h2>
        <p className="onboarding-text">{slide.text}</p>

        <div className="onboarding-nav">
          <button
            className="onboarding-back"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            ← Précédent
          </button>
          <span className="onboarding-counter">{step + 1} / {SLIDES.length}</span>
          {isLast ? (
            <button className="onboarding-next" onClick={onClose}>
              Terminer
            </button>
          ) : (
            <button className="onboarding-next" onClick={() => setStep(step + 1)}>
              Suivant →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
