package com.plantvillage.detection

import android.content.Context
import android.graphics.Bitmap
import android.util.Log
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import kotlin.math.min

/**
 * TensorFlow Lite Model Interpreter for plant disease prediction
 * Handles model loading, image preprocessing, and inference
 */
class ModelInterpreter(context: Context) {
    private var interpreter: Interpreter? = null
    private val classNames = listOf(
        "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
        "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew",
        "Cherry_(including_sour)___healthy", "Corn_(maize)___Cercospora_leaf_spot_(Gray_leaf_spot)",
        "Corn_(maize)___Common_rust", "Corn_(maize)___Northern_Leaf_Blight",
        "Corn_(maize)___healthy", "Grape___Black_measles", "Grape___Esca_(Black_Measles)",
        "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
        "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot",
        "Peach___healthy", "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy",
        "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
        "Raspberry___healthy", "Soybean___Bacterial_pustule", "Soybean___Frog_eye_leaf_spot",
        "Soybean___Powdery_mildew", "Soybean___healthy", "Squash___Powdery_mildew",
        "Strawberry___Angular_Leaf_Spot", "Strawberry___healthy", "Sugarcane___Mosaic_virus",
        "Sugarcane___Rust", "Sugarcane___healthy", "Tomato___Bacterial_wilt",
        "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold",
        "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites_(Two-spotted_spider_mite)",
        "Tomato___Target_Spot", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
    )

    init {
        loadModel(context)
    }

    private fun loadModel(context: Context) {
        println("=== ModelInterpreter.loadModel() START ===")
        try {
            val modelPath = "models/plant_village_model.tflite"
            println("MODEL PATH: $modelPath")
            
            // Try to open asset
            println("Trying to open asset...")
            val assetManager = context.assets
            val modelInputStream = assetManager.open(modelPath)
            println("✅ Asset opened! Reading bytes...")
            
            val modelBytes = modelInputStream.readBytes()
            modelInputStream.close()
            println("✅ Bytes read: ${modelBytes.size} bytes")
            
            if (modelBytes.isEmpty()) {
                println("❌ ERROR: Bytes are empty!")
                return
            }
            
            println("Creating ByteBuffer...")
            val modelBuffer = java.nio.ByteBuffer.allocateDirect(modelBytes.size)
            modelBuffer.put(modelBytes)
            modelBuffer.rewind()
            println("✅ ByteBuffer created")
            
            println("Creating Interpreter...")
            interpreter = Interpreter(modelBuffer)
            println("✅✅✅ INTERPRETER CREATED SUCCESSFULLY ✅✅✅")
            println("=== ModelInterpreter.loadModel() SUCCESS ===")
            
        } catch (e: Exception) {
            println("❌ ERROR: ${e.message}")
            e.printStackTrace()
            println("=== ModelInterpreter.loadModel() FAILED ===")
        }
    }

    /**
     * Preprocess bitmap to 128x128 normalized RGB input
     */
    private fun preprocessBitmap(bitmap: Bitmap): ByteBuffer {
        val resized = Bitmap.createScaledBitmap(bitmap, 128, 128, true)
        val buffer = ByteBuffer.allocateDirect(1 * 128 * 128 * 3 * 4) // float32
        buffer.order(ByteOrder.nativeOrder())
        
        val pixels = IntArray(128 * 128)
        resized.getPixels(pixels, 0, 128, 0, 0, 128, 128)
        
        // Convert ARGB to RGB - normalize to 0-1 range
        for (pixel in pixels) {
            val r = ((pixel shr 16) and 0xFF) / 255.0f
            val g = ((pixel shr 8) and 0xFF) / 255.0f
            val b = (pixel and 0xFF) / 255.0f
            buffer.putFloat(r)
            buffer.putFloat(g)
            buffer.putFloat(b)
        }
        buffer.rewind()
        return buffer
    }

    /**
     * Run inference and return predictions
     */
    fun predict(bitmap: Bitmap): PredictionResult {
        return try {
            println("PREDICT: Starting...")
            
            if (interpreter == null) {
                println("❌ FATAL: Interpreter is NULL!")
                return PredictionResult("Error", 0, listOf("Model not loaded"))
            }
            
            println("✅ Interpreter exists, generating predictions...")
            val inputBuffer = preprocessBitmap(bitmap)
            val outputArray = Array(1) { FloatArray(classNames.size) }
            
            interpreter!!.run(inputBuffer, outputArray)
            println("✅ Inference complete")
            
            val predictions = outputArray[0]
            println("Predictions received: ${predictions.size} classes")
            println("First 5 predictions: ${predictions.take(5).joinToString()}")
            println("Max confidence: ${predictions.maxOrNull()}")
            
            val sortedPredictions = predictions.mapIndexed { index, confidence ->
                Triple(classNames[index], confidence, index)
            }.sortedByDescending { it.second }
            
            val topPrediction = sortedPredictions[0]
            val confidence = (topPrediction.second * 100).toInt()
            
            println("✅ RESULT: ${topPrediction.first} = $confidence%")
            
            PredictionResult(
                className = topPrediction.first,
                confidence = confidence,
                allPredictions = sortedPredictions.take(5).map { "${it.first}: ${(it.second*100).toInt()}%" }
            )
        } catch (e: Exception) {
            println("❌ Prediction error: ${e.message}")
            e.printStackTrace()
            PredictionResult("Error", 0, listOf("Inference failed"))
        }
    }

    fun close() {
        interpreter?.close()
    }
}

/**
 * Data class for prediction results
 */
data class PredictionResult(
    val className: String,
    val confidence: Int,
    val allPredictions: List<String>
)
