import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAf6eqoN3dh5YfhQYkUB1xlrVeXOOcL0GM",
  authDomain: "ragequit-meter.firebaseapp.com",
  databaseURL: "https://ragequit-meter-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ragequit-meter",
  storageBucket: "ragequit-meter.appspot.com",
  messagingSenderId: "927846193524",
  appId: "1:927846193524:web:8596901261f475cea27421"
};

// ✅ Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// ✅ DOM references
const rageSlider = document.getElementById("rageSlider");
const levelText = document.getElementById("levelText");

// ⏳ Level labels
const rageLabels = [
  "🧘 Chill",
  "⚠️ Warning",
  "😡 Mad",
  "🤬 Critical",
  "💀 Danger",
  "🚨 EVACUATE"
];

// ✅ Sign in anonymously
signInAnonymously(auth)
  .then(() => {
    console.log("✅ Signed in anonymously");
  })
  .catch(error => {
    console.error("❌ Anonymous sign-in failed:", error.message);
  });

// ✅ Wait for auth before enabling UI
onAuthStateChanged(auth, user => {
  if (user) {
    rageSlider.disabled = false;
  } else {
    rageSlider.disabled = true;
  }
});

// ✅ Update Firebase when slider changes
rageSlider.addEventListener("input", () => {
  const level = parseInt(rageSlider.value);
  set(ref(db, "rageLevel"), level);
});

// ✅ Sync from Firebase
onValue(ref(db, "rageLevel"), snapshot => {
  const level = snapshot.val();
  if (level >= 1 && level <= 6) {
    rageSlider.value = level;
    levelText.textContent = `Level ${level} – ${rageLabels[level - 1]}`;
  } else {
    levelText.textContent = "⚠️ Invalid level";
  }
});
