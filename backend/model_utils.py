import tensorflow as tf
import numpy as np
from PIL import Image
import io
from class_mapping import get_severity_prediction
import logging

logger = logging.getLogger(__name__)

def preprocess_image(image_file, img_size=(128, 128)):
    """
    Preprocess image for model prediction
    - Resize to (128, 128)
    - Normalize pixel values to 0-1 range
    """
    # Read image from uploaded file
    image = Image.open(io.BytesIO(image_file)).convert("RGB")
    
    # Resize
    image = image.resize(img_size)
    
    # Convert to array
    image_array = np.array(image, dtype=np.float32)
    
    # Normalize pixel values from 0-255 to 0-1
    image_array = image_array / 255.0
    
    # Add batch dimension
    image_array = np.expand_dims(image_array, axis=0)
    
    return image_array

def predict(image_file, model, class_names):
    """
    Make prediction on uploaded image
    Returns: {
        "class_name": str,
        "prediction": str (Healthy/Mild/Severe),
        "confidence": float (0-1),
        "severity": str
    }
    """
    import time
    start_time = time.time()
    
    # Preprocess image
    logger.info("Starting image preprocessing...")
    image_array = preprocess_image(image_file)
    preprocess_time = time.time() - start_time
    logger.info(f"Image preprocessing completed in {preprocess_time:.2f}s")
    
    # Make prediction
    logger.info("Starting model prediction...")
    prediction_start = time.time()
    predictions = model.predict(image_array, verbose=0)
    confidence = float(np.max(predictions[0]))
    predicted_class_idx = np.argmax(predictions[0])
    predicted_class_name = class_names[predicted_class_idx]
    
    prediction_time = time.time() - prediction_start
    logger.info(f"Model prediction completed in {prediction_time:.2f}s")
    
    # DEBUG: Log top 5 predictions
    logger.info(f"\n🔍 PREDICTION DEBUG:")
    logger.info(f"  Predicted Class Index: {predicted_class_idx}")
    logger.info(f"  Predicted Class Name: {predicted_class_name}")
    logger.info(f"  Confidence: {confidence:.4f}")
    
    top_5_indices = np.argsort(predictions[0])[::-1][:5]
    logger.info(f"  Top 5 Predictions:")
    for rank, idx in enumerate(top_5_indices, 1):
        logger.info(f"    {rank}. [{idx:2d}] {class_names[idx]}: {predictions[0][idx]:.4f}")
    logger.info(f"🔍")
    
    # Get severity classification
    severity_info = get_severity_prediction(predicted_class_name)
    
    total_time = time.time() - start_time
    logger.info(f"Total prediction time: {total_time:.2f}s")
    
    return {
        "class_name": predicted_class_name,
        "class_index": int(predicted_class_idx),  # ADDED: Show which class was predicted
        "prediction": severity_info["prediction"],
        "confidence": confidence,
        "severity": severity_info.get("severity", "unknown"),
        "all_predictions": {
            class_names[i]: float(predictions[0][i]) 
            for i in np.argsort(predictions[0])[::-1][:5]  # Top 5
        }
    }
