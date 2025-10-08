import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, onSnapshot } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

// Ensure user is logged in
onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Please login first!");
    window.location.href = "auth.html";
  } else {
    loadDonations(user.uid);
  }
});

// Handle donation submission
document.getElementById("donate-btn").addEventListener("click", async () => {
  const foodType = document.getElementById("food-type").value;
  const quantity = document.getElementById("quantity").value;
  const expiry = document.getElementById("expiry-date").value;
  const pickupTime = document.getElementById("pickup-time").value;
  const location = document.getElementById("location").value;

  if (!foodType || !quantity || !expiry || !pickupTime || !location) {
    return alert("All fields are required!");
  }

  const user = auth.currentUser;

  try {
    await addDoc(collection(db, "donations"), {
      donorId: user.uid,
      foodType,
      quantity,
      expiry,
      pickupTime,
      location,
      status: "Pending",
      createdAt: serverTimestamp()
    });

    alert("Donation submitted successfully!");
    document.getElementById("food-type").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("expiry-date").value = "";
    document.getElementById("pickup-time").value = "";
    document.getElementById("location").value = "";

    loadDonations(user.uid);

  } catch (error) {
    alert(error.message);
  }
});

// Load donations for this user
async function loadDonations(uid) {
  const list = document.getElementById("donations-list");
  list.innerHTML = "Loading...";

  const q = query(collection(db, "donations"), where("donorId", "==", uid), orderBy("createdAt", "desc"));

  onSnapshot(q, snapshot => {
    list.innerHTML = "";
    snapshot.forEach(doc => {
      const donation = doc.data();
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>${donation.foodType} (${donation.quantity})</h3>
        <p><strong>Pickup:</strong> ${donation.pickupTime}, ${donation.location}</p>
        <p><strong>Status:</strong> <span class="status-badge status-${donation.status}">${donation.status}</span></p>
      `;
      list.appendChild(div);
    });
  });
}
