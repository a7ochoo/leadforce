import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TrialExpired from "./pages/TrialExpired";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [page, setPage] = useState("loading");

  useEffect(() => {
    const path = window.location.pathname;
    
    // Route admin secrète
    if (path === "/admin-secret-xyz") {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) { setPage("login"); return; }
      try {
        const user = JSON.parse(userStr);
        if (user.email === "ahmedyoussef.berred@gmail.com") {
          setPage("admin");
        } else {
          setPage("dashboard");
        }
      } catch { setPage("login"); }
      return;
    }

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) { setPage("login"); return; }

    try {
      const user = JSON.parse(userStr);
      const trialEnd = user.trial_ends_date ? new Date(user.trial_ends_date) : null;
      const now = new Date();

      if (user.status === "active") {
        setPage("dashboard");
      } else if (trialEnd && trialEnd < now) {
        setPage("trial_expired");
      } else {
        setPage("dashboard");
      }
    } catch { setPage("login"); }
  }, []);

  if (page === "loading") return null;
  if (page === "login") return <Login />;
  if (page === "admin") return <AdminDashboard />;
  if (page === "trial_expired") return <TrialExpired />;
  return <Dashboard />;
}

export default App;
