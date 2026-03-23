# Plant Disease Detection Backend

FastAPI backend for Plant Village dataset classification (38 disease classes).

## Features
- **FastAPI** - High-performance, modern Python framework
- **TensorFlow/Keras** - Deep learning predictions using MobileNetV2
- **CORS enabled** - Works with React frontend
- **Auto-detection** - Maps 38 classes to Healthy/Mild/Severe severity levels
- **Confidence scores** - Returns prediction confidence

---

## Installation

### 1. Prerequisites
- Python 3.8+
- pip

### 2. Install Dependencies

```bash
cd "d:\Dataset\Plant Village Dataset\backend"
pip install -r requirements.txt
```

### 3. Prepare Model
See `MODEL_EXPORT.md` for how to export the trained model from your notebook.

After exporting, place the model file in the backend directory:
```
backend/Final_PlantVillage38_model.keras
```

Or update the `MODEL_PATH` in `.env`

---

## Configuration

Edit `.env` file in the backend folder:
```env
MODEL_PATH=Final_PlantVillage38_model.keras
PORT=8000
ENVIRONMENT=development
```

---

## Running the Server

### Development Mode (with auto-reload)
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## API Endpoints

### 1. Root Endpoint
```
GET /
```
Response:
```json
{
  "message": "Plant Disease Detection API",
  "status": "running",
  "endpoints": {
    "predict": "/predict",
    "health": "/health",
    "docs": "/docs"
  }
}
```

### 2. Health Check
```
GET /health
```
Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "classes_count": 38
}
```

### 3. Predict Disease (Main Endpoint)
```
POST /predict
Content-Type: multipart/form-data
```

**Request:**
```
file: <image_file>
```

**Response:**
```json
{
  "class_name": "Tomato___Early_blight",
  "prediction": "Mild",
  "confidence": 0.9542,
  "severity": "mild",
  "all_predictions": {
    "Tomato___Early_blight": 0.9542,
    "Tomato___Late_blight": 0.0358,
    ...
  }
}
```

---

## Frontend Integration

Update your frontend `.env` file:

### .env.local (in frontend folder)
```
REACT_APP_API_URL=http://localhost:8000/predict
```

### Production
```
REACT_APP_API_URL=https://your-backend-url.com/predict
```

The React component (`home.js`) already expects the correct response format:
- `prediction`: "Healthy" | "Mild" | "Severe"
- `confidence`: float (0-1)

---

## API Documentation

Once the server is running, visit:
```
http://localhost:8000/docs
```

This opens **Swagger UI** with interactive API documentation.

---

## Class Mapping

The 38 Plant Village classes are automatically categorized:

### Healthy Classes (14)
- Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato

### Mild Diseases (20)
Early-stage diseases requiring monitoring and management:
- Black rot, Rust, Powdery mildew, Leaf scorch, etc.

### Severe Diseases (18)
Advanced-stage diseases requiring immediate action:
- Late blight, Viral infections, Advanced leaf mold, etc.

See `class_mapping.py` for the complete mapping.

---

## Troubleshooting

### Model not found
**Error:** `Model file not found at Final_PlantVillage38_model.keras`

**Solution:**
1. Export model from your notebook (see MODEL_EXPORT.md)
2. Place .keras file in backend directory OR
3. Update `MODEL_PATH` in `.env` with correct path

### CORS Issues
The CORS middleware is already configured to accept all origins:
```python
allow_origins=["*"]
```

For production, restrict to your domain:
```python
allow_origins=["https://yourdomain.com"]
```

### Port Already in Use
```bash
# Use a different port
python -m uvicorn main:app --host 0.0.0.0 --port 8001
```

### Model Takes Too Long to Load
- This is normal for the first prediction (model loads on startup)
- Subsequent requests are fast (~100-300ms)

---

## File Structure
```
backend/
├── main.py              # FastAPI application
├── model_utils.py       # Model loading & prediction logic
├── class_mapping.py     # Class-to-severity mapping
├── requirements.txt     # Python dependencies
├── .env                 # Configuration (MODEL_PATH, PORT)
├── MODEL_EXPORT.md      # How to export model from notebook
└── README.md            # This file
```

---

## Performance Notes

- **Image preprocessing:** ~50ms
- **Model inference:** ~100-150ms  
- **Total response time:** ~200-300ms

---

## Next Steps

1. ✅ Export model from notebook
2. ✅ Place model in backend folder
3. ✅ Run backend server
4. ✅ Test API with frontend

For production deployment, consider:
- Using **Gunicorn** instead of Uvicorn
- Deploying to **Heroku**, **Railway**, **Google Cloud Run**, or **AWS**
- Adding authentication/rate limiting
- Using **Redis** for caching predictions
