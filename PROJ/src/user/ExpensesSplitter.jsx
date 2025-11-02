import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NoSelectedSplitter from "../listdesti/noselectedsplitter.jsx";
import './ExpensesSplitter.css';

function ExpenseSplitter() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedPackage = location.state?.selectedPackage;
  const userLocation = location.state?.userLocation || 'Your Location';
  const transportMode = location.state?.transportMode || 'Bus';
  const commuteCost = location.state?.commuteCost || 0;
  const travelTime = location.state?.travelTime || 0;

  const [travelers, setTravelers] = useState(1);
  const [days, setDays] = useState(selectedPackage?.durationDays || 1);

  const [accommodation, setAccommodation] = useState(selectedPackage?.expenses?.accommodation || 0);
  const [food, setFood] = useState(selectedPackage?.expenses?.food || 0);
  const [activities, setActivities] = useState(selectedPackage?.expenses?.activities || 0);
  const [misc, setMisc] = useState(selectedPackage?.expenses?.misc || 0);

  // === Traveler names list ===
  const [travelerNames, setTravelerNames] = useState(["You"]);

  const addTraveler = () => {
    setTravelerNames([...travelerNames, `Traveler ${travelerNames.length + 1}`]);
    setTravelers(travelerNames.length + 1);
  };

  const updateTravelerName = (index, value) => {
    const updated = [...travelerNames];
    updated[index] = value;
    setTravelerNames(updated);
  };

  const removeTraveler = (index) => {
    if (travelerNames.length > 1) {
      const updated = travelerNames.filter((_, i) => i !== index);
      setTravelerNames(updated);
      setTravelers(updated.length);
    }
  };

  const distances = {
    "Bulacan-Baguio City": 230,
    "Bulacan-La Union": 250,
    "Bulacan-Vigan City": 300,
    "Bulacan-Tagaytay": 90,
    "Bulacan-Palawan": 580,
  };
  const key = `${userLocation}-${selectedPackage?.destination}`;
  const [distance] = useState(distances[key] || Math.floor(Math.random() * 200 + 100));

  // === Who pays section ===
  const [payerAssignments, setPayerAssignments] = useState({
    commute: "shared",
    accommodation: "shared",
    food: "shared",
    activities: "shared",
    misc: "shared",
  });

  const handlePayerChange = (category, value) => {
    setPayerAssignments((prev) => ({ ...prev, [category]: value }));
  };

  const getExpenseValue = (category, amount) => {
    return payerAssignments[category] === "shared" ? amount : 0;
  };

  const total =
    getExpenseValue("commute", commuteCost) +
    getExpenseValue("accommodation", accommodation) +
    getExpenseValue("food", food * days) +
    getExpenseValue("activities", activities) +
    getExpenseValue("misc", misc);

  const safeTravelers = travelers || 1;
  const perPerson = (total / safeTravelers).toFixed(2);

  if (!selectedPackage) return <NoSelectedSplitter />;

  const handleSaveTrip = () => {
    const savedTrip = {
      packageName: selectedPackage?.packageName || "Custom Trip",
      destination: selectedPackage?.destination,
      total,
      perPerson,
      days,
      travelers: safeTravelers,
      travelerNames,
      payerAssignments,
      transportMode,
      commuteCost,
      accommodation,
      food,
      activities,
      misc,
      userLocation,
      travelTime,
    };

    alert("✅ Trip saved! Redirecting to your profile...");
    navigate("/profile", { state: { savedTripPreview: savedTrip } });
  };

  return (
    <div className="splitter-horizontal">
      <div className="splitter-left">
        <h1><img src="/public/one.png" alt=""  className='iconix'/> Expense Splitter</h1>
        <p>
          <strong>From:</strong> {userLocation} → <strong>{selectedPackage?.destination}</strong>
        </p>

        <div className="info-box">
          <p><b>Mode:</b> {transportMode}</p>
          <p><b>Distance:</b> {distance} km</p>
          <p><b>Travel Time:</b> {travelTime} hrs</p>
          <p><b>Commute Cost:</b> ₱{commuteCost}</p>
        </div>

        <div className="input-row">
          <label>Number of Travelers:</label>
          <input
            type="number"
            min="1"
            value={travelers}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTravelers(val);
              if (val > travelerNames.length) addTraveler();
            }}
          />
        </div>

        {/* === Traveler names input === */}
        <div className="traveler-list">
          <h3>🧍 Traveler Names</h3>

          {/* scrollable area */}
          <div className="traveler-scroll">
            {travelerNames.map((name, index) => (
              <div key={index} className="traveler-row">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateTravelerName(index, e.target.value)}
                  placeholder={`Traveler ${index + 1}`}
                />
                {index > 0 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeTraveler(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className="add-btn" onClick={addTraveler}>
            + Add Traveler
          </button>
        </div>

        <button className="back-btn" onClick={() => navigate('/itinerary')}>
          ← Back to Itinerary
        </button>
      </div>

      <div className="splitter-right">
        <h2><img src="/public/one.png" alt=""  className='iconix'/> Expense Breakdown</h2>
        <div className="expense-grid">
          <div className="expense-item"><span>Commute</span><span>₱{commuteCost.toFixed(2)}</span></div>
          <div className="expense-item"><span>Accommodation</span><span>₱{accommodation.toFixed(2)}</span></div>
          <div className="expense-item"><span>Food (×{days} days)</span><span>₱{(food * days).toFixed(2)}</span></div>
          <div className="expense-item"><span>Activities</span><span>₱{activities.toFixed(2)}</span></div>
          <div className="expense-item"><span>Miscellaneous</span><span>₱{misc.toFixed(2)}</span></div>
          <hr />
          <div className="expense-item total">
            <span><b>Total Shared Cost:</b></span>
            <span><b>₱{total.toLocaleString()}</b></span>
          </div>
          <div className="expense-item">
            <span>Per Person:</span>
            <span>₱{perPerson}</span>
          </div>
        </div>

        {/* === Who Pays Section === */}
        <div className="payer-section">
          <h3><img src="/public/six.png" alt=""  className='iconix'/> Who pays for what?</h3>
          {Object.entries(payerAssignments).map(([key, value]) => (
            <div key={key} className="payer-row">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <select
                value={value}
                onChange={(e) => handlePayerChange(key, e.target.value)}
              >
                <option value="shared">Shared</option>
                {travelerNames.map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="expense-actions">
          <button className="save-btn" onClick={handleSaveTrip}>
            Save Trip to Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseSplitter;
