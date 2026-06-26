#!/bin/bash
# Android App Setup Verification Script
# Run this script to verify all necessary files are in place

echo "🔍 PlantVillage Android App - Setup Verification"
echo "=================================================="
echo ""

errors=0

# Check directory structure
echo "📁 Checking directory structure..."
dirs=(
    "app/src/main/java/com/plantvillage/detection"
    "app/src/main/res/layout"
    "app/src/main/res/drawable"
    "app/src/main/res/values"
    "app/src/main/assets/models"
)

for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✅ $dir"
    else
        echo "  ❌ $dir (MISSING)"
        errors=$((errors + 1))
    fi
done

echo ""
echo "📄 Checking source files..."
files=(
    "app/src/main/java/com/plantvillage/detection/MainActivity.kt"
    "app/src/main/java/com/plantvillage/detection/ModelInterpreter.kt"
    "app/src/main/java/com/plantvillage/detection/ChatbotService.kt"
    "app/src/main/java/com/plantvillage/detection/Database.kt"
    "app/src/main/res/layout/activity_main.xml"
    "app/src/main/res/drawable/chatbot_bg.xml"
    "app/src/main/res/values/strings.xml"
    "app/src/main/res/values/colors.xml"
    "app/src/main/res/values/themes.xml"
    "app/src/main/AndroidManifest.xml"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
        errors=$((errors + 1))
    fi
done

echo ""
echo "⚙️  Checking build files..."
build_files=(
    "build.gradle"
    "settings.gradle"
    "app/build.gradle"
    "app/proguard-rules.pro"
)

for file in "${build_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
        errors=$((errors + 1))
    fi
done

echo ""
echo "📚 Checking documentation..."
docs=(
    "README.md"
    "QUICK_START.md"
    "ARCHITECTURE.md"
    "convert_model.py"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc"
    else
        echo "  ❌ $doc (MISSING)"
        errors=$((errors + 1))
    fi
done

echo ""
echo "🔑 Checking critical assets..."
if [ -f "app/src/main/assets/models/plant_village_model.tflite" ]; then
    size=$(du -h "app/src/main/assets/models/plant_village_model.tflite" | cut -f1)
    echo "  ✅ plant_village_model.tflite ($size)"
else
    echo "  ⚠️  plant_village_model.tflite (NOT YET CONVERTED)"
    errors=$((errors - 1))  # Don't count as error, just warning
fi

echo ""
echo "=================================================="
if [ $errors -eq 0 ]; then
    echo "✅ All files present! Ready to build."
    echo ""
    echo "Next steps:"
    echo "1. Convert model: python convert_model.py ../backend/Final_PlantVillage38_model.keras"
    echo "2. Copy model: mkdir -p app/src/main/assets/models && cp plant_village_model.tflite app/src/main/assets/models/"
    echo "3. Open Android Studio: File → Open → Select this folder"
    echo "4. Build and run: Shift+F10"
else
    echo "❌ Found $errors missing file(s). See above."
fi
echo ""
