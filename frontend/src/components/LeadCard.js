import React from 'react';
import '../styles/LeadCard.css';

function LeadCard({ lead, onSelect, isSelected }) {
  const getClassificationColor = (classification) => {
    switch(classification) {
      case 'bon': return '#22c55e';
      case 'moyen': return '#f97316';
      case 'faible': return '#9ca3af';
      default: return '#3b82f6';
    }
  };

  const getClassificationLabel = (classification) => {
    switch(classification) {
      case 'bon': return '🟢 BON';
      case 'moyen': return '🟡 MOYEN';
      case 'faible': return '🔵 FAIBLE';
      default: return 'N/A';
    }
  };

  const getChannelIcon = (channel) => {
    if (channel.includes('whatsapp')) return '💬 WhatsApp';
    if (channel.includes('gmail')) return '📧 Gmail';
    return channel;
  };

  const getTypeLabel = (type) => {
    return type === 'respondeur' ? 'Répondeur' : 'Demandeur';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className={`lead-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="lead-card-header">
        <div className="lead-classification">
          <span 
            className="classification-badge"
            style={{ background: getClassificationColor(lead.classification) }}
          >
            {getClassificationLabel(lead.classification)}
          </span>
          {lead.score && (
            <span className="lead-score">{lead.score}/100</span>
          )}
        </div>
        <div className="lead-meta">
          <span className="lead-type">{getTypeLabel(lead.type)}</span>
          <span className="lead-channel">{getChannelIcon(lead.channel)}</span>
        </div>
      </div>

      <div className="lead-card-body">
        <h3 className="lead-name">
          {lead.prospect_name || 'Prospect sans nom'}
        </h3>

        <div className="lead-contact">
          {lead.prospect_email && (
            <p>📧 {lead.prospect_email}</p>
          )}
          {lead.prospect_phone && (
            <p>📞 {lead.prospect_phone}</p>
          )}
        </div>

        {lead.annonce_id && (
          <div className="lead-annonce">
            <p>📍 Annonce: {lead.annonce_id}</p>
          </div>
        )}

        <div className="lead-details-mini">
          {lead.type === 'respondeur' ? (
            <>
              {lead.prospect_phone && <span>✓ Visite possible</span>}
              {lead.prospect_phone && <span>✓ Contact fourni</span>}
            </>
          ) : (
            <>
              {lead.score && <span>✓ Demande complète</span>}
              {lead.form_sent && <span>✓ Formulaire envoyé</span>}
            </>
          )}
        </div>
      </div>

      <div className="lead-card-footer">
        <time className="lead-time">
          {formatDate(lead.created_at)}
        </time>
        <button className="view-details-btn">
          Voir détails →
        </button>
      </div>
    </div>
  );
}

export default LeadCard;
