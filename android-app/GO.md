# ⚡ QUICK START - ANDROID STUDIO (Copy & Paste This!)

## 🚀 5 STEPS TO RUNNING

### 1️⃣ OPEN PROJECT
- Open Android Studio
- File → Open
- Select: `d:\Dataset\Plant Village Dataset\android-app`
- **Wait for Gradle sync** ⏳ (green checkmark appears)

### 2️⃣ BUILD
- Ctrl + F9 (or Build → Make Project)
- **Wait** until bottom shows "Build successful"

### 3️⃣ CONNECT DEVICE
**Phone:** USB cable + enable USB Debugging
**Emulator:** Tools → AVD Manager → Click ▶️ play button

### 4️⃣ RUN
- Click green ▶️ play button (or Shift+F10)
- Select your device
- **Wait** 10-20 seconds for app to load

### 5️⃣ TEST
- Tap 📷 Camera or 🖼️ Gallery
- Tap 🔍 Scan Plant
- View results! 🎉

---

## ⏱️ EXPECTED TIMING

| Step | Time | Status |
|------|------|--------|
| Gradle Sync | 2-3 min | "Gradle sync completed" |
| Build | 1-2 min | "Build successful" |
| Device Setup | 2-5 min | Device appears in toolbar |
| App Deploy | 10-20 sec | App appears on screen |
| **TOTAL** | **~5-10 min** | ✅ Ready! |

---

## 🎯 WHAT TO LOOK FOR

✅ **Good Signs:**
- Bottom toolbar is GREEN
- No red squiggly lines in code
- Device name shows at top
- App icon appears on device

❌ **Bad Signs:**
- Red errors in project tree
- Device not found
- Build failed message
- App crashes immediately

---

## 🔗 PROJECT LOCATION

```
📁 d:\Dataset\Plant Village Dataset\android-app\
   ├── app/               ← Main Android app
   ├── build.gradle       ← Build config
   └── ANDROID_STUDIO_STEPS.md  ← Full guide
```

---

## 📌 KEY FILES ALREADY PREPARED

- ✅ Kotlin source code (4 files)
- ✅ XML layouts (5 files)
- ✅ Model file: `app/src/main/assets/models/plant_village_model.tflite`
- ✅ Dependencies configured in build.gradle
- ✅ Permissions set in AndroidManifest.xml

**Everything is ready to go!**

---

## 🐛 QUICK FIXES

| Issue | Fix |
|-------|-----|
| Gradle sync fails | File → Invalidate Caches → Restart |
| Build fails | Build → Clean Project → Make Project |
| Device not found | Check USB debugging enabled |
| App crashes | Check logcat for error messages |
| Model not loading | Verify model in `app/src/main/assets/models/` |

---

## 💬 TIPS

1. **First run slower:** Model initializes on first scan (1-2s), subsequent scans faster (300-800ms)
2. **Use real device when possible:** More accurate inference timing
3. **Check logcat:** View → Tool Windows → Logcat for debugging
4. **Hot reload works:** Can modify Java code and rerun

---

## 🎬 NOW GO!

👉 Open Android Studio and follow the 5 steps above!

📖 For detailed help: Open `ANDROID_STUDIO_STEPS.md` in the same folder
