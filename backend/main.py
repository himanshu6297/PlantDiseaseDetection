import logging
import os

from dotenv import load_dotenv
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from model_utils import predict
from chatbot_service import (
    get_disease_advice,
    generate_initial_chatbot_message,
    store_conversation,
    get_session_history,
    check_rate_limit,
    get_remaining_rate_limit,
    validate_confidence_tier,
    initialize_chatbot_service
)

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Plant Disease Detection API",
    description="Detect plant diseases using Deep Learning (MobileNetV2)",
    version="1.0.0"
)

# CORS middleware - allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MODEL_PATH = os.getenv("MODEL_PATH", "Final_PlantVillage38_model.keras")
PORT = int(os.getenv("PORT", 8000))

# Load class names and model on startup
class_names = None
model = None

@app.on_event("startup")
async def startup_event():
    """Load model and class names on startup"""
    global model, class_names
    try:
        logger.info("Loading model on startup...")
        
        if not os.path.exists(MODEL_PATH):
            logger.error(f"Model file not found at {MODEL_PATH}")
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        
        model = tf.keras.models.load_model(MODEL_PATH)
        
        # Initialize chatbot service
        initialize_chatbot_service()
        
        # Define class names (38 Plant Village classes - in alphabetical order as per training)
        class_names = [
            "Apple___Apple_scab",
            "Apple___Black_rot",
            "Apple___Cedar_apple_rust",
            "Apple___healthy",
            "Blueberry___healthy",
            "Cherry_(including_sour)___Powdery_mildew",
            "Cherry_(including_sour)___healthy",
            "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
            "Corn_(maize)___Common_rust_",
            "Corn_(maize)___Northern_Leaf_Blight",
            "Corn_(maize)___healthy",
            "Grape___Black_rot",
            "Grape___Esca_(Black_Measles)",
            "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
            "Grape___healthy",
            "Orange___Haunglongbing_(Citrus_greening)",
            "Peach___Bacterial_spot",
            "Peach___healthy",
            "Pepper,_bell___Bacterial_spot",
            "Pepper,_bell___healthy",
            "Potato___Early_blight",
            "Potato___Late_blight",
            "Potato___healthy",
            "Raspberry___healthy",
            "Soybean___healthy",
            "Squash___Powdery_mildew",
            "Strawberry___Leaf_scorch",
            "Strawberry___healthy",
            "Tomato___Bacterial_spot",
            "Tomato___Early_blight",
            "Tomato___Late_blight",
            "Tomato___Leaf_Mold",
            "Tomato___Septoria_leaf_spot",
            "Tomato___Spider_mites Two-spotted_spider_mite",
            "Tomato___Target_Spot",
            "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
            "Tomato___Tomato_mosaic_virus",
            "Tomato___healthy",
        ]
        
        logger.info(f"✓ Model loaded successfully! Loaded {len(class_names)} classes")
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        raise

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Plant Disease Detection API",
        "status": "running",
        "endpoints": {
            "predict": "/predict",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "classes_count": len(class_names) if class_names else 0
    }

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    """
    Predict plant disease from uploaded image
    
    Returns:
    {
        "class_name": str,
        "prediction": str (Healthy/Mild/Severe),
        "confidence": float (0-1),
        "severity": str
    }
    """
    try:
        if model is None or class_names is None:
            raise HTTPException(
                status_code=500,
                detail="Model not loaded. Please check server logs."
            )
        
        # Validate file
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="File must be an image"
            )
        
        # Read image file
        image_data = await file.read()
        
        if len(image_data) == 0:
            raise HTTPException(
                status_code=400,
                detail="Empty file"
            )
        
        # Make prediction using model_utils.predict
        result = predict(image_data, model, class_names)
        
        logger.info(f"Prediction: {result['prediction']} (confidence: {result['confidence']:.4f})")
        
        return JSONResponse(status_code=200, content=result)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.post("/chat")
async def chat_with_disease_advisor(
    session_id: str = Body(...),
    message: str = Body(None),
    prediction_data: dict = Body(...)
):
    """
    Chat with disease advisor. Returns structured JSON response.
    
    Request:
    {
        "session_id": "uuid",
        "message": "optional user question (required on subsequent calls)",
        "prediction_data": {
            "plant_type": "string",
            "disease_name": "string", 
            "confidence": 0.87,
            "severity": "Healthy|Mild|Severe",
            "top_predictions": [{"name": "disease", "confidence": 0.87}, ...]
        }
    }
    
    Response:
    {
        "status": "success|error",
        "answer": "string",
        "urgency_level": "low|medium|high",
        "safe_next_steps": [string, ...],
        "follow_up_questions": [string, ...],
        "disclaimer": "string",
        "remaining_rate_limit": int,
        "session_id": "uuid",
        "confidence_tier": 1-3,
        "timestamp": "ISO8601"
    }
    """
    try:
        from datetime import datetime
        
        # ==================== VALIDATION ====================
        
        # Validate session_id
        if not session_id or not isinstance(session_id, str):
            raise HTTPException(status_code=400, detail="Invalid session_id")
        
        # Validate prediction_data
        required_fields = ["plant_type", "disease_name", "confidence", "severity", "top_predictions"]
        for field in required_fields:
            if field not in prediction_data:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required field: {field}"
                )
        
        confidence = float(prediction_data.get("confidence", 0))
        
        # ==================== CONFIDENCE TIER LOGIC ====================
        
        confidence_tier = validate_confidence_tier(confidence)
        
        # Tier 1: Disable chatbot
        if confidence_tier == 1:
            return JSONResponse(
                status_code=200,
                content={
                    "status": "error",
                    "answer": "Detection confidence is below 30%. Please upload a clearer image.",
                    "urgency_level": "low",
                    "safe_next_steps": ["Take a clearer photo with better lighting", "Ensure leaf is in focus"],
                    "follow_up_questions": [],
                    "disclaimer": "Low confidence detection. Please retake image.",
                    "remaining_rate_limit": 10,
                    "session_id": session_id,
                    "confidence_tier": 1,
                    "timestamp": datetime.utcnow().isoformat()
                }
            )
        
        # ==================== RATE LIMITING ====================
        
        allowed, remaining = check_rate_limit(session_id, limit_per_hour=10)
        
        if not allowed:
            minutes_remaining = 60 - int((datetime.utcnow().timestamp() % 3600) / 60)
            return JSONResponse(
                status_code=429,
                content={
                    "status": "error",
                    "answer": f"You've reached the chat limit. Try again in {minutes_remaining} minutes.",
                    "urgency_level": "low",
                    "safe_next_steps": [],
                    "follow_up_questions": [],
                    "disclaimer": "Rate limit exceeded.",
                    "remaining_rate_limit": 0,
                    "session_id": session_id,
                    "confidence_tier": confidence_tier,
                    "timestamp": datetime.utcnow().isoformat()
                }
            )
        
        # ==================== MESSAGE VALIDATION & SANITIZATION ====================
        
        # Automatic first message (no user message required on first call)
        if not message or message.strip() == "":
            disease_name = prediction_data.get("disease_name", "Unknown")
            severity = prediction_data.get("severity", "Unknown")
            
            # Generate initial greeting
            response_data = generate_initial_chatbot_message(disease_name, confidence, severity)
            
            # Add remaining fields
            response_data["remaining_rate_limit"] = remaining
            response_data["session_id"] = session_id
            response_data["timestamp"] = datetime.utcnow().isoformat()
            
            # Store in conversation history
            store_conversation(session_id, "assistant", response_data["answer"])
            
            return JSONResponse(status_code=200, content=response_data)
        
        # Validate message length and content
        if len(message) > 500:
            raise HTTPException(status_code=400, detail="Message exceeds 500 characters")
        
        # Basic sanitization (check for injection patterns)
        suspicious_patterns = ["prompt=", "system:", "override:", "ignore:", "you are now"]
        message_lower = message.lower()
        for pattern in suspicious_patterns:
            if pattern in message_lower:
                logger.warning(f"Suspicious input pattern detected in session {session_id}: {pattern}")
                # Log but still process (system prompt is authoritative)
        
        # Store user message
        store_conversation(session_id, "user", message)
        
        # ==================== GET LLM RESPONSE ====================
        
        # Get conversation history (trimmed)
        history = get_session_history(session_id)
        
        # Get disease advice from LLM
        response_data = get_disease_advice(
            structured_prediction=prediction_data,
            user_message=message,
            conversation_history=history,
            confidence_tier=confidence_tier
        )
        
        # Store assistant response
        store_conversation(session_id, "assistant", response_data["answer"])
        
        # Add metadata to response
        response_data["remaining_rate_limit"] = remaining
        response_data["session_id"] = session_id
        response_data["confidence_tier"] = confidence_tier
        response_data["timestamp"] = datetime.utcnow().isoformat()
        
        logger.info(f"Chat response generated for session {session_id} (tier {confidence_tier})")
        
        return JSONResponse(status_code=200, content=response_data)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Chat request failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=PORT,
        reload=False
    )
