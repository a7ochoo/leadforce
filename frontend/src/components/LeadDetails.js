import React, { useState, useEffect } from 'react';
import '../styles/LeadDetails.css';

function LeadDetails({ lead, token, onClose }) {
  const [messages, setMessages] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeadDetails();
  }, [lead.id]);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/conversations/${lead.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setScore(data.score);
      }
    } catch (err) {
      console.error('Fetch lead details error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getClassificationColor = (classification) => {
    switch(classification) {
      case 'bon': return '#22c55e';
      case 'moyen': return '#f97316';
      case 'faible': return '#9ca3af';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{lead.prospect_name || 'Détails du lead'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-spinner">Chargement...</div>
          ) : (
            <>
              {/* Lead Info */}
              <div className="modal-section">
                <h3>Informations</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Type</label>
                    <value>{lead.type === 'respondeur' ? 'Répondeur' : 'Demandeur'}</value>
                  </div>
                  <div className="info-item">
                    <label>Canal</label>
                    <value>{lead.channel}</value>
                  </div>
                  <div className="info-item">
                    <label>Score</label>
                    <value style={{color: getClassificationColor(lead.classification)}}>
                      {lead.score}/100 - {lead.classification?.toUpperCase()}
                    </value>
                  </div>
                  <div className="info-item">
                    <label>Reçu</label>
                    <value>{new Date(lead.created_at).toLocaleString('fr-FR')}</value>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="modal-section">
                <h3>Contact</h3>
                <div className="contact-info">
                  {lead.prospect_name && (
                    <p><strong>Nom:</strong> {lead.prospect_name}</p>
                  )}
                  {lead.prospect_email && (
                    <p><strong>Email:</strong> {lead.prospect_email}</p>
                  )}
                  {lead.prospect_phone && (
                    <p><strong>Téléphone:</strong> {lead.prospect_phone}</p>
                  )}
                  {lead.annonce_id && (
                    <p><strong>Annonce:</strong> {lead.annonce_id}</p>
                  )}
                </div>
              </div>

              {/* Conversation */}
              <div className="modal-section">
                <h3>Conversation</h3>
                <div className="conversation">
                  {messages.length === 0 ? (
                    <p className="empty-conversation">Aucun message</p>
                  ) : (
                    messages.map((msg, idx) => (
                      <div key={idx} className={`message ${msg.sender}`}>
                        <div className="message-sender">
                          {msg.sender === 'prospect' ? '👤 Prospect' : '🤖 Bot'}
                        </div>
                        <div className="message-content">
                          {msg.content}
                        </div>
                        <div className="message-time">
                          {new Date(msg.created_at).toLocaleTimeString('fr-FR')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Score Details */}
              {score && (
                <div className="modal-section">
                  <h3>Détails du score</h3>
                  <div className="score-details">
                    <div className="score-item">
                      <span>Score total:</span>
                      <strong>{score.score}/100</strong>
                    </div>
                    <div className="score-item">
                      <span>Classification:</span>
                      <strong style={{color: getClassificationColor(score.classification)}}>
                        {score.classification?.toUpperCase()}
                      </strong>
                    </div>
                    {score.details && Object.entries(score.details).map(([key, value]) => (
                      <div key={key} className="score-item">
                        <span>{key.replace(/_/g, ' ')}:</span>
                        <strong>{String(value)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>
                  Fermer
                </button>
                {lead.prospect_email && (
                  <a href={`mailto:${lead.prospect_email}`} className="btn btn-primary">
                    Contacter par email
                  </a>
                )}
                {lead.prospect_phone && (
                  <a href={`tel:${lead.prospect_phone}`} className="btn btn-primary">
                    Appeler
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadDetails;
