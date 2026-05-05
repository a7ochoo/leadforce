import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';

function AdminDashboard({ token, user }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.plan === 'admin') {
      fetchAdminStats();
      fetchUsers();
    }
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Fetch admin stats error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/users`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.plan !== 'admin') {
    return (
      <div className="admin-error">
        <h2>❌ Accès Refusé</h2>
        <p>Vous devez avoir un compte admin pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="admin-subtitle">Gestion globale de LeadForce</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Vue d'ensemble
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs ({users.length})
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Chargement des données...</div>
      ) : (
        <>
          {activeTab === 'overview' && stats && (
            <div className="admin-overview">
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-label">Utilisateurs Actifs</div>
                  <div className="kpi-value">{stats.activeSubscriptions}</div>
                  <div className="kpi-change">+{Math.floor(stats.activeSubscriptions * 0.1)} ce mois</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Revenue Mensuel</div>
                  <div className="kpi-value">{Math.round(stats.monthlyRevenue)}€</div>
                  <div className="kpi-change">+15% vs mois dernier</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Leads Totaux</div>
                  <div className="kpi-value">{stats.totalLeads}</div>
                  <div className="kpi-change">+{Math.floor(stats.totalLeads * 0.2)} cette semaine</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">BON Leads</div>
                  <div className="kpi-value">
                    {stats.leadsByClassification?.find(l => l.classification === 'bon')?.count || 0}
                  </div>
                  <div className="kpi-change">
                    {stats.totalLeads > 0 ? Math.round((stats.leadsByClassification?.find(l => l.classification === 'bon')?.count || 0) / stats.totalLeads * 100) : 0}% du total
                  </div>
                </div>
              </div>

              <div className="admin-charts">
                <div className="chart-card">
                  <h3>Distribution des Leads</h3>
                  <div className="chart-container">
                    <div className="chart-item">
                      <span>🟢 BON</span>
                      <div className="chart-bar">
                        <div className="bar-fill" style={{
                          width: stats.leadsByClassification?.find(l => l.classification === 'bon')?.count 
                            ? `${(stats.leadsByClassification.find(l => l.classification === 'bon').count / stats.totalLeads * 100)}%`
                            : '0%',
                          background: '#22c55e'
                        }}></div>
                      </div>
                      <span className="bar-label">
                        {stats.leadsByClassification?.find(l => l.classification === 'bon')?.count || 0}
                      </span>
                    </div>
                    <div className="chart-item">
                      <span>🟡 MOYEN</span>
                      <div className="chart-bar">
                        <div className="bar-fill" style={{
                          width: stats.leadsByClassification?.find(l => l.classification === 'moyen')?.count 
                            ? `${(stats.leadsByClassification.find(l => l.classification === 'moyen').count / stats.totalLeads * 100)}%`
                            : '0%',
                          background: '#f97316'
                        }}></div>
                      </div>
                      <span className="bar-label">
                        {stats.leadsByClassification?.find(l => l.classification === 'moyen')?.count || 0}
                      </span>
                    </div>
                    <div className="chart-item">
                      <span>🔵 FAIBLE</span>
                      <div className="chart-bar">
                        <div className="bar-fill" style={{
                          width: stats.leadsByClassification?.find(l => l.classification === 'faible')?.count 
                            ? `${(stats.leadsByClassification.find(l => l.classification === 'faible').count / stats.totalLeads * 100)}%`
                            : '0%',
                          background: '#9ca3af'
                        }}></div>
                      </div>
                      <span className="bar-label">
                        {stats.leadsByClassification?.find(l => l.classification === 'faible')?.count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-users">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Nom</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Inscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.first_name} {user.last_name}</td>
                      <td>
                        <span className={`badge badge-${user.plan}`}>
                          {user.plan === 'agent' ? 'Agent' : 'Agence'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status === 'active' ? '✓ Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <a href={`/admin/users/${user.id}`} className="btn-link">
                          Détails →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="admin-analytics">
              <div className="analytics-card">
                <h3>Métriques Clés</h3>
                <div className="metrics-list">
                  <div className="metric">
                    <span>Utilisateurs Total</span>
                    <strong>{stats?.totalUsers || 0}</strong>
                  </div>
                  <div className="metric">
                    <span>Utilisateurs Actifs</span>
                    <strong>{stats?.activeSubscriptions || 0}</strong>
                  </div>
                  <div className="metric">
                    <span>Taux de Conversion</span>
                    <strong>
                      {stats?.totalUsers ? Math.round(stats.activeSubscriptions / stats.totalUsers * 100) : 0}%
                    </strong>
                  </div>
                  <div className="metric">
                    <span>Revenue Mensuel</span>
                    <strong>{Math.round(stats?.monthlyRevenue || 0)}€</strong>
                  </div>
                  <div className="metric">
                    <span>Revenue par User</span>
                    <strong>
                      {stats?.activeSubscriptions ? Math.round(stats.monthlyRevenue / stats.activeSubscriptions) : 0}€
                    </strong>
                  </div>
                  <div className="metric">
                    <span>Total Leads</span>
                    <strong>{stats?.totalLeads || 0}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
