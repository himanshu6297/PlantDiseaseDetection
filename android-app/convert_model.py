#!/usr/bin/env python3
"""
Convert Keras model to TensorFlow Lite format for Android deployment
Run this script from the backend directory containing the .keras model
"""

import tensorflow as tf
import os
import sys

def convert_keras_to_tflite(input_model_path, output_path="plant_village_model.tflite"):
    """
    Convert Keras model to TensorFlow Lite format
    """
    print(f"Loading model from: {input_model_path}")
    
    # Load the Keras model
    model = tf.keras.models.load_model(input_model_path)
    print(f"Model loaded successfully")
    print(f"Model summary:")
    model.summary()
    
    # Create TFLite converter
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # Optimize for inference
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    # Set target spec for mobile
    converter.target_spec.supported_ops = [
        tf.lite.OpsSet.TFLITE_BUILTINS,
        tf.lite.OpsSet.SELECT_TF_OPS
    ]
    
    # Convert model
    print("Converting model to TensorFlow Lite format...")
    tflite_model = converter.convert()
    
    # Save the converted model
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
    
    file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"✅ Model converted successfully!")
    print(f"📁 Output: {output_path}")
    print(f"📊 Size: {file_size_mb:.2f} MB")
    print(f"\n📱 Next steps:")
    print(f"1. Copy {output_path} to android-app/app/src/main/assets/models/")
    print(f"2. Make sure the filename is 'plant_village_model.tflite'")
    print(f"3. Build and run the Android app")

if __name__ == "__main__":
    # Use the model from current directory or command-line argument
    if len(sys.argv) > 1:
        input_model = sys.argv[1]
    else:
        # Default path
        input_model = "Final_PlantVillage38_model.keras"
    
    if not os.path.exists(input_model):
        print(f"❌ Error: Model file not found: {input_model}")
        print(f"Usage: python convert_model.py <path_to_model.keras>")
        sys.exit(1)
    
    output_model = "plant_village_model.tflite"
    convert_keras_to_tflite(input_model, output_model)
