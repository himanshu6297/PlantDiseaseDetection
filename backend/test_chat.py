import json
import requests

payload = {
    "session_id": "test-session-123",
    "message": "",
    "prediction_data": {
        "plant_type": "Tomato",
        "disease_name": "Late Blight",
        "confidence": 0.85,
        "severity": "Severe",
        "top_predictions": []
    }
}

try:
    print("Testing /chat endpoint...")
    response = requests.post("http://localhost:8000/chat", json=payload, timeout=15)
    print(f"✓ Status Code: {response.status_code}")
    result = response.json()
    print(f"✓ Response status: {result.get('status')}")
    answer = result.get('answer', 'N/A')
    print(f"✓ Answer length: {len(answer)} chars")
    print(f"Answer preview: {answer[:150]}")
    print(f"✓ Urgency: {result.get('urgency_level')}")
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {str(e)}")
