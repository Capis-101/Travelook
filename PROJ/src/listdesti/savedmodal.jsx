import React from "react";
import { useNavigate } from "react-router-dom";
import "./savedmodal.css";

function TripModal({ trip, onClose }) {
  const navigate = useNavigate();
  if (!trip) return null;
  const handleReopenSplitter = () => {
    navigate("/splitter", {
      state: {
        selectedPackage: {
          packageName: trip.packageName,
          destination: trip.destination,
          durationDays: trip.days,
          expenses: {
            accommodation: trip.accommodation,
            food: trip.food,
            activities: trip.activities,
            misc: trip.misc,
          },
        },
        userLocation: trip.userLocation,
        transportMode: trip.transportMode,
        commuteCost: trip.commuteCost,
        travelTime: trip.travelTime,
        travelers: trip.travelers,
        travelerNames: trip.travelerNames,
        payerAssignments: trip.payerAssignments,
      },
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{trip.packageName}</h2>
        <p className="destination">{trip.destination}</p>

        <div className="trip-details">
          <p><b>From:</b> {trip.userLocation}</p>
          <p><b>Mode:</b> {trip.transportMode}</p>
          <p><b>Days:</b> {trip.days}</p>
          <p><b>Travelers:</b> {trip.travelers}</p>
          <p><b>Travel Time:</b> {trip.travelTime} hrs</p>
          <hr />
          <p><b>Commute:</b> ₱{trip.commuteCost}</p>
          <p><b>Accommodation:</b> ₱{trip.accommodation}</p>
          <p><b>Food:</b> ₱{trip.food * trip.days}</p>
          <p><b>Activities:</b> ₱{trip.activities}</p>
          <p><b>Miscellaneous:</b> ₱{trip.misc}</p>
          <hr />
          <p><b>Total:</b> ₱{Number(trip.total).toLocaleString()}</p>
          <p><b>Per Person:</b> ₱{Number(trip.perPerson).toLocaleString()}</p>
        </div>

        <div className="modal-actions">
          <button className="close-btn" onClick={onClose}>Close</button>
          <button
            className="open-splitter-btn"
            onClick={handleReopenSplitter}
          >
            Reopen in Splitter
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripModal;
