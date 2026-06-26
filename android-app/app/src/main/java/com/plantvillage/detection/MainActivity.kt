package com.plantvillage.detection

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import androidx.room.Room
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import android.view.View
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.LinearLayout
import kotlinx.coroutines.launch
import java.io.File
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class MainActivity : AppCompatActivity() {
    private lateinit var modelInterpreter: ModelInterpreter
    private lateinit var chatbotService: ChatbotService
    private lateinit var database: PlantDiseaseDatabase
    private lateinit var predictionDao: PredictionDao
    
    private var cameraExecutor: ExecutorService = Executors.newSingleThreadExecutor()
    private var currentBitmap: Bitmap? = null
    
    private lateinit var imageView: ImageView
    private lateinit var resultTextView: TextView
    private lateinit var confidenceTextView: TextView
    private lateinit var adviceTextView: TextView
    private lateinit var chatbotTextView: TextView
    private lateinit var cameraButton: Button
    private lateinit var galleryButton: Button
    private lateinit var scanButton: Button
    private lateinit var historyButton: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var resultScrollView: ScrollView
    private lateinit var allPredictionsTextView: TextView
    
    companion object {
        private const val CAMERA_PERMISSION_REQUEST_CODE = 101
        private const val GALLERY_REQUEST_CODE = 102
        private const val CAMERA_CAPTURE_REQUEST_CODE = 103
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        Log.d("MainActivity", "🚀 App starting...")
        
        // Initialize database and services
        database = Room.databaseBuilder(
            applicationContext,
            PlantDiseaseDatabase::class.java,
            "plant_disease_db"
        ).build()
        
        predictionDao = database.predictionDao()
        Log.d("MainActivity", "📦 Database initialized")
        
        modelInterpreter = ModelInterpreter(this)
        Log.d("MainActivity", "🧠 ModelInterpreter initialized")
        
        chatbotService = ChatbotService()
        Log.d("MainActivity", "💬 ChatbotService initialized")
        
        // Initialize views
        initializeViews()
        
        // Request permissions
        if (!allPermissionsGranted()) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(
                    Manifest.permission.CAMERA,
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                ),
                CAMERA_PERMISSION_REQUEST_CODE
            )
        }
        
        // Set up button listeners
        cameraButton.setOnClickListener { captureFromCamera() }
        galleryButton.setOnClickListener { pickFromGallery() }
        scanButton.setOnClickListener { performScan() }
        historyButton.setOnClickListener { showHistory() }
        imageView.setOnClickListener { pickFromGallery() }
        
        // Show initial chatbot greeting
        chatbotTextView.text = chatbotService.getGreeting()
    }
    
    private fun initializeViews() {
        imageView = findViewById(R.id.imageView)
        resultTextView = findViewById(R.id.resultTextView)
        confidenceTextView = findViewById(R.id.confidenceTextView)
        adviceTextView = findViewById(R.id.adviceTextView)
        chatbotTextView = findViewById(R.id.chatbotTextView)
        cameraButton = findViewById(R.id.cameraButton)
        galleryButton = findViewById(R.id.galleryButton)
        scanButton = findViewById(R.id.scanButton)
        historyButton = findViewById(R.id.historyButton)
        progressBar = findViewById(R.id.progressBar)
        resultScrollView = findViewById(R.id.resultScrollView)
        allPredictionsTextView = findViewById(R.id.allPredictionsTextView)
    }
    
    private fun allPermissionsGranted() = arrayOf(
        Manifest.permission.CAMERA,
        Manifest.permission.READ_EXTERNAL_STORAGE,
        Manifest.permission.WRITE_EXTERNAL_STORAGE
    ).all {
        ContextCompat.checkSelfPermission(baseContext, it) == PackageManager.PERMISSION_GRANTED
    }
    
    private fun captureFromCamera() {
        val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        startActivityForResult(intent, CAMERA_CAPTURE_REQUEST_CODE)
    }
    
    private fun pickFromGallery() {
        val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
        intent.type = "image/*"
        startActivityForResult(intent, GALLERY_REQUEST_CODE)
    }
    
    private fun performScan() {
        if (currentBitmap == null) {
            Toast.makeText(this, "Please select an image first", Toast.LENGTH_SHORT).show()
            return
        }
        
        Log.d("MainActivity", "🎬 Starting scan...")
        progressBar.visibility = View.VISIBLE
        resultScrollView.visibility = View.GONE
        
        // Run inference in coroutine
        lifecycleScope.launch {
            try {
                Log.d("MainActivity", "📸 Calling predict on bitmap: ${currentBitmap?.width}x${currentBitmap?.height}")
                val result = modelInterpreter.predict(currentBitmap!!)
                Log.d("MainActivity", "✅ Prediction result: ${result.className} (${result.confidence}%)")
                
                // Update UI on main thread
                runOnUiThread {
                    displayPredictionResult(result)
                    savePredictionToHistory(result)
                    progressBar.visibility = View.GONE
                    resultScrollView.visibility = View.VISIBLE
                }
            } catch (e: Exception) {
                Log.e("MainActivity", "❌ Scan error: ${e.message}", e)
                runOnUiThread {
                    Toast.makeText(this@MainActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                    progressBar.visibility = View.GONE
                }
            }
        }
    }
    
    private fun displayPredictionResult(result: PredictionResult) {
        val (className, confidence, allPredictions) = result
        
        // Extract plant and disease names
        val parts = className.split("___")
        val plant = parts.getOrNull(0)?.replace("_", " ") ?: "Unknown"
        val disease = if (parts.size > 1) parts[1].replace("_", " ") else "Healthy"
        
        // Update result text views
        resultTextView.text = "Plant: $plant"
        confidenceTextView.text = "Disease: $disease ($confidence%)"
        
        // Get and display chatbot advice
        val advice = chatbotService.getAdvice(className)
        adviceTextView.text = "💡 Advice: $advice"
        
        // Show follow-up question
        val followUp = chatbotService.getFollowUpQuestion(className)
        chatbotTextView.text = followUp
        
        // Display all predictions
        val predictionsText = "Top Predictions:\n" + allPredictions.joinToString("\n")
        allPredictionsTextView.text = predictionsText
    }
    
    private fun savePredictionToHistory(result: PredictionResult) {
        val parts = result.className.split("___")
        val entity = PredictionEntity(
            plantType = parts.getOrNull(0)?.replace("_", " ") ?: "Unknown",
            disease = if (parts.size > 1) parts[1].replace("_", " ") else "Healthy",
            confidence = result.confidence
        )
        
        lifecycleScope.launch {
            predictionDao.insertPrediction(entity)
            Log.d("MainActivity", "Prediction saved to history")
        }
    }
    
    private fun showHistory() {
        lifecycleScope.launch {
            val history = predictionDao.getRecentPredictions(10)
            runOnUiThread {
                val historyText = StringBuilder("Recent Predictions:\n\n")
                history.forEach { prediction ->
                    val date = SimpleDateFormat("MMM dd, HH:mm", Locale.getDefault())
                        .format(prediction.timestamp)
                    historyText.append("${prediction.plantType} - ${prediction.disease} (${prediction.confidence}%)\n$date\n\n")
                }
                
                adviceTextView.text = historyText.toString()
                Toast.makeText(this@MainActivity, "Showing last 10 predictions", Toast.LENGTH_SHORT).show()
            }
        }
    }
    
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        
        if (resultCode == RESULT_OK) {
            when (requestCode) {
                CAMERA_CAPTURE_REQUEST_CODE -> {
                    val bitmap = data?.getParcelableExtra<Bitmap>("data")
                    if (bitmap != null) {
                        currentBitmap = bitmap
                        imageView.setImageBitmap(bitmap)
                        performScan()
                    }
                }
                GALLERY_REQUEST_CODE -> {
                    val imageUri = data?.data
                    if (imageUri != null) {
                        try {
                            val bitmap = MediaStore.Images.Media.getBitmap(contentResolver, imageUri)
                            currentBitmap = bitmap
                            imageView.setImageBitmap(bitmap)
                            performScan()
                        } catch (e: Exception) {
                            Toast.makeText(this, "Error loading image: ${e.message}", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            }
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        modelInterpreter.close()
        cameraExecutor.shutdown()
    }
    
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            if (!allPermissionsGranted()) {
                Toast.makeText(this, "Permissions not granted", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
