const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Prompts for different conversation flows
const CLASSIFICATION_PROMPT = `Tu es un expert en qualification immobilière. 
Analyse ce message et détermine:
1. Est-ce un PROSPECT (message lié à l'immobilier) ou NON-PROSPECT (personnel)?
2. Si PROSPECT: est-ce un RÉPONDEUR (répond à une annonce) ou DEMANDEUR (cherche un bien)?
3. Identifie les références d'annonce si présentes.

Réponds UNIQUEMENT en JSON:
{
  "is_prospect": true/false,
  "type": "respondeur" ou "demandeur",
  "annonce_id": "12345" ou null,
  "confidence": 0.95
}`;

const RESPONDEUR_QUESTIONS = {
  1: "Merci ! Quelques questions rapides pour accélérer. Vous pouvez visiter quand ?",
  2: "Très bien. Votre financement est confirmé ?",
  3: "Parfait ! Un dernier détail: vous êtes actuellement libre ou occupé ?"
};

const DEMANDEUR_QUESTIONS = {
  1: "Bonjour ! Quelques questions rapides pour mieux comprendre votre demande. Quel est votre budget ?",
  2: "Merci. Quelle(s) localisation(s) précisément ?",
  3: "C'est pour un achat ou une location ?",
  4: "Quel délai pour votre achat/location ?",
  5: "Type de bien cherché ? (appart, maison, studio, etc)",
  6: "Neuf ou ancien ?",
  7: "Y a-t-il des critères spécifiques ? (surface, étage, balcon, parking, etc)"
};

// Classify incoming message
async function classifyMessage(messageContent) {
  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-20250805',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `${CLASSIFICATION_PROMPT}\n\nMessage à analyser: "${messageContent}"`
        }
      ]
    });
    
    const jsonStr = response.content[0].text;
    const result = JSON.parse(jsonStr);
    return result;
  } catch (err) {
    console.error('Classification error:', err);
    return {
      is_prospect: false,
      type: null,
      annonce_id: null,
      confidence: 0
    };
  }
}

// Get next chatbot question
async function getNextQuestion(conversationType, questionsAnswered, messageHistory) {
  try {
    const questions = conversationType === 'respondeur' ? RESPONDEUR_QUESTIONS : DEMANDEUR_QUESTIONS;
    const nextQuestionNumber = questionsAnswered + 1;
    
    if (!questions[nextQuestionNumber]) {
      // All questions answered, ready to send form
      return {
        type: 'form',
        message: 'Merci pour ces infos ! Pour finaliser, remplissez ce formulaire rapide (2 min) :'
      };
    }
    
    return {
      type: 'question',
      question: questions[nextQuestionNumber],
      question_number: nextQuestionNumber
    };
  } catch (err) {
    console.error('Get next question error:', err);
    return null;
  }
}

// Score conversation based on responses
async function scoreConversation(conversationType, responses, formData) {
  try {
    let score = 0;
    let details = {};
    
    if (conversationType === 'respondeur') {
      // RESPONDEUR SCORING
      // Q1: Disponibilité visite
      if (responses[1] && responses[1].toLowerCase().includes('semaine')) {
        score += 25;
        details.visit_availability = 'this_week';
      } else {
        details.visit_availability = 'later';
      }
      
      // Q2: Achat/Location
      const isAchat = responses[2] && responses[2].toLowerCase().includes('achat');
      details.type_transaction = isAchat ? 'achat' : 'location';
      
      if (isAchat) {
        // Q3a: Financement
        if (responses[3] && responses[3].toLowerCase().includes('oui')) {
          score += 20;
          details.financing = 'confirmed';
        } else {
          details.financing = 'pending';
        }
      } else {
        // Q3b: Salaire
        if (responses[3]) {
          const salary = parseInt(responses[3]);
          if (salary > 2000) {
            score += 20;
            details.salary_level = 'high';
          } else {
            details.salary_level = 'low';
          }
        }
      }
      
      // Complétude des réponses
      score += 10;
      details.completeness = 'complete';
      
      // Classification
      let classification = 'faible';
      if (score >= 38) classification = 'bon';
      else if (score >= 24) classification = 'moyen';
      
      return {
        score,
        classification,
        details,
        maxScore: 55
      };
    } else {
      // DEMANDEUR SCORING
      // Budget
      if (responses[1]) {
        score += 20;
        details.budget = responses[1];
      }
      
      // Localisation
      if (responses[2]) {
        score += 15;
        details.location = responses[2];
      }
      
      // Urgence (délai)
      if (responses[4] && responses[4].toLowerCase().includes('immédiat')) {
        score += 15;
        details.urgency = 'immediate';
      } else {
        details.urgency = 'not_urgent';
      }
      
      // Complétude
      score += 10;
      details.completeness = 'complete';
      
      // Classification
      let classification = 'faible';
      if (score >= 41) classification = 'bon';
      else if (score >= 21) classification = 'moyen';
      
      return {
        score,
        classification,
        details,
        maxScore: 60
      };
    }
  } catch (err) {
    console.error('Scoring error:', err);
    return {
      score: 0,
      classification: 'faible',
      details: {},
      maxScore: 60
    };
  }
}

// Check if prospect message is legitimate (not spam/personal)
async function isLegitimateProspect(messageContent) {
  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-20250805',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `Cet email/message est-il sérieusement lié à l'immobilier (achat/vente/location) ou est-ce un message personnel?
          
Message: "${messageContent}"

Réponds SEULEMENT avec: "PROSPECT" ou "PERSONNEL"`
        }
      ]
    });
    
    const response_text = response.content[0].text.trim().toUpperCase();
    return response_text === 'PROSPECT';
  } catch (err) {
    console.error('Legitimacy check error:', err);
    return true; // Default to prospect if error
  }
}

module.exports = {
  classifyMessage,
  getNextQuestion,
  scoreConversation,
  isLegitimateProspect,
  RESPONDEUR_QUESTIONS,
  DEMANDEUR_QUESTIONS
};
