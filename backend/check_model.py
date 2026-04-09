import tensorflow as tf
import os

MODEL_PATH = "./Final_PlantVillage38_model.keras"

if os.path.exists(MODEL_PATH):
    model = tf.keras.models.load_model(MODEL_PATH)
    
    print("=" * 80)
    print("MODEL INFORMATION")
    print("=" * 80)
    print(f"\nModel Name: {model.name}")
    print(f"\nInput Shape: {model.input_shape}")
    print(f"\nOutput Shape: {model.output_shape}")
    
    print(f"\nModel Summary:")
    model.summary()
    
    # Check if model has metadata about classes
    print(f"\nModel Config:")
    config = model.get_config()
    if 'layers' in config:
        last_layer = config['layers'][-1]
        print(f"Last layer config: {last_layer}")
    
    print("=" * 80)
else:
    print(f"Model not found at {MODEL_PATH}")
