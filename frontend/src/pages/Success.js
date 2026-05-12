import React from "react";

function Success() {
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F5F4F1",fontFamily:"Inter,sans-serif"}}>
      <div style={{background:"white",border:"0.5px solid #E5E4E0",borderRadius:"16px",padding:"2.5rem",maxWidth:"400px",textAlign:"center"}}>
        <div style={{fontSize:"48px",marginBottom:"1rem"}}>🎉</div>
        <h1 style={{fontSize:"22px",fontWeight:"600",color:"#1A1A1A",marginBottom:"8px"}}>Paiement réussi!</h1>
        <p style={{fontSize:"14px",color:"#888",marginBottom:"2rem"}}>Votre abonnement LeadForce est activé. Bienvenue!</p>
        <button onClick={() => window.location.href="/"} style={{width:"100%",padding:"11px",background:"#5B4CF5",color:"white",border:"none",borderRadius:"10px",fontSize:"14px",fontWeight:"500",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
          Accéder à mon dashboard →
        </button>
      </div>
    </div>
  );
}

export default Success;