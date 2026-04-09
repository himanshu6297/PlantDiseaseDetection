# Plant Village 38-class to Severity Mapping
# Auto-detects Healthy vs Disease, then classifies severity
# EXACT mapping matching main.py class_names list (38 classes)

import logging

logger = logging.getLogger(__name__)

CLASS_SEVERITY_MAP = {
    # Healthy classes (14 total)
    "Apple___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Blueberry___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Cherry_(including_sour)___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Corn_(maize)___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Grape___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Peach___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Pepper,_bell___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Potato___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Raspberry___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Soybean___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Strawberry___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Tomato___healthy": {"prediction": "Healthy", "severity": "healthy"},
    
    # Mild Diseases (18 total - early stage, manageable)
    "Apple___Apple_scab": {"prediction": "Mild", "severity": "mild"},
    "Apple___Black_rot": {"prediction": "Mild", "severity": "mild"},
    "Apple___Cedar_apple_rust": {"prediction": "Mild", "severity": "mild"},
    "Cherry_(including_sour)___Powdery_mildew": {"prediction": "Mild", "severity": "mild"},
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {"prediction": "Mild", "severity": "mild"},
    "Corn_(maize)___Common_rust_": {"prediction": "Mild", "severity": "mild"},
    "Corn_(maize)___Northern_Leaf_Blight": {"prediction": "Mild", "severity": "mild"},
    "Grape___Black_rot": {"prediction": "Mild", "severity": "mild"},
    "Grape___Esca_(Black_Measles)": {"prediction": "Mild", "severity": "mild"},
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {"prediction": "Mild", "severity": "mild"},
    "Orange___Haunglongbing_(Citrus_greening)": {"prediction": "Mild", "severity": "mild"},
    "Peach___Bacterial_spot": {"prediction": "Mild", "severity": "mild"},
    "Pepper,_bell___Bacterial_spot": {"prediction": "Mild", "severity": "mild"},
    "Potato___Early_blight": {"prediction": "Mild", "severity": "mild"},
    "Squash___Powdery_mildew": {"prediction": "Mild", "severity": "mild"},
    "Strawberry___Leaf_scorch": {"prediction": "Mild", "severity": "mild"},
    
    # Severe Diseases (6 total - advanced stage, requires immediate action)
    "Potato___Late_blight": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Bacterial_spot": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Early_blight": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Late_blight": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Leaf_Mold": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Septoria_leaf_spot": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Spider_mites Two-spotted_spider_mite": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Target_Spot": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Tomato_mosaic_virus": {"prediction": "Severe", "severity": "severe"},
}

def get_severity_prediction(class_name):
    """
    Get prediction category (Healthy/Mild/Severe) for a given class name.
    Returns default "Severe" for unknown classes to be safe.
    """
    if class_name in CLASS_SEVERITY_MAP:
        return CLASS_SEVERITY_MAP[class_name]
    else:
        # Default to Severe for unknown classes (safe approach)
        logger.warning(f"⚠️  Unknown class '{class_name}' - defaulting to Severe")
        return {"prediction": "Severe", "severity": "severe", "class": class_name}
