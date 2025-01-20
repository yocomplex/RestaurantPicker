// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, onValue } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-5yfSlrlINIXHHQuwIpmh7G4PIG39Mq8",
  authDomain: "restaurant-picker-f2f45.firebaseapp.com",
  databaseURL: "https://restaurant-picker-f2f45-default-rtdb.firebaseio.com",
  projectId: "restaurant-picker-f2f45",
  storageBucket: "restaurant-picker-f2f45.firebasestorage.app",
  messagingSenderId: "714231697522",
  appId: "1:714231697522:web:66a4cd57f9c4d4f14db2eb",
  measurementId: "G-5W9E1LYYX1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Pick a random restaurant
function pickPlace() {
  const username = document.getElementById("username").value.trim();
  const input = document.getElementById("input").value;
  const places = input.split(",").map((place) => place.trim()).filter((place) => place);

  if (!username) {
    alert("Please enter your name.");
    return;
  }

  if (places.length === 0) {
    alert("Please enter at least one restaurant.");
    return;
  }

  // Pick a random place
  const randomPlace = places[Math.floor(Math.random() * places.length)];

  // Update Firebase with the random choice
  const placeRef = ref(db, `places/${randomPlace}`);
  update(placeRef, { pickedBy: username, count: 1 });

  document.getElementById("result").innerText = `Thank you, ${username}. You should eat at: ${randomPlace}`;
}

// Listen for leaderboard updates
const leaderboardRef = ref(db, "places");
onValue(leaderboardRef, (snapshot) => {
  const leaderboard = snapshot.val();
  const leaderboardElement = document.getElementById("leaderboard");
  leaderboardElement.innerHTML = ""; // Clear existing leaderboard

  if (leaderboard) {
    const sortedPlaces = Object.entries(leaderboard).sort(([, a], [, b]) => b.count - a.count);

    sortedPlaces.forEach(([place, data]) => {
      const li = document.createElement("li");
      li.textContent = `${place} (${data.count} picks, last picked by ${data.pickedBy || "Unknown"})`;
      leaderboardElement.appendChild(li);
    });
  }
});

// Attach the event listener to the button
document.getElementById("pick-button").addEventListener("click", pickPlace);
