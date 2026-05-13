import React, { useState } from "react";
import "../styles/Guide.css";

const SECTIONS = [
  {
    id: "pipeline",
    icon: "ti-layout-columns",
    title: "Pipeline & Suivi",
    items: [
      { q: "C'est quoi le Pipeline?", a: "Le Pipeline affiche tous vos prospects en colonnes: Nouveau → Qualifié → Visite → Offre → Vendu → Perdu. Chaque carte = 1 prospect avec son score et son canal." },
      { q: "Comment déplacer un prospect?", a: "Cliquez sur une carte pour ouvrir la fiche. Dans 'Avancer dans le pipeline', cliquez sur l'étape souhaitée. La mise à jour est automatique." },
      { q: "C'est quoi les scores?", a: "BON (vert) = prospect sérieux, financement confirmé, délai court. MOYEN (orange) = potentiel mais incertain. FAIBLE (rouge) = budget ou financement non confirmé." },
      { q: "La timeline de suivi", a: "Chaque prospect a une timeline: Message reçu → Qualification auto → Agent notifié → Visite programmée → Offre soumise → Achat finalisé." },
    ]
  },
  {
    id: "whatsapp",
    icon: "ti-brand-whatsapp",
    title: "WhatsApp & SMS",
    items: [
      { q: "Comment qualifier un prospect WhatsApp/SMS?", a: "2 méthodes: (1) Copier le lien questionnaire et l'envoyer au prospect. (2) Coller le message du prospect dans 'Analyser un message' — l'IA analyse et crée le lead automatiquement." },
      { q: "Copier le lien questionnaire", a: "Dans Pipeline → cliquez 'Copier lien questionnaire'. Le lien est copié. Envoyez-le au prospect via WhatsApp ou SMS. Quand il remplit le formulaire, le lead apparaît dans le Pipeline." },
      { q: "Analyser un message manuellement", a: "Dans Pipeline → cliquez 'Analyser un message'. Collez le message WhatsApp ou SMS du prospect. Claude IA analyse, calcule le score et crée le lead dans le Pipeline automatiquement." },
      { q: "Notification après qualification", a: "Vous recevez un email avec toutes les infos du prospect: nom, contact, budget, financement, délai, score. Vous n'avez plus à noter manuellement." },
    ]
  },
  {
    id: "email",
    icon: "ti-mail",
    title: "Email & Portails",
    items: [
      { q: "Comment connecter mon email?", a: "Canaux → Email → 'Connecter mon email'. Entrez votre adresse et mot de passe. Compatible Gmail, Outlook, Yahoo et tous les emails professionnels via SMTP/IMAP." },
      { q: "Gmail: mot de passe d'application", a: "Pour Gmail, utilisez un mot de passe d'application (pas votre vrai mot de passe). Allez sur myaccount.google.com/apppasswords → Créer → Nom: LeadForce → Copiez le code généré." },
      { q: "Portails SeLoger, LeBonCoin, etc.", a: "Quand un prospect vous contacte via SeLoger/LeBonCoin, le portail vous envoie un email. Configurez Gmail pour transférer ces emails à LeadForce → qualification automatique!" },
      { q: "Comment configurer le forwarding?", a: "Dans Gmail: Paramètres → Filtres → Créer un filtre → De: notification@seloger.com → Transférer à votre email LeadForce. Voir l'onglet Guide → Portails pour les instructions détaillées." },
    ]
  },
  {
    id: "questionnaire",
    icon: "ti-clipboard-list",
    title: "Questionnaire",
    items: [
      { q: "Comment fonctionne le questionnaire?", a: "Le questionnaire est un formulaire en 3 étapes que vous envoyez à vos prospects. Il collecte: infos personnelles, projet immobilier, critères de recherche." },
      { q: "Infos collectées (Email)", a: "Si le prospect vient par email → le questionnaire demande son numéro de téléphone. Si par WhatsApp → il demande son email. Toujours nom, prénom + infos du projet." },
      { q: "Lien public du questionnaire", a: "Votre lien questionnaire: leadforce-frontend.onrender.com/questionnaire. Partagez-le sur votre site, carte de visite, signature email. Chaque réponse crée un lead dans le Pipeline." },
      { q: "Score automatique", a: "Après soumission, LeadForce calcule automatiquement le score: financement confirmé (+30pts), délai immédiat (+25pts), budget renseigné (+15pts), infos complètes (+10pts)." },
    ]
  },
  {
    id: "portails",
    icon: "ti-building-estate",
    title: "Portails immobiliers",
    items: [
      { q: "SeLoger", a: "Email source: notification@seloger.com. Dans Gmail: Paramètres → Filtres → De: notification@seloger.com → Transférer à votre email LeadForce. C'est tout!" },
      { q: "LeBonCoin", a: "Email source: noreply@leboncoin.fr. Dans Gmail: Paramètres → Filtres → De: noreply@leboncoin.fr → Transférer à votre email LeadForce." },
      { q: "PAP", a: "Email source: contact@pap.fr. Dans Gmail: Paramètres → Filtres → De: contact@pap.fr → Transférer à votre email LeadForce." },
      { q: "Logic-Immo & Bienici", a: "Logic-Immo: notification@logic-immo.com. Bienici: no-reply@bienici.com. Même procédure: créer un filtre Gmail et transférer à votre email LeadForce." },
    ]
  },
  {
    id: "paiement",
    icon: "ti-credit-card",
    title: "Abonnement & Paiement",
    items: [
      { q: "Combien coûte LeadForce?", a: "Agent Solo: 49€/mois. Essai gratuit de 7 jours sans carte bancaire. Annulation possible à tout moment. Paiement sécurisé via Stripe." },
      { q: "Comment s'abonner?", a: "Offres → Agent Solo → 'Commencer'. Vous êtes redirigé vers Stripe Checkout. Entrez vos informations de paiement. Votre accès est activé immédiatement après paiement." },
      { q: "1 mois gratuit contre un avis", a: "À la fin de votre essai, vous pouvez obtenir 1 mois gratuit supplémentaire en échange d'un avis détaillé sur votre expérience LeadForce." },
      { q: "Annuler mon abonnement", a: "Paramètres → Gérer mon abonnement → Annuler. Vous gardez l'accès jusqu'à la fin de la période payée. Aucune pénalité d'annulation." },
    ]
  },
];

function Guide() {
  const [activeSection, setActiveSection] = useState("pipeline");
  const [openItem, setOpenItem] = useState(null);

  const section = SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="guide-container">
      <div className="guide-header">
        <h1>Guide d'utilisation</h1>
        <p>Tout ce que vous devez savoir pour utiliser LeadForce</p>
      </div>

      <div className="guide-layout">
        <div className="guide-sidebar">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`guide-nav-btn ${activeSection === s.id ? "active" : ""}`}
              onClick={() => { setActiveSection(s.id); setOpenItem(null); }}
            >
              <i className={`ti ${s.icon}`} aria-hidden="true"></i>
              {s.title}
            </button>
          ))}
        </div>

        <div className="guide-content">
          <h2 className="guide-section-title">
            <i className={`ti ${section.icon}`} aria-hidden="true"></i>
            {section.title}
          </h2>
          <div className="guide-faq">
            {section.items.map((item, i) => (
              <div key={i} className={`faq-item ${openItem === i ? "open" : ""}`}>
                <button className="faq-question" onClick={() => setOpenItem(openItem === i ? null : i)}>
                  <span>{item.q}</span>
                  <i className={`ti ${openItem === i ? "ti-chevron-up" : "ti-chevron-down"}`} aria-hidden="true"></i>
                </button>
                {openItem === i && (
                  <div className="faq-answer">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guide;
