import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Please login first!");
    window.location.href = "auth.html";
  } else {
    loadAllDonations();
  }
});

function loadAllDonations() {
  const list = document.getElementById("donations-list");
  list.innerHTML = "Loading...";

  const q = query(collection(db, "donations"), orderBy("createdAt", "desc"));

  onSnapshot(q, snapshot => {
    list.innerHTML = "";
    snapshot.forEach(docSnap => {
      const donation = docSnap.data();
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>${donation.foodType} (${donation.quantity})</h3>
        <p><strong>Donor:</strong> ${donation.donorId}</p>
        <p><strong>Pickup:</strong> ${donation.pickupTime}, ${donation.location}</p>
        <p><strong>Status:</strong> <span class="status-badge status-${donation.status}">${donation.status}</span></p>
        <button class="assign-btn">Assign Volunteer</button>
      `;
      list.appendChild(div);

      div.querySelector(".assign-btn").addEventListener("click", async () => {
        const volunteerId = prompt("Enter Volunteer UID:");
        if (!volunteerId) return;

        await updateDoc(doc(db, "donations", docSnap.id), {
          status: "Assigned",
          volunteerId
        });
        alert("Volunteer assigned!");
      });
    });
  });
}
