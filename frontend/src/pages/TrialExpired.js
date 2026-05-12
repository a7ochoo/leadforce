import React, { useState } from "react";
import "../styles/TrialExpired.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function TrialExpired() {
  const [step, setStep] = useState("choice"); // choice, review, success
  const [review, setReview] = useState({
    rating: 0,
    liked: "",
    improved: "",
    recommend: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (review.rating === 0) { setError("Veuillez donner une note"); return; }
    if (review.liked.length < 50) { setError("Merci de détailler ce que vous avez aimé (min. 50 caractères)"); return; }
    if (review.improved.length < 50) { setError("Merci de détailler vos suggestions d'amélioration (min. 50 caractères)"); return; }

    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_URL}/api/reviews/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(review)
      });
      const data = await res.json();
      if (data.success) {
        setStep("success");
      } else {
        setError(data.error || "Erreur lors de la soumission");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = "/?tab=pricing";
  };

  const StarRating = () => (
    <div className="star-rating">
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          type="button"
          className={`star ${review.rating >= star ? "active" : ""}`}
          onClick={() => setReview(p => ({...p, rating: star}))}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="trial-expired-container">
      <div className="trial-expired-card">

        {step === "choice" && (
          <>
            <div className="expired-header">
              <div className="logo-row">
                <div className="logo-box"><span>LF</span></div>
                <span className="logo-text">LeadForce</span>
              </div>
              <div className="expired-icon">⏰</div>
              <h1>Votre essai gratuit est terminé</h1>
              <p>Merci d'avoir testé LeadForce pendant 7 jours. Choisissez la suite :</p>
            </div>

            <div className="choice-grid">
              <div className="choice-card offer">
                <div className="choice-badge">Offre exclusive</div>
                <div className="choice-icon">🎁</div>
                <h3>1 mois gratuit</h3>
                <p>Rédigez un avis détaillé sur votre expérience et recevez <strong>1 mois offert</strong> sur le plan Agent Solo.</p>
                <ul className="choice-list">
                  <li>✓ Avis de minimum 100 mots</li>
                  <li>✓ Ce qui vous a plu</li>
                  <li>✓ Vos suggestions d'amélioration</li>
                </ul>
                <button className="choice-btn offer-btn" onClick={() => setStep("review")}>
                  Rédiger mon avis →
                </button>
              </div>

              <div className="choice-card premium">
                <div className="choice-icon">🚀</div>
                <h3>Continuer directement</h3>
                <p>Souscrivez à un plan payant et continuez à qualifier vos leads sans interruption.</p>
                <div className="choice-prices">
                  <div className="choice-price">
                    <span className="price-amount">49€</span>
                    <span className="price-label">/mois — Agent Solo</span>
                  </div>
                  <div className="choice-price">
                    <span className="price-amount">199€</span>
                    <span className="price-label">/mois — Agence</span>
                  </div>
                </div>
                <button className="choice-btn premium-btn" onClick={handleUpgrade}>
                  Voir les offres →
                </button>
              </div>
            </div>
          </>
        )}

        {step === "review" && (
          <>
            <div className="expired-header">
              <div className="logo-row">
                <div className="logo-box"><span>LF</span></div>
                <span className="logo-text">LeadForce</span>
              </div>
              <div className="review-badge">1 mois gratuit en échange de votre avis</div>
              <h1>Partagez votre expérience</h1>
              <p>Votre avis nous aide à améliorer LeadForce. En échange, recevez 1 mois offert!</p>
            </div>

            {error && <div className="review-error">{error}</div>}

            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="review-group">
                <label>Note globale <span className="required">*</span></label>
                <StarRating />
              </div>

              <div className="review-group">
                <label>Qu'est-ce qui vous a le plus plu? <span className="required">*</span></label>
                <p className="review-hint">Fonctionnalités, facilité d'utilisation, gain de temps... (min. 50 caractères)</p>
                <textarea
                  placeholder="Ex: La qualification automatique des leads m'a fait gagner énormément de temps. Le scoring est très précis et..."
                  value={review.liked}
                  onChange={(e) => setReview(p => ({...p, liked: e.target.value}))}
                  required
                  rows={4}
                />
                <span className="char-count">{review.liked.length}/50 minimum</span>
              </div>

              <div className="review-group">
                <label>Que pouvons-nous améliorer? <span className="required">*</span></label>
                <p className="review-hint">Fonctionnalités manquantes, bugs, suggestions... (min. 50 caractères)</p>
                <textarea
                  placeholder="Ex: Il manque l'intégration avec les portails immobiliers comme SeLoger. Il serait utile de pouvoir..."
                  value={review.improved}
                  onChange={(e) => setReview(p => ({...p, improved: e.target.value}))}
                  required
                  rows={4}
                />
                <span className="char-count">{review.improved.length}/50 minimum</span>
              </div>

              <div className="review-group">
                <label>Recommanderiez-vous LeadForce à un collègue?</label>
                <div className="recommend-options">
                  {["Oui, absolument", "Probablement", "Pas sûr(e)", "Non"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={`recommend-btn ${review.recommend === opt ? "active" : ""}`}
                      onClick={() => setReview(p => ({...p, recommend: opt}))}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="review-group">
                <label>Votre prénom (pour personnaliser le mois offert)</label>
                <input
                  type="text"
                  placeholder="Ahmed"
                  value={review.name}
                  onChange={(e) => setReview(p => ({...p, name: e.target.value}))}
                />
              </div>

              <div className="review-actions">
                <button type="button" className="back-btn" onClick={() => setStep("choice")}>← Retour</button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Envoi en cours..." : "Soumettre et obtenir 1 mois gratuit →"}
                </button>
              </div>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="success-screen">
            <div className="success-icon">🎉</div>
            <h1>Merci pour votre avis!</h1>
            <p>Votre mois gratuit a été activé sur votre compte.</p>
            <div className="success-details">
              <div className="success-detail">
                <span className="detail-icon">✓</span>
                <span>1 mois gratuit activé</span>
              </div>
              <div className="success-detail">
                <span className="detail-icon">✓</span>
                <span>Accès complet à toutes les fonctionnalités</span>
              </div>
              <div className="success-detail">
                <span className="detail-icon">✓</span>
                <span>Votre avis va nous aider à améliorer LeadForce</span>
              </div>
            </div>
            <button className="continue-btn" onClick={() => window.location.href = "/"}>
              Accéder à mon dashboard →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default TrialExpired;
