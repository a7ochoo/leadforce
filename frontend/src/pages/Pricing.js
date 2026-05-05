import React, { useState } from 'react';
import '../styles/Pricing.css';

function Pricing({ token, user, onCheckout }) {
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: 'Agent',
      price: 49,
      period: '/mois',
      description: 'Pour un agent immobilier seul',
      features: [
        '✓ 4 canaux (Gmail + WhatsApp)',
        '✓ Scoring illimité',
        '✓ Rapports quotidiens',
        '✓ Support email',
      ],
      cta: 'Commencer gratuitement',
      highlighted: false,
    },
    {
      name: 'Agence',
      price: 199,
      period: '/mois',
      description: 'Pour une équipe de 5 agents',
      features: [
        '✓ 5 agents inclus',
        '✓ Tous les 4 canaux',
        '✓ Scoring illimité',
        '✓ Rapports consolidés',
        '✓ Support prioritaire',
        '✓ +20€/agent supplémentaire',
      ],
      cta: 'Commencer gratuitement',
      highlighted: true,
    },
  ];

  const handleCheckout = async (plan) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/stripe/checkout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ plan: plan.name.toLowerCase() })
        }
      );

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Tarification LeadForce</h1>
        <p>Choisissez le plan qui vous convient. 7 jours gratuit sans engagement.</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.name} className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}>
            {plan.highlighted && <div className="badge">RECOMMANDÉ</div>}
            
            <h3>{plan.name}</h3>
            <p className="plan-description">{plan.description}</p>
            
            <div className="price">
              <span className="amount">{plan.price}€</span>
              <span className="period">{plan.period}</span>
            </div>

            <button 
              className="btn btn-primary btn-block"
              onClick={() => handleCheckout(plan)}
              disabled={loading}
            >
              {loading ? 'Chargement...' : plan.cta}
            </button>

            <div className="features">
              {plan.features.map((feature, idx) => (
                <p key={idx}>{feature}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pricing-faq">
        <h2>Questions fréquentes</h2>
        
        <div className="faq-item">
          <h4>Puis-je annuler à tout moment ?</h4>
          <p>Oui, vous pouvez annuler votre abonnement à tout moment depuis les paramètres. Pas de contrat long terme.</p>
        </div>

        <div className="faq-item">
          <h4>Y a-t-il des frais cachés ?</h4>
          <p>Non, le prix affiché est le seul prix que vous payerez. Pas de frais supplémentaires.</p>
        </div>

        <div className="faq-item">
          <h4>Puis-je passer d'un plan à l'autre ?</h4>
          <p>Oui, vous pouvez mettre à jour votre plan à tout moment. Les changements s'appliquent immédiatement.</p>
        </div>

        <div className="faq-item">
          <h4>Avez-vous une garantie de satisfaction ?</h4>
          <p>Oui, nous offrons une garantie de satisfaction de 30 jours. Si vous n'êtes pas satisfait, nous vous remboursons.</p>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
