# PlantVillage Android App - Setup & Build Guide

## Project Overview
This is an Android prototype app for plant disease detection using TensorFlow Lite and a pre-trained MobileNetV2 model.

## Features
- 📷 **Camera Capture**: Take photos directly from device camera
- 🖼️ **Gallery Upload**: Select images from device gallery
- 🔍 **Disease Detection**: Offline inference using TensorFlow Lite
- 💬 **Chatbot Advice**: AI-powered disease management recommendations
- 📋 **History Tracking**: Save and view past predictions
- ⚡ **Offline**: Works completely offline after app installation

## Prerequisites
- Android Studio 2021.1 or later
- Android SDK 24+ (API Level 24+)
- Kotlin 1.8+
- Python 3.8+ (for model conversion only)

## Model Setup

### 1. Convert Keras Model to TensorFlow Lite

```bash
cd android-app
python convert_model.py ../backend/Final_PlantVillage38_model.keras
```

This will generate `plant_village_model.tflite` (~15-20 MB)

### 2. Copy Model to Assets

```bash
cp plant_village_model.tflite app/src/main/assets/models/
```

Alternatively, manually copy the file:
- Source: `android-app/plant_village_model.tflite`
- Destination: `android-app/app/src/main/assets/models/plant_village_model.tflite`

Ensure the directory structure is:
```
app/
├── src/
│   ├── main/
│   │   ├── assets/
│   │   │   └── models/
│   │   │       └── plant_village_model.tflite
│   │   ├── java/
│   │   ├── res/
│   │   └── AndroidManifest.xml
```

## Building the App

### Option 1: Using Android Studio
1. Open Android Studio
2. File → Open → Select `android-app` folder
3. Wait for Gradle sync to complete
4. Click "Run" or press Shift + F10

### Option 2: Using Gradle CLI

```bash
cd android-app
./gradlew build        # Build debug APK
./gradlew assembleDebug
```

## Running on Device/Emulator

### On Physical Device
1. Enable Developer Mode on your Android phone
2. Connect via USB
3. Run: `./gradlew installDebug`
4. Or in Android Studio: Click Run

### On Emulator
1. Create/start an Android emulator in Android Studio
2. Run: `./gradlew installDebug`
3. Or in Android Studio: Click Run → Select emulator

## App Architecture

### Core Components

**ModelInterpreter.kt**
- Loads TensorFlow Lite model
- Preprocesses images (128×128 RGB)
- Runs inference
- Returns predictions with confidence scores

**ChatbotService.kt**
- Template-based disease advice (38 diseases covered)
- Context-aware responses
- Follow-up suggestions

**Database.kt**
- Room database for prediction history
- SQLite storage on device
- Offline data persistence

**MainActivity.kt**
- Camera and gallery integration
- Image handling and processing
- UI updates and result display
- History management

## Class Reference (38 Plant Disease Classes)

The model is trained on 38 classes:
- Apple: Apple scab, Black rot, Cedar apple rust, healthy
- Blueberry: healthy
- Cherry: Powdery mildew, healthy
- Corn: Cercospora leaf spot, Common rust, Northern Leaf Blight, healthy
- Grape: Black measles, Esca, Leaf blight, healthy
- Orange: Huanglongbing, healthy
- Peach: Bacterial spot, healthy
- Pepper: Bacterial spot, healthy
- Potato: Early blight, Late blight, healthy
- Raspberry: healthy
- Soybean: Bacterial pustule, Frog eye leaf spot, Powdery mildew, healthy
- Squash: Powdery mildew, healthy
- Strawberry: Angular Leaf Spot, healthy
- Sugarcane: Mosaic virus, Rust, healthy
- Tomato: Bacterial wilt, Early blight, Late blight, Leaf Mold, Septoria leaf spot, Spider mites, Target Spot, Tomato mosaic virus, healthy

## Dependencies

**Core Android:**
- androidx.appcompat:1.6.1
- androidx.constraintlayout:2.1.4
- com.google.android.material:1.9.0

**Machine Learning:**
- tensorflow-lite:2.11.0
- tensorflow-lite-support:0.4.4

**Database:**
- androidx.room:room-runtime:2.5.2
- androidx.room:room-ktx:2.5.2

**Camera:**
- androidx.camera:camera-core:1.2.2
- androidx.camera:camera-lifecycle:1.2.2

**Async:**
- kotlinx-coroutines-android:1.7.1

## Troubleshooting

### Build Issues

**"Model file not found"**
- Ensure `plant_village_model.tflite` is in `app/src/main/assets/models/`
- Check file name exactly matches (case-sensitive)

**Gradle sync fails**
- Clean project: `./gradlew clean`
- Rebuild: `./gradlew build`

**Permission errors at runtime**
- Grant camera and storage permissions when prompted
- On Android 6+, permissions are requested at runtime

### Runtime Issues

**App crashes on scan**
- Check logcat for detailed error: `./gradlew logcat`
- Verify permissions are granted
- Ensure image is valid when captured

**Predictions seem wrong**
- Model expects 128×128 RGB images
- Verify model file is not corrupted (check file size ~15-20MB)
- Check image preprocessing in ModelInterpreter

**Slow inference**
- First inference may be slower (model initialization)
- Subsequent predictions should be <1-2 seconds on modern devices
- Consider using GPU acceleration (advanced)

## Performance Notes

- **Model Size**: ~15-20 MB (TensorFlow Lite optimized)
- **Input Size**: 128×128 RGB
- **Inference Time**: 500-1500ms depending on device
- **Memory Usage**: ~50-100 MB RAM
- **Compatibility**: Android 5.0+ (API 21+), tested on API 24+

## Future Enhancements

1. **Cloud Sync**: Backup predictions to backend API
2. **GPU Acceleration**: Use GPU delegates for faster inference
3. **Batch Processing**: Multiple images at once
4. **Local Model Updates**: Download newer models over-the-air
5. **Advanced UI**: Charts, analytics, export reports
6. **Multi-language Support**: Localization for different languages
7. **NNAPI Acceleration**: Hardware acceleration on supported devices

## File Structure

```
android-app/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── assets/models/
│   │   │   │   └── plant_village_model.tflite
│   │   │   ├── java/com/plantvillage/detection/
│   │   │   │   ├── MainActivity.kt
│   │   │   │   ├── ModelInterpreter.kt
│   │   │   │   ├── ChatbotService.kt
│   │   │   │   └── Database.kt
│   │   │   ├── res/
│   │   │   │   ├── layout/activity_main.xml
│   │   │   │   ├── drawable/chatbot_bg.xml
│   │   │   │   ├── values/strings.xml
│   │   │   │   └── values/themes.xml
│   │   │   └── AndroidManifest.xml
│   │   └── test/
│   ├── build.gradle
│   └── proguard-rules.pro
├── build.gradle
├── settings.gradle
├── convert_model.py
└── README.md
```

## Support & Contact

For issues or questions:
1. Check the troubleshooting section above
2. Review Android logcat output for detailed errors
3. Verify model format matches expected TensorFlow Lite format

## License

This app uses the Plant Village dataset and TensorFlow Lite framework.
