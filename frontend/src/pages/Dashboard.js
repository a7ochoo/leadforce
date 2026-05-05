import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userStr || !token) {
      window.location.href = "/";
      return;
    }

    try {
      setUser(JSON.parse(userStr));
    } catch (err) {
      console.error("Erreur:", err);
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading) {
    return <div className="dashboard-container">Chargement...</div>;
  }

  if (!user) {
    return <div className="dashboard-container">Erreur</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <h1>LeadForce</h1>
        <div className="navbar-right">
          <span>{user.email}</span>
          <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Bienvenue! 🎉</h2>
          <p>Compte créé avec succès!</p>
          
          <div className="user-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Plan:</strong> Agent Solo (49€/mois)</p>
            <p><strong>Statut:</strong> ✅ Période d'essai (7 jours gratuit)</p>
            <p><strong>Essai jusqu'au:</strong> {new Date(user.trial_ends_date).toLocaleDateString("fr-FR")}</p>
          </div>

          <div className="features-list">
            <h3>🚀 Fonctionnalités:</h3>
            <ul>
              <li>✅ Messages WhatsApp</li>
              <li>✅ Emails Gmail</li>
              <li>✅ Chatbot IA</li>
              <li>✅ Scoring leads</li>
              <li>✅ Rapports quotidiens</li>
            </ul>
          </div>
        </div>

        <div className="stats-card">
          <h3>📊 Statistiques</h3>
          <div className="stat">
            <span>Leads</span>
            <p>0</p>
          </div>
          <div className="stat">
            <span>Qualifiés</span>
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
