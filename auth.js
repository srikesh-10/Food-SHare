// ------------------- Firebase Imports -------------------
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// ------------------- Firebase Initialization -------------------
const firebaseConfig = {
  apiKey: "AIzaSyBrlwaRS2BrM4nKPWtXrgCSmnFc1v9RXZY",
  authDomain: "studio-7295306594-ea89e.firebaseapp.com",
  projectId: "studio-7295306594-ea89e",
  storageBucket: "studio-7295306594-ea89e.firebasestorage.app",
  messagingSenderId: "874639914925",
  appId: "1:874639914925:web:9f0f0179cbce37661e5324"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ------------------- Toggle Forms -------------------
const signupBox = document.getElementById("signup-box");
const loginBox = document.getElementById("login-box");

document.getElementById("show-login").addEventListener("click", () => {
  signupBox.style.display = "none";
  loginBox.style.display = "block";
});

document.getElementById("show-signup").addEventListener("click", () => {
  signupBox.style.display = "block";
  loginBox.style.display = "none";
});

// ------------------- Sign Up -------------------
document.getElementById("signup-btn").addEventListener("click", async () => {
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const name = document.getElementById("signup-name").value.trim();
  const role = document.getElementById("signup-role").value;

  if (!email || !password || !name || !role) return alert("All fields required!");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
      createdAt: new Date()
    });

    alert("Sign Up Successful!");
    signupBox.style.display = "none";
    loginBox.style.display = "block";

  } catch (error) {
    alert(error.message);
  }
});

// ------------------- Login -------------------
document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) return alert("Email & password required!");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (!docSnap.exists()) return alert("User data not found!");

    const role = docSnap.data().role;

    if (role === "donor") window.location.href = "donate.html";
    else if (role === "volunteer") window.location.href = "volunteer.html";
    else if (role === "admin") window.location.href = "admin.html";
    else alert("Role not recognized!");

  } catch (error) {
    alert(error.message);
  }
});

// ------------------- Auth State Listener -------------------
onAuthStateChanged(auth, user => {
  if (user) console.log(`Logged in as: ${user.email}`);
  else console.log("Not logged in");
});

// ------------------- Logout -------------------
document.getElementById("logout-btn")?.addEventListener("click", async () => {
  await signOut(auth);
  alert("Logged out successfully!");
  window.location.href = "auth.html";
});
