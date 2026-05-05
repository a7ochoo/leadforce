import React, { useState } from 'react';

function GmailIntegration({ channel, token, onConnect, isConnected, onDisconnect }) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/gmail/auth-url?channel=${channel}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error('Get Gmail auth URL error:', err);
      alert('Erreur lors de la connexion à Gmail');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir déconnecter Gmail ?')) {
      onDisconnect();
    }
  };

  return (
    <div className="integration-buttons">
      {isConnected ? (
        <>
          <p className="success-message">✓ Gmail connecté et synchronisé</p>
          <button 
            className="btn btn-secondary"
            onClick={handleDisconnect}
          >
            Déconnecter
          </button>
        </>
      ) : (
        <>
          <p className="info-message">
            Cliquez pour autoriser LeadForce à accéder à votre Gmail
          </p>
          <button 
            className="btn btn-primary"
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Connecter Gmail'}
          </button>
        </>
      )}
    </div>
  );
}

export default GmailIntegration;
