import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseconfig";
import { doc, setDoc } from "firebase/firestore";
import Loader from "../user/loader";
import "./authmodal.css";

function SignupModal({ onClose, onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState(""); // ✅ new state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) return alert("❌ Passwords do not match!");
    if (!username.trim()) return alert("❌ Please enter a username!");
    if (!location.trim()) return alert("❌ Please enter your location!");

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });

      // ✅ Save user data (with location) to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
        location,
        createdAt: new Date(),
      });

      onClose();
      navigate("/home");
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {loading ? (
        <Loader />
      ) : (
        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          <div className="auth-modal-image"></div>

          <div className="auth-modal-form">
            <button className="close-btn" onClick={onClose}>×</button>

            <p className="switch-text">
              Already have an account?{" "}
              <span className="link" onClick={onSwitch}>Login</span>
            </p>

            <h2>Sign Up</h2>

            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Your Location (e.g. Bulacan)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button className="submt-sign" type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupModal;
