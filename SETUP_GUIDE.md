# Complete Setup Guide: Plant Disease Detection System

## 📋 Overview
Your system has two parts:
1. **Frontend** (React) - `home.js` - Already prepared ✓
2. **Backend** (FastAPI) - Python server for predictions - Just created

---

## 🚀 Step-by-Step Setup

### STEP 1: Export Model from Colab Notebook

Your trained model needs to be saved and downloaded.

**In your Colab notebook**, add this cell at the end:

```python
# Save the model
model.save("/content/drive/MyDrive/Final_PlantVillage38_model.keras")
print("✓ Model saved successfully!")

# Download it
from google.colab import files
files.download("/content/drive/MyDrive/Final_PlantVillage38_model.keras")
```

Run this cell to download the model file (~400-500 MB).

---

### STEP 2: Set Up Backend

#### 2.1 Place Model File
Copy the downloaded `Final_PlantVillage38_model.keras` to the backend folder:
```
d:\Dataset\Plant Village Dataset\backend\Final_PlantVillage38_model.keras
```

#### 2.2 Install Dependencies
Open PowerShell/Command Prompt and run:

```bash
cd "d:\Dataset\Plant Village Dataset\backend"
pip install -r requirements.txt
```

This will install:
- FastAPI
- TensorFlow
- Pillow (image processing)
- Other dependencies

**Installation time:** 5-10 minutes (first time)

#### 2.3 Start Backend Server

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
✓ Model loaded successfully! Loaded 38 classes
```

**Keep this terminal running while testing!**

---

### STEP 3: Set Up Frontend

#### 3.1 Create .env.local
In your frontend folder, create a new file: `.env.local`

```env
REACT_APP_API_URL=http://localhost:8000/predict
```

This tells React where the backend is located.

#### 3.2 Start Frontend
Open a new terminal and run:

```bash
cd "d:\Dataset\Plant Village Dataset\frontend"
npm start
```

This will open the app at `http://localhost:3000`

---

## ✅ Testing the System

### Test 1: Check Backend Health
Visit in your browser:
```
http://localhost:8000/health
```

Should show:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "classes_count": 38
}
```

### Test 2: Check API Docs
Visit in your browser:
```
http://localhost:8000/docs
```

This shows interactive Swagger documentation.

### Test 3: Test with Sample Image
In the frontend (http://localhost:3000):
1. Upload any leaf image
2. Wait for prediction (~2-3 seconds)
3. See prediction results

---

## 📁 Project Structure

```
d:\Dataset\Plant Village Dataset\
├── frontend/
│   ├── src/
│   │   └── home.js              ← Already configured ✓
│   ├── .env.local               ← Create this (Step 3.1)
│   ├── package.json
│   └── ...
│
└── backend/
    ├── main.py                  ← FastAPI app
    ├── model_utils.py           ← Model prediction logic
    ├── class_mapping.py         ← Disease categorization
    ├── requirements.txt         ← Dependencies (install these)
    ├── .env                     ← Configuration
    ├── Final_PlantVillage38_model.keras  ← Place model here
    ├── README.md                ← Backend documentation
    ├── MODEL_EXPORT.md          ← How to export model
    ├── setup.bat                ← Quick setup script (Windows)
    ├── test_api.py              ← Test script
    └── ...
```

---

## 🔄 Typical Workflow

### Development (Local Testing)

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Then open http://localhost:3000 and test!

### Production (Real Deployment)

Backend deployment options:
- **Heroku** (easiest for beginners)
- **Railway** (modern, fast)
- **Google Cloud Run** (serverless)
- **AWS** (comprehensive)
- **DigitalOcean** (affordable)

Update frontend `.env.local`:
```env
REACT_APP_API_URL=https://your-backend-url.com/predict
```

---

## 🔧 Troubleshooting

### Problem: "Model file not found"
**Solution:**
1. Download model from Colab (STEP 1)
2. Place in `backend/` folder
3. Restart backend server

### Problem: "Cannot connect to backend"
**Solution:**
1. Ensure backend is running on port 8000
2. Check firewall isn't blocking port 8000
3. Make sure `.env.local` has correct URL

### Problem: "Prediction very slow (>5 seconds)"
**Solution:**
This is normal for first prediction (model loads into GPU/CPU memory). Subsequent predictions are faster (~300ms).

### Problem: "Port 8000 already in use"
**Solution:**
```bash
# Use different port
python -m uvicorn main:app --reload --port 8001
# Then update .env.local with http://localhost:8001/predict
```

### Problem: Dependencies installation fails
**Solution:**
```bash
# Upgrade pip first
python -m pip install --upgrade pip
# Then try installing again
pip install -r requirements.txt
```

---

## 📊 What Happens When You Upload an Image

```
Frontend (React)
    ↓ (uploads image)
Backend API (FastAPI)
    ↓ (processes image)
TensorFlow Model
    ↓ (makes prediction)
Class Mapping
    ├─ Identifies which of 38 diseases
    └─ Maps to Healthy/Mild/Severe
    ↓
Frontend (React)
    ↓ (displays results)
User sees:
  - Disease name
  - Category (Healthy/Mild/Severe)
  - Confidence %
  - Guidance
```

---

## 🎯 Next Steps After Setup

1. ✅ Test with sample images
2. ✅ Verify predictions are accurate
3. ✅ Fine-tune model if needed (retrain in Colab)
4. ✅ Deploy to production server
5. ✅ Share with users

---

## 📞 Getting Help

If you encounter issues:

1. **Check backend logs** - Read terminal output carefully
2. **Check browser console** - F12 → Console tab
3. **Test API directly** - Use Swagger UI at http://localhost:8000/docs
4. **Run test script** - `python test_api.py image.jpg`

---

## ✨ Features Implemented

✅ Model trained on 38 plant disease classes
✅ Auto-detection of disease severity (Healthy/Mild/Severe)
✅ Confidence scores with predictions
✅ Fast inference (~300ms after warmup)
✅ Frontend displays results with guidance
✅ CORS enabled for any frontend
✅ Full API documentation
✅ Health check endpoint
✅ Error handling and logging

---

**You're all set! Follow steps 1-3 and you'll have a working plant disease detection system. Good luck! 🌱**
