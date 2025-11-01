import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import "./packagemodal.css";

function PackageModal({ pkg, onClose }) {
  const navigate = useNavigate();

  const [userLocation, setUserLocation] = useState("");
  const [transportMode, setTransportMode] = useState("driving-car"); // OpenRoute mode
  const [commuteCost, setCommuteCost] = useState(0);
  const [travelTime, setTravelTime] = useState(0);
  const [distance, setDistance] = useState(0);

  const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImQ1ZGI2NzFkMjZkZTQwZWM5MTcwZTQyMWNhNDc3YmZlIiwiaCI6Im11cm11cjY0In0=";

  // ✅ Get user's saved location from Firestore
  useEffect(() => {
    const fetchUserLocation = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserLocation(userSnap.data().location || "Unknown");
        } else {
          setUserLocation("Unknown");
        }
      } else {
        setUserLocation("Unknown");
      }
    };
    fetchUserLocation();
  }, []);

  // ✅ Fetch travel distance & time dynamically using OpenRouteService
  useEffect(() => {
    const fetchTravelData = async () => {
      if (!userLocation || !pkg?.destination) return;

      try {
        // Convert locations to coordinates using OpenRoute Geocoding API
        const getCoords = async (place) => {
          const res = await fetch(
            `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(
              place
            )}`
          );
          const data = await res.json();
          if (data.features?.length > 0) {
            const [lng, lat] = data.features[0].geometry.coordinates;
            return `${lng},${lat}`;
          }
          return null;
        };

        const start = await getCoords(userLocation);
        const end = await getCoords(pkg.destination);

        if (!start || !end) {
          console.warn("Missing coordinates for route");
          return;
        }

        // Get directions data
        const res = await fetch(
          `https://api.openrouteservice.org/v2/directions/${transportMode}?api_key=${API_KEY}&start=${start}&end=${end}`
        );
        const data = await res.json();

        if (data.features?.length > 0) {
          const summary = data.features[0].properties.summary;
          const distKm = summary.distance / 1000;
          const timeHrs = summary.duration / 3600;

          setDistance(distKm.toFixed(1));
          setTravelTime(timeHrs.toFixed(1));

          // Estimate cost: ₱10 per km
          setCommuteCost(Math.round(distKm * 10));
        } else {
          console.warn("No route found.");
        }
      } catch (err) {
        console.error("Error fetching travel data:", err);
      }
    };

    fetchTravelData();
  }, [userLocation, pkg, transportMode]);

  if (!pkg) return null;

  const handleProceed = () => {
    navigate("/splitter", {
      state: {
        selectedPackage: pkg,
        userLocation,
        transportMode,
        commuteCost,
        travelTime,
      },
    });
  };

  return (
    <div className="pkg-modal-overlay" onClick={onClose}>
      <div className="pkg-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* ===== HEADER ===== */}
        <div className="pkg-modal-header">
          <h2>{pkg.packageName || pkg.title}</h2>
          <p className="pkg-duration">{pkg.duration}</p>
          <p>
            <strong>Destination:</strong> {pkg.destination}
          </p>
        </div>

        {/* ===== TRAVEL INFO ===== */}
        <div className="pkg-details">
          <h3><span><img src="/public/seven.png" alt="" /></span> Travel Details</h3>

          <label htmlFor="transport">Mode of Transport:</label>
          <select
            id="transport"
            value={transportMode}
            onChange={(e) => setTransportMode(e.target.value)}
          >
            <option value="driving-car">Car</option>
            <option value="driving-hgv">Bus</option>
            <option value="cycling-regular">Bike</option>
            <option value="foot-walking">Walking</option>
          </select>

          <ul>
            <li>
              <b>From:</b> {userLocation || "Unknown"}
            </li>
            <li>
              <b>To:</b> {pkg.destination}
            </li>
            <li>
              <b>Distance:</b> {distance} km
            </li>
            <li>
              <b>Estimated Travel Time:</b> {travelTime} hrs
            </li>
            <li>
              <b>Estimated Cost:</b> ₱{commuteCost}
            </li>
          </ul>
        </div>

        {/* ===== IMAGES, DETAILS, AND BUTTONS (unchanged) ===== */}
        {(pkg.accommodationImage ||
          pkg.foodImage ||
          (pkg.spotImages && pkg.spotImages.length > 0)) && (
          <div className="pkg-image-gallery">
            {pkg.accommodationImage && (
              <div className="pkg-image-block">
                <p className="pkg-image-label"> <span><img src="/public/four.png" alt="" /></span> Accommodation</p>
                <img src={pkg.accommodationImage} alt="Accommodation" />
                <p>{pkg.accommodation}</p>
              </div>
            )}

            {pkg.spotImages && pkg.spotImages.length > 0 && (
              <div className="pkg-image-block">
                <p className="pkg-image-label"> <span><img src="/public/two.png" alt="" /></span> Tourist Spots</p>
                <div className="pkg-spot-gallery">
                  {pkg.spotImages.map((src, i) => (
                    <img key={i} src={src} alt={`Spot ${i + 1}`} />
                  ))}
                </div>
              </div>
            )}

            {pkg.foodImage && (
              <div className="pkg-image-block">
                <p className="pkg-image-label"><span><img src="/public/three.png" alt="" /></span> Dining</p>
                <img src={pkg.foodImage} alt="Food & Dining" />
              </div>
            )}
          </div>
        )}

        <div className="pkg-details">
          <h3><span><img src="/public/eight.png" alt="" /></span> Included in Package</h3>
          {pkg.inclusions && pkg.inclusions.length > 0 ? (
            <ul>
              {pkg.inclusions.map((item, i) => (
                <li key={i}>✅ {item}</li>
              ))}
            </ul>
          ) : (
            <p>No inclusions available.</p>
          )}

          <h3> <span><img src="/public/one.png" alt="" /></span> Expenses</h3>
          <ul>
            <li>Accommodation: ₱{pkg.expenses?.accommodation || 0}</li>
            <li>Food: ₱{pkg.expenses?.food || 0}</li>
            <li>Activities: ₱{pkg.expenses?.activities || 0}</li>
            <li>Miscellaneous: ₱{pkg.expenses?.misc || 0}</li>
          </ul>
          <p className="pkg-total">
            <strong>Total:</strong> ₱
            {(pkg.expenses?.accommodation || 0) +
              (pkg.expenses?.food || 0) +
              (pkg.expenses?.activities || 0) +
              (pkg.expenses?.misc || 0) +
              commuteCost}
          </p>
        </div>

        <div className="pkg-modal-buttons">
          <button className="pkg-btn-cancel" onClick={onClose}>
            Close
          </button>
          <button className="pkg-btn-select" onClick={handleProceed}>
            Continue to Expense Splitter
          </button>
        </div>
      </div>
    </div>
  );
}

export default PackageModal;
