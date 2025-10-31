import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseconfig";
import { useNavigate } from "react-router-dom";
import "./admin.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      alert("✅ Password reset email sent! Check your inbox.");
      navigate("/admin/new-password", { state: { email } });
    } catch (error) {
      alert("Failed to send reset request.");
      console.error(error);
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Forgot Password</h2>

      <form className="admin-login-form" onSubmit={handleForgot}>
        <input
          type="email"
          placeholder="Enter Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Reset Email</button>

        <span className="forgot-password" onClick={() => navigate("/admin")}>
          Back to Login
        </span>
      </form>
    </div>
  );
}
