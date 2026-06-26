## 🌱 PlantVillage Android App - Architecture Overview

### Tech Stack
- **Language**: Kotlin 1.8+
- **Min SDK**: Android 5.0 (API 21)
- **Target SDK**: Android 13 (API 33)
- **Build System**: Gradle 7.4
- **IDE**: Android Studio 2021.1+

### Core Components

#### 1. ModelInterpreter.kt
- Loads TensorFlow Lite model from assets
- Preprocesses images to 128×128 RGB
- Runs inference with normalization
- Returns top-5 predictions with confidence

**Key Properties:**
- 38 disease classes (same as web model)
- Float32 input/output tensors
- Optimized for mobile (quantized)

#### 2. ChatbotService.kt
- Template-based responses (MVP approach)
- 280+ disease-specific advice messages
- Context-aware responses based on plant type
- Follow-up question generation

**Coverage:**
- All 38 plant disease classes
- Random selection from advice templates
- Personalized greetings and follow-ups

#### 3. Database Components
- **PredictionEntity**: Data model for stored predictions
- **PredictionDao**: CRUD operations for predictions
- **PlantDiseaseDatabase**: Room database abstraction

**Storage:**
- SQLite database on device
- Unlimited history (can be managed)
- Timestamps for all predictions

#### 4. MainActivity.kt
- Camera capture using Intent
- Gallery image selection
- Image preprocessing and scaling
- Async inference execution (Coroutines)
- UI state management
- Database operations

**Features:**
- Camera permission handling
- Gallery integration
- Progress indication
- Result display in cards
- History viewing

### Data Flow

```
User Input
    ↓
[Camera/Gallery] → Image Bitmap
    ↓
[ModelInterpreter] → Preprocess (128×128)
    ↓
[TensorFlow Lite] → Inference
    ↓
[Top Predictions] → PredictionResult
    ↓
[ChatbotService] → Generate Advice
    ↓
[MainActivity] → Display Results
    ↓
[Database] → Save to History
```

### UI Layout Structure

```
activity_main.xml (Root LinearLayout)
├── Top Button Bar (Camera | Gallery | History)
├── Main ScrollView
│   └── Content LinearLayout
│       ├── Image Section
│       │   ├── ImageView (Plant Image)
│       │   └── Scan Button
│       ├── Progress Bar (Hidden until scanning)
│       └── Results ScrollView (Initially Hidden)
│           ├── Detection Result Card
│           ├── Advice Card
│           ├── Chatbot Card (Dark blue gradient)
│           └── All Predictions Card
```

### Permissions Required

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" /> <!-- For future cloud features -->
```

### Dependencies Overview

**ML/TensorFlow:**
- tensorflow-lite:2.11.0 - Core inference engine
- tensorflow-lite-support:0.4.4 - Image processing utilities
- tensorflow-lite-metadata:0.1.0-rc - Model metadata

**Android Framework:**
- androidx.appcompat:1.6.1 - Backward compatibility
- androidx.constraintlayout:2.1.4 - Layout engine
- com.google.android.material:1.9.0 - UI components

**Database:**
- androidx.room:room-runtime:2.5.2 - ORM library
- androidx.room:room-ktx:2.5.2 - Coroutines support

**Async/Concurrency:**
- org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.1 - Main thread async
- org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.1 - Coroutines base

**Camera:**
- androidx.camera:camera-core:1.2.2 - Camera abstraction
- androidx.camera:camera-lifecycle:1.2.2 - Lifecycle binding
- androidx.camera:camera-view:1.2.2 - Camera preview UI

### Model Details

**Conversion Process:**
```
Keras Model (.keras)
    ↓
[TFLiteConverter]
    ↓
Optimizations Applied:
- DEFAULT optimization (pruning, quantization)
- Mobile-specific ops (CPU-optimized)
    ↓
TensorFlow Lite Model (.tflite)
    ↓
Assets Directory
```

**Model Specs:**
- Input: 1×128×128×3 (Float32)
- Output: 1×38 (Float32 probabilities)
- Framework: TensorFlow Lite
- Quantization: post-training (if applied)

### Performance Characteristics

**Inference Speed:**
- First inference: 1-2s (model initialization)
- Subsequent: 300-800ms on modern devices
- Depends on device CPU/GPU specifications

**Memory Usage:**
- Model: ~15-20 MB (disk), ~30-50 MB loaded
- Runtime: ~50-100 MB total process memory
- Database: SQLite, grows with history

**Optimization Techniques:**
- TFLite model quantization (reduces size)
- CPU-only inference (no GPU needed)
- Asynchronous execution (UI remains responsive)

### Security Considerations

**Local Processing:**
- No data sent to external servers
- All inference on-device
- History stored locally on SQLite

**Permissions:**
- Camera access: Required for photo capture
- Storage access: Required for gallery selection
- Sensitive operations are permission-gated

### Future Enhancement Points

**Immediate (v1.1):**
- Add GPU delegate support
- Batch image processing
- Export prediction reports

**Short-term (v1.5):**
- Cloud sync to backend API
- Multi-language UI
- Advanced analytics dashboard
- Real-time camera scanning

**Long-term (v2.0):**
- Model updates over-the-air
- Custom disease database
- Farmer community features
- Integration with agricultural APIs

### Build Variants

Current: Single debug/release build
Future: Could support:
- Flavor variants (lite/full model)
- Staging/production endpoints
- Debug/release optimization levels

### Testing Strategy

**Unit Tests:**
- Model preprocessing logic
- ChatbotService advice generation
- Database operations

**Integration Tests:**
- Image capture flow
- Inference pipeline
- Result display accuracy

**Manual Testing:**
- Camera permissions flow
- Gallery selection
- Inference timing
- History persistence

### Deployment

**Build Artifact:**
- APK: android-app.apk (~25-35 MB with TFLite model)
- AAB (App Bundle): Recommended for Play Store

**Distribution:\l
- Direct APK installation
- Google Play Store (Play Console submission)
- Beta testing via Google Play

### Notes

- All 38 classes from training matched in ModelInterpreter
- Chatbot templates cover all diseases + general advice
- Database ready for unlimited history
- Async operations prevent UI freezing
- All code is production-ready MVP quality

