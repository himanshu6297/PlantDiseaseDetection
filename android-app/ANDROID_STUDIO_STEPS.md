# 📱 ANDROID STUDIO - STEP BY STEP GUIDE

## ✅ PRE-SETUP COMPLETE (Already Done!)

- [x] Model converted: `plant_village_model.tflite` ✅
- [x] Model copied to: `app/src/main/assets/models/` ✅
- [x] All Kotlin source files created ✅
- [x] All XML layouts configured ✅
- [x] Build files ready ✅

**Location:** `d:\Dataset\Plant Village Dataset\android-app\`

---

## 📋 FOLLOW THESE STEPS IN ANDROID STUDIO

### STEP 1: OPEN THE PROJECT (2 minutes)

1. **Open Android Studio**
   - Click on "Open" or File → Open
   
2. **Navigate to the android-app folder**
   - Go to: `d:\Dataset\Plant Village Dataset\android-app\`
   - Click "OK"

3. **Wait for Gradle to sync** ⏳
   - You'll see: "Gradle sync in progress..."
   - Wait until: "Gradle sync completed" appears at the bottom
   - This takes 2-3 minutes first time

✅ **Success sign:** Bottom bar shows "Gradle sync completed" in green

---

### STEP 2: VERIFY DEPENDENCIES INSTALLED (1 minute)

After Gradle finishes, you'll see:
- Project tree on the left showing `app` folder
- No red error squiggly lines in code
- Bottom bar is green/clean

If you see errors:
1. Click: `File` → `Invalidate Caches` → `Invalidate and Restart`
2. Wait for Android Studio to restart
3. Gradle will sync again

✅ **Success sign:** Project tree shows all folders without errors

---

### STEP 3: CONNECT DEVICE OR START EMULATOR (5 minutes)

#### Option A: Connect Physical Android Phone 📱
1. Connect phone to computer with USB cable
2. Enable "Developer Mode" on phone:
   - Settings → About Phone → Tap "Build Number" 7 times
3. Enable "USB Debugging" in Developer Options
4. When prompted, tap "Allow" for USB debugging
5. Android Studio will show your device name at top

#### Option B: Start Android Emulator 🖥️
1. In Android Studio, click: `Tools` → `AVD Manager`
2. Select an emulator (e.g., "Pixel 4 API 30")
3. Click green ▶️ **Play button** to start it
4. Wait 30 seconds for emulator to fully boot

✅ **Success sign:** Device name appears in top toolbar next to green play button

---

### STEP 4: BUILD THE APP (3 minutes)

1. **Let Gradle finish** (if still building)
   - Look at bottom toolbar
   - Wait for "Build complete" message

2. **Build project manually:**
   - Click: `Build` → `Make Project`
   - Or press: **Ctrl + F9**
   - Wait for message: "Build successful"

✅ **Success sign:** Bottom bar shows "Build successful" in green

---

### STEP 5: RUN THE APP (2 minutes)

1. **Click the green Play button ▶️ (Run button)**
   - Top toolbar, big green play icon
   - Or press: **Shift + F10**

2. **Select your device:**
   - Your phone or emulator should show in the list
   - Click it to select
   - Click "OK"

3. **Wait for app to deploy** ⏳
   - You'll see: "App starting..."
   - App will appear on your device/emulator
   - Takes 10-20 seconds first time

✅ **Success sign:** 
- App appears on device/emulator screen
- Shows: "Protect Your Plants with AI" header
- Buttons: 📷 Camera | 🖼️ Gallery | 📋 History visible

---

## 🧪 TEST THE APP (In the running app)

### Test 1: Camera Capture
1. Tap **📷 Camera** button
2. Take a photo of any plant (or any object)
3. Photo appears on screen
4. Tap **🔍 Scan Plant** button
5. Wait 1-2 seconds for results

### Test 2: Gallery Selection
1. Tap **🖼️ Gallery** button
2. Select any image from your device
3. Tap **🔍 Scan Plant** button
4. Wait for results to display

### Test 3: View Results
Results should show:
- 🌱 Plant: [Plant Type]
- 🚨 Disease: [Disease Name] (Confidence %)
- 💡 Advice: [AI Disease Advice]
- 🤖 Follow-up question
- 📊 Top 5 predictions

### Test 4: View History
1. Tap **📋 History** button
2. View your past predictions with dates

---

## ⚠️ TROUBLESHOOTING

### Problem: "Gradle sync failed"
**Solution:**
1. Click: `File` → `Invalidate Caches` → `Invalidate and Restart`
2. Android Studio will restart
3. Gradle will sync automatically

### Problem: "Build failed"
**Solution:**
1. Click: `Build` → `Clean Project`
2. Wait 30 seconds
3. Click: `Build` → `Make Project`
4. Try Run again

### Problem: "Device not found"
**Solution:**
1. If physical phone:
   - Check USB cable connection
   - Check "USB Debugging" is enabled in phone settings
   - Unplug and replug USB cable
2. If emulator:
   - Click `Tools` → `AVD Manager`
   - Click ▶️ play button to start emulator
   - Wait 30 seconds

### Problem: "App crashes when scanning"
**Solution:**
1. Go to Android Studio bottom
2. Click "Logcat" tab
3. Look for red error messages
4. Common fix: Close app, try again
5. Check phone has storage permission granted

### Problem: "Model not loading"
**Solution:**
1. Make sure file exists: `app/src/main/assets/models/plant_village_model.tflite`
2. Filename must be EXACT (lowercase, correct extension)
3. Clean project and rebuild

---

## ✨ WHAT YOU SHOULD SEE

### App Home Screen
```
┌─────────────────────────────────────┐
│  Protect Your Plants with AI        │
╠─────────────────────────────────────╣
│  📷 Camera  | 🖼️ Gallery | 📋 History│
╠─────────────────────────────────────╣
│                                     │
│         [Gray Image Area]           │
│       (shows selected image)        │
│                                     │
│      🔍 Scan Plant (Button)        │
│                                     │
└─────────────────────────────────────┘
```

### After Scanning
```
┌─────────────────────────────────────┐
│  🌱 Detection Result                │
├─────────────────────────────────────┤
│  Plant: Tomato                      │
│  Disease: Late Blight (92%)         │
├─────────────────────────────────────┤
│  💡 Late blight causes rapid        │
│     decline in cool, wet weather... │
├─────────────────────────────────────┤
│  🤖 Would you like specific         │
│     treatment methods?              │
├─────────────────────────────────────┤
│  📊 Top Predictions:                │
│  • Tomato Late Blight: 92%         │
│  • Tomato Early Blight: 7%         │
│  • ...                              │
└─────────────────────────────────────┘
```

---

## 📞 QUICK REFERENCE

| Action | Keyboard Shortcut |
|--------|-------------------|
| Run App | **Shift + F10** |
| Build Project | **Ctrl + F9** |
| Stop App | **Ctrl + F2** |
| View Logcat | **Alt + 6** |
| Open Run Config | **Shift + Alt + F10** |

---

## ✅ COMPLETE CHECKLIST

- [ ] Android Studio opened
- [ ] Project loaded from `android-app` folder
- [ ] Gradle sync completed (green checkmark)
- [ ] No errors in project tree
- [ ] Device connected OR emulator running
- [ ] Build successful
- [ ] App running on device/emulator
- [ ] Can tap Camera button
- [ ] Can tap Gallery button
- [ ] Can tap Scan button
- [ ] Results display correctly
- [ ] Can view history

---

## 🎉 YOU'RE DONE!

Once all tests pass, you have a working plant disease detection app!

**Next (Optional):**
- Share results via WhatsApp/Email
- Customize app name/icon
- Deploy to Play Store
- Integrate with backend API

---

## 📞 NEED HELP?

If something doesn't work:
1. Check the troubleshooting section above
2. Look at logcat (View → Tool Windows → Logcat or Alt+6)
3. Read: `android-app/README.md` for detailed info
4. Check: `android-app/QUICK_START.md` for quick ref

**Happy Building!** 🌱📱
