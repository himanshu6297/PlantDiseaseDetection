# Plant Village 38-class to Severity Mapping
# Auto-detects Healthy vs Disease, then classifies severity

CLASS_SEVERITY_MAP = {
    # Healthy classes
    "Apple___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Blueberry___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Cherry___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Corn___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Grape___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Orange___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Peach___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Pepper_bell___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Potato___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Raspberry___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Soybean___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Squash___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Strawberry___healthy": {"prediction": "Healthy", "severity": "healthy"},
    "Tomato___healthy": {"prediction": "Healthy", "severity": "healthy"},
    
    # Mild Diseases (early stage, manageable)
    "Apple___Black_rot": {"prediction": "Mild", "severity": "mild"},
    "Apple___Cedar_apple_rust": {"prediction": "Mild", "severity": "mild"},
    "Apple___Powdery_mildew": {"prediction": "Mild", "severity": "mild"},
    "Blueberry___Leaf_scorch": {"prediction": "Mild", "severity": "mild"},
    "Corn___Common_rust": {"prediction": "Mild", "severity": "mild"},
    "Corn___Gray_leaf_spot": {"prediction": "Mild", "severity": "mild"},
    "Corn___Northern_Leaf_Blight": {"prediction": "Mild", "severity": "mild"},
    "Grape___Black_rot": {"prediction": "Mild", "severity": "mild"},
    "Grape___Esca": {"prediction": "Mild", "severity": "mild"},
    "Grape___Leaf_blight": {"prediction": "Mild", "severity": "mild"},
    "Orange___Haunglongbing": {"prediction": "Mild", "severity": "mild"},
    "Peach___Bacterial_spot": {"prediction": "Mild", "severity": "mild"},
    "Pepper_bell___Bacterial_spot": {"prediction": "Mild", "severity": "mild"},
    "Potato___Early_blight": {"prediction": "Mild", "severity": "mild"},
    "Raspberry___Septoria_leaf_spot": {"prediction": "Mild", "severity": "mild"},
    "Soybean___Bacterial_blight": {"prediction": "Mild", "severity": "mild"},
    "Squash___Powdery_mildew": {"prediction": "Mild", "severity": "mild"},
    "Strawberry___Leaf_scorch": {"prediction": "Mild", "severity": "mild"},
    
    # Severe Diseases (advanced stage, requires immediate action)
    "Cherry___Powdery_mildew": {"prediction": "Severe", "severity": "severe"},
    "Corn___Leaf_smut": {"prediction": "Severe", "severity": "severe"},
    "Grape___Powdery_mildew": {"prediction": "Severe", "severity": "severe"},
    "Peach___Powdery_mildew": {"prediction": "Severe", "severity": "severe"},
    "Pepper_bell___Target_Spot": {"prediction": "Severe", "severity": "severe"},
    "Potato___Late_blight": {"prediction": "Severe", "severity": "severe"},
    "Soybean___Brown_spot": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Bacterial_spot": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Early_blight": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Late_blight": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Leaf_Mold": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Powdery_mildew": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Septoria_leaf_spot": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Spider_mites": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Target_Spot": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Tomato_mosaic_virus": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {"prediction": "Severe", "severity": "severe"},
    "Tomato___Two_spotted_spider_mite": {"prediction": "Severe", "severity": "severe"},
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
        return {"prediction": "Severe", "severity": "severe", "class": class_name}
