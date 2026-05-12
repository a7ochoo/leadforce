import React, { useState, useEffect } from "react";
import "../styles/AdminDashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [data, setData] = useState({ users: [], reviews: [], stats: null, revenue: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersRes, reviewsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/users`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/reviews`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/stats`, { headers: { "Authorization": `Bearer ${token}` } }),
      ]);
      const users = await usersRes.json();
      const reviews = await reviewsRes.json();
      const stats = await statsRes.json();
      setData({ users: users.users || [], reviews: reviews.reviews || [], stats: stats });
    } catch (err) {
      setError("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";
  const formatMoney = (n) => n ? `${(n/100).toFixed(0)}€` : "0€";

  const tabs = [
    { id: "stats", label: "Vue d'ensemble", icon: "ti-chart-bar" },
    { id: "users", label: "Utilisateurs", icon: "ti-users" },
    { id: "reviews", label: "Avis clients", icon: "ti-star" },
  ];

  const stats = data.stats || {};
  const users = data.users || [];
  const reviews = data.reviews || [];

  const mrr = users.filter(u => u.status === "active" && u.plan === "agent").length * 4900
             + users.filter(u => u.status === "active" && u.plan === "agence").length * 19900;

  const starAvg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div className="admin-nav-left">
          <div className="admin-logo">
            <div className="admin-logo-box">LF</div>
            <span className="admin-logo-text">LeadForce</span>
            <span className="admin-badge">Admin</span>
          </div>
          <div className="admin-tabs">
            {tabs.map(t => (
              <span key={t.id} className={`admin-tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
                <i className={`ti ${t.icon}`} aria-hidden="true"></i> {t.label}
              </span>
            ))}
          </div>
        </div>
        <div className="admin-nav-right">
          <button className="admin-refresh" onClick={fetchAll}><i className="ti ti-refresh" aria-hidden="true"></i></button>
          <button className="admin-logout" onClick={() => window.location.href = "/"}>← App</button>
        </div>
      </nav>

      <div className="admin-body">
        {loading && <div className="admin-loading"><i className="ti ti-loader-2" aria-hidden="true"></i> Chargement...</div>}
        {error && <div className="admin-error">{error}</div>}

        {!loading && activeTab === "stats" && (
          <>
            <div className="admin-header">
              <h1>Vue d'ensemble</h1>
              <p>Statistiques globales de LeadForce</p>
            </div>

            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="astat-top">
                  <div className="astat-icon purple"><i className="ti ti-users" aria-hidden="true"></i></div>
                  <span className="astat-trend up">+{users.filter(u => new Date(u.created_at) > new Date(Date.now() - 7*86400000)).length} cette semaine</span>
                </div>
                <p className="astat-number">{users.length}</p>
                <p className="astat-label">Utilisateurs inscrits</p>
              </div>

              <div className="admin-stat-card">
                <div className="astat-top">
                  <div className="astat-icon green"><i className="ti ti-credit-card" aria-hidden="true"></i></div>
                </div>
                <p className="astat-number">{formatMoney(mrr)}</p>
                <p className="astat-label">MRR (revenus mensuels)</p>
              </div>

              <div className="admin-stat-card">
                <div className="astat-top">
                  <div className="astat-icon blue"><i className="ti ti-user-check" aria-hidden="true"></i></div>
                </div>
                <p className="astat-number">{users.filter(u => u.status === "active").length}</p>
                <p className="astat-label">Abonnements actifs</p>
              </div>

              <div className="admin-stat-card">
                <div className="astat-top">
                  <div className="astat-icon amber"><i className="ti ti-star" aria-hidden="true"></i></div>
                </div>
                <p className="astat-number">{starAvg} ★</p>
                <p className="astat-label">Note moyenne ({reviews.length} avis)</p>
              </div>

              <div className="admin-stat-card">
                <div className="astat-top">
                  <div className="astat-icon orange"><i className="ti ti-clock" aria-hidden="true"></i></div>
                </div>
                <p className="astat-number">{users.filter(u => u.status === "trial").length}</p>
                <p className="astat-label">En période d'essai</p>
              </div>

              <div className="admin-stat-card">
                <div className="astat-top">
                  <div className="astat-icon red"><i className="ti ti-user-x" aria-hidden="true"></i></div>
                </div>
                <p className="astat-number">{users.filter(u => u.status === "expired").length}</p>
                <p className="astat-label">Essais expirés</p>
              </div>
            </div>

            <div className="admin-section-grid">
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Répartition des plans</h3>
                </div>
                <div className="plan-breakdown">
                  <div className="plan-row">
                    <span className="plan-name">Agent Solo (49€)</span>
                    <div className="plan-bar-wrap">
                      <div className="plan-bar" style={{width: `${users.length ? (users.filter(u=>u.plan==="agent").length/users.length)*100 : 0}%`, background: "#5B4CF5"}}></div>
                    </div>
                    <span className="plan-count">{users.filter(u=>u.plan==="agent").length}</span>
                  </div>
                  <div className="plan-row">
                    <span className="plan-name">Agence (199€)</span>
                    <div className="plan-bar-wrap">
                      <div className="plan-bar" style={{width: `${users.length ? (users.filter(u=>u.plan==="agence").length/users.length)*100 : 0}%`, background: "#22C55E"}}></div>
                    </div>
                    <span className="plan-count">{users.filter(u=>u.plan==="agence").length}</span>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Derniers inscrits</h3>
                </div>
                <div className="recent-users">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="recent-user-row">
                      <div className="ru-avatar">{u.email[0].toUpperCase()}</div>
                      <div className="ru-info">
                        <p className="ru-email">{u.email}</p>
                        <p className="ru-date">{formatDate(u.created_at)}</p>
                      </div>
                      <span className={`ru-status ${u.status}`}>{u.status}</span>
                    </div>
                  ))}
                  {users.length === 0 && <p className="empty-text">Aucun utilisateur</p>}
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && activeTab === "users" && (
          <>
            <div className="admin-header">
              <h1>Utilisateurs</h1>
              <p>{users.length} inscrits au total</p>
            </div>
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Prénom</th>
                    <th>Plan</th>
                    <th>Statut</th>
                    <th>Essai expire</th>
                    <th>Inscrit le</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="td-email">{u.email}</td>
                      <td>{u.first_name || "—"}</td>
                      <td><span className="plan-pill">{u.plan}</span></td>
                      <td><span className={`status-pill ${u.status}`}>{u.status}</span></td>
                      <td>{formatDate(u.trial_ends_date)}</td>
                      <td>{formatDate(u.created_at)}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6} className="empty-td">Aucun utilisateur inscrit</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && activeTab === "reviews" && (
          <>
            <div className="admin-header">
              <h1>Avis clients</h1>
              <p>{reviews.length} avis · Note moyenne: {starAvg} ★</p>
            </div>
            <div className="reviews-grid">
              {reviews.map(r => (
                <div key={r.id} className="review-card">
                  <div className="review-card-header">
                    <div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                    <span className="review-date">{formatDate(r.created_at)}</span>
                  </div>
                  {r.reviewer_name && <p className="review-name">{r.reviewer_name}</p>}
                  <div className="review-section">
                    <p className="review-section-label">Ce qui a plu</p>
                    <p className="review-text">{r.liked}</p>
                  </div>
                  <div className="review-section">
                    <p className="review-section-label">À améliorer</p>
                    <p className="review-text">{r.improved}</p>
                  </div>
                  {r.recommend && (
                    <div className="review-recommend">
                      <i className="ti ti-thumb-up" aria-hidden="true"></i> {r.recommend}
                    </div>
                  )}
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="empty-state">
                  <i className="ti ti-star" aria-hidden="true"></i>
                  <p>Aucun avis pour le moment</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
