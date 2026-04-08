#!/usr/bin/env python
"""
Startup script to run the backend server
Automatically reads PORT from .env file (default: 8000)
"""
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get backend path
backend_path = os.path.dirname(os.path.abspath(__file__))
if backend_path in sys.path:
    sys.path.remove(backend_path)
sys.path.insert(0, backend_path)

# Get port from environment (default 8000)
PORT = int(os.getenv("PORT", 8000))

print(f"Backend path: {backend_path}")
print(f"Python path (first 3): {sys.path[:3]}")
print(f"Server port (from .env): {PORT}")

if __name__ == "__main__":
    import uvicorn
    
    # Import app from THIS directory's main.py
    from main import app
    
    print(f"\nApp title: {app.title}")
    print(f"Routes: {len([route for route in app.routes if hasattr(route, 'path')])} available")
    
    print(f"\n✓ Starting server on http://0.0.0.0:{PORT}")
    print(f"✓ Chatbot service available at http://localhost:{PORT}/chat")
    print(f"✓ API docs available at http://localhost:{PORT}/docs\n")
    
    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="info")
