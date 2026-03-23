# ⚡ Quick Reference Card

## 🚀 Commands to Remember

### Setup (One-Time)
```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Create frontend .env.local
echo REACT_APP_API_URL=http://localhost:8000/predict > frontend\.env.local
```

### Running (Every Time)

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload
# ✓ Runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# ✓ Opens http://localhost:3000
```

---

## 🌐 Important URLs

**Frontend:** http://localhost:3000
**Backend API:** http://localhost:8000
**API Docs:** http://localhost:8000/docs
**Health Check:** http://localhost:8000/health

---

## 📋 File Locations

**Backend:** `d:\Dataset\Plant Village Dataset\backend\`
**Frontend:** `d:\Dataset\Plant Village Dataset\frontend\`
**Model:** `d:\Dataset\Plant Village Dataset\backend\Final_PlantVillage38_model.keras` (download from Colab)
**Frontend Config:** `d:\Dataset\Plant Village Dataset\frontend\.env.local`

---

## 🔌 API Endpoint

**POST** `/predict`
```bash
# Using curl
curl -X POST "http://localhost:8000/predict" \
  -F "file=@image.jpg"

# Response
{
  "class_name": "Tomato___Early_blight",
  "prediction": "Mild",
  "confidence": 0.9542,
  "severity": "mild"
}
```

---

## ⚙️ Environment Variables

**Backend (.env):**
```env
MODEL_PATH=Final_PlantVillage38_model.keras
PORT=8000
```

**Frontend (.env.local):**
```env
REACT_APP_API_URL=http://localhost:8000/predict
```

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| Port 8000 in use | Change `--port 8001` in backend command |
| Model not found | Download from Colab, place in backend/ |
| Can't connect to backend | Start backend first, check firewall |
| Slow first prediction | Normal (model loads), 2nd+ are fast |
| Import error | Run `pip install -r requirements.txt` |

---

## 📊 Prediction Categories

**Input:** 38 Plant Disease Classes
**Output Options:**
- 🟢 **Healthy** (14 classes)
- 🟡 **Mild** (20 classes)
- 🔴 **Severe** (18 classes)

---

## ✅ Testing Checklist

- [ ] Backend running (`npm run start` shows loaded model)
- [ ] Frontend .env.local created
- [ ] Frontend running (`npm start` on port 3000)
- [ ] Health check passes (http://localhost:8000/health)
- [ ] Upload test image, get prediction
- [ ] Verify frontend shows Healthy/Mild/Severe category
- [ ] Verify confidence percentage displays

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SETUP_GUIDE.md` | Complete step-by-step setup |
| `backend/README.md` | Backend API documentation |
| `backend/MODEL_EXPORT.md` | How to export model from Colab |
| `IMPLEMENTATION_SUMMARY.md` | What was created and why |

---

## 🎯 Production Deployment

Once working locally, deploy backend to:
- Heroku
- Railway
- Google Cloud Run
- AWS
- DigitalOcean

Update frontend `.env.local`:
```env
REACT_APP_API_URL=https://your-backend-url.com/predict
```

---

**Bookmark this page for quick reference!**
