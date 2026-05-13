import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const PIPELINE_STAGES = [
  { id: "nouveau", label: "Nouveau", color: "gray" },
  { id: "qualifie", label: "Qualifié", color: "blue" },
  { id: "visite", label: "Visite", color: "purple" },
  { id: "offre", label: "Offre", color: "amber" },
  { id: "vendu", label: "Vendu", color: "green" },
  { id: "perdu", label: "Perdu", color: "red" },
];

const MOCK_LEADS = [
  { id: 1, name: "Marie Dupont", type: "Achat", detail: "T3 Paris 15e", budget: "450k€", channel: "email", score: "moyen", stage: "nouveau", date: "Il y a 2h", timeline: [
    { icon: "ti-mail", label: "Message reçu", desc: "Email — Intéressée par un T3 dans le 15e", time: "Aujourd'hui 14h32", done: true },
    { icon: "ti-robot", label: "Qualification auto", desc: "Score MOYEN — Budget ok, délai incertain", time: "Aujourd'hui 14h33", done: true },
    { icon: "ti-bell", label: "Agent notifié", desc: "Notification envoyée par email", time: "Aujourd'hui 14h33", done: true },
    { icon: "ti-calendar", label: "Visite à programmer", desc: "En attente de confirmation", time: "", done: false, active: false },
    { icon: "ti-file-text", label: "Offre à soumettre", desc: "En attente", time: "", done: false },
    { icon: "ti-home-check", label: "Achat finalisé", desc: "En attente", time: "", done: false },
  ]},
  { id: 2, name: "Karim Benali", type: "Location", detail: "Studio Lyon", budget: "800€/mois", channel: "whatsapp", score: "faible", stage: "nouveau", date: "Il y a 5h", timeline: [
    { icon: "ti-brand-whatsapp", label: "Message reçu", desc: "WhatsApp — Cherche un studio pas trop cher", time: "Aujourd'hui 11h15", done: true },
    { icon: "ti-robot", label: "Qualification auto", desc: "Score FAIBLE — Budget très serré, pas de garant", time: "Aujourd'hui 11h15", done: true },
    { icon: "ti-bell", label: "Agent notifié", desc: "Notification envoyée", time: "Aujourd'hui 11h16", done: true },
    { icon: "ti-calendar", label: "Visite à programmer", desc: "En attente", time: "", done: false },
    { icon: "ti-file-text", label: "Offre à soumettre", desc: "En attente", time: "", done: false },
    { icon: "ti-home-check", label: "Achat finalisé", desc: "En attente", time: "", done: false },
  ]},
  { id: 3, name: "Sophie Martin", type: "Achat", detail: "Maison Lyon", budget: "380k€", channel: "email", score: "bon", stage: "qualifie", date: "Hier", timeline: [
    { icon: "ti-mail", label: "Message reçu", desc: "Email — Cherche maison avec jardin", time: "Hier 09h00", done: true },
    { icon: "ti-robot", label: "Qualification auto", desc: "Score BON — Financement confirmé, délai 1 mois", time: "Hier 09h01", done: true },
    { icon: "ti-bell", label: "Agent notifié", desc: "Notifié — Lead BON prioritaire", time: "Hier 09h01", done: true },
    { icon: "ti-calendar", label: "Visite à programmer", desc: "Contact en cours avec l'agent", time: "Hier 16h00", done: true },
    { icon: "ti-file-text", label: "Offre à soumettre", desc: "En attente après visite", time: "", done: false },
    { icon: "ti-home-check", label: "Achat finalisé", desc: "En attente", time: "", done: false },
  ]},
  { id: 4, name: "Ahmed Berred", type: "Achat", detail: "Appart Bordeaux", budget: "280k€", channel: "whatsapp", score: "bon", stage: "visite", date: "Visite Sam. 15h", timeline: [
    { icon: "ti-brand-whatsapp", label: "Message reçu", desc: "WhatsApp — Intéressé par appart Bordeaux", time: "Lun. 14h32", done: true },
    { icon: "ti-robot", label: "Qualification auto", desc: "Score BON — Budget confirmé, prêt accordé", time: "Lun. 14h33", done: true },
    { icon: "ti-bell", label: "Agent notifié", desc: "Notifié — Lead BON à traiter", time: "Lun. 14h33", done: true },
    { icon: "ti-calendar", label: "Visite programmée", desc: "Samedi 13 mai à 15h00 — 12 rue de la Paix", time: "Sam. 15h00", done: false, active: true },
    { icon: "ti-file-text", label: "Offre à soumettre", desc: "En attente après la visite", time: "", done: false },
    { icon: "ti-home-check", label: "Achat finalisé", desc: "En attente", time: "", done: false },
  ]},
  { id: 5, name: "Pierre Leblanc", type: "Achat", detail: "Villa Marseille", budget: "320k€", channel: "whatsapp", score: "bon", stage: "offre", date: "Offre à 320k€", timeline: [
    { icon: "ti-brand-whatsapp", label: "Message reçu", desc: "WhatsApp — Villa avec piscine", time: "Il y a 5j", done: true },
    { icon: "ti-robot", label: "Qualification auto", desc: "Score BON — Budget solide", time: "Il y a 5j", done: true },
    { icon: "ti-bell", label: "Agent notifié", desc: "Notifié", time: "Il y a 5j", done: true },
    { icon: "ti-calendar", label: "Visite effectuée", desc: "Visite réalisée le 8 mai", time: "8 mai", done: true },
    { icon: "ti-file-text", label: "Offre soumise", desc: "Offre à 320 000€ — En négociation", time: "Hier", done: true, active: true },
    { icon: "ti-home-check", label: "Achat finalisé", desc: "En attente de signature", time: "", done: false },
  ]},
  { id: 6, name: "Julie Bernard", type: "Achat", detail: "T4 Paris 11e", budget: "485k€", channel: "email", score: "bon", stage: "vendu", date: "Vendu 485k€", timeline: [
    { icon: "ti-mail", label: "Message reçu", desc: "Email — Grand appartement familial", time: "Il y a 3 sem.", done: true },
    { icon: "ti-robot", label: "Qualification auto", desc: "Score BON", time: "Il y a 3 sem.", done: true },
    { icon: "ti-bell", label: "Agent notifié", desc: "Notifié", time: "Il y a 3 sem.", done: true },
    { icon: "ti-calendar", label: "Visite effectuée", desc: "Visite réalisée", time: "Il y a 2 sem.", done: true },
    { icon: "ti-file-text", label: "Offre acceptée", desc: "Offre à 485 000€ acceptée", time: "Il y a 1 sem.", done: true },
    { icon: "ti-home-check", label: "Achat finalisé", desc: "Compromis signé — Vente conclue!", time: "Hier", done: true },
  ]},
];

function ScoreBadge({ score }) {
  const map = { bon: ["score-high", "BON"], moyen: ["score-mid", "MOYEN"], faible: ["score-low", "FAIBLE"] };
  const [cls, label] = map[score] || ["score-mid", score];
  return <span className={`lead-score ${cls}`}>{label}</span>;
}

function ChannelIcon({ channel }) {
  return channel === "whatsapp"
    ? <span className="lead-channel"><i className="ti ti-brand-whatsapp" aria-hidden="true"></i> WhatsApp</span>
    : <span className="lead-channel"><i className="ti ti-mail" aria-hidden="true"></i> Email</span>;
}

function Timeline({ items }) {
  return (
    <div className="timeline">
      {items.map((item, i) => (
        <div key={i} className={`tl-item ${i < items.length - 1 ? "has-line" : ""}`}>
          <div className={`tl-icon ${item.done ? "done" : item.active ? "active" : "pending"}`}>
            <i className={`ti ${item.icon}`} aria-hidden="true"></i>
          </div>
          <div className="tl-content">
            <p className={`tl-title ${!item.done && !item.active ? "muted" : ""}`}>{item.label}</p>
            <p className="tl-desc">{item.desc}</p>
            {item.time && <p className="tl-time">{item.time}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("pipeline");
  const [selectedLead, setSelectedLead] = useState(null);
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ connected: false });
  const [emailForm, setEmailForm] = useState({ email: "", password: "", smtpHost: "", smtpPort: "587", imapHost: "", imapPort: "993" });
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr || !token) { window.location.href = "/"; return; }
    try { setUser(JSON.parse(userStr)); } catch { window.location.href = "/"; }
   fetchEmailStatus();
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.leads && data.leads.length > 0) {
        const formattedLeads = data.leads.map(l => ({
          id: l.id,
          name: `${l.first_name} ${l.last_name}`,
          type: l.type || "Achat",
          detail: l.city || "Non renseigné",
          budget: l.budget || "Non renseigné",
          channel: l.channel || "email",
          score: l.score || "moyen",
          stage: l.stage || "nouveau",
          date: new Date(l.created_at).toLocaleDateString("fr-FR"),
          timeline: [
            { icon: "ti-mail", label: "Message reçu", desc: "Prospect intéressé", time: new Date(l.created_at).toLocaleDateString("fr-FR"), done: true },
            { icon: "ti-robot", label: "Qualification automatique", desc: `Score ${l.score?.toUpperCase()}`, time: new Date(l.created_at).toLocaleDateString("fr-FR"), done: true },
            { icon: "ti-bell", label: "Agent notifié", desc: "Notification envoyée", time: new Date(l.created_at).toLocaleDateString("fr-FR"), done: true },
            { icon: "ti-calendar", label: "Visite à programmer", desc: "En attente", time: "", done: ["visite","offre","vendu"].includes(l.stage), active: l.stage === "visite" },
            { icon: "ti-file-text", label: "Offre à soumettre", desc: "En attente", time: "", done: ["offre","vendu"].includes(l.stage), active: l.stage === "offre" },
            { icon: "ti-home-check", label: "Achat finalisé", desc: "En attente", time: "", done: l.stage === "vendu" },
          ]
        }));
        setLeads(formattedLeads);
      }
    } catch (err) {
      console.error("Erreur:", err);
    }
  };
  const fetchEmailStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/integrations/email`, { headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      setEmailStatus(data);
    } catch {}
  };

  const handleConnectEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true); setEmailError(""); setEmailSuccess("");
    try {
      const res = await fetch(`${API_URL}/api/integrations/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ...emailForm, provider: detectProvider(emailForm.email) })
      });
      const data = await res.json();
      if (data.success) { setEmailSuccess("Email connecté!"); setShowEmailForm(false); fetchEmailStatus(); }
      else { setEmailError(data.error || "Erreur"); }
    } catch { setEmailError("Erreur de connexion"); }
    finally { setEmailLoading(false); }
  };

  const detectProvider = (email) => {
    if (email.includes("@gmail.com")) return "gmail";
    if (email.includes("@outlook.com") || email.includes("@hotmail.com")) return "outlook";
    if (email.includes("@yahoo")) return "yahoo";
    return "custom";
  };

  const autoFillSmtp = (email) => {
    const p = detectProvider(email);
    const c = { gmail: { smtpHost: "smtp.gmail.com", smtpPort: "587", imapHost: "imap.gmail.com", imapPort: "993" }, outlook: { smtpHost: "smtp-mail.outlook.com", smtpPort: "587", imapHost: "outlook.office365.com", imapPort: "993" }, yahoo: { smtpHost: "smtp.mail.yahoo.com", smtpPort: "587", imapHost: "imap.mail.yahoo.com", imapPort: "993" }, custom: { smtpHost: `smtp.${email.split("@")[1]||""}`, smtpPort: "587", imapHost: `imap.${email.split("@")[1]||""}`, imapPort: "993" } };
    setEmailForm(prev => ({ ...prev, email, ...c[p] }));
  };

  const handleUpgrade = async (plan) => {
    setLoadingStripe(true);
    try {
      const res = await fetch(`${API_URL}/api/stripe/create-checkout-session`, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify({ plan }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Erreur: " + (data.error || "Erreur inconnue"));
    } catch { alert("Erreur de connexion"); }
    finally { setLoadingStripe(false); }
  };

  const moveLeadToStage = (leadId, stageId) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: stageId } : l));
    if (selectedLead?.id === leadId) setSelectedLead(prev => ({ ...prev, stage: stageId }));
  };

  const getInitials = () => {
    if (!user) return "?";
    return ((user.first_name?.[0] || "") + (user.last_name?.[0] || "")).toUpperCase() || user.email[0].toUpperCase();
  };

  const getTrialDays = () => {
    if (!user?.trial_ends_date) return 7;
    return Math.max(0, Math.ceil((new Date(user.trial_ends_date) - new Date()) / 86400000));
  };

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  if (!user) return null;

  const tabs = [
    { id: "pipeline", label: "Pipeline", icon: "ti-layout-columns" },
    { id: "canaux", label: "Canaux", icon: "ti-plug" },
    { id: "pricing", label: "Offres", icon: "ti-credit-card" },
    { id: "settings", label: "Paramètres", icon: "ti-settings" },
  ];

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="nav-left">
          <div className="nav-logo">
            <div className="nav-logo-box"><span>LF</span></div>
            <span className="nav-logo-text">LeadForce</span>
          </div>
          <div className="nav-links">
            {tabs.map(t => (
              <span key={t.id} className={`nav-link ${activeTab === t.id ? "active" : ""}`} onClick={() => { setActiveTab(t.id); setSelectedLead(null); }}>
                <i className={`ti ${t.icon}`} aria-hidden="true"></i> {t.label}
              </span>
            ))}
          </div>
        </div>
        <div className="nav-right">
          <div className="trial-pill">{getTrialDays()}j d'essai</div>
          <div className="nav-notif"><i className="ti ti-bell" aria-hidden="true"></i></div>
          <div className="nav-avatar">{getInitials()}</div>
          <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} className="logout-btn">Déconnexion</button>
        </div>
      </nav>

      <div className="dashboard-body">

        {activeTab === "pipeline" && !selectedLead && (
          <>
            <div className="dashboard-header">
              <div>
                <h1>Pipeline leads</h1>
                <p style={{textTransform:"capitalize"}}>{today} · {leads.length} prospects actifs</p>
              </div>
              <div className="header-stats">
                <div className="hstat"><span className="hstat-n">{leads.filter(l=>l.score==="bon").length}</span><span className="hstat-l">Bons leads</span></div>
                <div className="hstat"><span className="hstat-n">{leads.filter(l=>l.stage==="vendu").length}</span><span className="hstat-l">Vendus</span></div>
                <div className="hstat"><span className="hstat-n">{leads.filter(l=>l.stage==="visite").length}</span><span className="hstat-l">Visites</span></div>
              </div>
            </div>

            <div className="kanban">
              {PIPELINE_STAGES.map(stage => {
                const stageLeads = leads.filter(l => l.stage === stage.id);
                return (
                  <div key={stage.id} className="kanban-col">
                    <div className={`kanban-header kh-${stage.color}`}>
                      <span className="kanban-title">{stage.label}</span>
                      <span className={`kanban-count kc-${stage.color}`}>{stageLeads.length}</span>
                    </div>
                    <div className="kanban-cards">
                      {stageLeads.map(lead => (
                        <div key={lead.id} className="lead-card" onClick={() => setSelectedLead(lead)}>
                          <p className="lead-name">{lead.name}</p>
                          <p className="lead-type">{lead.type} · {lead.detail}</p>
                          <p className="lead-budget">{lead.budget}</p>
                          <div className="lead-meta">
                            <ChannelIcon channel={lead.channel} />
                            <ScoreBadge score={lead.score} />
                          </div>
                          <p className="lead-date">{lead.date}</p>
                        </div>
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="kanban-empty">
                          <p>Aucun lead</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "pipeline" && selectedLead && (
          <>
            <div className="dashboard-header">
              <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
                <button className="back-btn" onClick={() => setSelectedLead(null)}>
                  <i className="ti ti-arrow-left" aria-hidden="true"></i> Pipeline
                </button>
                <div>
                  <h1>{selectedLead.name}</h1>
                  <p>{selectedLead.type} · {selectedLead.detail} · {selectedLead.budget}</p>
                </div>
              </div>
              <ScoreBadge score={selectedLead.score} />
            </div>

            <div className="lead-detail-grid">
              <div className="detail-left">
                <div className="detail-card">
                  <h3 className="detail-section-title">Informations</h3>
                  <div className="detail-rows">
                    <div className="detail-row"><span>Canal</span><span><ChannelIcon channel={selectedLead.channel} /></span></div>
                    <div className="detail-row"><span>Type</span><span>{selectedLead.type}</span></div>
                    <div className="detail-row"><span>Recherche</span><span>{selectedLead.detail}</span></div>
                    <div className="detail-row"><span>Budget</span><span style={{fontWeight:500}}>{selectedLead.budget}</span></div>
                    <div className="detail-row"><span>Score</span><span><ScoreBadge score={selectedLead.score} /></span></div>
                  </div>
                </div>

                <div className="detail-card">
                  <h3 className="detail-section-title">Avancer dans le pipeline</h3>
                  <div className="stage-buttons">
                    {PIPELINE_STAGES.map(s => (
                      <button
                        key={s.id}
                        className={`stage-btn ${selectedLead.stage === s.id ? "stage-btn-active" : ""}`}
                        onClick={() => moveLeadToStage(selectedLead.id, s.id)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="detail-right">
                <div className="detail-card">
                  <h3 className="detail-section-title">Suivi du prospect</h3>
                  <Timeline items={selectedLead.timeline} />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "canaux" && (
          <>
            <div className="dashboard-header">
              <h1>Canaux de communication</h1>
              <p>Connectez vos canaux pour qualifier les leads automatiquement</p>
            </div>
            <div className="canaux-grid">
              <div className="canal-card">
                <div className="canal-header">
                  <div className="canal-icon email"><i className="ti ti-mail" aria-hidden="true"></i></div>
                  <div className={`canal-status ${emailStatus.connected ? "connected" : "disconnected"}`}>{emailStatus.connected ? "Connecté" : "Non connecté"}</div>
                </div>
                <h3>Email universel</h3>
                <p>Gmail, Outlook, Yahoo, email professionnel — tous compatibles via SMTP/IMAP.</p>
                {emailStatus.connected ? (
                  <div>
                    <div className="canal-connected-info"><i className="ti ti-check" aria-hidden="true"></i><span>{emailStatus.email}</span><span className="provider-badge">{emailStatus.provider}</span></div>
                    <button className="canal-btn disconnect" onClick={async () => { await fetch(`${API_URL}/api/integrations/email`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } }); setEmailStatus({ connected: false }); }}>Déconnecter</button>
                  </div>
                ) : (
                  <button className="canal-btn" onClick={() => setShowEmailForm(!showEmailForm)}>{showEmailForm ? "Annuler" : "Connecter mon email →"}</button>
                )}
                {showEmailForm && !emailStatus.connected && (
                  <form onSubmit={handleConnectEmail} className="email-form">
                    {emailError && <div className="canal-error">{emailError}</div>}
                    {emailSuccess && <div className="canal-success">{emailSuccess}</div>}
                    <div className="email-form-group"><label>Adresse email</label><input type="email" placeholder="vous@exemple.com" value={emailForm.email} onChange={e => autoFillSmtp(e.target.value)} required /></div>
                    <div className="email-form-group"><label>Mot de passe / Mot de passe d'application</label><input type="password" placeholder="••••••••" value={emailForm.password} onChange={e => setEmailForm(p => ({...p, password: e.target.value}))} required /></div>
                    <div className="smtp-info"><i className="ti ti-info-circle" aria-hidden="true"></i><span>Config SMTP/IMAP auto-détectée</span></div>
                    <div className="smtp-grid">
                      <div className="email-form-group"><label>Serveur SMTP</label><input type="text" value={emailForm.smtpHost} onChange={e => setEmailForm(p => ({...p, smtpHost: e.target.value}))} /></div>
                      <div className="email-form-group"><label>Port SMTP</label><input type="number" value={emailForm.smtpPort} onChange={e => setEmailForm(p => ({...p, smtpPort: e.target.value}))} /></div>
                      <div className="email-form-group"><label>Serveur IMAP</label><input type="text" value={emailForm.imapHost} onChange={e => setEmailForm(p => ({...p, imapHost: e.target.value}))} /></div>
                      <div className="email-form-group"><label>Port IMAP</label><input type="number" value={emailForm.imapPort} onChange={e => setEmailForm(p => ({...p, imapPort: e.target.value}))} /></div>
                    </div>
                    <button type="submit" className="canal-btn" disabled={emailLoading}>{emailLoading ? "Connexion..." : "Connecter →"}</button>
                  </form>
                )}
              </div>

              <div className="canal-card">
                <div className="canal-header">
                  <div className="canal-icon whatsapp"><i className="ti ti-brand-whatsapp" aria-hidden="true"></i></div>
                  <div className="canal-status disconnected">Non connecté</div>
                </div>
                <h3>WhatsApp Business</h3>
                <p>Recevez et qualifiez les prospects via WhatsApp Business API officielle (Meta).</p>
                <button className="canal-btn" onClick={() => alert("Nécessite un compte WhatsApp Business API (Meta). Contactez-nous pour la configuration.")}>Configurer WhatsApp →</button>
              </div>

              <div className="canal-card coming-soon">
                <div className="canal-header">
                  <div className="canal-icon sms"><i className="ti ti-message" aria-hidden="true"></i></div>
                  <div className="canal-status soon">Bientôt</div>
                </div>
                <h3>SMS</h3>
                <p>Qualification automatique par SMS via Twilio. Disponible prochainement.</p>
                <button className="canal-btn disabled" disabled>Bientôt disponible</button>
              </div>
            </div>
            <div className="canal-note">
              <i className="ti ti-shield-check" aria-hidden="true"></i>
              <p>Pour Gmail: utilisez un mot de passe d'application (Paramètres Google → Sécurité). Pour Outlook: activez SMTP dans les paramètres. Vos identifiants sont chiffrés.</p>
            </div>
          </>
        )}

        {activeTab === "pricing" && (
          <>
            <div className="dashboard-header">
              <h1>Nos offres</h1>
              <p>Choisissez le plan adapté à votre activité</p>
            </div>
            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Agent Solo</h3>
                  <div className="pricing-price"><span className="price-amount">49€</span><span className="price-period">/mois</span></div>
                  <p className="pricing-desc">Pour les agents indépendants</p>
                </div>
                <ul className="pricing-features">
                  {["Qualification automatique des leads","Email universel (Gmail, Outlook, Yahoo, Pro)","WhatsApp Business API","Chatbot IA (Claude)","Pipeline CRM avec suivi prospect","Scoring automatique","Rapports quotidiens à 18h","Support email"].map(f => (
                    <li key={f}><i className="ti ti-check" aria-hidden="true"></i> {f}</li>
                  ))}
                </ul>
                <button className="pricing-btn primary" onClick={() => handleUpgrade("agent")} disabled={loadingStripe}>{loadingStripe ? "Chargement..." : "Commencer — 49€/mois"}</button>
              </div>
              <div className="pricing-card featured">
                <div className="pricing-badge">Populaire</div>
                <div className="pricing-header">
                  <h3>Agence</h3>
                  <div className="pricing-price"><span className="price-amount">199€</span><span className="price-period">/mois</span></div>
                  <p className="pricing-desc">Pour les agences immobilières</p>
                </div>
                <ul className="pricing-features">
                  {["Tout d'Agent Solo","5 agents inclus","+20€/agent supplémentaire","Dashboard équipe","Pipeline partagé entre agents","Rapports avancés","Support prioritaire","Onboarding personnalisé"].map(f => (
                    <li key={f}><i className="ti ti-check" aria-hidden="true"></i> {f}</li>
                  ))}
                </ul>
                <button className="pricing-btn featured-btn" onClick={() => handleUpgrade("agence")} disabled={loadingStripe}>{loadingStripe ? "Chargement..." : "Commencer — 199€/mois"}</button>
              </div>
            </div>
            <div className="pricing-note"><i className="ti ti-shield-check" aria-hidden="true"></i><p>Paiement sécurisé via Stripe — Annulation possible à tout moment — Sans engagement</p></div>
          </>
        )}

        {activeTab === "settings" && (
          <>
            <div className="dashboard-header"><h1>Paramètres</h1><p>Gérez votre compte et vos préférences</p></div>
            <div className="settings-card">
              <div className="settings-section">
                <h3>Informations du compte</h3>
                <div className="settings-row"><span className="settings-label">Email</span><span className="settings-value">{user.email}</span></div>
                <div className="settings-row"><span className="settings-label">Plan actuel</span><span className="settings-value"><span className="plan-badge">Essai gratuit</span></span></div>
                <div className="settings-row"><span className="settings-label">Essai expire le</span><span className="settings-value">{user.trial_ends_date ? new Date(user.trial_ends_date).toLocaleDateString("fr-FR") : "—"}</span></div>
              </div>
              <div className="settings-section">
                <h3>Canaux connectés</h3>
                <div className="settings-row"><span className="settings-label">Email</span><span className="settings-value">{emailStatus.connected ? <span className="connected-badge">✓ {emailStatus.email}</span> : <span style={{color:"#AAA"}}>Non connecté</span>}</span></div>
                <div className="settings-row"><span className="settings-label">WhatsApp</span><span className="settings-value" style={{color:"#AAA"}}>Non connecté</span></div>
              </div>
              <div className="settings-section">
                <h3>Danger</h3>
                <button className="danger-btn" onClick={() => { localStorage.clear(); window.location.href = "/"; }}><i className="ti ti-logout" aria-hidden="true"></i> Se déconnecter</button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
