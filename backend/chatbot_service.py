"""
Chatbot Service for Plant Disease Detection
Handles LLM integration, conversation management, and structured responses
"""

import os
import json
import time
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from openai import OpenAI
from dotenv import load_dotenv

# Setup logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Load environment variables
load_dotenv()

# Initialize OpenAI client
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
API_TYPE = os.getenv("API_TYPE", "responses")  # Primary or chat-completions
CONFIDENCE_THRESHOLD_TIER1 = float(os.getenv("CONFIDENCE_THRESHOLD_TIER1", "0.3"))
CONFIDENCE_THRESHOLD_TIER3 = float(os.getenv("CONFIDENCE_THRESHOLD_TIER3", "0.6"))
SESSION_TIMEOUT_HOURS = int(os.getenv("SESSION_TIMEOUT_HOURS", "24"))
CONVERSATION_HISTORY_MAX_MESSAGES = int(os.getenv("CONVERSATION_HISTORY_MAX_MESSAGES", "8"))

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not set in .env file")

client = OpenAI(api_key=OPENAI_API_KEY)

# MVP SESSION STORAGE - Upgrade to PostgreSQL + Redis for persistence, distributed rate limiting, and production scaling
sessions_db: Dict[str, Dict] = {}
rate_limit_db: Dict[str, Dict] = {}


# ==================== SYSTEM PROMPT ====================

SYSTEM_PROMPT = """You are an evidence-based agricultural disease guidance assistant. Provide ONLY general agricultural guidance based on plant disease detection.

MANDATORY SAFETY CONSTRAINTS:
✓ Respond ONLY about plant diseases and general agricultural practices
✗ NEVER prescribe specific pesticide types, dosages, or application rates
✗ NEVER guarantee disease cure rates, 100% prevention, or disease elimination
✗ NEVER make legal, regulatory, or compliance claims about disease management
✗ NEVER hallucinate treatments not based on established agricultural extension sources
✗ Refuse any question outside plant disease/agricultural scope
✗ For commercial crops or critical scenarios: 'I recommend consulting a certified agronomist.'

RESPONSE FORMAT (CRITICAL):
- Use NUMBERED BULLET POINTS with this format: "1. **Measure Name**: Description"
- For prevention steps, use: "To prevent [disease], consider these measures:"
- Always structure responses as a numbered list (1., 2., 3., etc.)
- Each point should be concise and actionable
- Keep total response under 200 words
- Use bold for key terms and measure names

For uncertainty: 'I don't have sufficient information to recommend this.'
Context: You are provided structured detection data including confidence scores and alternative disease predictions."""



# ==================== CONFIDENCE TIER LOGIC ====================

def validate_confidence_tier(confidence: float) -> int:
    """
    Determine confidence tier based on prediction confidence.
    
    Tier 1 (<30%): Chatbot disabled
    Tier 2 (30-60%): General guidance only with warning
    Tier 3 (>60%): Full disease-specific advice
    """
    if confidence < CONFIDENCE_THRESHOLD_TIER1:
        return 1
    elif confidence < CONFIDENCE_THRESHOLD_TIER3:
        return 2
    else:
        return 3


# ==================== STRUCTURED CONTEXT BUILDING ====================

def build_structured_context(prediction_data: Dict, confidence_tier: int) -> str:
    """
    Build structured context from prediction data for LLM.
    Adjusts context based on confidence tier.
    """
    plant_type = prediction_data.get("plant_type", "Unknown")
    disease_name = prediction_data.get("disease_name", "Unknown")
    confidence = prediction_data.get("confidence", 0.0)
    severity = prediction_data.get("severity", "Unknown")
    top_predictions = prediction_data.get("top_predictions", [])
    
    # Build confidence tier message
    tier_message = ""
    if confidence_tier == 1:
        tier_message = f"Detection confidence is below 30% - chatbot disabled."
    elif confidence_tier == 2:
        tier_message = f"Detection confidence is moderate ({confidence*100:.0f}%). General guidance provided; recommend professional inspection for commercial crops."
    else:
        tier_message = f"Detection confidence is high ({confidence*100:.0f}%). Full disease-specific advice enabled."
    
    # Build prediction context
    context = f"""
STRUCTURED PREDICTION DATA:
- Plant Type: {plant_type}
- Detected Disease: {disease_name}
- Confidence: {confidence*100:.1f}%
- Severity Level: {severity}
- Confidence Tier: {confidence_tier} ({tier_message})

Alternative Predictions (Top 3):
"""
    for i, pred in enumerate(top_predictions[:3], 1):
        context += f"\n{i}. {pred['name']}: {pred['confidence']*100:.1f}%"
    
    return context


# ==================== MESSAGE GENERATION ====================

def generate_initial_chatbot_message(disease_name: str, confidence: float, severity: str) -> Dict:
    """
    Generate automatic first message after disease detection.
    Returns structured response.
    """
    confidence_pct = confidence * 100
    
    message = f"Detected **{disease_name}** with **{confidence_pct:.0f}% confidence** ({severity.capitalize()} severity). I can help with symptom recognition, management strategies, and prevention tips. What would you like to know?"
    
    return {
        "status": "success",
        "answer": message,
        "urgency_level": "low" if severity == "Healthy" else ("medium" if severity == "Mild" else "high"),
        "safe_next_steps": [
            "Inspect leaves carefully for early symptoms",
            "Check nearby plants for disease spread",
            "Document weather conditions (humidity, temperature, rainfall)",
            "Plan preventive measures or treatments"
        ],
        "follow_up_questions": [
            "What are the early symptoms I should watch for?",
            "What preventive measures can I take?",
            "How quickly can this disease spread?",
            "Should I consult a professional?"
        ],
        "disclaimer": "This is general guidance only. Not a substitute for professional agronomic advice.",
        "confidence_tier": validate_confidence_tier(confidence)
    }


# ==================== CONVERSATION HISTORY MANAGEMENT ====================

def trim_conversation_history(messages: List[Dict], max_messages: int = CONVERSATION_HISTORY_MAX_MESSAGES) -> List[Dict]:
    """
    Trim conversation history to optimize LLM context window.
    Conversation trimming optimizes LLM context window usage and reduces token cost.
    """
    if len(messages) > max_messages:
        return messages[-max_messages:]
    return messages


def store_conversation(session_id: str, role: str, content: str, timestamp: str = None) -> None:
    """
    Store message in session history (MVP in-memory storage).
    """
    if session_id not in sessions_db:
        sessions_db[session_id] = {
            "messages": [],
            "created_at": datetime.utcnow().isoformat(),
            "last_activity": datetime.utcnow().isoformat(),
            "confidence_tier": 3
        }
    
    sessions_db[session_id]["messages"].append({
        "role": role,
        "content": content,
        "timestamp": timestamp or datetime.utcnow().isoformat()
    })
    
    sessions_db[session_id]["last_activity"] = datetime.utcnow().isoformat()


def get_session_history(session_id: str) -> List[Dict]:
    """
    Retrieve trimmed conversation history for session.
    """
    if session_id not in sessions_db:
        return []
    
    messages = sessions_db[session_id]["messages"]
    return trim_conversation_history(messages)


def cleanup_expired_sessions() -> None:
    """
    Auto-expire sessions after 24 hours of inactivity.
    Runs on app startup and periodically.
    """
    current_time = datetime.utcnow()
    expired_sessions = []
    
    for session_id, session_data in sessions_db.items():
        last_activity = datetime.fromisoformat(session_data["last_activity"])
        if (current_time - last_activity).hours > SESSION_TIMEOUT_HOURS:
            expired_sessions.append(session_id)
    
    for session_id in expired_sessions:
        del sessions_db[session_id]
        if session_id in rate_limit_db:
            del rate_limit_db[session_id]


# ==================== RATE LIMITING ====================

def check_rate_limit(session_id: str, limit_per_hour: int = 10) -> Tuple[bool, int]:
    """
    Check if session has exceeded rate limit (10 messages/hour by default).
    Returns: (is_allowed, remaining_limit)
    """
    current_time = time.time()
    
    if session_id not in rate_limit_db:
        rate_limit_db[session_id] = {
            "message_count": 0,
            "window_start": current_time
        }
        return True, limit_per_hour - 1
    
    rate_info = rate_limit_db[session_id]
    window_elapsed = current_time - rate_info["window_start"]
    
    # Reset window if older than 1 hour
    if window_elapsed > 3600:
        rate_limit_db[session_id] = {
            "message_count": 1,
            "window_start": current_time
        }
        return True, limit_per_hour - 1
    
    # Check if limit exceeded
    if rate_info["message_count"] >= limit_per_hour:
        return False, 0
    
    rate_limit_db[session_id]["message_count"] += 1
    remaining = limit_per_hour - rate_limit_db[session_id]["message_count"]
    return True, remaining


def get_remaining_rate_limit(session_id: str, limit_per_hour: int = 10) -> int:
    """Get remaining rate limit for session without incrementing."""
    if session_id not in rate_limit_db:
        return limit_per_hour
    
    current_time = time.time()
    rate_info = rate_limit_db[session_id]
    window_elapsed = current_time - rate_info["window_start"]
    
    if window_elapsed > 3600:
        return limit_per_hour
    
    remaining = limit_per_hour - rate_info["message_count"]
    return max(0, remaining)


# ==================== LLM INFERENCE ====================

def get_disease_advice(
    structured_prediction: Dict,
    user_message: str,
    conversation_history: List[Dict],
    confidence_tier: int
) -> Dict:
    """
    Call GPT-4o mini via Chat Completions API.
    Returns structured JSON response.
    """
    # Build context from structured prediction
    context = build_structured_context(structured_prediction, confidence_tier)
    
    # Adjust system prompt based on confidence tier
    adjusted_prompt = SYSTEM_PROMPT
    if confidence_tier == 2:
        adjusted_prompt += "\n\nIMPORTANT: This is a Tier 2 prediction (moderate confidence). Add a disclaimer and reduce certainty in your language. Recommend professional inspection."
    
    # Build messages for LLM (including conversation history)
    messages = []
    
    # Add history (already trimmed to 5-8 messages)
    for msg in conversation_history:
        messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    
    # Add current user message with context
    messages.append({
        "role": "user",
        "content": f"{context}\n\nUser Question: {user_message}"
    })
    
    # Call LLM using Chat Completions API (most reliable)
    try:
        # Use Chat Completions API with system prompt as first message
        full_messages = [{"role": "system", "content": adjusted_prompt}] + messages
        
        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=full_messages,
            max_tokens=300,
            temperature=0.7
        )
        
        answer = response.choices[0].message.content
        
        # Generate structured response
        urgency_level = "low"
        if structured_prediction.get("severity") == "Mild":
            urgency_level = "medium"
        elif structured_prediction.get("severity") == "Severe":
            urgency_level = "high"
        
        return {
            "status": "success",
            "answer": answer,
            "urgency_level": urgency_level,
            "safe_next_steps": [
                "Monitor plants regularly for symptom progression",
                "Maintain proper plant spacing for air circulation",
                "Water at soil level to keep leaves dry",
                "Follow integrated pest management (IPM) practices"
            ],
            "follow_up_questions": [
                "Are there resistant varieties available?",
                "What organic management options exist?",
                "How often should I monitor for this disease?",
                "When should I seek professional help?"
            ],
            "disclaimer": "This is general guidance only. Not a substitute for professional agronomic advice. Always consult local extension services for region-specific recommendations."
        }

    except Exception as e:
        # API failure handling - log the actual error for debugging
        error_msg = f"Error calling LLM: {type(e).__name__}: {str(e)}"
        logger.error(error_msg)
        print(f"❌ {error_msg}")
        
        # Return error response
        return {
            "status": "error",
            "answer": "I'm temporarily unavailable. Please try again in a few moments.",
            "urgency_level": "low",
            "safe_next_steps": [],
            "follow_up_questions": [],
            "disclaimer": "Service temporarily unavailable."
        }




# ==================== INITIALIZATION ====================

def initialize_chatbot_service():
    """Initialize chatbot service on app startup."""
    cleanup_expired_sessions()
    print("✓ Chatbot service initialized")
