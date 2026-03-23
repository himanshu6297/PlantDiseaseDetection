import requests
import sys
from pathlib import Path

"""
Quick test script for the Plant Disease Detection API
Usage: python test_api.py <image_path>
"""

API_URL = "http://localhost:8000"

def test_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{API_URL}/health")
        print("✓ Backend is running!")
        print(f"  Status: {response.json()['status']}")
        print(f"  Model loaded: {response.json()['model_loaded']}")
        print(f"  Classes: {response.json()['classes_count']}")
        return True
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to backend at {API_URL}")
        print("  Make sure backend is running: python -m uvicorn main:app --reload")
        return False

def test_predict(image_path):
    """Test prediction endpoint with an image"""
    if not Path(image_path).exists():
        print(f"✗ Image file not found: {image_path}")
        return
    
    print(f"Testing prediction with: {image_path}")
    
    with open(image_path, "rb") as img:
        files = {"file": img}
        try:
            response = requests.post(f"{API_URL}/predict", files=files)
            
            if response.status_code == 200:
                result = response.json()
                print("\n✓ Prediction successful!")
                print(f"  Disease: {result['class_name']}")
                print(f"  Category: {result['prediction']}")
                print(f"  Confidence: {result['confidence']:.2%}")
                print(f"  Severity: {result['severity']}")
                print("\n  Top 5 predictions:")
                for i, (disease, conf) in enumerate(result['all_predictions'].items(), 1):
                    print(f"    {i}. {disease}: {conf:.4f}")
            else:
                print(f"✗ Prediction failed: {response.status_code}")
                print(f"  Error: {response.json()}")
        except Exception as e:
            print(f"✗ Request failed: {str(e)}")

if __name__ == "__main__":
    print("Plant Disease Detection API - Test Script")
    print("=" * 40)
    print()
    
    # Test health
    if not test_health():
        sys.exit(1)
    
    print()
    
    # Test prediction if image provided
    if len(sys.argv) > 1:
        test_predict(sys.argv[1])
    else:
        print("No image provided. Usage:")
        print("  python test_api.py <image_path>")
