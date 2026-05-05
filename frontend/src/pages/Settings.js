import React, { useState, useEffect } from 'react';
import '../styles/Settings.css';
import GmailIntegration from '../components/GmailIntegration';
import WhatsAppIntegration from '../components/WhatsAppIntegration';

function Settings({ token, user }) {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('integrations');

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/integrations`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIntegrations(data);
      }
    } catch (err) {
      console.error('Fetch integrations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIntegrationStatus = (channel) => {
    const integration = integrations.find(i => i.channel === channel);
    return integration?.is_connected ? 'connected' : 'disconnected';
  };

  const handleDisconnect = async (channel) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/integrations/${channel}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        fetchIntegrations();
      }
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  return (
    <div className="settings">
      <div className="settings-tabs">
        <button 
          className={`tab ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          Intégrations
        </button>
        <button 
          className={`tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Compte
        </button>
      </div>

      {activeTab === 'integrations' && (
        <div className="integrations-section">
          <h2>Connectez vos canaux</h2>
          
          {loading ? (
            <div className="loading-spinner">Chargement...</div>
          ) : (
            <div className="integrations-grid">
              {/* Gmail Pro */}
              <div className="integration-card">
                <div className="integration-header">
                  <h3>📧 Gmail Professionnel</h3>
                  <span className={`status ${getIntegrationStatus('gmail_pro')}`}>
                    {getIntegrationStatus('gmail_pro') === 'connected' ? '✓ Connecté' : 'Non connecté'}
                  </span>
                </div>
                <p className="integration-description">
                  Connectez votre email pro (agence.fr)
                </p>
                <GmailIntegration 
                  channel="gmail_pro" 
                  token={token}
                  onConnect={fetchIntegrations}
                  isConnected={getIntegrationStatus('gmail_pro') === 'connected'}
                  onDisconnect={() => handleDisconnect('gmail_pro')}
                />
              </div>

              {/* Gmail Perso */}
              <div className="integration-card">
                <div className="integration-header">
                  <h3>📧 Gmail Personnel</h3>
                  <span className={`status ${getIntegrationStatus('gmail_perso')}`}>
                    {getIntegrationStatus('gmail_perso') === 'connected' ? '✓ Connecté' : 'Non connecté'}
                  </span>
                </div>
                <p className="integration-description">
                  Connectez votre email personnel (gmail.com)
                </p>
                <GmailIntegration 
                  channel="gmail_perso" 
                  token={token}
                  onConnect={fetchIntegrations}
                  isConnected={getIntegrationStatus('gmail_perso') === 'connected'}
                  onDisconnect={() => handleDisconnect('gmail_perso')}
                />
              </div>

              {/* WhatsApp Business */}
              <div className="integration-card">
                <div className="integration-header">
                  <h3>💬 WhatsApp Business</h3>
                  <span className={`status ${getIntegrationStatus('whatsapp_business')}`}>
                    {getIntegrationStatus('whatsapp_business') === 'connected' ? '✓ Connecté' : 'Non connecté'}
                  </span>
                </div>
                <p className="integration-description">
                  Connectez votre numéro WhatsApp Business
                </p>
                <WhatsAppIntegration 
                  channel="whatsapp_business" 
                  token={token}
                  onConnect={fetchIntegrations}
                  isConnected={getIntegrationStatus('whatsapp_business') === 'connected'}
                  onDisconnect={() => handleDisconnect('whatsapp_business')}
                />
              </div>

              {/* WhatsApp Perso */}
              <div className="integration-card">
                <div className="integration-header">
                  <h3>💬 WhatsApp Personnel</h3>
                  <span className={`status disconnected`}>
                    Copier/coller
                  </span>
                </div>
                <p className="integration-description">
                  Copier/coller les messages dans le dashboard
                </p>
                <div className="coming-soon">
                  Via formulaire du dashboard (Jour 5)
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'account' && (
        <div className="account-section">
          <div className="account-card">
            <h3>Forfait</h3>
            <p className="plan-name">{user?.plan === 'agent' ? 'Formule Agent' : 'Formule Agence'}</p>
            <p className="plan-price">49€/mois</p>
            <div className="plan-features">
              <p>✓ Tous les 4 canaux</p>
              <p>✓ Scoring illimité</p>
              <p>✓ Rapports quotidiens</p>
            </div>
            <button className="btn btn-primary">Gérer forfait</button>
          </div>

          <div className="account-card">
            <h3>Trial</h3>
            <p className="trial-info">
              Expire le: <strong>{new Date(user?.trial_ends_date).toLocaleDateString('fr-FR')}</strong>
            </p>
            <p className="trial-status">
              ✓ Accès actif
            </p>
            <button className="btn btn-primary">Passer à l'abonnement</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
