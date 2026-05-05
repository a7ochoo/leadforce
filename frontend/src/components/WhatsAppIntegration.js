import React, { useState } from 'react';

function WhatsAppIntegration({ channel, token, onConnect, isConnected, onDisconnect }) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [apiToken, setApiToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || !apiToken) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/whatsapp-business/connect`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phoneNumber,
            apiToken
          })
        }
      );

      if (response.ok) {
        alert('WhatsApp Business connecté !');
        setShowForm(false);
        onConnect();
      } else {
        alert('Erreur lors de la connexion');
      }
    } catch (err) {
      console.error('WhatsApp connect error:', err);
      alert('Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir déconnecter WhatsApp Business ?')) {
      onDisconnect();
    }
  };

  return (
    <div className="integration-form">
      {isConnected ? (
        <>
          <p className="success-message">✓ WhatsApp Business connecté</p>
          <button 
            className="btn btn-secondary"
            onClick={handleDisconnect}
          >
            Déconnecter
          </button>
        </>
      ) : (
        <>
          {!showForm ? (
            <>
              <p className="info-message">
                Entrez vos identifiants WhatsApp Business
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Connecter WhatsApp Business
              </button>
              <p className="help-text">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Besoin d'aide pour trouver vos identifiants ?
                </a>
              </p>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Numéro WhatsApp Business</label>
                <input 
                  type="tel"
                  placeholder="ex: +33612345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Clé API WhatsApp</label>
                <input 
                  type="password"
                  placeholder="Votre token d'accès"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Connexion...' : 'Connecter'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default WhatsAppIntegration;
