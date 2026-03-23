# Steps to Export Model from Google Colab Notebook

## Option 1: Export from Colab (Automatic)
In your notebook, add this cell at the end to export the model:

```python
# Export the trained model to a downloadable file
model.save("/content/drive/MyDrive/Final_PlantVillage38_model.keras")
print("✓ Model saved successfully to Google Drive!")

# You can also download it directly from Colab:
from google.colab import files
files.download("/content/drive/MyDrive/Final_PlantVillage38_model.keras")
```

## Option 2: Manual Download from Google Drive
1. Open your Google Drive
2. Navigate to `Final_PlantVillage38_model.keras`
3. Download it to your machine
4. Place it in the `backend/` directory

## Location in Project
Keep the model file (.keras) in the backend directory or update MODEL_PATH in .env:
```
d:\Dataset\Plant Village Dataset\backend\Final_PlantVillage38_model.keras
```

## Verify Model
The backend will automatically load the model on startup and log success/failure.
