# PlantVillage Android App - Quick Start

## ⚡ 5-Minute Setup

### Step 1: Convert Model (5 min)
```bash
cd android-app
python convert_model.py ../backend/Final_PlantVillage38_model.keras
```
Expected: Generates `plant_village_model.tflite` (~20 MB)

### Step 2: Copy Model to App
```bash
mkdir -p app/src/main/assets/models
cp plant_village_model.tflite app/src/main/assets/models/
```

### Step 3: Open in Android Studio
1. File → Open → Select `android-app` folder
2. Wait for Gradle sync (~2-3 min)
3. Connect Android device or start emulator
4. Click Run (green play button) or Shift+F10

### Step 4: Test App
- Click 📷 Camera or 🖼️ Gallery
- Select/capture a plant image
- Click 🔍 Scan Plant
- View results!

---

## 📱 What's Working Now

✅ **Core Features:**
- Camera capture from device camera
- Gallery selection from photos
- TensorFlow Lite offline inference (38 classes)
- Disease prediction with confidence %
- Chatbot disease advice (template-based)
- Prediction history with timestamps
- Offline operation (no server needed)

✅ **UI Elements:**
- Material Design interface
- Dark blue theme matching web app
- Image preview
- Results in organized cards
- Scrollable advices and chatbot responses

---

## 🔧 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Language** | Kotlin |
| **Framework** | Android SDK 24+ |
| **ML** | TensorFlow Lite 2.11 |
| **Database** | Room + SQLite |
| **Camera** | CameraX API |
| **Async** | Coroutines |
| **Build** | Gradle 7.4 |

---

## 📦 Project Structure

```
android-app/
├── app/
│   ├── src/main/
│   │   ├── assets/models/              # ← TFLite model goes here
│   │   │   └── plant_village_model.tflite
│   │   ├── java/com/plantvillage/detection/
│   │   │   ├── MainActivity.kt         # Main activity
│   │   │   ├── ModelInterpreter.kt     # TFLite inference
│   │   │   ├── ChatbotService.kt       # Disease advice
│   │   │   └── Database.kt             # History storage
│   │   ├── res/
│   │   │   ├── layout/activity_main.xml
│   │   │   ├── drawable/chatbot_bg.xml
│   │   │   └── values/strings.xml
│   │   └── AndroidManifest.xml
│   ├── build.gradle                   # Dependencies
│   └── proguard-rules.pro              # Optimization rules
├── convert_model.py                   # Model conversion script
└── README.md                          # Full documentation
```

---

## ⚠️ Common Issues

### Model Not Found
```
❌ Error: java.lang.IllegalArgumentException: error reading model
```
**Fix:** Copy `plant_village_model.tflite` to `app/src/main/assets/models/`

### Build Fails
```bash
# Clean and rebuild
./gradlew clean
./gradlew build
```

### App Crashes on Scan
- Check Android logcat for errors
- Ensure permissions are granted (Camera, Storage)
- Try with a different image

---

## 🚀 Next Steps After Setup

1. **Run & Test**: Install app, test with different plant images
2. **Optimize**: Adjust UI colors, text, button labels
3. **Enhance**: Add features like:
   - Export predictions as PDF
   - Share results with farmers
   - Integration with backend API for cloud sync
   - Multi-language support

---

## 📞 Support

For issues:
1. Check `README.md` troubleshooting section
2. View logcat: `./gradlew logcat | grep Plant`
3. Verify model path and filename (case-sensitive!)

Enjoy! 🌱

