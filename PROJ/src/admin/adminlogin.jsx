import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseconfig";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import Loader from "../user/loader";

function AdminLogin() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const adminEmail = "admin@gmail.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (email === adminEmail) {
        navigate("/admin/adminDashboard");
      } else {
        alert("Access denied. Admin account only.");
        await auth.signOut();
      }
    } catch (err) {
      alert("Wrong email or password.");
      console.error("Admin login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const goToForgotPassword = () => {
    navigate("/admin/forgot-password");
  };

  return (
    <div className="admin-login-container">

      <h2>Admin Login</h2>
    
      <form className="admin-login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        {/* ✅ Navigate to Forgot Password */}
        <span className="forgot-password" onClick={goToForgotPassword}>
          Forgot Password?
        </span>
      </form>
    </div>
  );
}

export default AdminLogin;
