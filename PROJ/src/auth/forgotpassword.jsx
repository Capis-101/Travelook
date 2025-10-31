import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseconfig";
import "./authmodal.css";

function ForgotPasswordModal({ onClose, onBack }) {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
  e.preventDefault();
  try {
    await sendPasswordResetEmail(auth, email);
    onBack("emailSent"); // ✅ go to success screen
  } catch (error) {
    alert(error.message);
  }
};


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>

        {/* LEFT IMAGE */}
        <div className="auth-modal-image"></div>

        {/* RIGHT FORM */}
        <div className="auth-modal-form">
          <button className="close-btn" onClick={onClose}>×</button>

          <h2>Forgot Password</h2>
          <form onSubmit={handleReset}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="submit-forgot">
              Send Reset Link
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default ForgotPasswordModal;
