import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Onboarding from './components/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(7);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        // Calculate trial days left
        const trialEnds = new Date(userData.trial_ends_date);
        const today = new Date();
        const daysLeft = Math.ceil((trialEnds - today) / (1000 * 60 * 60 * 24));
        setTrialDaysLeft(Math.max(0, daysLeft));
        
        // Show onboarding if first time
        if (!localStorage.getItem('onboarding_completed')) {
          setShowOnboarding(true);
        }
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('onboarding_completed');
    setToken(null);
    setUser(null);
    setCurrentPage('login');
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  if (loading) {
    return <div className="loading">Chargement LeadForce...</div>;
  }

  if (!token) {
    if (currentPage === 'register') {
      return <Register onRegister={handleLogin} setCurrentPage={setCurrentPage} />;
    }
    return <Login onLogin={handleLogin} setCurrentPage={setCurrentPage} />;
  }

  return (
    <div className="app">
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="logo">LeadForce</h1>
          <div className="trial-badge">
            Trial: {trialDaysLeft} jours restants
          </div>
        </div>
        
        <div className="navbar-center">
          <button 
            className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            📨 Mes leads
          </button>
          <button 
            className={`nav-button ${currentPage === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentPage('reports')}
          >
            📊 Rapports
          </button>
          <button 
            className={`nav-button ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
          >
            ⚙️ Paramètres
          </button>
        </div>
        
        <div className="navbar-right">
          <span className="user-email">{user?.email}</span>
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'dashboard' && <Dashboard token={token} user={user} />}
        {currentPage === 'settings' && <Settings token={token} user={user} />}
        {currentPage === 'reports' && <Reports token={token} user={user} />}
      </main>
    </div>
  );
}

export default App;
