import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { collection, addDoc, getDocs, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebaseconfig.js";
import Nav from "./nav.jsx";
import "./profile.css";
import TripModal from "../listdesti/savedmodal.jsx";

function Profile() {
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const preview = location.state?.savedTripPreview;
  const hasSavedRef = useRef(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const uid = auth?.currentUser?.uid || "guest";

  // ⚙️ User location states
  const [userLocation, setUserLocation] = useState("Unknown");
  const [editingLocation, setEditingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState("");

  // ⚙️ Fetch user info (location)
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!uid || uid === "guest") return;
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserLocation(userSnap.data().location || "Unknown");
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };
    fetchUserInfo();
  }, [uid]);

  // 🔹 Fetch saved itineraries
  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, "users", uid, "itineraries");
        const snap = await getDocs(colRef);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSavedItineraries(items);
      } catch (err) {
        console.error("Failed to fetch saved itineraries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [uid]);
  // 🔹 Auto-save previewed trip from splitter
useEffect(() => {
  if (!preview || hasSavedRef.current) return;
  hasSavedRef.current = true;

  (async () => {
    try {
      const colRef = collection(db, "users", uid, "itineraries");
      await addDoc(colRef, {
        ...preview,
        createdAt: new Date().toISOString(),
      });

      const snap = await getDocs(colRef);
      setSavedItineraries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // ✅ Clear location.state after saving
      window.history.replaceState({}, "");
    } catch (err) {
      console.error("Auto-save preview failed:", err);
    }
  })();
}, [preview, uid]);


  // 🔹 Delete trip
  const handleDelete = async (docId) => {
    try {
      await deleteDoc(doc(db, "users", uid, "itineraries", docId));
      setSavedItineraries((prev) => prev.filter((i) => i.id !== docId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ⚙️ Update location
  const handleLocationSave = async () => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { location: newLocation });
      setUserLocation(newLocation);
      setEditingLocation(false);
    } catch (err) {
      console.error("Location update failed:", err);
    }
  };

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <Nav />
      <div className="profile-container">
        <header className="profile-header">
          <div>
            <h1>Welcome Back, Traveler 🌍</h1>
            <p className="subtext">Manage and revisit your saved itineraries here.</p>
          </div>
          
        <div className="header-actions">
            <button className="add-btn" onClick={() => window.location.href = "/itinerary"}>
              + New Itinerary
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="location-card">
          {editingLocation ? (
            <div className="location-edit">
              <input
                type="text"
                placeholder="Enter new location"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
              <button onClick={handleLocationSave}>Save</button>
              <button onClick={() => setEditingLocation(false)}>Cancel</button>
            </div>
          ) : (
            <div className="location-display">
              <p><strong>Current Location:</strong> {userLocation}</p>
              <button onClick={() => setEditingLocation(true)}>Change</button>
            </div>
          )}
        </div>


        



        {loading ? (
          <div className="loading">Fetching your adventures...</div>
        ) : savedItineraries.length === 0 ? (
          <div className="empty-state">
            <img src="/empty-box.png" alt="No Trips" className="empty-img" />
            <p>No saved trips yet.</p>
          </div>
        ) : (
          <div className="trip-grid">
            {savedItineraries.map((it) => (
              <div key={it.id} className="trip-card">
                <div className="trip-info">
                  <h3>{it.packageName}</h3>
                  <p className="destination">{it.destination}</p>
                  <p><b>Total:</b> ₱{Math.round(it.total).toLocaleString()}</p>
                  <p><b>Per Person:</b> ₱{Number(it.perPerson).toLocaleString()}</p>
                  <p><b>Days:</b> {it.days} • <b>Travelers:</b> {it.travelers}</p>
                </div>
                <div className="trip-actions">
                  <button className="open-btn" onClick={() => setSelectedTrip(it)}>
                    Open
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(it.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTrip && (
        <TripModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </>
  );
}

export default Profile;
