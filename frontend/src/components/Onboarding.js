import React, { useState } from 'react';
import '../styles/Onboarding.css';

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '👋 Bienvenue sur LeadForce !',
      description: 'LeadForce qualifie automatiquement tes leads en temps réel et te génère un score.',
      content: 'Prêt à économiser 3-4h par jour ? Commençons !'
    },
    {
      title: '🤖 Voici le fonctionnement',
      description: '1️⃣ Un prospect t\'envoie un message (WhatsApp, Email, annonce, etc)',
      content: '2️⃣ LeadForce le reçoit AUTOMATIQUEMENT\n3️⃣ Claude (IA) pose des questions rapides\n4️⃣ Le prospect remplit un formulaire\n5️⃣ Claude génère un SCORE (BON / MOYEN / FAIBLE)\n6️⃣ Tu reçois une notification + un rapport à 18h'
    },
    {
      title: '🔌 Étape 1: Connecte tes canaux',
      description: 'Tu vas autoriser LeadForce à accéder à:',
      content: '✅ Gmail (pro + perso)\n✅ WhatsApp Business\n\nWhatsApp perso: copie/colle dans le dashboard'
    },
    {
      title: '📧 Connecte Gmail (professionnel)',
      description: 'Clique sur le bouton ci-dessous, puis autorise Google',
      content: 'On va lire tes emails de prospect et ignorer les perso grâce à l\'IA'
    },
    {
      title: '💬 Connecte WhatsApp Business',
      description: 'Tu vas avoir besoin:',
      content: '• Ton numéro WhatsApp Business\n• Ta clé API WhatsApp\n\n(Pas sûr? Voici le guide →)'
    },
    {
      title: '📊 Voici un exemple de conversation réelle',
      description: 'PROSPECT: "Bonjour, je suis intéressé par votre annonce 3P Marseille"',
      content: 'LEADFORCE: "Merci ! Quelques questions rapides: Vous pouvez visiter quand ?"\nPROSPECT: "Cette semaine"\nLEADFORCE: "Votre financement confirmé ?"\nPROSPECT: "Oui"\nLEADFORCE: "✅ SCORE: BON (68/100) - Prospect qualifié, à appeler!"'
    },
    {
      title: '📨 Où trouver tes leads',
      description: 'Dans \'Mes leads\' tu vois:',
      content: '• Tous les prospects reçus\n• Leur SCORE (BON/MOYEN/FAIBLE)\n• Quand tu les as reçus\n• Les détails de la conversation\n\nTu peux filtrer par score ou type (répondeur/demandeur)'
    },
    {
      title: '📊 Ton rapport quotidien',
      description: 'À 18h chaque jour, tu reçois un email:',
      content: 'RAPPORT QUOTIDIEN\n├─ Leads reçus: 20\n├─ BON: 8 (40%)\n├─ MOYEN: 7 (35%)\n├─ FAIBLE: 5 (25%)\n├─ Temps économisé: 5.5h\n├─ Meilleur lead: Marie (68/100)\n└─ Tendances'
    },
    {
      title: '❓ Questions fréquentes',
      description: 'Comment LeadForce sait si c\'est un PROSPECT?',
      content: 'L\'IA analyse chaque message. Si c\'est sur l\'immobilier → PROSPECT. Si c\'est perso → ignoré.\n\nEt si je reçois un mail perso sur Gmail? L\'IA ignore automatiquement (familial, bancaire, etc)'
    },
    {
      title: '🚀 Bravo, tu es prêt !',
      description: 'Tu peux maintenant:',
      content: '✅ Recevoir des leads automatiquement\n✅ Les voir qualifiés en temps réel\n✅ Économiser 3-4h par jour\n✅ Recevoir un rapport à 18h\n\nDes questions? Contact support →'
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-header">
          <h2>{currentStep.title}</h2>
          <button 
            className="skip-btn"
            onClick={onComplete}
          >
            Passer le tutoriel ×
          </button>
        </div>

        <div className="onboarding-body">
          <p className="step-description">{currentStep.description}</p>
          <div className="step-content">
            {currentStep.content.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>

        <div className="onboarding-footer">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{width: `${((step + 1) / steps.length) * 100}%`}}
            />
          </div>
          <p className="progress-text">
            Étape {step + 1}/{steps.length}
          </p>

          <div className="onboarding-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0}
            >
              ← Précédent
            </button>

            {step === steps.length - 1 ? (
              <button 
                className="btn btn-primary"
                onClick={onComplete}
              >
                Allons-y! 🚀
              </button>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={() => setStep(step + 1)}
              >
                Suivant →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
