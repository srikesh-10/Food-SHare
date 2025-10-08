// js/main.js
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

// ------------------- Firebase Initialization -------------------
const firebaseConfig = {
  apiKey: "AIzaSyD4oAh01w44fVRllsQxiXr4i5G2q6RMBLw",
  authDomain: "food-waste-platform-ff3bf.firebaseapp.com",
  projectId: "food-waste-platform-ff3bf",
  storageBucket: "food-waste-platform-ff3bf.appspot.com",
  messagingSenderId: "407206083683",
  appId: "1:407206083683:web:343f918ae2690ecf34cc56"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ------------------- Logout Functionality -------------------
const logoutBtn = document.getElementById("logout-btn");
if(logoutBtn){
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        alert("Logged out successfully!");
        window.location.href = "auth.html";
      })
      .catch(err => {
        alert("Failed to logout: " + err.message);
      });
  });
}

// ------------------- Optional: Redirect if not logged in -------------------
onAuthStateChanged(auth, user => {
  if(!user){
    console.log("User not logged in, redirecting to login page.");
    // Optional auto-redirect:
    // window.location.href = "auth.html";
  } else {
    console.log("User is logged in as:", user.email);
  }
});
