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
    - Normalize pixel values
    """
    # Read image from uploaded file
    image = Image.open(io.BytesIO(image_file)).convert("RGB")
    
    # Resize
    image = image.resize(img_size)
    
    # Convert to array
    image_array = np.array(image, dtype=np.float32)
    
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
    # Preprocess image
    image_array = preprocess_image(image_file)
    
    # Make prediction
    predictions = model.predict(image_array, verbose=0)
    confidence = float(np.max(predictions[0]))
    predicted_class_idx = np.argmax(predictions[0])
    predicted_class_name = class_names[predicted_class_idx]
    
    # Get severity classification
    severity_info = get_severity_prediction(predicted_class_name)
    
    return {
        "class_name": predicted_class_name,
        "prediction": severity_info["prediction"],
        "confidence": confidence,
        "severity": severity_info.get("severity", "unknown"),
        "all_predictions": {
            class_names[i]: float(predictions[0][i]) 
            for i in np.argsort(predictions[0])[::-1][:5]  # Top 5
        }
    }
