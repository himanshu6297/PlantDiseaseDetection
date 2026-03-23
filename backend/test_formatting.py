import json
import requests

payload = {
    "session_id": "test-session-456",
    "message": "What measures should I take to prevent powdery mildew in apple plants?",
    "prediction_data": {
        "plant_type": "Apple",
        "disease_name": "Powdery Mildew",
        "confidence": 0.78,
        "severity": "Mild",
        "top_predictions": []
    }
}

try:
    print("Testing /chat endpoint with formatting request...")
    response = requests.post("http://localhost:8000/chat", json=payload, timeout=15)
    print(f"✓ Status Code: {response.status_code}")
    result = response.json()
    print(f"✓ Response status: {result.get('status')}\n")
    answer = result.get('answer', 'N/A')
    print("=== FORMATTED RESPONSE ===")
    print(answer)
    print("\n=== METADATA ===")
    print(f"Urgency Level: {result.get('urgency_level')}")
    print(f"Safe Next Steps: {result.get('safe_next_steps', [])[:1]}")
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {str(e)}")
