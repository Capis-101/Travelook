import { useLocation, useNavigate } from "react-router-dom";
import { updatePassword } from "firebase/auth";
import { auth } from "../firebaseconfig";
import { useState } from "react";
import "./admin.css";

export default function NewPassword() {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        alert("✅ Password updated successfully!");
        navigate("/admin/adminLogin");
      } else {
        alert("Session expired! Please login with the new password.");
        navigate("/admin/adminLogin");
      }
    } catch (err) {
      alert("Error updating password. Login using reset link first.");
      console.log(err);
    }
  };

  if (!email) {
    navigate("/admin/adminLogin");
  }

  return (
    <div className="admin-login-container">
      <h2>New Password</h2>
      
      <form className="admin-login-form" onSubmit={handleUpdatePassword}>
        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          required
        />

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}
