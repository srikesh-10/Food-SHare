import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Please login first!");
    window.location.href = "auth.html";
  } else {
    loadNearbyDonations(user.uid);
  }
});

function loadNearbyDonations(uid) {
  const list = document.getElementById("donations-list");
  list.innerHTML = "Loading...";

  const maxDistanceInput = document.getElementById("max-distance");

  // Refresh button
  document.getElementById("refresh-btn").addEventListener("click", () => {
    list.innerHTML = "";
    loadNearbyDonations(uid);
  });

  const q = query(collection(db, "donations"), where("status", "==", "Pending"), orderBy("createdAt", "desc"));

  onSnapshot(q, snapshot => {
    list.innerHTML = "";
    snapshot.forEach(docSnap => {
      const donation = docSnap.data();
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>${donation.foodType} (${donation.quantity})</h3>
        <p><strong>Pickup:</strong> ${donation.pickupTime}, ${donation.location}</p>
        <p><strong>Status:</strong> <span class="status-badge status-${donation.status}">${donation.status}</span></p>
        <button class="accept-btn">Accept Donation</button>
      `;
      list.appendChild(div);

      div.querySelector(".accept-btn").addEventListener("click", async () => {
        await updateDoc(doc(db, "donations", docSnap.id), {
          status: "PickedUp",
          volunteerId: uid
        });
        alert("Donation accepted!");
      });
    });
  });
}
