import React, { useState, useEffect } from 'react';
import '../styles/Reports.css';

function Reports({ token, user }) {
  const [reports, setReports] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Simulated report data (in production, fetch from backend)
    const today = new Date();
    const mockReport = {
      date: today.toISOString().split('T')[0],
      totalLeads: 20,
      bonLeads: 8,
      moyenLeads: 7,
      faibleLeads: 5,
      respondeurs: {
        count: 8,
        avgScore: 61
      },
      demandeurs: {
        count: 12,
        avgScore: 48
      },
      averageScore: 54,
      timeSavedHours: 5.5,
      topLead: {
        name: 'Marie Dupont',
        email: 'marie@example.com',
        phone: '06 12 34 56 78',
        score: 68,
        classification: 'bon'
      },
      trends: {
        avgBudget: '380 000€',
        immediateUrgency: '55%',
        mainType: 'Appartement ancien',
        mainChannel: 'WhatsApp',
        peakTime: '10h-12h et 18h-20h'
      }
    };

    setStats(mockReport);
    setLoading(false);
  }, [selectedDate]);

  const getClassificationColor = (classification) => {
    switch(classification) {
      case 'bon': return '#22c55e';
      case 'moyen': return '#f97316';
      case 'faible': return '#9ca3af';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="reports">
      <div className="reports-header">
        <h2>Rapports</h2>
        <div className="date-picker">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Chargement du rapport...</div>
      ) : stats ? (
        <div className="report-content">
          {/* Summary cards */}
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-label">Leads reçus</div>
              <div className="summary-value">{stats.totalLeads}</div>
              <div className="summary-breakdown">
                Répondeurs: {stats.respondeurs.count} | Demandeurs: {stats.demandeurs.count}
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Qualité BON</div>
              <div className="summary-value" style={{color: '#22c55e'}}>40%</div>
              <div className="summary-breakdown">
                {stats.bonLeads} leads de qualité
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Score moyen</div>
              <div className="summary-value">{stats.averageScore}/100</div>
              <div className="summary-breakdown">
                vs 48/100 hier
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Temps économisé</div>
              <div className="summary-value">{stats.timeSavedHours}h</div>
              <div className="summary-breakdown">
                Qualification auto
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="breakdown-section">
            <h3>📊 Répartition des leads</h3>
            <div className="breakdown-grid">
              <div className="breakdown-card">
                <h4>Répondeurs</h4>
                <div className="breakdown-stats">
                  <div className="stat-row">
                    <span>🟢 BON</span>
                    <span>{Math.ceil(stats.respondeurs.count * 0.5)} (50%)</span>
                  </div>
                  <div className="stat-row">
                    <span>🟡 MOYEN</span>
                    <span>{Math.ceil(stats.respondeurs.count * 0.3)} (38%)</span>
                  </div>
                  <div className="stat-row">
                    <span>🔵 FAIBLE</span>
                    <span>{Math.ceil(stats.respondeurs.count * 0.2)} (12%)</span>
                  </div>
                </div>
                <div className="avg-score">
                  Score moyen: <strong>{stats.respondeurs.avgScore}/70</strong>
                </div>
              </div>

              <div className="breakdown-card">
                <h4>Demandeurs</h4>
                <div className="breakdown-stats">
                  <div className="stat-row">
                    <span>🟢 BON</span>
                    <span>{Math.ceil(stats.demandeurs.count * 0.33)} (33%)</span>
                  </div>
                  <div className="stat-row">
                    <span>🟡 MOYEN</span>
                    <span>{Math.ceil(stats.demandeurs.count * 0.42)} (42%)</span>
                  </div>
                  <div className="stat-row">
                    <span>🔵 FAIBLE</span>
                    <span>{Math.ceil(stats.demandeurs.count * 0.25)} (25%)</span>
                  </div>
                </div>
                <div className="avg-score">
                  Score moyen: <strong>{stats.demandeurs.avgScore}/60</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Top lead */}
          {stats.topLead && (
            <div className="top-lead-section">
              <h3>🏆 Meilleur lead</h3>
              <div className="top-lead-card">
                <div className="top-lead-name">{stats.topLead.name}</div>
                <div className="top-lead-score">
                  <span className="score-badge" style={{
                    background: getClassificationColor(stats.topLead.classification)
                  }}>
                    {stats.topLead.score}/100 {stats.topLead.classification.toUpperCase()}
                  </span>
                </div>
                <div className="top-lead-info">
                  <p>📧 {stats.topLead.email}</p>
                  <p>📞 {stats.topLead.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Trends */}
          <div className="trends-section">
            <h3>📈 Tendances</h3>
            <div className="trends-list">
              <div className="trend-item">
                <span>Budget moyen (demandeurs):</span>
                <strong>{stats.trends.avgBudget}</strong>
              </div>
              <div className="trend-item">
                <span>Urgence (immédiate):</span>
                <strong>{stats.trends.immediateUrgency}</strong>
              </div>
              <div className="trend-item">
                <span>Type principal:</span>
                <strong>{stats.trends.mainType}</strong>
              </div>
              <div className="trend-item">
                <span>Canal principal:</span>
                <strong>{stats.trends.mainChannel}</strong>
              </div>
              <div className="trend-item">
                <span>Heure de pic:</span>
                <strong>{stats.trends.peakTime}</strong>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-report">
          <p>Aucun rapport pour cette date</p>
        </div>
      )}
    </div>
  );
}

export default Reports;
