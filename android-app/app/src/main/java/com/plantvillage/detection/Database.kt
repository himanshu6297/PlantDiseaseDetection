package com.plantvillage.detection

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Entity(tableName = "predictions")
data class PredictionEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val plantType: String,
    val disease: String,
    val confidence: Int,
    val timestamp: Long = System.currentTimeMillis()
)

@Dao
interface PredictionDao {
    @Insert
    suspend fun insertPrediction(prediction: PredictionEntity)

    @Query("SELECT * FROM predictions ORDER BY timestamp DESC LIMIT :limit")
    suspend fun getRecentPredictions(limit: Int = 10): List<PredictionEntity>

    @Query("SELECT * FROM predictions ORDER BY timestamp DESC")
    suspend fun getAllPredictions(): List<PredictionEntity>

    @Query("DELETE FROM predictions")
    suspend fun clearAllPredictions()

    @Query("SELECT COUNT(*) FROM predictions")
    suspend fun getPredictionCount(): Int
}

@Database(entities = [PredictionEntity::class], version = 1)
abstract class PlantDiseaseDatabase : RoomDatabase() {
    abstract fun predictionDao(): PredictionDao
}
