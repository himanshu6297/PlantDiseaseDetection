# PlantVillage Android App - Build Configuration

## ProGuard rules for TensorFlow Lite
-keep class org.tensorflow.** { *; }
-keep class org.tensorflow.lite.** { *; }

# Keep model classes
-keep class com.plantvillage.detection.** { *; }

# Keep all model-related classes
-keep class com.plantvillage.detection.ModelInterpreter { *; }
-keep class com.plantvillage.detection.PredictionResult { *; }
-keep class com.plantvillage.detection.ChatbotService { *; }

# Room database
-keep class androidx.room.** { *; }
-keep class * extends androidx.room.RoomDatabase
-keep class * extends androidx.room.Dao

# Keep our entity classes
-keep class com.plantvillage.detection.PredictionEntity { *; }

# CameraX
-keep class androidx.camera.** { *; }
-keep class androidx.camera.core.** { *; }
-keep class androidx.camera.lifecycle.** { *; }

# General Android
-keep class android.** { *; }
-keep class androidx.** { *; }

# Don't warn about missing classes
-dontwarn tensorflow.lite.**
-dontwarn org.tensorflow.**
