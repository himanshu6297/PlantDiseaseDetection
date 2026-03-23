from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

# -------------------------
# CORS
# -------------------------
origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Load model
# -------------------------
MODEL_PATH = "model/severity_best_model_version-1.keras"
MODEL = tf.keras.models.load_model(MODEL_PATH)

# -------------------------
# Class names - EXACT order from training notebook
# -------------------------
CLASS_NAMES = [
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

# -------------------------
# Disease severity mapping - Categorize diseases
# -------------------------
SEVERITY_MAP = {
    # Healthy
    "Apple___healthy": "Healthy",
    "Blueberry___healthy": "Healthy",
    "Cherry_(including_sour)___healthy": "Healthy",
    "Corn_(maize)___healthy": "Healthy",
    "Grape___healthy": "Healthy",
    "Orange___Haunglongbing_(Citrus_greening)": "Healthy",
    "Peach___healthy": "Healthy",
    "Pepper,_bell___healthy": "Healthy",
    "Potato___healthy": "Healthy",
    "Raspberry___healthy": "Healthy",
    "Soybean___healthy": "Healthy",
    "Squash___Powdery_mildew": "Healthy",
    "Strawberry___healthy": "Healthy",
    "Tomato___healthy": "Healthy",
    
    # Mild
    "Apple___Apple_scab": "Mild",
    "Apple___Black_rot": "Mild",
    "Apple___Cedar_apple_rust": "Mild",
    "Cherry_(including_sour)___Powdery_mildew": "Mild",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": "Mild",
    "Corn_(maize)___Common_rust_": "Mild",
    "Corn_(maize)___Northern_Leaf_Blight": "Mild",
    "Grape___Black_rot": "Mild",
    "Grape___Esca_(Black_Measles)": "Mild",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": "Mild",
    "Peach___Bacterial_spot": "Mild",
    "Pepper,_bell___Bacterial_spot": "Mild",
    "Potato___Early_blight": "Mild",
    "Strawberry___Leaf_scorch": "Mild",
    "Tomato___Bacterial_spot": "Mild",
    "Tomato___Target_Spot": "Mild",
    
    # Severe
    "Potato___Late_blight": "Severe",
    "Squash___Powdery_mildew": "Severe",
    "Tomato___Early_blight": "Severe",
    "Tomato___Late_blight": "Severe",
    "Tomato___Leaf_Mold": "Severe",
    "Tomato___Septoria_leaf_spot": "Severe",
    "Tomato___Spider_mites Two-spotted_spider_mite": "Severe",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "Severe",
    "Tomato___Tomato_mosaic_virus": "Severe",
}


# Safety check: model output classes must match CLASS_NAMES length
out_classes = MODEL.output_shape[-1]
if out_classes != len(CLASS_NAMES):
    raise ValueError(
        f"Model outputs {out_classes} classes but CLASS_NAMES has {len(CLASS_NAMES)}.\n"
        f"Fix CLASS_NAMES to have exactly {out_classes} items."
    )

# Auto-detect model input size (no more 128 vs 256 problems)
# Usually input_shape is (None, H, W, C)
in_shape = MODEL.input_shape
H, W = in_shape[1], in_shape[2]

if H is None or W is None:
    # fallback if model allows dynamic size (rare)
    IMG_SIZE = (128, 128)
else:
    IMG_SIZE = (int(W), int(H))  # PIL uses (width, height)

@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive", "model_input_size": IMG_SIZE, "num_classes": out_classes}

def preprocess_image(data: bytes) -> np.ndarray:
    # Open and force RGB (3 channels)
    img = Image.open(BytesIO(data)).convert("RGB")

    # Resize to model's expected input size
    img = img.resize(IMG_SIZE)

    # Convert to float32 and normalize to [0,1]
    #arr = np.array(img, dtype=np.float32) / 255.0
    arr = np.array(img, dtype=np.float32)   # NO /255 because model already has Rescaling
    arr = np.expand_dims(arr, axis=0)

    return arr

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        raw = await file.read()

        image = preprocess_image(raw)
        preds = MODEL.predict(image, verbose=0)[0]
        idx = int(np.argmax(preds))
        
        # Get the disease class name
        disease_class = CLASS_NAMES[idx]
        confidence = float(preds[idx])
        
        # Get severity category (Healthy/Mild/Severe)
        prediction = SEVERITY_MAP.get(disease_class, "Severe")  # Default to Severe if not found

        # Response with prediction category
        return {
            "class_name": disease_class,
            "prediction": prediction,  # Healthy, Mild, or Severe
            "confidence": round(confidence, 4),
            "confidence_percent": round(confidence * 100, 2)
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    
if __name__ == "__main__":
    print("Model input shape:", MODEL.input_shape)
    print("Model output shape:", MODEL.output_shape)
    print("Number of classes:", MODEL.output_shape[-1])